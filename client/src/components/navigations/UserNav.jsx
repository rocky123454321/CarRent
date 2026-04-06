import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, LogOut, Menu, X, MessageSquare, CarFront, ChevronRight } from "lucide-react";
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
  AlertDialogTitle, AlertDialogCancel,
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

  const handleMobileNav = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const NotificationList = () => (
    <div className="max-h-[60vh] overflow-y-auto bg-white dark:bg-zinc-950">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <Bell size={20} className="mb-2 opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-widest">No Activity</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => handleViewNotification(n)}
              className="px-6 py-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {n.senderName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                      {n.senderName}
                    </p>
                    <span className="text-[9px] font-medium text-zinc-400">
                      {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed italic">
                    "{n.message}"
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
    <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md w-full fixed top-0 left-0 z-50 border-b border-zinc-100 dark:border-zinc-900 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16 relative">
        
        {/* Left: Brand */}
        <Link to="/" className="shrink-0 active:scale-95 transition-transform">
          <img src={brand} alt="brand" className="h-6 dark:invert" />
        </Link>
  
        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {['Home', 'Category', 'My Rentals', 'Chat'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : item === 'Category' ? '/cars' : `/${item.toLowerCase().replace(' ', '-')}`} 
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-all"
            >
              {item}
            </Link>
          ))}
        </div>
  
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden lg:flex relative w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-1 ring-zinc-200 dark:ring-zinc-800 outline-none text-[10px] font-bold tracking-widest transition-all"
            />
          </div>
  
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                <Bell size={16} />
                {totalUnread > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full ring-2 ring-white dark:ring-zinc-950" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-xl shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 mt-3 bg-white dark:bg-zinc-950 overflow-hidden" align="end">
              <div className="px-6 py-4 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity</h3>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-[9px] font-bold uppercase tracking-tighter hover:underline">Clear</button>
                )}
              </div>
              <NotificationList />
            </DropdownMenuContent>
          </DropdownMenu>
  
          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                <div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px] uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 mt-3 bg-white dark:bg-zinc-950 overflow-hidden" align="end">
              <DropdownMenuLabel className="px-5 py-4 border-b border-zinc-50 dark:border-zinc-900">
                <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[9px] text-zinc-400 font-medium mt-0.5">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg py-2.5 px-4 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-zinc-500 focus:text-zinc-900 dark:focus:text-white focus:bg-zinc-50 dark:focus:bg-zinc-900 transition-colors flex items-center gap-3">
                  <Settings size={14} /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-50 dark:bg-zinc-900" />
              <div className="p-1.5">
                <DropdownMenuItem onClick={logout} className="rounded-lg py-2.5 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white focus:bg-zinc-900 dark:focus:bg-white focus:text-white dark:focus:text-zinc-950 transition-all flex items-center gap-3 cursor-pointer">
                  <LogOut size={14} /> Sign Out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
  
          {/* Mobile Menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              mobileOpen ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
            }`}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-zinc-950 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-8 flex flex-col h-full">
            <div className="flex flex-col gap-8">
              {['Home', 'Category', 'My Rentals', 'Chat'].map((item) => (
                <Link 
                  key={item}
                  to={item === 'Home' ? '/' : item === 'Category' ? '/cars' : `/${item.toLowerCase().replace(' ', '-')}`} 
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center justify-between"
                >
                  {item}
                  <ChevronRight size={24} className="opacity-10" />
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3 pb-10 border-t border-zinc-100 dark:border-zinc-900 pt-8">
              <button onClick={() => handleMobileNav('/settings')} className="flex items-center gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 text-[10px] font-bold uppercase tracking-widest">
                <Settings size={16} /> Account Settings
              </button>
              <button onClick={logout} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dialog */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-2xl p-0 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xl">
          <AlertDialogHeader className="px-6 py-5 border-b border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Notifications</AlertDialogTitle>
              <AlertDialogCancel className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border-none flex items-center justify-center m-0">
                <X size={14} />
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <NotificationList />
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default UserNav;