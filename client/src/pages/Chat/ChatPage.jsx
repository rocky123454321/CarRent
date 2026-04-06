import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChatStore } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ShieldCheck, ArrowLeft, MessageCircle, Search, Car } from 'lucide-react';

const Skeleton = ({ className }) => (
  <div className={`bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl ${className}`} />
);

// ── Sidebar Component ──
const Sidebar = ({
  font, searchQuery, setSearchQuery, isConnected,
  filteredConversations, loading, onlineUsers,
  activeConversation, selectConversation, userProfiles, getLastMessage,
}) => (
  <div className="flex flex-col h-full bg-white dark:bg-zinc-950 w-full transition-colors duration-300" style={font}>
    <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 space-y-5 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 dark:text-zinc-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-1 italic">Channel</p>
          <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white uppercase italic">Messages<span className="text-zinc-300 dark:text-zinc-800">.</span></h2>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors
          ${isConnected 
            ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800' 
            : 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/20'}`}>
          <span className={`w-1 h-1 rounded-full ${isConnected ? 'bg-zinc-900 dark:bg-white animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div className="relative">
        <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />
        <input
          type="text"
          placeholder="SEARCH CONVERSATIONS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-2xl py-3 pl-10 pr-4 text-[10px] font-bold tracking-widest text-zinc-700 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all uppercase"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4">
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        ))
      ) : filteredConversations.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-[10px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.3em]">No Active Logs</p>
        </div>
      ) : (
        filteredConversations.map(uid => {
          const isOnline = onlineUsers.includes(uid);
          const isActive = activeConversation === uid;
          return (
            <button
              key={uid}
              onClick={() => selectConversation(uid)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left group
                ${isActive 
                  ? 'bg-zinc-900 dark:bg-white shadow-xl shadow-zinc-200/50 dark:shadow-none' 
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors border
                  ${isActive ? 'bg-white/10 border-transparent' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'}`}>
                  <ShieldCheck size={18} className={isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400 dark:text-zinc-600'} />
                </div>
                {isOnline && (
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 bg-zinc-900 dark:bg-white
                    ${isActive ? 'border-zinc-900 dark:border-white' : 'border-white dark:border-zinc-950'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate transition-colors uppercase tracking-tight ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {userProfiles[uid] || 'System Admin'}
                </p>
                <p className={`text-[10px] truncate mt-1 transition-colors font-medium ${isActive ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
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

// ── Chat View Component ──
const Chat = ({
  font, activeConversation, setMobileView, isConnected,
  onlineUsers, activeName, isActiveOnline, carName,
  loading, activeMessages, userIsTyping,
  messagesEndRef, inputRef, user, message,
  handleTyping, handleSend,
}) => (
  <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-950 transition-colors duration-300" style={font}>
    <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center gap-4 shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <button
        onClick={() => setMobileView('sidebar')}
        className="md:hidden p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 transition shrink-0"
      >
        <ArrowLeft size={16} />
      </button>
      {activeConversation ? (
        <>
          <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-white dark:text-zinc-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-zinc-900 dark:text-white text-sm truncate uppercase tracking-tight">{activeName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isActiveOnline ? 'bg-zinc-900 dark:bg-white animate-pulse' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
                {isActiveOnline ? 'Active Session' : 'Offline'}
              </p>
            </div>
          </div>
          {carName && (
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[9px] font-bold px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shrink-0 max-w-[160px]">
              <Car size={12} className="shrink-0" />
              <span className="truncate uppercase tracking-widest">{carName}</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-[10px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.2em]">Select Destination</p>
      )}
    </div>

    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-zinc-50/30 dark:bg-black/20">
      {!activeConversation ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-200 dark:text-zinc-900 text-center px-10">
          <ShieldCheck size={60} className="mb-6 opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] italic">Encryption Active</p>
        </div>
      ) : loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-12 rounded-2xl" style={{ width: `${160 + (i % 3) * 60}px` }} />
          </div>
        ))
      ) : activeMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-10 shadow-sm max-w-[320px]">
            <MessageCircle size={32} className="mx-auto mb-6 text-zinc-200 dark:text-zinc-800" />
            <p className="text-xs font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-widest italic">New Protocol</p>
            <p className="text-[10px] leading-relaxed font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">
              Communication line established for {carName ? <span className="text-zinc-900 dark:text-white font-black underline">{carName}</span> : 'support'}.
            </p>
          </div>
        </div>
      ) : (
        activeMessages.map((msg, i) => {
          const isMine = msg.fromUserId === user._id;
          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%]`}>
                <div className={`px-5 py-3.5 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm transition-all
                  ${isMine
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-br-none'
                    : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-100 dark:border-zinc-800/50'}`}>
                  {msg.message}
                </div>
                <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 mt-2 px-1 uppercase tracking-[0.2em] italic">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })
      )}

      {userIsTyping && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex gap-2 items-center">
            {[0, 150, 300].map(delay => (
              <span key={delay} className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>

    <div className="px-6 py-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 shrink-0">
      <div className="flex gap-3 items-end max-w-5xl mx-auto">
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-end px-5 py-3 focus-within:border-zinc-900 dark:focus-within:border-white transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            disabled={!isConnected || !activeConversation}
            placeholder="TYPE YOUR MESSAGE..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-bold tracking-widest py-2 resize-none max-h-32 text-zinc-800 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none uppercase"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || !isConnected || !activeConversation}
          className="bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-300 dark:disabled:text-zinc-800 text-white dark:text-zinc-950 p-4 rounded-2xl transition-all active:scale-95 shrink-0 shadow-lg shadow-zinc-200 dark:shadow-none"
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

  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState('sidebar');

  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const font = { fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" };
  const routeAdminId = location.state?.adminId || null;
  const carName = location.state?.carName || null;

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
      const name = (userProfiles[uid] || '').toLowerCase();
      const lastMsg = (conversations[uid]?.slice(-1)[0]?.message || '').toLowerCase();
      return name.includes(query) || lastMsg.includes(query);
    });
  }, [searchQuery, conversationUserIds, conversations, userProfiles]);

  const activeMessages = activeConversation ? (conversations[activeConversation] || []) : [];
  const userIsTyping = activeConversation ? typingUsers[activeConversation] : false;
  const isActiveOnline = activeConversation ? onlineUsers.includes(activeConversation) : false;
  const activeName = activeConversation
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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400 dark:text-zinc-600" style={font}>
      <MessageCircle size={40} className="mb-3 opacity-20" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Session Expired</p>
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
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 p-4 md:p-8" style={font}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition w-fit italic"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div
        className="flex overflow-hidden rounded-[2rem] border border-zinc-100 dark:border-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-950 transition-all duration-500"
        style={{ height: 'calc(100vh - 160px)' }}
      >
        {/* Sidebar Desktop */}
        <div className="hidden md:flex w-80 border-r border-zinc-100 dark:border-zinc-900 shrink-0 flex-col">
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