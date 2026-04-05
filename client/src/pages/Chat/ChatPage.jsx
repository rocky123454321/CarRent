import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChatStore } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ShieldCheck, ArrowLeft, MessageCircle, Search, Car } from 'lucide-react';

const Skeleton = ({ className }) => (
  <div className={`bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl ${className}`} />
);

// ── Sidebar ──
const Sidebar = ({
  font, searchQuery, setSearchQuery, isConnected,
  filteredConversations, loading, onlineUsers,
  activeConversation, selectConversation, userProfiles, getLastMessage,
}) => (
  <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] w-full transition-colors duration-300" style={font}>
    <div className="p-5 border-b border-slate-100 dark:border-white/5 space-y-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] tracking-widest uppercase mb-0.5">Support</p>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors
          ${isConnected 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div className="relative">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-4">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))
      ) : filteredConversations.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-black border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle size={20} className="text-slate-300 dark:text-slate-700" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-600">No conversations yet</p>
        </div>
      ) : (
        filteredConversations.map(uid => {
          const isOnline = onlineUsers.includes(uid);
          const isActive = activeConversation === uid;
          return (
            <button
              key={uid}
              onClick={() => selectConversation(uid)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left group
                ${isActive 
                  ? 'bg-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                  ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                  <ShieldCheck size={17} className={isActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'} />
                </div>
                {isOnline && (
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-emerald-500
                    ${isActive ? 'border-indigo-600' : 'border-white dark:border-slate-900'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                  {userProfiles[uid] || 'Admin'}
                </p>
                <p className={`text-[11px] truncate mt-0.5 transition-colors ${isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {getLastMessage(uid)}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  </div>
);

// ── Chat ──
const Chat = ({
  font, activeConversation, setMobileView, isConnected,
  onlineUsers, activeName, isActiveOnline, carName,
  loading, activeMessages, userIsTyping,
  messagesEndRef, inputRef, user, message,
  handleTyping, handleSend,
}) => (
  <div className="flex flex-col h-full w-full bg-white dark:bg-[#0a0a0a] transition-colors duration-300" style={font}>
    <div className="px-4 py-3.5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 shrink-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
      <button
        onClick={() => setMobileView('sidebar')}
        className="md:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition shrink-0"
      >
        <ArrowLeft size={16} />
      </button>
      {activeConversation ? (
        <>
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200 dark:shadow-none">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-sm truncate">{activeName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isActiveOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isActiveOnline ? 'Online' : 'Away'}
              </p>
            </div>
          </div>
          {carName && (
            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50 shrink-0 max-w-[140px]">
              <Car size={10} className="shrink-0" />
              <span className="truncate uppercase tracking-tighter">{carName}</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm font-bold text-slate-400 dark:text-slate-600">Select a conversation</p>
      )}
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-50/30 dark:bg-black/20">
      {!activeConversation ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-800 text-center px-6">
          <ShieldCheck size={48} className="mb-4 opacity-50" />
          <p className="text-[10px] font-black uppercase tracking-widest">Select a secure conversation</p>
        </div>
      ) : loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-10 rounded-2xl" style={{ width: `${140 + (i % 3) * 50}px` }} />
          </div>
        ))
      ) : activeMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-100 dark:border-white/5 rounded-3xl p-8 shadow-sm max-w-[280px]">
            <MessageCircle size={32} className="mx-auto mb-4 text-indigo-200 dark:text-indigo-900" />
            <p className="text-sm font-black text-slate-600 dark:text-slate-300 mb-1">Secure Channel</p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Start chatting about {carName ? <span className="text-indigo-500 font-bold">{carName}</span> : 'your concerns'}.
            </p>
          </div>
        </div>
      ) : (
        activeMessages.map((msg, i) => {
          const isMine = msg.fromUserId === user._id;
          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-colors
                  ${isMine
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100 dark:shadow-none'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700/50'}`}>
                  {msg.message}
                </div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 mt-1.5 px-1 uppercase tracking-tighter">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })
      )}

      {userIsTyping && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
            {[0, 150, 300].map(delay => (
              <span key={delay} className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-2" />
    </div>

    <div className="px-4 py-4 bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-white/5 shrink-0">
      <div className="flex gap-2 items-end">
        <div className="flex-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/5 rounded-2xl flex items-end px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 dark:focus-within:border-indigo-500/50 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            disabled={!isConnected || !activeConversation}
            placeholder={
              !isConnected        ? 'Connecting...'        :
              !activeConversation ? 'Select a chat...'     :
              'Write a message...'
            }
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 font-medium text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || !isConnected || !activeConversation}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white p-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page Component ──
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

  const [message,     setMessage]    = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading,     setLoading]    = useState(true);
  const [mobileView,  setMobileView]  = useState('sidebar');

  const typingTimeout  = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const font       = { fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" };
  const routeAdminId = location.state?.adminId || null;
  const carName      = location.state?.carName  || null;

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, initializeSocket, disconnectSocket]);

  useEffect(() => {
    if (routeAdminId && isConnected) {
      setActiveConversation(routeAdminId);
      setMobileView('chat');
    }
  }, [routeAdminId, isConnected, setActiveConversation]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [conversations[activeConversation]?.length, typingUsers[activeConversation]]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const conversationUserIds = useMemo(() => {
    return Object.keys(conversations).sort((a, b) => {
      const aLast = conversations[a]?.slice(-1)[0]?.timestamp || 0;
      const bLast = conversations[b]?.slice(-1)[0]?.timestamp || 0;
      return bLast - aLast;
    });
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversationUserIds;
    const query = searchQuery.toLowerCase();
    return conversationUserIds.filter(uid => {
      const name    = (userProfiles[uid] || '').toLowerCase();
      const lastMsg = (conversations[uid]?.slice(-1)[0]?.message || '').toLowerCase();
      return name.includes(query) || lastMsg.includes(query);
    });
  }, [searchQuery, conversationUserIds, conversations, userProfiles]);

  const activeMessages = activeConversation ? (conversations[activeConversation] || []) : [];
  const userIsTyping   = activeConversation ? typingUsers[activeConversation]        : false;
  const isActiveOnline = activeConversation ? onlineUsers.includes(activeConversation): false;
  const activeName     = activeConversation
    ? (userProfiles[activeConversation] || `Admin ···${activeConversation.slice(-4)}`)
    : 'Support';

  const getLastMessage = (uid) => (conversations[uid] || []).slice(-1)[0]?.message || 'No messages yet';

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

  const selectConversation = (uid) => {
    setActiveConversation(uid);
    setMobileView('chat');
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 dark:text-slate-600" style={font}>
      <MessageCircle size={40} className="mb-3 opacity-20" />
      <p className="text-xs font-black uppercase tracking-widest">Authentication Required</p>
    </div>
  );

  const sharedProps = {
    font, isConnected, activeConversation, onlineUsers,
    getLastMessage, selectConversation, userProfiles,
    loading, activeMessages, userIsTyping,
    messagesEndRef, inputRef, user, message,
    handleTyping, handleSend, setMobileView,
    activeName, isActiveOnline, carName,
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500" style={font}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition w-fit"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div
        className="flex overflow-hidden rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-[#0a0a0a] transition-all duration-300"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {/* Sidebar Desktop */}
        <div className="hidden md:flex w-80 border-r border-slate-100 dark:border-white/5 shrink-0 flex-col">
          <Sidebar {...sharedProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredConversations={filteredConversations} />
        </div>

        {/* Mobile Views */}
        <div className="flex md:hidden flex-1 min-w-0 overflow-hidden">
          {mobileView === 'sidebar'
            ? <Sidebar {...sharedProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredConversations={filteredConversations} />
            : <Chat {...sharedProps} />
          }
        </div>

        {/* Chat Desktop */}
        <div className="hidden md:flex flex-1 min-w-0 flex-col overflow-hidden">
          <Chat {...sharedProps} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;