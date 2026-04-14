import { create } from 'zustand';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Notification types
// { id, type: 'chat' | 'new-booking' | 'booking-status', ... }

export const useChatStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  conversations: {},
  typingUsers: {},
  activeConversation: null,
  userProfiles: {},
  unreadCounts: {},

  // Unified notification list
  // Each item shape:
  //   chat:           { id, type:'chat', userId, senderName, message, time, read:false }
  //   new-booking:    { id, type:'new-booking', rentalId, userName, userId, carBrand, carModel, totalPrice, timestamp, read:false }
  //   booking-status: { id, type:'booking-status', rentalId, status, carBrand, carModel, timestamp, read:false }
  notifications: [],

  initializeSocket: (userId) => {
    if (get().socket?.connected) return;

    const socket = io(API_URL, {
      withCredentials: true,
      auth: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      set({ isConnected: true });
      socket.emit('conversation-users');
      const active = get().activeConversation;
      if (active) setTimeout(() => socket.emit('load-history', { withUserId: active }), 300);
    });

    socket.on('disconnect', () => set({ isConnected: false }));
    socket.on('online-users', (users) => set({ onlineUsers: users }));

    socket.on('conversation-profiles', (profiles = {}) => {
      set((state) => ({ userProfiles: { ...state.userProfiles, ...profiles } }));
    });

    // ── Chat message notification ──
    socket.on('private-message', (data) => {
      const { fromUserId, toUserId, message, timestamp, _id, fromUserName, toUserName } = data;
      const otherUserId = fromUserId === userId ? toUserId : fromUserId;
      const isIncoming  = fromUserId !== userId;

      set((state) => {
        const isActive = state.activeConversation === otherUserId;
        const prev     = state.conversations[otherUserId] || [];
        if (_id && prev.some((m) => m._id === _id)) return state;

        let nextNotifications = state.notifications;
        let nextUnread        = state.unreadCounts;

        if (isIncoming && !isActive) {
          const senderName = fromUserName || state.userProfiles[fromUserId] || 'User';
          const existingIdx = state.notifications.findIndex(
            (n) => n.type === 'chat' && n.userId === otherUserId
          );
          const prevCount = existingIdx >= 0 ? (state.notifications[existingIdx].unreadCount || 1) : 0;
          const newCount  = prevCount + 1;

          const newNotif = {
            id:          `chat-${otherUserId}`,
            type:        'chat',
            userId:      otherUserId,
            senderName,
            unreadCount: newCount,
            message,
            time:        timestamp,
            read:        false,
          };

          nextNotifications = existingIdx >= 0
            ? [newNotif, ...state.notifications.filter((n) => !(n.type === 'chat' && n.userId === otherUserId))]
            : [newNotif, ...state.notifications];

          nextUnread = { ...state.unreadCounts, [otherUserId]: newCount };
        }

        return {
          conversations: {
            ...state.conversations,
            [otherUserId]: [...prev, data],
          },
          userProfiles: {
            ...state.userProfiles,
            ...(fromUserName ? { [fromUserId]: fromUserName } : {}),
            ...(toUserName   ? { [toUserId]:   toUserName   } : {}),
          },
          unreadCounts:  nextUnread,
          notifications: nextNotifications,
        };
      });
    });

    // ── New booking notification (admin receives) ──
    socket.on('new-booking', (data) => {
      set((state) => ({
        notifications: [
          {
            id:        `new-booking-${data.rentalId}`,
            type:      'new-booking',
            rentalId:  data.rentalId,
            userId:    data.userId,
            userName:  data.userName,
            userEmail: data.userEmail,
            carBrand:  data.carBrand,
            carModel:  data.carModel,
            licensePlate: data.licensePlate,
            totalPrice: data.totalPrice,
            rentalStartDate: data.rentalStartDate,
            rentalEndDate:   data.rentalEndDate,
            message:   `New booking: ${data.carBrand} ${data.carModel}`,
            time:      data.timestamp,
            read:      false,
          },
          ...state.notifications,
        ],
      }));
    });

    // ── Booking status update notification (user receives; admin also gets live update) ──
    socket.on('booking-status-update', (data) => {
      set((state) => ({
        notifications: [
          {
            id:       `status-${data.rentalId}-${Date.now()}`,
            type:     'booking-status',
            rentalId: data.rentalId,
            status:   data.status,
            userId:   data.userId || null,
            userName: data.userName || null,
            carBrand: data.carBrand,
            carModel: data.carModel,
            message:  `Booking ${data.status}: ${data.carBrand} ${data.carModel}`,
            time:     data.timestamp,
            read:     false,
          },
          ...state.notifications,
        ],
      }));
    });

    socket.on('pending-messages', (pending = []) => {
      set((state) => {
        const nextConv     = { ...state.conversations };
        const nextProfiles = { ...state.userProfiles };
        pending.forEach((msg) => {
          const other = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
          const prev  = nextConv[other] || [];
          if (!prev.some((m) => m._id === msg._id)) nextConv[other] = [...prev, msg];
          if (msg.fromUserName) nextProfiles[msg.fromUserId] = msg.fromUserName;
          if (msg.toUserName)   nextProfiles[msg.toUserId]   = msg.toUserName;
        });
        return { conversations: nextConv, userProfiles: nextProfiles };
      });
    });

    socket.on('conversation-users', (userIds = []) => {
      set((state) => {
        const next = { ...state.conversations };
        userIds.forEach((id) => { if (!next[id]) next[id] = []; });
        return { conversations: next };
      });
    });

    socket.on('conversation-users-refresh', () => socket.emit('conversation-users'));

    socket.on('history', ({ withUserId, messages }) => {
      const nextProfiles = {};
      (messages || []).forEach((msg) => {
        if (msg.fromUserName) nextProfiles[msg.fromUserId] = msg.fromUserName;
        if (msg.toUserName)   nextProfiles[msg.toUserId]   = msg.toUserName;
      });
      set((state) => ({
        conversations: { ...state.conversations, [withUserId]: messages },
        userProfiles:  { ...state.userProfiles, ...nextProfiles },
      }));
    });

    socket.on('typing', ({ fromUserId, isTyping }) => {
      set((state) => ({ typingUsers: { ...state.typingUsers, [fromUserId]: isTyping } }));
    });

    set({ socket });
  },

  sendPrivateMessage: ({ toUserId, message }) => {
    const { socket } = get();
    if (socket?.connected) socket.emit('private-message', { toUserId, message });
  },

  loadHistory: (withUserId) => {
    const { socket } = get();
    if (socket?.connected && withUserId) socket.emit('load-history', { withUserId });
  },

  setTyping: (toUserId, isTyping) => {
    const { socket } = get();
    if (socket?.connected) socket.emit('typing', { toUserId, isTyping });
  },

  setActiveConversation: (userId) => {
    set((state) => ({
      activeConversation: userId,
      unreadCounts:  { ...state.unreadCounts,  [userId]: 0 },
      // Mark chat notifications for this user as read
      notifications: state.notifications.map((n) =>
        n.type === 'chat' && n.userId === userId ? { ...n, read: true } : n
      ),
    }));
    get().loadHistory(userId);
  },

  // Mark a single notification as read by id
  markNotificationRead: (notifId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notifId ? { ...n, read: true } : n
      ),
    }));
  },

  // Mark ALL notifications as read
  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCounts: {},
    }));
  },

  clearNotifications: () => set({ notifications: [], unreadCounts: {} }),

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) { socket.disconnect(); set({ socket: null, isConnected: false }); }
  },
}));