import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useLocation } from "react-router-dom";
import { Send, Wifi, WifiOff, UserCircle, Menu, X, Inbox, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Reusable Skeleton Component for loading states
const Skeleton = ({ className }) => (
  <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} />
);

const AdminChatPage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const {
    initializeSocket,
    disconnectSocket,
    sendPrivateMessage, 
    setActiveConversation,                                 
    setTyping,
    conversations,
    typingUsers,
    isConnected,
    onlineUsers,
    activeConversation,
    userProfiles,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef(null);
  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const conversationUserIds = Object.keys(conversations).filter(id => 
    (userProfiles[id] || id).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeMessages = conversations[activeConversation] || [];
  const userIsTyping = activeConversation ? typingUsers[activeConversation] : false;

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, initializeSocket, disconnectSocket]);

  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (targetUserId && isConnected) setActiveConversation(targetUserId);
  }, [location.state?.userId, isConnected, setActiveConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, userIsTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingConversations(false);
      setLoadingMessages(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    const text = message.trim();
    if (!text || !isConnected || !activeConversation) return;
    sendPrivateMessage({ toUserId: activeConversation, message: text });
    setMessage("");
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
    return msgs[msgs.length - 1]?.message || "No messages yet";
  };

  const getDisplayName = (userId) =>
    userProfiles[userId] || location.state?.renterName || `User ···${userId.slice(-4)}`;

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex overflow-hidden font-sans text-slate-900">
      
      {/* --- Sidebar --- */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-85 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-50 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-2xl tracking-tight text-slate-900">Chats</h2>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isConnected ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isConnected ? "Live" : "Offline"}
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Find a conversation..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="py-4 space-y-2">
            {loadingConversations ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-3/4 h-3.5" />
                    <Skeleton className="w-1/2 h-2.5" />
                  </div>
                </div>
              ))
            ) : conversationUserIds.length === 0 ? (
              <div className="text-center py-16 px-4 text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                   <Inbox size={24} className="opacity-40" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Inbox is empty</p>
              </div>
            ) : (
              conversationUserIds.map((userId) => {
                const isOnline = onlineUsers.includes(userId);
                const isActive = activeConversation === userId;
                return (
                  <Button
                    key={userId}
                    variant="ghost"
                    onClick={() => {
                      setActiveConversation(userId);
                      setSidebarOpen(false);
                    }}
                    className={`w-full h-auto flex items-center gap-4 px-4 py-4 justify-start rounded-2xl transition-all duration-200 group
                      ${isActive ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700" : "hover:bg-slate-50"}`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white border border-slate-100'}`}>
                        <UserCircle className={`w-8 h-8 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      {isOnline && (
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 ${isActive ? 'border-indigo-600' : 'border-white'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center mb-0.5">
                         <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{getDisplayName(userId)}</p>
                      </div>
                      <p className={`text-xs truncate font-medium ${isActive ? 'text-indigo-100 opacity-80' : 'text-slate-500'}`}>{getLastMessage(userId)}</p>
                    </div>
                  </Button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* --- Main Chat --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fbfcfd]">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 flex items-center justify-center mb-6 border border-slate-50">
              <Sparkles size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-slate-900 font-extrabold text-xl mb-2">Your Workspace</h3>
            <p className="text-slate-400 text-sm font-medium text-center max-w-[280px]">Select a client from the sidebar to start a professional conversation.</p>
            <Button variant="outline" className="mt-8 rounded-2xl lg:hidden border-slate-200" onClick={() => setSidebarOpen(true)}>
              View Messages
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-20 px-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl z-10 sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 hover:bg-slate-50 rounded-2xl text-slate-500 border border-slate-100">
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-indigo-600 rounded-[14px] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-100">
                    {getDisplayName(activeConversation).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base leading-none mb-1.5">{getDisplayName(activeConversation)}</h4>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(activeConversation) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {onlineUsers.includes(activeConversation) ? "Online" : "Away"}
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden bg-slate-50/30">
              <ScrollArea className="h-full w-full">
                <div className="p-6 md:p-10 space-y-8">
                  {loadingMessages ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <Skeleton className="w-64 h-14 rounded-2xl" />
                      </div>
                    ))
                  ) : activeMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 opacity-30 select-none">
                        <Inbox size={48} className="mb-4" />
                        <div className="text-[11px] font-black uppercase tracking-[0.3em]">No Message History</div>
                    </div>
                  ) : (
                    activeMessages.map((msg, i) => {
                      const isMine = msg.fromUserId === user._id;
                      return (
                        <div key={msg._id || i} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                          <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] md:max-w-[65%]`}>
                            <div
                              className={`px-5 py-3.5 rounded-[22px] text-[14px] font-medium leading-relaxed shadow-sm transition-all ${
                                isMine
                                  ? "bg-indigo-600 text-white rounded-br-none shadow-indigo-100"
                                  : "bg-white text-slate-700 rounded-bl-none border border-slate-100 shadow-slate-200/50"
                              }`}
                            >
                              {msg.message}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 mt-2 px-1 uppercase tracking-wider">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {userIsTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 flex gap-1.5 items-center shadow-sm">
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

            {/* Input Area */}
            <div className="p-6 md:p-8 bg-white border-t border-slate-100 shrink-0 sticky bottom-0">
              <div className="max-w-4xl mx-auto flex gap-4 items-end">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[24px] flex items-end px-5 py-2.5 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white focus-within:border-indigo-500 transition-all duration-300">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={message}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || !isConnected}
                  className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center"
                >
                  <Send size={22} className={message.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;