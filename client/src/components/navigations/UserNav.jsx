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
    <div className="max-h-[60vh] overflow-y-auto bg-white dark:bg-[#0a0a0a]">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
             <Bell size={28} className="opacity-20" />
          </div>
          <p className="text-sm font-medium text-slate-500">All caught up!</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => handleViewNotification(n)}
              className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm">
                  {n.senderName?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                      {n.senderName || 'Support'}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-600">
                      {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed italic">
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
    <nav className="bg-white/90 dark:bg-[#0a0a0a] backdrop-blur-md w-full fixed top-0 left-0 z-50 border-b border-slate-200/60 dark:border-white/5 shadow-sm transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 h-16 relative">
        
        {/* Left: Brand */}
        <Link to="/" className="shrink-0 active:scale-95 transition-transform">
          <img src={brand} alt="brand" className="h-8 sm:h-9 dark:brightness-110" />
        </Link>
  
        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {['Home', 'Category', 'My Rentals', 'Chat'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : item === 'Category' ? '/cars' : `/${item.toLowerCase().replace(' ', '-')}`} 
              className="px-3 lg:px-4 py-2 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all whitespace-nowrap"
            >
              {item}
            </Link>
          ))}
        </div>
  
        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden lg:flex relative w-[160px] xl:w-[240px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-black border border-transparent dark:border-white/5 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-sm dark:text-white transition-all"
            />
          </div>
  
          <div className="hidden lg:block w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
  
          {/* Notifications */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Bell size={18} />
                  {totalUnread > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 rounded-2xl shadow-xl border-slate-200 dark:border-white/5 p-0 mt-2 bg-white dark:bg-[#0a0a0a]" align="end">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider hover:underline">
                      Clear All
                    </button>
                  )}
                </div>
                <NotificationList />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
  
          {/* Profile */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-2 lg:pr-3 rounded-xl border border-slate-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-2xl shadow-xl border-slate-200 dark:border-white/5 p-0 mt-2 overflow-hidden bg-white dark:bg-[#0a0a0a]" align="end">
                <DropdownMenuLabel className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/5 font-normal">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-xl py-2.5 px-3 cursor-pointer flex items-center gap-2 text-slate-600 dark:text-slate-400 focus:bg-slate-50 dark:focus:bg-slate-800 transition-colors">
                    <Settings size={16} className="opacity-70" /> Account Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="dark:bg-slate-800" />
                <div className="p-1.5">
                  <DropdownMenuItem onClick={logout} className="rounded-xl py-2.5 px-3 text-red-600 font-bold cursor-pointer flex items-center gap-2 focus:bg-red-50 dark:focus:bg-red-900/20 transition-colors">
                    <LogOut size={16} /> Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
  
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 shadow-lg ${
              mobileOpen 
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 shadow-red-200/20' 
                : 'bg-slate-900 dark:bg-blue-600 text-white shadow-slate-200/50 dark:shadow-blue-900/30'
            }`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      {mobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 md:hidden bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setMobileOpen(false)} 
          />
          <div className="md:hidden absolute inset-x-0 top-full bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-white/5 shadow-2xl z-50 animate-in slide-in-from-top duration-300 ease-out">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleMobileNav('/cars')} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-black gap-2 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#0a0a0a] flex items-center justify-center text-slate-600 dark:text-slate-400"><Search size={20} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</span>
                </button>
                <button onClick={() => handleMobileNav('/my-rentals')} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-black gap-2 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#0a0a0a] flex items-center justify-center text-slate-600 dark:text-slate-400"><CarFront size={20} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rentals</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => { setNotifOpen(true); setMobileOpen(false); }} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center"><Bell size={18} /></div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Notifications</span>
                  </div>
                  {totalUnread > 0 && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalUnread}</span>}
                </button>
                
                <button onClick={() => handleMobileNav('/chat')} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"><MessageSquare size={18} /></div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Messages</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                </button>

                <button onClick={logout} className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold mt-2 border border-red-100 dark:border-red-900/30">
                  <LogOut size={18} /> Log out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notifications Dialog */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-[#0a0a0a]">
          <AlertDialogHeader className="px-5 py-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-white">Notifications</AlertDialogTitle>
              <AlertDialogCancel className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border-none flex items-center justify-center text-slate-500 dark:text-slate-400 m-0 shadow-sm active:scale-90 transition-all">
                <X size={18} />
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