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

  // 🔥 NEW
  unreadCounts: {},
  notifications: [],

  initializeSocket: (userId) => {
    if (get().socket?.connected) return;

    const socket = io(API_URL, {
      withCredentials: true,
      auth: { userId },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      set({ isConnected: true });
      socket.emit('conversation-users');

      const active = get().activeConversation;
      if (active) {
        setTimeout(() => {
          socket.emit('load-history', { withUserId: active });
        }, 500);
      }
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('online-users', (users) => {
      set({ onlineUsers: users });
    });

    socket.on('conversation-profiles', (profiles = {}) => {
      set((state) => ({
        userProfiles: {
          ...state.userProfiles,
          ...profiles,
        },
      }));
    });

    // 🔥 MESSAGE + NOTIFICATION
    socket.on('private-message', (data) => {
      const { fromUserId, toUserId, message, timestamp, _id } = data;
      const otherUserId = fromUserId === userId ? toUserId : fromUserId;

      set((state) => {
        const prev = state.conversations[otherUserId] || [];
        const isActive = state.activeConversation === otherUserId;
        const otherUserName =
          fromUserId === userId ? data.toUserName : data.fromUserName;

        return {
          conversations: {
            ...state.conversations,
            [otherUserId]: [...prev, data],
          },
          userProfiles: {
            ...state.userProfiles,
            ...(data.fromUserName ? { [fromUserId]: data.fromUserName } : {}),
            ...(data.toUserName ? { [toUserId]: data.toUserName } : {}),
          },

          unreadCounts: {
            ...state.unreadCounts,
            [otherUserId]: isActive
              ? 0
              : (state.unreadCounts[otherUserId] || 0) + 1,
          },

          // 🔔 ADD NOTIFICATION
          notifications: isActive
            ? state.notifications
            : (() => {
                const displayName =
                  otherUserName || state.userProfiles[otherUserId] || 'User';
                const existingIndex = state.notifications.findIndex(
                  (n) => n.userId === otherUserId
                );

                if (existingIndex !== -1) {
                  const existing = state.notifications[existingIndex];
                  const nextCount = (existing.unreadCount || 1) + 1;
                  const updated = {
                    ...existing,
                    unreadCount: nextCount,
                    text: `${displayName} has ${nextCount} unread messages`,
                    message,
                    time: timestamp,
                  };

                  return [
                    updated,
                    ...state.notifications.filter((_, idx) => idx !== existingIndex),
                  ];
                }

                return [
                  {
                    id: `notif-${otherUserId}`,
                    userId: otherUserId,
                    unreadCount: 1,
                    text: `${displayName} has 1 unread message`,
                    message,
                    time: timestamp,
                  },
                  ...state.notifications,
                ];
              })(),
        };
      });
    });

    socket.on('pending-messages', (pending = []) => {
      set((state) => {
        const nextConversations = { ...state.conversations };
        const nextProfiles = { ...state.userProfiles };

        pending.forEach((msg) => {
          const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
          const prev = nextConversations[otherUserId] || [];
          const exists = prev.some((item) => item._id === msg._id);
          if (!exists) {
            nextConversations[otherUserId] = [...prev, msg];
          }
          if (msg.fromUserName) nextProfiles[msg.fromUserId] = msg.fromUserName;
          if (msg.toUserName) nextProfiles[msg.toUserId] = msg.toUserName;
        });

        return { conversations: nextConversations, userProfiles: nextProfiles };
      });
    });

    socket.on('conversation-users', (userIds = []) => {
      set((state) => {
        const nextConversations = { ...state.conversations };
        userIds.forEach((id) => {
          if (!nextConversations[id]) nextConversations[id] = [];
        });
        return { conversations: nextConversations };
      });
    });

    socket.on('conversation-users-refresh', () => {
      socket.emit('conversation-users');
    });

    socket.on('history', ({ withUserId, messages }) => {
      const nextProfiles = {};
      (messages || []).forEach((msg) => {
        if (msg.fromUserName) nextProfiles[msg.fromUserId] = msg.fromUserName;
        if (msg.toUserName) nextProfiles[msg.toUserId] = msg.toUserName;
      });

      set((state) => ({
        conversations: {
          ...state.conversations,
          [withUserId]: messages,
        },
        userProfiles: {
          ...state.userProfiles,
          ...nextProfiles,
        },
      }));
    });

    socket.on('typing', ({ fromUserId, isTyping }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [fromUserId]: isTyping,
        },
      }));
    });

    set({ socket });
  },

  sendPrivateMessage: ({ toUserId, message }) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('private-message', { toUserId, message });
    }
  },

  loadHistory: (withUserId) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('load-history', { withUserId });
    }
  },

  setTyping: (toUserId, isTyping) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('typing', { toUserId, isTyping });
    }
  },

  setActiveConversation: (userId) => {
    set((state) => ({
      activeConversation: userId,
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0,
      },
      notifications: state.notifications.filter((n) => n.userId !== userId),
    }));

    get().loadHistory(userId);
  },

  clearNotifications: () => set({ notifications: [] }),

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));