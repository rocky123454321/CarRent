import { Message } from './models/Message.model.js';
import { User } from './models/user.model.js';
import mongoose from 'mongoose';

const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (io) => {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) return;
    if (!mongoose.Types.ObjectId.isValid(userId)) return;

    const currentUserObjectId = new mongoose.Types.ObjectId(userId);

    const emitConversationUsers = async () => {
      try {
        const participants = await Message.aggregate([
          {
            $match: {
              $or: [
                { fromUserId: currentUserObjectId },
                { toUserId: currentUserObjectId },
              ],
            },
          },
          {
            $project: {
              otherUserId: {
                $cond: [
                  { $eq: ['$fromUserId', currentUserObjectId] },
                  '$toUserId',
                  '$fromUserId',
                ],
              },
              createdAt: 1,
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: '$otherUserId',
              lastMessageAt: { $first: '$createdAt' },
            },
          },
          { $sort: { lastMessageAt: -1 } },
        ]);

        const userIds = participants.map((item) => item._id.toString());
        const users = await User.find({ _id: { $in: userIds } }).select('_id name').lean();
        const profiles = users.reduce((acc, item) => {
          acc[item._id.toString()] = item.name || 'User';
          return acc;
        }, {});

        socket.emit('conversation-users', userIds);
        socket.emit('conversation-profiles', profiles);
      } catch (err) {
        console.error('Error loading conversation users:', err);
      }
    };

    onlineUsers.set(userId, socket.id);
    console.log(`Connected: ${userId} → ${socket.id}`);

    // Broadcast updated online list
    io.emit('online-users', Array.from(onlineUsers.keys()));

    // Small delay to ensure socket is fully ready before emitting
    setTimeout(async () => {
      await emitConversationUsers();
    }, 100);

    // ── Deliver any unread messages that arrived while offline ──
    try {
      const pending = await Message.find({
        toUserId: currentUserObjectId,
        read: false,
      })
        .sort({ createdAt: 1 })
        .lean();

      if (pending.length > 0) {
        const idSet = new Set();
        pending.forEach((m) => {
          idSet.add(m.fromUserId.toString());
          idSet.add(m.toUserId.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(idSet) } })
          .select('_id name')
          .lean();

        const nameMap = users.reduce((acc, item) => {
          acc[item._id.toString()] = item.name || 'User';
          return acc;
        }, {});

        socket.emit(
          'pending-messages',
          pending.map((m) => ({
            fromUserId:   m.fromUserId.toString(),
            toUserId:     m.toUserId.toString(),
            message:      m.message,
            timestamp:    m.createdAt.toISOString(),
            _id:          m._id.toString(),
            fromUserName: nameMap[m.fromUserId.toString()] || 'User',
            toUserName:   nameMap[m.toUserId.toString()] || 'User',
          }))
        );

        // Mark them read now that user is online
        await Message.updateMany(
          { toUserId: currentUserObjectId, read: false },
          { read: true }
        );
      }
    } catch (err) {
      console.error('Error delivering pending messages:', err);
    }

    // ── Private message ──
    socket.on('private-message', async ({ toUserId, message }) => {
      if (!toUserId || !message?.trim()) return;
      if (!mongoose.Types.ObjectId.isValid(toUserId)) return;

      const toUserObjectId = new mongoose.Types.ObjectId(toUserId);

      try {
        const saved = await Message.create({
          fromUserId: currentUserObjectId,
          toUserId:   toUserObjectId,
          message:    message.trim(),
          read:       false,
        });

        const [fromUser, toUser] = await Promise.all([
          User.findById(currentUserObjectId).select('name').lean(),
          User.findById(toUserObjectId).select('name').lean(),
        ]);

        const msgData = {
          fromUserId:   userId,
          toUserId:     toUserId,
          message:      saved.message,
          timestamp:    saved.createdAt.toISOString(),
          _id:          saved._id.toString(),
          fromUserName: fromUser?.name || 'User',
          toUserName:   toUser?.name || 'User',
        };

        // Send to recipient if online
        const targetSocketId = onlineUsers.get(toUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('private-message', msgData);
          io.to(targetSocketId).emit('conversation-users-refresh');
          // Mark read immediately since recipient is online
          saved.read = true;
          await saved.save();
        }

        // Echo back to sender
        socket.emit('private-message', msgData);
        socket.emit('conversation-users-refresh');
      } catch (err) {
        console.error('Error saving message:', err);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // ── Load conversation history ──
    socket.on('load-history', async ({ withUserId, page = 1 }) => {
      if (!withUserId) return;
      if (!mongoose.Types.ObjectId.isValid(withUserId)) return;

      const withUserObjectId = new mongoose.Types.ObjectId(withUserId);

      try {
        const limit = 50;
        const skip  = (page - 1) * limit;

        const messages = await Message.find({
          $or: [
            { fromUserId: currentUserObjectId, toUserId: withUserObjectId },
            { fromUserId: withUserObjectId,    toUserId: currentUserObjectId },
          ],
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        const idSet = new Set();
        messages.forEach((m) => {
          idSet.add(m.fromUserId.toString());
          idSet.add(m.toUserId.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(idSet) } })
          .select('_id name')
          .lean();

        const nameMap = users.reduce((acc, item) => {
          acc[item._id.toString()] = item.name || 'User';
          return acc;
        }, {});

        // Mark incoming messages as read
        await Message.updateMany(
          { fromUserId: withUserObjectId, toUserId: currentUserObjectId, read: false },
          { read: true }
        );

        socket.emit('history', {
          withUserId,
          messages: messages.reverse().map((m) => ({
            fromUserId:   m.fromUserId.toString(),
            toUserId:     m.toUserId.toString(),
            message:      m.message,
            timestamp:    m.createdAt.toISOString(),
            _id:          m._id.toString(),
            fromUserName: nameMap[m.fromUserId.toString()] || 'User',
            toUserName:   nameMap[m.toUserId.toString()] || 'User',
          })),
        });
      } catch (err) {
        console.error('Error loading history:', err);
      }
    });

    // ── Typing indicator ──
    socket.on('typing', ({ toUserId, isTyping }) => {
      const targetSocketId = onlineUsers.get(toUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing', { fromUserId: userId, isTyping });
      }
    });

    socket.on('conversation-users', async () => {
      await emitConversationUsers();
    });

    socket.on('conversation-users-refresh', async () => {
      await emitConversationUsers();
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('online-users', Array.from(onlineUsers.keys()));
      console.log(`Disconnected: ${userId}`);
    });
  });
};