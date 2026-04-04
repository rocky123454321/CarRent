import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChatStore } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, WifiOff, ShieldCheck, ArrowLeft, MessageCircle, Info, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatPage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    initializeSocket, disconnectSocket, sendPrivateMessage,
    setActiveConversation, setTyping, conversations,
    typingUsers, isConnected, onlineUsers,
    activeConversation, userProfiles,
  } = useChatStore();

  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const carName = location.state?.carName || null;

  // Initialize socket
  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, initializeSocket, disconnectSocket]);

  const activeMessages = activeConversation ? (conversations[activeConversation] || []) : [];
  const userIsTyping = activeConversation ? typingUsers[activeConversation] : false;
  const isActiveOnline = activeConversation ? onlineUsers.includes(activeConversation) : false;
  const activeName = activeConversation ? (userProfiles[activeConversation] || `User ···${activeConversation.slice(-4)}`) : 'Support';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, userIsTyping]);

  const conversationUserIds = Object.keys(conversations).sort((a, b) => {
    const aLast = conversations[a]?.[conversations[a].length - 1]?.timestamp || 0;
    const bLast = conversations[b]?.[conversations[b].length - 1]?.timestamp || 0;
    return bLast - aLast;
  });

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversationUserIds;
    return conversationUserIds.filter(userId => {
      const name = userProfiles[userId] || '';
      const lastMsg = conversations[userId]?.[conversations[userId].length - 1]?.message || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase()) || lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, conversationUserIds, conversations, userProfiles]);

  const handleSend = () => {
    const text = message.trim();
    if (!text || !isConnected || !activeConversation) return;
    sendPrivateMessage({ toUserId: activeConversation, message: text });
    setMessage('');
    setTyping(activeConversation, false);
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

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
      <MessageCircle size={48} className="mb-4 opacity-10" />
      <p className="text-sm font-black uppercase tracking-widest text-slate-400">Access Denied</p>
      <p className="text-xs font-bold opacity-60">Please login to access the chat</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col gap-6 p-4 lg:p-8">

      {/* Header Info */}
      <div className="flex items-center justify-between shrink-0 px-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-sm font-black text-slate-500 hover:text-indigo-600 transition-all active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden sm:inline uppercase tracking-widest text-[11px]">Return Home</span>
        </button>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm transition-all ${
          isConnected ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          {isConnected ? "Secure Connection" : "Connection Lost"}
        </div>
      </div>

      <div className="flex flex-1 bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl shadow-indigo-900/5 relative">

        {/* --- Sidebar --- */}
        <div className="hidden md:flex flex-col w-80 border-r border-slate-50 bg-slate-50/30">
          <div className="p-6 space-y-5">
            <h2 className="font-black text-2xl text-slate-900 tracking-tight">Messages</h2>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-2xl border border-slate-100 px-11 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all placeholder:text-slate-400 placeholder:font-medium"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <div className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">Inbox Clear</div>
                </div>
              ) : (
                filteredConversations.map(userId => {
                  const isOnline = onlineUsers.includes(userId);
                  const isActive = activeConversation === userId;
                  return (
                    <Button
                      key={userId}
                      variant="ghost"
                      onClick={() => setActiveConversation(userId)}
                      className={`w-full flex items-center gap-4 px-4 py-8 rounded-[24px] justify-start transition-all duration-300 group ${
                        isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700' : 'hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${isActive ? 'bg-white/20' : 'bg-white border border-slate-100 text-indigo-600 shadow-sm'}`}>
                          {(userProfiles[userId] || 'U').charAt(0).toUpperCase()}
                        </div>
                        {isOnline && <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 ${isActive ? 'border-indigo-600' : 'border-white'}`} />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-black truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {userProfiles[userId] || `User ···${userId.slice(-4)}`}
                        </p>
                        <p className={`text-[11px] truncate font-bold mt-0.5 ${isActive ? 'text-indigo-100/80' : 'text-slate-400'}`}>
                          {getLastMessage(userId)}
                        </p>
                      </div>
                    </Button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* --- Main Chat Interface --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#fcfdfe]">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 flex items-center justify-center mb-6 border border-slate-50">
                <Sparkles size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-slate-900 font-black text-xl mb-1">Response Center</h3>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Select a chat to begin</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-24 px-8 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl z-10 sticky top-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{activeName}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`w-2 h-2 rounded-full ${isActiveOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isActiveOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isActiveOnline ? 'Live Now' : 'Disconnected'}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="p-3.5 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                  <Info size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden bg-slate-50/20">
                <ScrollArea className="h-full">
                  <div className="p-6 md:p-10 space-y-8">
                    {activeMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20">
                         <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-100/20 border border-slate-50 text-center max-w-xs animate-in zoom-in-95 duration-500">
                          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-600">
                            <MessageCircle size={30} />
                          </div>
                          <h4 className="font-black text-slate-900 mb-2">Private Session</h4>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Start your conversation {carName ? `regarding ${carName}` : ''}.
                          </p>
                        </div>
                      </div>
                    ) : (
                      activeMessages.map((msg, i) => {
                        const isMine = msg.fromUserId === user._id;
                        return (
                          <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className={`max-w-[85%] sm:max-w-[65%]`}>
                              <div className={`px-6 py-4 rounded-[26px] text-sm font-bold leading-relaxed shadow-sm transition-all ${
                                isMine
                                  ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-200'
                                  : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                              }`}>
                                {msg.message}
                              </div>
                              <p className={`text-[9px] font-black mt-2.5 px-2 uppercase tracking-widest text-slate-400 ${isMine ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {userIsTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 rounded-[20px] rounded-bl-none px-6 py-5 shadow-sm flex gap-2 items-center">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                  </div>
                </ScrollArea>
              </div>

              {/* Message Input */}
              <div className="p-6 md:p-8 bg-white border-t border-slate-50 shrink-0 sticky bottom-0">
                <div className="max-w-4xl mx-auto flex items-end gap-4">
                  <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[28px] flex items-end px-6 py-3.5 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white focus-within:border-indigo-500 transition-all duration-300">
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={handleTyping}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      rows={1}
                      disabled={!isConnected || !activeConversation}
                      placeholder="Ask something..."
                      className="flex-1 bg-transparent resize-none py-1.5 text-sm focus:outline-none max-h-32 min-h-[24px] leading-relaxed text-slate-700 font-bold placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || !isConnected}
                    className="bg-indigo-600 text-white w-14 h-14 rounded-[22px] flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-200 transition-all shadow-2xl shadow-indigo-200 shrink-0 active:scale-90"
                  >
                    <Send size={22} className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatPage;