import { create } from 'zustand';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';

export const useChatStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  conversations: {},
  typingUsers: {},
  activeConversation: null,
  userProfiles: {},
  unreadCounts: {},
  notifications: [], // { id, userId, senderName, unreadCount, message, time }

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

    socket.on('private-message', (data) => {
      const { fromUserId, toUserId, message, timestamp, _id, fromUserName, toUserName } = data;
      const otherUserId = fromUserId === userId ? toUserId : fromUserId;
      const isIncoming  = fromUserId !== userId;

      set((state) => {
        const isActive      = state.activeConversation === otherUserId;
        const prev          = state.conversations[otherUserId] || [];
        if (_id && prev.some((m) => m._id === _id)) return state;

        let nextNotifications = state.notifications;
        let nextUnread        = state.unreadCounts;

        // Only notify for incoming messages when that chat isn't open
        if (isIncoming && !isActive) {
          const senderName = fromUserName || state.userProfiles[fromUserId] || 'User';
          const existing   = state.notifications.find((n) => n.userId === otherUserId);
          const newCount   = (existing?.unreadCount || 0) + 1;

          const newNotif = {
            id: `notif-${otherUserId}`,
            userId: otherUserId,
            senderName,                  // ✅ stored cleanly
            unreadCount: newCount,
            message,
            time: timestamp,
          };

          nextNotifications = existing
            ? [newNotif, ...state.notifications.filter((n) => n.userId !== otherUserId)]
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
      notifications: state.notifications.filter((n) => n.userId !== userId),
    }));
    get().loadHistory(userId);
  },

  clearNotifications: () => set({ notifications: [], unreadCounts: {} }),

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) { socket.disconnect(); set({ socket: null, isConnected: false }); }
  },
}));