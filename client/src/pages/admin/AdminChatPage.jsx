import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../stores/chatStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useLocation } from "react-router-dom";
import { Send, Wifi, WifiOff, UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
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
  const sidebarRef = useRef(null);
  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const conversationUserIds = Object.keys(conversations);
  const activeMessages = conversations[activeConversation] || [];
  const userIsTyping = activeConversation ? typingUsers[activeConversation] : false;

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    if (user?._id) initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id]);

  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (targetUserId && isConnected) setActiveConversation(targetUserId);
  }, [location.state?.userId, isConnected]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
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

  // Simulate loading for skeletons
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingConversations(false);
      setLoadingMessages(false);
    }, 1000); // 1s skeleton
    return () => clearTimeout(timer);
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

  const getLastMessage = (userId) => {
    const msgs = conversations[userId] || [];
    return msgs[msgs.length - 1]?.message || "No messages yet";
  };

  const getDisplayName = (userId) =>
    userProfiles[userId] || location.state?.renterName || `User ···${userId.slice(-4)}`;

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r lg:z-5 border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-lg text-gray-900">Messages</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loadingConversations ? (
              // Sidebar Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-4">
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="w-3/4 h-3 rounded" />
                    <Skeleton className="w-1/2 h-2 rounded" />
                  </div>
                </div>
              ))
            ) : conversationUserIds.length === 0 ? (
              <div className="text-center py-10 px-4 text-gray-400 text-sm">No conversations yet</div>
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
                    className={`w-full flex items-center gap-3 px-3 py-6 justify-start rounded-xl transition-all
                      ${isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "hover:bg-gray-100"}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <UserCircle className="w-7 h-7 text-gray-400" />
                      </div>
                      {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold truncate text-gray-900">{getDisplayName(userId)}</p>
                      <p className="text-xs text-gray-500 truncate font-normal">{getLastMessage(userId)}</p>
                    </div>
                  </Button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="w-32 h-4 mx-auto mb-2" />
              <Skeleton className="w-48 h-3 mx-auto" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden bg-white">
              <ScrollArea className="h-full w-full">
                <div className="p-4 md:p-6 space-y-4">
                  {loadingMessages ? (
                    // Messages Skeleton
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <Skeleton className="w-64 h-10 rounded-2xl" />
                      </div>
                    ))
                  ) : (
                    activeMessages.map((msg, i) => {
                      const isMine = msg.fromUserId === user._id;
                      return (
                        <div key={msg._id || i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%]`}>
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                                isMine
                                  ? "bg-blue-600 text-white rounded-br-none"
                                  : "bg-gray-100 text-gray-800 rounded-bl-none"
                              }`}
                            >
                              {msg.message}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {userIsTyping && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-2" />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="max-w-4xl mx-auto flex gap-2 items-end">
                <div className="flex-1 bg-gray-100 rounded-2xl flex items-end px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
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
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || !isConnected}
                  className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200"
                >
                  <Send size={20} />
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