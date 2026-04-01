import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../stores/chatStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Wifi, WifiOff, UserCircle, ShieldCheck, Car, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';

const ChatPage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const routeAdminId = location.state?.adminId || null;
  const carName      = location.state?.carName  || null;

  const {
    initializeSocket, disconnectSocket,
    sendPrivateMessage, setActiveConversation,
    setTyping, conversations, typingUsers,
    isConnected, onlineUsers, userProfiles,
  } = useChatStore();

  const [message, setMessage]     = useState('');
  const [fetchedAdmin, setFetchedAdmin] = useState(null);

  const typingTimeout  = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const adminId       = routeAdminId || fetchedAdmin?._id || null;
  const adminName     = (adminId && userProfiles[adminId]) || fetchedAdmin?.name || 'Admin';
  const messages      = adminId ? (conversations[adminId] || []) : [];
  const isAdminOnline = adminId ? onlineUsers.includes(adminId) : false;
  const adminIsTyping = adminId ? typingUsers[adminId] : false;

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, initializeSocket, disconnectSocket]);

  useEffect(() => {
    if (routeAdminId) return;
    axios.get(`${API_URL}/api/auth/admin-id`, { withCredentials: true })
      .then((res) => setFetchedAdmin(res.data?.admin || null))
      .catch(() => toast.error('Failed to load admin chat'))
  }, [routeAdminId]);

  useEffect(() => {
    if (adminId && isConnected) setActiveConversation(adminId);
  }, [adminId, isConnected, setActiveConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminIsTyping]);

  const handleSend = () => {
    const text = message.trim();
    if (!text || !isConnected || !adminId) return;
    sendPrivateMessage({ toUserId: adminId, message: text });
    setMessage('');
    setTyping(adminId, false);
    clearTimeout(typingTimeout.current);
    inputRef.current?.focus();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!adminId) return;
    setTyping(adminId, true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(adminId, false), 1500);
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-[400px] text-gray-500 text-sm">
      Please login to chat
    </div>
  );

  return (
    <div className="space-y-3">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to dashboard
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
          {!adminId ? (
            <p className="text-center text-gray-400 text-xs py-12 px-4">
              No admin available.
            </p>
          ) : (
            <button
              onClick={() => setActiveConversation(adminId)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 bg-blue-50 border-r-2 border-r-blue-600"
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gray-500" />
                </div>
                {isAdminOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-700">
                  {adminName}
                </p>
                <p className="text-xs text-gray-400">
                  {messages[messages.length-1]?.message || 'No messages yet'}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!adminId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No admin to chat with</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gray-500" />
                </div>
                {isAdminOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {adminName}
                </p>
                <p className="text-xs text-gray-400">{isAdminOnline ? 'Online' : 'Offline'}</p>
              </div>
              {carName && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full shrink-0">
                  <Car size={11} /> {carName}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                  <ShieldCheck className="w-10 h-10 mb-2 opacity-20" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((msg, i) => {
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

              {/* Typing */}
              {adminIsTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center">
                      {[0,150,300].map((delay) => (
                        <span key={delay} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${delay}ms`}} />
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
                onKeyDown={(e) => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault(); handleSend();} }}
                rows={1}
                disabled={!isConnected || !adminId}
                placeholder={!isConnected ? 'Reconnecting...' : 'Type a message...'}
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

export default ChatPage;