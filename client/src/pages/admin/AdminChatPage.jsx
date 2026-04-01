import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../stores/chatStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Wifi, WifiOff, UserCircle, ArrowLeft } from 'lucide-react';

const AdminChatPage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    initializeSocket, disconnectSocket,
    sendPrivateMessage, setActiveConversation,
    setTyping, conversations, typingUsers,
    isConnected, onlineUsers, activeConversation,
    userProfiles,
  } = useChatStore();

  const [message, setMessage] = useState('');
  const typingTimeout  = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const conversationUserIds = Object.keys(conversations);
  const activeMessages      = conversations[activeConversation] || [];
  const userIsTyping        = activeConversation ? typingUsers[activeConversation] : false;

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, initializeSocket, disconnectSocket]);

  // Auto-select conversation from navigation state (e.g. from Bookings page)
  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (targetUserId && isConnected) {
      setActiveConversation(targetUserId);
    }
  }, [location.state?.userId, isConnected, setActiveConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, userIsTyping]);

  const handleSend = () => {
    const text = message.trim();
    if (!text || !isConnected || !activeConversation) return;
    sendPrivateMessage({ toUserId: activeConversation, message: text });
    setMessage('');
    setTyping(activeConversation, false);
    clearTimeout(typingTimeout.current);
    inputRef.current?.focus();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!activeConversation) return;
    setTyping(activeConversation, true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(activeConversation, false), 1500);
  };

  const getLastMessage = (userId) => {
    const msgs = conversations[userId] || [];
    return msgs[msgs.length - 1]?.message || 'No messages yet';
  };

  const getDisplayName = (userId) =>
    userProfiles[userId] || location.state?.renterName || `User ···${userId.slice(-4)}`;

  return (
    <div className="space-y-3">
      <button
        onClick={() => navigate('/admin/bookings')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to bookings
      </button>

    <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

      {/* ── Sidebar ── */}
      <div className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-base text-gray-900">Messages</h2>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            {isConnected
              ? <><Wifi className="w-3 h-3 text-green-500" /> Connected</>
              : <><WifiOff className="w-3 h-3 text-red-400" /> Disconnected</>}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationUserIds.length === 0 ? (
            <p className="text-center text-gray-400 text-xs py-12 px-4">
              No conversations yet. Users will appear here when they message you.
            </p>
          ) : (
            conversationUserIds.map((userId) => {
              const isOnline = onlineUsers.includes(userId);
              const isActive = activeConversation === userId;
              const lastMsg  = getLastMessage(userId);
              return (
                <button
                  key={userId}
                  onClick={() => setActiveConversation(userId)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                    isActive ? 'bg-blue-50 border-r-2 border-r-blue-600' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isActive ? 'font-semibold text-blue-700' : 'font-medium text-gray-900'}`}>
                      {getDisplayName(userId)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{lastMsg}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a conversation to start replying</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-gray-500" />
                </div>
                {onlineUsers.includes(activeConversation) && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {getDisplayName(activeConversation)}
                </p>
                <p className="text-xs text-gray-400">
                  {onlineUsers.includes(activeConversation) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
              {activeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                  <UserCircle className="w-10 h-10 mb-2 opacity-20" />
                  <p>No messages yet</p>
                </div>
              ) : (
                activeMessages.map((msg, i) => {
                  const isMine = msg.fromUserId === user._id;
                  return (
                    <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                        isMine
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                      }`}>
                        <p className="leading-relaxed">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing dots */}
              {userIsTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                rows={1}
                disabled={!isConnected}
                placeholder={isConnected ? 'Reply to user...' : 'Reconnecting...'}
                className="flex-1 resize-none px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-28 leading-relaxed"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || !isConnected}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors shrink-0"
              >
                <Send size={17} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminChatPage;