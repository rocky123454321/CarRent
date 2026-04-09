import React, { useEffect, useState } from "react";
import { Bell, Settings, LogOut, Menu, X, ChevronRight, MessageSquare, Sun, Moon, TextAlignStart } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useThemeStore } from "../../store/themeStore";

const AdminNav = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { unreadCounts, notifications, clearNotifications, setActiveConversation } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { darkMode, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

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
    <div className="max-h-[60vh] overflow-y-auto bg-white dark:bg-zinc-950 transition-colors custom-scrollbar">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-100 dark:border-zinc-800">
            <Bell size={18} className="opacity-30" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">System Clear</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleViewNotification(n)}
              className="px-6 py-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shrink-0 font-black text-[10px] border border-zinc-800 dark:border-zinc-200">
                  {n.senderName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight group-hover:underline decoration-zinc-400 underline-offset-4 transition-all">
                      {n.senderName}
                    </p>
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase">
                      {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-0 z-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900/50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Left: Sidebar Toggle (Desktop) */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-2xl  text-zinc-900 dark:text-white active:scale-95 transition-all  "
          >
            <TextAlignStart size={20} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95"
          >
            {darkMode ? (
              <Sun size={16} className="text-yellow-500" />
            ) : (
              <Moon size={16} className="text-zinc-900" />
            )}
          </button>

          {/* Notifications — desktop only */}
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
                  <Bell size={16} />
                  {totalUnread > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full ring-2 ring-white dark:ring-zinc-950" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
  className="w-screen h-[90vh] sm:w-80 sm:h-auto translate-y-2 sm:translate-y-0 shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 bg-white dark:bg-zinc-950 overflow-hidden"
  align="end"
  sideOffset={8}
>
  {/* Content ng header */}
  <div className="px-6 py-4 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity</h3>
    {notifications.length > 0 && (
      <button onClick={clearNotifications} className="text-[9px] font-bold uppercase tracking-tighter hover:underline">
        Clear
      </button>
    )}
  </div>
  
  <div className="h-full overflow-y-auto pb-10">
    <NotificationList />
  </div>
</DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile — desktop only */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95 group">
                  <div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px] uppercase shadow-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-xl shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 mt-3 bg-white dark:bg-zinc-950 overflow-hidden"
                align="end"
              >
                <DropdownMenuLabel className="px-5 py-4 border-b border-zinc-50 dark:border-zinc-900">
                  <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
                  <p className="text-[9px] font-medium text-zinc-400 mt-0.5">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuItem
                    onClick={() => navigate('settings')}
                    className="rounded-lg py-2.5 px-4 cursor-pointer flex items-center gap-3 text-zinc-500 hover:text-zinc-900 dark:focus:text-white focus:bg-zinc-50 dark:focus:bg-zinc-900 font-bold text-[10px] uppercase tracking-widest transition-colors"
                  >
                    <Settings size={14} /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-50 dark:bg-zinc-900" />
                <div className="p-1.5">
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg py-2.5 px-4 text-zinc-900 dark:text-white font-black cursor-pointer flex items-center gap-3 focus:bg-zinc-900 dark:focus:bg-white focus:text-white dark:focus:text-zinc-950 text-[10px] uppercase tracking-widest transition-all"
                  >
                    <LogOut size={14} /> Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle — matches UserNav style */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`sm:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 ${
              mobileOpen
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
            }`}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay — UserNav style */}
      {mobileOpen && (
        <div className="sm:hidden fixed h-[100vh] w-full backdrop-blur-2xl z-50 top-[72px] bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-8 flex flex-col h-full">

            {/* Large Nav Links */}
            <div className="flex flex-col gap-8">
              {['Dashboard', 'Chat', 'Settings'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Dashboard' ? '/admin' : `/admin/${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center justify-between"
                >
                  {item}
                  <ChevronRight size={24} className="opacity-10" />
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-3 pb-10 border-t border-zinc-100 dark:border-zinc-900 pt-8">
      
              <button
                onClick={logout}
                className="flex items-center mb-8 gap-3 p-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dialog (mobile fallback via notifOpen) */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-[2.5rem] p-0 overflow-hidden border border-zinc-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950 transition-all">
          <AlertDialogHeader className="px-6 py-6 border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between w-full">
              <AlertDialogTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Activity</AlertDialogTitle>
              <AlertDialogCancel className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-zinc-950 dark:text-white m-0 transition-transform">
                <X size={18} />
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <NotificationList />
          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-50 dark:border-zinc-900">
            <button
              onClick={() => { handleMobileNav('/admin/chat'); setNotifOpen(false); }}
              className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all"
            >
              Open Messaging Center
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default AdminNav;