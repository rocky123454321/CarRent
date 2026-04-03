import React, { useEffect, useState } from "react";
import { Bell, Settings, LogOut, Menu, X, Search, ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogFooter, AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const AdminNav = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { unreadCounts, notifications, clearNotifications, setActiveConversation } = useChatStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalUnread = Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (user?._id) useChatStore.getState().initializeSocket(user._id);
    return () => useChatStore.getState().disconnectSocket();
  }, [user?._id]);

  if (!user || user.role !== "renter") return null;

  const handleViewNotification = (n) => {
    setActiveConversation(n.userId);
    setNotifOpen(false);
    setMobileOpen(false);
    navigate("/admin/chat", { state: { userId: n.userId } });
  };

  const handleMobileNav = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const NotificationList = () => (
    <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-50">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Bell size={32} className="mb-2 opacity-10" />
          <p className="text-xs font-medium">No notifications</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="px-4 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs">
                {n.senderName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-slate-900 truncate pr-2">
                    {n.senderName || 'User'}
                  </p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 italic">"{n.message}"</p>
                <button
                  onClick={() => handleViewNotification(n)}
                  className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
      
      {/* Left: Sidebar Toggle & Search (Desktop Only) */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 active:scale-95 transition"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex relative w-full max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
                <Bell size={18} />
                {totalUnread > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-2xl shadow-2xl border-slate-100 p-0 mt-2" align="end">
               <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-[11px] text-indigo-600 font-semibold uppercase">Clear</button>
                )}
              </div>
              <NotificationList />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Profile */}
        <div className="hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pr-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-slate-700">{user?.name?.split(' ')[0]}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-2xl shadow-2xl border-slate-100 p-0 mt-2 overflow-hidden" align="end">
              <DropdownMenuLabel className="px-4 py-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{user?.email}</p>
                  <div className="mt-2 text-left">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase border border-indigo-100">Admin</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl py-2.5 cursor-pointer flex items-center gap-2">
                  <Settings size={16} className="text-slate-400" /> Account Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1 opacity-50" />
              <div className="p-1.5">
                <DropdownMenuItem onClick={logout} className="rounded-xl py-2.5 text-red-600 font-bold cursor-pointer">
                  <LogOut size={16} className="mr-2" /> Log out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white active:scale-95 transition"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[65px] bg-white border-b border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top duration-300">
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-200">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setNotifOpen(true)} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 active:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Bell size={18} /></div>
                  <span className="font-semibold text-slate-700 text-sm">Notifications</span>
                </div>
                {totalUnread > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>}
              </button>
              <button onClick={() => handleMobileNav('/settings')} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 active:bg-slate-50 transition text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><Settings size={18} /></div>
                  <span className="font-semibold text-sm">Settings</span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button onClick={logout} className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 font-bold transition mt-2">
                <LogOut size={18} /> Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications AlertDialog */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[95vw] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <AlertDialogHeader className="px-5 py-4 border-b border-slate-50 bg-white">
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-base font-bold text-slate-900">Notifications</AlertDialogTitle>
              <AlertDialogCancel className="h-8 w-8 rounded-full bg-slate-50 border-none p-0 flex items-center justify-center text-slate-400">
                <X size={16} />
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <div className="bg-white"><NotificationList /></div>
          {notifications.length > 0 && (
            <AlertDialogFooter className="p-4 bg-slate-50">
              <button onClick={() => { handleMobileNav('/admin/chat'); setNotifOpen(false); }} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold active:scale-95 transition">OPEN CHAT CENTER</button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default AdminNav;