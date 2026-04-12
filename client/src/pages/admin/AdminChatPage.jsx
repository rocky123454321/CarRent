import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useLocation } from "react-router-dom";
import { Send, Inbox, Search, Sparkles, ArrowLeft, MoreVertical, ShieldCheck } from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl ${className}`} />
);

// ── Sidebar Component ──
const Sidebar = ({
  font, searchTerm, setSearchTerm, isConnected,
  conversationUserIds, loadingConversations,
  onlineUsers, activeConversation, selectConversation,
  getDisplayName, getLastMessage,
}) => (
  <div className="flex flex-col h-full bg-white dark:bg-zinc-950 w-full border-r border-zinc-100 dark:border-zinc-900 transition-colors duration-300" style={font}>
    <div className="p-6 space-y-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
        
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Messages</h2>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all
          ${isConnected 
            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
            : 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
          {isConnected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>
      <div className="relative group">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
      {loadingConversations ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-5">
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-3/4" />
            </div>
          </div>
        ))
      ) : conversationUserIds.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800">
            <Inbox size={20} className="text-zinc-300 dark:text-zinc-600" />
          </div>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Inbox Empty</p>
        </div>
      ) : (
        conversationUserIds.map((userId) => {
          const isOnline = onlineUsers.includes(userId);
          const isActive = activeConversation === userId;
          return (
            <button
              key={userId}
              onClick={() => selectConversation(userId)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-300 group
                ${isActive 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xl shadow-zinc-900/10' 
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all
                  ${isActive 
                    ? 'bg-white/10 dark:bg-zinc-900/10 scale-105' 
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'}`}>
                  {getDisplayName(userId).charAt(0).toUpperCase()}
                </div>
                {isOnline && (
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] bg-emerald-500
                    ${isActive ? 'border-zinc-900 dark:border-white' : 'border-white dark:border-zinc-950'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <p className="text-[13px] font-bold truncate leading-none uppercase tracking-tight">
                    {getDisplayName(userId)}
                  </p>
                </div>
                <p className={`text-[11px] truncate font-medium ${isActive ? 'opacity-70' : 'text-zinc-400'}`}>
                  {getLastMessage(userId)}
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
  font, activeConversation, setMobileView,
  onlineUsers, getDisplayName,
  loadingMessages, activeMessages,
  userIsTyping, messagesEndRef, inputRef,
  user, message, handleTyping, handleSend, isConnected,
}) => (
  <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-950 transition-colors duration-300" style={font}>
    {/* Chat Header */}
    <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => setMobileView("sidebar")}
          className="md:hidden p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        {activeConversation && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-950 font-bold text-sm shrink-0">
              {getDisplayName(activeConversation).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                 <p className="font-bold text-zinc-900 dark:text-white text-[15px] leading-tight truncate uppercase tracking-tight">{getDisplayName(activeConversation)}</p>
                 <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers.includes(activeConversation) ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  {onlineUsers.includes(activeConversation) ? 'Active Now' : 'Last seen recently'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <button className="p-2.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
        <MoreVertical size={20} />
      </button>
    </div>

    {/* Message Area */}
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-zinc-50/20 dark:bg-black/10 custom-scrollbar">
      {!activeConversation ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
             <Sparkles size={32} className="text-zinc-200 dark:text-zinc-800" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-[0.2em]">Select an Agent</h3>
          <p className="text-xs text-zinc-400 mt-2">Pick a conversation from the sidebar to begin.</p>
        </div>
      ) : loadingMessages ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-14 rounded-[1.5rem] w-64" />
          </div>
        ))
      ) : activeMessages.length === 0 ? (
        <div className="text-center py-10 opacity-40 uppercase tracking-widest text-[10px] font-bold italic">
          No previous logs found
        </div>
      ) : (
        activeMessages.map((msg, i) => {
          const isMine = msg.fromUserId === user._id;
          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%]`}>
                <div className={`px-5 py-3.5 rounded-[1.8rem] text-[13px] font-medium leading-relaxed
                  ${isMine
                    ? 'bg-zinc-900 text-white rounded-br-none dark:bg-white dark:text-zinc-950 shadow-lg shadow-zinc-900/5'
                    : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-100 dark:border-zinc-800'}`}>
                  {msg.message}
                </div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2 px-1 italic">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })
      )}

      {userIsTyping && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-zinc-800 flex gap-1.5 items-center">
            {[0, 150, 300].map(delay => (
              <span key={delay} className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>

    {/* Input Area */}
    <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 shrink-0">
      <div className="flex gap-3 items-end max-w-6xl mx-auto">
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center px-6 py-1 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Type your secure message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-4 resize-none max-h-32 font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none uppercase tracking-widest"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || !isConnected}
          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 p-4 rounded-full transition-all shadow-xl active:scale-95 disabled:opacity-20 shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  </div>
);

const AdminChatPage = () => {
  // ── Logic: Do Not Touch ──
  const { user } = useAuthStore();
  const location = useLocation();
  const {
    initializeSocket, disconnectSocket,
    sendPrivateMessage, setActiveConversation,
    setTyping, conversations, typingUsers,
    isConnected, onlineUsers, activeConversation, userProfiles,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [mobileView, setMobileView] = useState("sidebar");

  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const font = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  const conversationUserIds = Object.keys(conversations)
    .filter(id => {
      const name = userProfiles[id] || id;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aLast = conversations[a]?.slice(-1)[0]?.timestamp || 0;
      const bLast = conversations[b]?.slice(-1)[0]?.timestamp || 0;
      return bLast - aLast;
    });

  const activeMessages = conversations[activeConversation] || [];
  const userIsTyping = activeConversation ? typingUsers[activeConversation] : false;

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id]);

  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (targetUserId && isConnected) {
      setActiveConversation(targetUserId);
      setMobileView("chat");
    }
  }, [location.state?.userId, isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length, userIsTyping]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoadingConversations(false);
      setLoadingMessages(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleSend = () => {
    const text = message.trim();
    if (!text || !isConnected || !activeConversation) return;
    sendPrivateMessage({ toUserId: activeConversation, message: text });
    setMessage("");
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

  const getLastMessage = (uid) => (conversations[uid] || []).slice(-1)[0]?.message || "No messages yet";
  const getDisplayName = (uid) => userProfiles[uid] || location.state?.renterName || `User ···${uid.slice(-4)}`;
  const selectConversation = (uid) => { setActiveConversation(uid); setMobileView("chat"); };

  const sharedProps = {
    font, isConnected, activeConversation, onlineUsers,
    getDisplayName, getLastMessage, selectConversation,
    loadingMessages, activeMessages, userIsTyping,
    messagesEndRef, inputRef, user, message,
    handleTyping, handleSend, setMobileView,
  };

  // ── UI Return: Fixed for Full Width ──
  return (
    <div className="flex flex-col w-full h-[90vh] mt-13 bg-white dark:bg-zinc-950 overflow-hidden animate-in fade-in duration-700" style={font}>
      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <div className={`
          ${mobileView === "sidebar" ? "flex" : "hidden"} 
          md:flex w-full md:w-80 lg:w-96 shrink-0 flex-col
        `}>
          <Sidebar {...sharedProps} searchTerm={searchTerm} setSearchTerm={setSearchTerm} conversationUserIds={conversationUserIds} loadingConversations={loadingConversations} />
        </div>

        {/* Mobile/Desktop Chat View */}
        <div className={`
          ${mobileView === "chat" ? "flex" : "hidden"} 
          md:flex flex-1 flex-col min-w-0
        `}>
          <Chat {...sharedProps} />
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;