import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useLocation } from "react-router-dom";
import { Send, Inbox, Search, Sparkles, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Skeleton = ({ className }) => (
  <div className={`bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl ${className}`} />
);

// ── Sidebar ──
const Sidebar = ({
  font, searchTerm, setSearchTerm, isConnected,
  conversationUserIds, loadingConversations,
  onlineUsers, activeConversation, selectConversation,
  getDisplayName, getLastMessage,
}) => (
  <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] w-full transition-colors duration-300" style={font}>
    <div className="p-5 border-b border-slate-100 dark:border-white/5 space-y-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] tracking-widest uppercase mb-0.5">Support</p>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors
          ${isConnected 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
            : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
      <div className="relative">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin dark:scrollbar-thumb-slate-800">
      {loadingConversations ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-4">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))
      ) : conversationUserIds.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Inbox size={20} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">No conversations yet</p>
        </div>
      ) : (
        conversationUserIds.map((userId) => {
          const isOnline = onlineUsers.includes(userId);
          const isActive = activeConversation === userId;
          return (
            <button
              key={userId}
              onClick={() => selectConversation(userId)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left
                ${isActive 
                  ? 'bg-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                  {getDisplayName(userId).charAt(0).toUpperCase()}
                </div>
                {isOnline && (
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-emerald-500
                    ${isActive ? 'border-indigo-600' : 'border-white dark:border-slate-900'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                  {getDisplayName(userId)}
                </p>
                <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
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

// ── Chat ──
const Chat = ({
  font, activeConversation, setMobileView,
  onlineUsers, getDisplayName,
  loadingMessages, activeMessages,
  userIsTyping, messagesEndRef, inputRef,
  user, message, handleTyping, handleSend, isConnected,
}) => (
  <div className="flex flex-col h-full w-full bg-white dark:bg-[#0a0a0a] transition-colors duration-300" style={font}>
    <div className="px-4 py-3.5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 shrink-0 bg-white dark:bg-[#0a0a0a]">
      <button
        onClick={() => setMobileView("sidebar")}
        className="md:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition shrink-0"
      >
        <ArrowLeft size={16} />
      </button>
      {activeConversation ? (
        <>
          <div className="w-9 h-9 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
            {getDisplayName(activeConversation).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{getDisplayName(activeConversation)}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers.includes(activeConversation) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {onlineUsers.includes(activeConversation) ? 'Online' : 'Away'}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-600 font-medium">Select a conversation</p>
      )}
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/30 dark:bg-black/20">
      {!activeConversation ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-800 text-center px-6">
          <Sparkles size={36} className="mb-3 text-indigo-200 dark:text-indigo-900/40" />
          <p className="text-xs font-semibold uppercase tracking-widest">Select a conversation to start chatting</p>
        </div>
      ) : loadingMessages ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-10 rounded-2xl dark:bg-slate-800" style={{ width: `${140 + (i % 3) * 50}px` }} />
          </div>
        ))
      ) : activeMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-100 dark:border-white/5 rounded-3xl p-8 shadow-sm max-w-[280px]">
            <Inbox size={28} className="mx-auto mb-3 text-indigo-200 dark:text-indigo-800" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No messages yet</p>
          </div>
        </div>
      ) : (
        activeMessages.map((msg, i) => {
          const isMine = msg.fromUserId === user._id;
          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-colors
                  ${isMine
                    ? 'bg-indigo-600 text-white rounded-br-none dark:bg-indigo-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700/50'}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 px-1 uppercase tracking-wider">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })
      )}

      {userIsTyping && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
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
        <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-end px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
          <textarea
            ref={inputRef}
            rows={1}
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 font-medium text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || !isConnected}
          className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white p-3.5 rounded-2xl transition-all shadow-md active:scale-95 shrink-0"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  </div>
);

const AdminChatPage = () => {
  // ... (All current logic remains exactly the same)
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
  const font = { fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" };

  const conversationUserIds = Object.keys(conversations)
    .filter(id => (userProfiles[id] || id).toLowerCase().includes(searchTerm.toLowerCase()))
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
    const frame = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeMessages.length, userIsTyping]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoadingConversations(false);
      setLoadingMessages(false);
    }, 800);
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

  return (
    <div className="flex flex-col gap-4 transition-colors duration-300" style={font}>
      <div>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-widest uppercase mb-0.5">Support</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Messages</h1>
      </div>

      <div
        className="flex overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-[#0a0a0a]"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        <div className="hidden md:flex w-72 border-r border-slate-100 dark:border-white/5 shrink-0 flex-col">
          <Sidebar {...sharedProps}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            conversationUserIds={conversationUserIds}
            loadingConversations={loadingConversations}
          />
        </div>

        <div className="flex md:hidden flex-1 min-w-0 overflow-hidden">
          {mobileView === "sidebar"
            ? <Sidebar {...sharedProps}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                conversationUserIds={conversationUserIds}
                loadingConversations={loadingConversations}
              />
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

export default AdminChatPage;