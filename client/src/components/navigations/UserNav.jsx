import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, LogOut, Menu, X, MessageSquare, CarFront } from "lucide-react";
import brand from "../../assets/brand.png";
import { useAuthStore } from "../../store/authStore";
import { useCarStore } from "../../store/CarStore";
import { useChatStore } from "../../store/chatStore";
import { useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogFooter, AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const UserNav = () => {
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useCarStore();
  const {
    initializeSocket, disconnectSocket,
    unreadCounts, notifications, clearNotifications, setActiveConversation,
  } = useChatStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const totalUnread = Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (!user?._id || user.role === "renter") return;
    initializeSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id, user?.role]);

  if (!user || user.role === "renter") return null;

  const handleViewNotification = (n) => {
    setActiveConversation(n.userId);
    setNotifOpen(false);
    setMobileOpen(false);
    navigate("/chat", { state: { adminId: n.userId } });
  };

  // Shared notification list UI
  const NotificationList = () => (
    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Bell size={28} className="mb-2 opacity-20" />
          <p className="text-xs">No notifications</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">
                  {n.senderName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {n.unreadCount > 1 ? `${n.unreadCount} new messages` : '1 new message'}
                  <span className="font-normal text-gray-500"> from </span>
                  <span className="text-blue-600">{n.senderName || 'User'}</span>
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5 italic">"{n.message}"</p>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleViewNotification(n)}
              className="mt-2 ml-10 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              View message →
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full fixed top-0 left-0 px-6 py-4 z-50 border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <Link to="/"><img src={brand} alt="brand" className="h-10" /></Link>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/cars" className="px-3 py-2 text-sm rounded-xl text-slate-600 hover:bg-slate-50">Category</Link>
          <Link to="/my-rentals" className="px-3 py-2 text-sm rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
            <CarFront size={14} /> My Rentals
          </Link>
          <Link to="/chat" className="px-3 py-2 text-sm rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
            <MessageSquare size={14} /> Chat
          </Link>

          {/* Desktop Search */}
          <div className="relative w-[260px]">
            <input
              type="text" placeholder="Search cars..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-700 placeholder:text-slate-400 transition"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Desktop Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition">
                <Bell size={17} />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-80 rounded-2xl shadow-xl border p-0 overflow-hidden" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  {totalUnread > 0 && (
                    <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{totalUnread}</span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-xs text-blue-500 hover:text-blue-700">Clear all</button>
                )}
              </div>
              <NotificationList />
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t bg-gray-50">
                  <button onClick={() => navigate('/chat')} className="w-full text-xs text-center text-blue-600 hover:text-blue-800 font-medium">
                    Open Chat
                  </button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer">
                <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || "?"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 rounded-2xl shadow-xl border border-slate-100 p-0 overflow-hidden" align="end">
              <DropdownMenuLabel className="px-4 py-4 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">{user?.name?.charAt(0).toUpperCase() || "?"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold">Member</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer rounded-xl px-3 py-2.5 gap-2.5 focus:bg-slate-50">
                  <Settings size={15} className="text-slate-400" />
                  <span className="text-sm text-slate-600">Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="mx-1.5" />
              <div className="p-1.5">
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer rounded-xl px-3 py-2.5 gap-2.5 text-red-500 focus:text-red-600 focus:bg-red-50">
                  <LogOut size={15} />
                  <span className="text-sm font-medium">Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500">
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl px-5 py-5 flex flex-col gap-4">

      
          {/* Mobile Actions */}
          <div className="flex gap-3">
            {/* Mobile Notifications Button → opens AlertDialog */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition text-slate-700 text-sm font-semibold"
            >
              <Bell size={16} />
              Alerts
              {totalUnread > 0 && (
                <span className="absolute top-2 right-3 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {totalUnread}
                </span>
              )}
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-indigo-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-700 text-sm font-semibold"
          >
            <Settings size={16} />
            Settings
          </button>

          {/* Logout */}
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500 hover:bg-red-600 transition text-white text-sm font-semibold shadow-sm"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}

      {/* Mobile Notifications AlertDialog */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="rounded-2xl w-[90vw] max-w-sm p-0 overflow-hidden">
          <AlertDialogHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertDialogTitle className="text-sm font-semibold text-gray-900">
                  Notifications
                </AlertDialogTitle>
                   <AlertDialogCancel className="flex-1 text-xs absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </AlertDialogCancel>
                {totalUnread > 0 && (
                  <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {totalUnread}
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="text-xs text-blue-500 hover:text-blue-700">
                  Clear all
                </button>
              )}
            </div>
          </AlertDialogHeader>

          <NotificationList />

          <AlertDialogFooter className="px-4 py-3 border-t bg-gray-50 flex flex-row gap-2">
            {notifications.length > 0 && (
              <button
                onClick={() => { navigate('/chat'); setNotifOpen(false); }}
                className="flex-1 text-xs text-center text-blue-600 hover:text-blue-800 font-medium py-2"
              >
                Open Chat
              </button>
            )}
         
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </nav>
  );
};

export default UserNav;