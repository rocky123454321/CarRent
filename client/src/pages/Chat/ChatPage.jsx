import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChatStore } from '../../store/chatStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ShieldCheck, ArrowLeft, MessageCircle, Search, Car } from 'lucide-react';

const Skeleton = ({ className }) => (
  <div className={`bg-slate-100 animate-pulse rounded-xl ${className}`} />
);

// ── Sidebar ── OUTSIDE ChatPage
const Sidebar = ({
  font, searchQuery, setSearchQuery, isConnected,
  filteredConversations, loading, onlineUsers,
  activeConversation, selectConversation, userProfiles, getLastMessage,
}) => (
  <div className="flex flex-col h-full bg-white w-full" style={font}>
    <div className="p-5 border-b border-slate-100 space-y-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-600 font-semibold text-[10px] tracking-widest uppercase mb-0.5">Support</p>
          <h2 className="text-xl font-black text-slate-900">Messages</h2>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border
          ${isConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div className="relative">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-1">
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
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle size={20} className="text-slate-300" />
          </div>
          <p className="text-xs font-semibold text-slate-400">No conversations yet</p>
        </div>
      ) : (
        filteredConversations.map(uid => {
          const isOnline = onlineUsers.includes(uid);
          const isActive = activeConversation === uid;
          return (
            <button
              key={uid}
              onClick={() => selectConversation(uid)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left
                ${isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'hover:bg-slate-50'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${isActive ? 'bg-white/20' : 'bg-slate-100 border border-slate-200'}`}>
                  <ShieldCheck size={17} className={isActive ? 'text-white' : 'text-indigo-500'} />
                </div>
                {isOnline && (
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-emerald-500
                    ${isActive ? 'border-indigo-600' : 'border-white'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {userProfiles[uid] || 'Admin'}
                </p>
                <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
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

// ── Chat ── OUTSIDE ChatPage
const Chat = ({
  font, activeConversation, setMobileView, isConnected,
  onlineUsers, activeName, isActiveOnline, carName,
  loading, activeMessages, userIsTyping,
  messagesEndRef, inputRef, user, message,
  handleTyping, handleSend,
}) => (
  <div className="flex flex-col h-full w-full" style={font}>
    <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-white">
      <button
        onClick={() => setMobileView('sidebar')}
        className="md:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-500 border border-slate-200 transition shrink-0"
      >
        <ArrowLeft size={16} />
      </button>
      {activeConversation ? (
        <>
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{activeName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isActiveOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {isActiveOnline ? 'Online' : 'Away'}
              </p>
            </div>
          </div>
          {carName && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-indigo-100 shrink-0 max-w-[120px]">
              <Car size={10} className="shrink-0" />
              <span className="truncate">{carName}</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-400">Select a conversation</p>
      )}
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/30">
      {!activeConversation ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center px-6">
          <ShieldCheck size={36} className="mb-3" />
          <p className="text-xs font-semibold uppercase tracking-widest">Select a conversation</p>
        </div>
      ) : loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-10 rounded-2xl" style={{ width: `${140 + (i % 3) * 50}px` }} />
          </div>
        ))
      ) : activeMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm max-w-[260px]">
            <MessageCircle size={28} className="mx-auto mb-3 text-indigo-200" />
            <p className="text-sm font-semibold text-slate-500 mb-1">Start the conversation</p>
            {carName && (
              <p className="text-xs text-slate-400">
                Asking about <span className="font-semibold text-indigo-600">{carName}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        activeMessages.map((msg, i) => {
          const isMine = msg.fromUserId === user._id;
          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                  ${isMine
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100'
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-1 px-1 uppercase tracking-wider">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })
      )}

      {userIsTyping && (
        <div className="flex justify-start">
          <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
            {[0, 150, 300].map(delay => (
              <span key={delay} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-2" />
    </div>

    <div className="px-4 py-3 bg-white border-t border-slate-100 shrink-0">
      <div className="flex gap-2 items-end">
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-end px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition">
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
              !isConnected        ? 'Reconnecting...'       :
              !activeConversation ? 'Select a conversation' :
              'Type a message...'
            }
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 font-medium text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || !isConnected || !activeConversation}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-3.5 rounded-2xl transition-all shadow-md shadow-indigo-100 active:scale-95 shrink-0"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  </div>
);

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

  const [message,    setMessage]    = useState('');
  const [searchQuery,setSearchQuery]= useState('');
  const [loading,    setLoading]    = useState(true);
  const [mobileView, setMobileView] = useState('sidebar');

  const typingTimeout  = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const font       = { fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" };
  const routeAdminId = location.state?.adminId || null;
  const carName      = location.state?.carName  || null;

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id]);

  useEffect(() => {
    if (routeAdminId && isConnected) {
      setActiveConversation(routeAdminId);
      setMobileView('chat');
    }
  }, [routeAdminId, isConnected]);

  // ✅ scroll fix
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

  // ✅ sorted by latest
  const conversationUserIds = useMemo(() => {
    return Object.keys(conversations).sort((a, b) => {
      const aLast = conversations[a]?.slice(-1)[0]?.timestamp || 0;
      const bLast = conversations[b]?.slice(-1)[0]?.timestamp || 0;
      return bLast - aLast;
    });
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversationUserIds;
    return conversationUserIds.filter(uid => {
      const name    = (userProfiles[uid] || '').toLowerCase();
      const lastMsg = (conversations[uid]?.slice(-1)[0]?.message || '').toLowerCase();
      return name.includes(searchQuery.toLowerCase()) || lastMsg.includes(searchQuery.toLowerCase());
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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400" style={font}>
      <MessageCircle size={40} className="mb-3 opacity-20" />
      <p className="text-sm font-semibold">Please login to access chat</p>
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
    <div className="flex flex-col gap-4" style={font}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition w-fit"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div
        className="flex overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white"
        style={{ height: 'calc(100vh - 130px)' }}
      >
        <div className="hidden md:flex w-72 border-r border-slate-100 shrink-0 flex-col">
          <Sidebar {...sharedProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredConversations={filteredConversations} />
        </div>

        <div className="flex md:hidden flex-1 min-w-0 overflow-hidden">
          {mobileView === 'sidebar'
            ? <Sidebar {...sharedProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredConversations={filteredConversations} />
            : <Chat {...sharedProps} />
          }
        </div>

        <div className="hidden md:flex flex-1 min-w-0 flex-col overflow-hidden">
          <Chat {...sharedProps} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;