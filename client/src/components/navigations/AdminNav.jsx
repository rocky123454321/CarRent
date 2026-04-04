import React, { useEffect, useState } from "react";
import { Bell, Settings, LogOut, Menu, X, ChevronRight, MessageSquare, Sun, Moon } from "lucide-react";
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
  AlertDialogTitle, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useThemeStore } from "../../store/themeStore";

const AdminNav = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { unreadCounts, notifications, clearNotifications, setActiveConversation } = useChatStore();
  const navigate = useNavigate();
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
    <div className="max-h-[60vh] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-slate-800 bg-white dark:bg-slate-900 transition-colors">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-800">
             <Bell size={28} className="opacity-20" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-[10px]">All caught up!</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => handleViewNotification(n)}
              className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-black text-xs border border-indigo-200/50 dark:border-indigo-800/50">
                  {n.senderName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {n.senderName || 'User'}
                    </p>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase">
                      {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
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
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left: Sidebar Toggle */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 active:scale-95 transition-all border border-slate-200 dark:border-slate-800"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {/* Notifications — Desktop */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  <Bell size={18} />
                  {totalUnread > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 rounded-[1.5rem] shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 mt-2" align="end">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 rounded-t-[1.5rem]">
                  <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800 dark:text-slate-200">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-tighter hover:underline">
                      Clear all
                    </button>
                  )}
                </div>
                <NotificationList />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile — Desktop */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-[1.5rem] shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 mt-2 overflow-hidden" align="end">
                <DropdownMenuLabel className="px-5 py-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 font-normal">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.name}</p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="p-2">
                  <DropdownMenuItem onClick={() => navigate('settings')} className="rounded-xl py-3 px-4 cursor-pointer flex items-center gap-3 text-slate-600 dark:text-slate-400 focus:bg-slate-50 dark:focus:bg-slate-900 font-bold text-xs uppercase tracking-widest transition-colors">
                    <Settings size={16} className="text-indigo-500" /> Account Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <div className="p-2">
                  <DropdownMenuItem onClick={logout} className="rounded-xl py-3 px-4 text-red-600 dark:text-red-400 font-black cursor-pointer flex items-center gap-3 focus:bg-red-50 dark:focus:bg-red-900/20 text-xs uppercase tracking-widest transition-colors">
                    <LogOut size={16} /> Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Profile Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`sm:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 border ${
              mobileOpen 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' 
                : 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-transparent'
            }`}
          >
            {mobileOpen ? <X size={20} /> : <span className="font-black text-sm">{user?.name?.charAt(0).toUpperCase()}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 sm:hidden bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-sm transition-all" onClick={() => setMobileOpen(false)} />
          <div className="sm:hidden absolute inset-x-0 top-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in slide-in-from-top duration-200">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.name}</p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mt-0.5">System Admin</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { icon: <Bell size={20} />, label: "Notifications", color: "text-orange-500", onClick: () => { setNotifOpen(true); setMobileOpen(false); }, unread: totalUnread },
                  { icon: <MessageSquare size={20} />, label: "Messages", color: "text-blue-500", onClick: () => handleMobileNav('/admin/chat') },
                  { icon: <Settings size={20} />, label: "Settings", color: "text-slate-500", onClick: () => handleMobileNav('settings') },
                ].map((item, idx) => (
                  <button key={idx} onClick={item.onClick} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <span className={item.color}>{item.icon}</span>
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    {item.unread > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{item.unread}</span>
                    ) : (
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                ))}
                <button onClick={logout} className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black mt-2 active:bg-red-100 dark:active:bg-red-900/30 transition-colors uppercase tracking-widest text-[11px]">
                  <LogOut size={20} /> 
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notifications Dialog (Mobile) */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900 transition-all">
          <AlertDialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between w-full">
              <AlertDialogTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Notifications</AlertDialogTitle>
              <AlertDialogCancel className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border-none flex items-center justify-center text-slate-500 dark:text-slate-400 m-0 hover:rotate-90 transition-transform">
                <X size={20} />
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <div className="bg-white dark:bg-slate-900">
            <NotificationList />
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50">
             <button
              onClick={() => { handleMobileNav('/admin/chat'); setNotifOpen(false); }}
              className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
            >
              Go to Messages
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default AdminNav;