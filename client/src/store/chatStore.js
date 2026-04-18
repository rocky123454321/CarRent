import { create } from 'zustand';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── API helpers ────────────────────────────────────────────────────────────
const api = {
  getNotifications: () =>
    fetch(`${API_URL}/api/notifications`, { credentials: 'include' })
      .then((r) => r.json()),

  markOneRead: (id) =>
    fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      credentials: 'include',
    }),

  markAllRead: () =>
    fetch(`${API_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    }),

  clearAll: () =>
    fetch(`${API_URL}/api/notifications`, {
      method: 'DELETE',
      credentials: 'include',
    }),
};

export const useChatStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  conversations: {},
  typingUsers: {},
  activeConversation: null,
  userProfiles: {},
  unreadCounts: {},
  notifications: [],
  _currentUserId: null,

  // ─── NEW: fetch notifications from DB on mount ───────────────────────────
  fetchNotifications: async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) {
        // Rebuild unreadCounts from DB data
        const unreadCounts = {};
        res.notifications.forEach((n) => {
          if (!n.read && n.type === 'chat' && n.userId) {
            unreadCounts[n.userId] = (unreadCounts[n.userId] || 0) + (n.unreadCount || 1);
          }
        });
        set({ notifications: res.notifications, unreadCounts });
      }
    } catch (err) {
      console.error('fetchNotifications error:', err);
    }
  },

  initializeSocket: (userId) => {
    const state = get();
    if (state.socket?.connected && state._currentUserId === userId) return;
    if (state.socket) state.socket.disconnect();

    // ✅ Fetch persisted notifications from DB on init
    get().fetchNotifications();

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
      set((s) => ({ userProfiles: { ...s.userProfiles, ...profiles } }));
    });

    // ── Chat message ──
    socket.on('private-message', (data) => {
      const { fromUserId, toUserId, message, timestamp, _id, fromUserName, toUserName } = data;
      const otherUserId = fromUserId === userId ? toUserId : fromUserId;
      const isIncoming  = fromUserId !== userId;

      set((s) => {
        const isActive = s.activeConversation === otherUserId;
        const prev     = s.conversations[otherUserId] || [];
        if (_id && prev.some((m) => m._id === _id)) return s;

        let nextNotifications = s.notifications;
        let nextUnread        = s.unreadCounts;

        if (isIncoming && !isActive) {
          const senderName  = fromUserName || s.userProfiles[fromUserId] || 'User';
          const existingIdx = s.notifications.findIndex(
            (n) => n.type === 'chat' && n.userId === otherUserId
          );
          const prevCount = existingIdx >= 0 ? (s.notifications[existingIdx].unreadCount || 1) : 0;
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
            ? [newNotif, ...s.notifications.filter((n) => !(n.type === 'chat' && n.userId === otherUserId))]
            : [newNotif, ...s.notifications];

          nextUnread = { ...s.unreadCounts, [otherUserId]: newCount };
        }

        return {
          conversations: { ...s.conversations, [otherUserId]: [...prev, data] },
          userProfiles: {
            ...s.userProfiles,
            ...(fromUserName ? { [fromUserId]: fromUserName } : {}),
            ...(toUserName   ? { [toUserId]:   toUserName   } : {}),
          },
          unreadCounts:  nextUnread,
          notifications: nextNotifications,
        };
      });
    });

    // ── New booking (admin receives) ──
    socket.on('new-booking', (data) => {
      set((s) => ({
        notifications: [
          {
            id:           `new-booking-${data.rentalId}`,
            type:         'new-booking',
            rentalId:     data.rentalId,
            userId:       data.userId,
            userName:     data.userName,
            userEmail:    data.userEmail,
            carBrand:     data.carBrand,
            carModel:     data.carModel,
            licensePlate: data.licensePlate,
            totalPrice:   data.totalPrice,
            message:      `New booking: ${data.carBrand} ${data.carModel}`,
            time:         data.timestamp,
            read:         false,
          },
          ...s.notifications,
        ],
      }));
    });

    // ── Booking status update (user receives) ──
    socket.on('booking-status-update', (data) => {
      set((s) => ({
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
          ...s.notifications,
        ],
      }));
    });

    // ── Pending messages ──
    socket.on('pending-messages', (pending = []) => {
      set((s) => {
        const nextConv     = { ...s.conversations };
        const nextProfiles = { ...s.userProfiles };
        const pendingNotifs = [];

        pending.forEach((msg) => {
          const other = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
          const prev  = nextConv[other] || [];
          if (!prev.some((m) => m._id === msg._id)) nextConv[other] = [...prev, msg];
          if (msg.fromUserName) nextProfiles[msg.fromUserId] = msg.fromUserName;
          if (msg.toUserName)   nextProfiles[msg.toUserId]   = msg.toUserName;

          if (msg.fromUserId !== userId) {
            const exists = pendingNotifs.find((n) => n.userId === msg.fromUserId);
            if (exists) {
              exists.unreadCount += 1;
              exists.message = msg.message;
              exists.time    = msg.timestamp;
            } else {
              pendingNotifs.push({
                id:          `chat-${msg.fromUserId}`,
                type:        'chat',
                userId:      msg.fromUserId,
                senderName:  msg.fromUserName || nextProfiles[msg.fromUserId] || 'User',
                unreadCount: 1,
                message:     msg.message,
                time:        msg.timestamp,
                read:        false,
              });
            }
          }
        });

        let merged = [...s.notifications];
        pendingNotifs.forEach((n) => {
          const idx = merged.findIndex((m) => m.type === 'chat' && m.userId === n.userId);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], unreadCount: merged[idx].unreadCount + n.unreadCount, read: false };
          } else {
            merged = [n, ...merged];
          }
        });

        return { conversations: nextConv, userProfiles: nextProfiles, notifications: merged };
      });
    });

    socket.on('conversation-users', (userIds = []) => {
      set((s) => {
        const next = { ...s.conversations };
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
      set((s) => ({
        conversations: { ...s.conversations, [withUserId]: messages },
        userProfiles:  { ...s.userProfiles, ...nextProfiles },
      }));
    });

    socket.on('typing', ({ fromUserId, isTyping }) => {
      set((s) => ({ typingUsers: { ...s.typingUsers, [fromUserId]: isTyping } }));
    });

    set({ socket, _currentUserId: userId });
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
    set((s) => ({
      activeConversation: userId,
      unreadCounts: { ...s.unreadCounts, [userId]: 0 },
      notifications: s.notifications.map((n) =>
        n.type === 'chat' && n.userId === userId ? { ...n, read: true } : n
      ),
    }));
    get().loadHistory(userId);
  },

  // ─── Updated: also persist to DB ────────────────────────────────────────
  markNotificationRead: (notifId) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === notifId ? { ...n, read: true } : n
      ),
    }));
    api.markOneRead(notifId).catch(console.error);
  },

  markAllRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCounts: {},
    }));
    api.markAllRead().catch(console.error);
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCounts: {} });
    api.clearAll().catch(console.error);
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, _currentUserId: null });
    }
  },
}));