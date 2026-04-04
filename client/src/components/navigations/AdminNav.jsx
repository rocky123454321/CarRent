import React, { useEffect, useState } from "react";
import { Bell, Settings, LogOut, Menu, X, Search, ChevronRight, MessageSquare } from "lucide-react";
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
    <div className="max-h-[60vh] overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
             <Bell size={28} className="opacity-20" />
          </div>
          <p className="text-sm font-medium">All caught up!</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => handleViewNotification(n)}
              className="px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-sm">
                  {n.senderName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {n.senderName || 'User'}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left: Sidebar Toggle (Mobile) / Search (Desktop) */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 active:scale-95 transition-all border border-slate-200"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications — Desktop */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                  <Bell size={18} />
                  {totalUnread > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 rounded-2xl shadow-xl border-slate-200 p-0 mt-2" align="end">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                  <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <NotificationList />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile — Desktop */}
          <div className="hidden sm:block ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user?.name?.split(' ')[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-2xl shadow-xl border-slate-200 p-0 mt-2 overflow-hidden" align="end">
                <DropdownMenuLabel className="px-4 py-4 bg-slate-50 border-b border-slate-100 font-normal">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl py-2.5 px-3 cursor-pointer flex items-center gap-2 text-slate-600 focus:bg-slate-50">
                    <Settings size={16} /> Account Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-1.5">
                  <DropdownMenuItem onClick={logout} className="rounded-xl py-2.5 px-3 text-red-600 font-bold cursor-pointer flex items-center gap-2 focus:bg-red-50">
                    <LogOut size={16} /> Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Profile/Menu Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`sm:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${
              mobileOpen ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
            }`}
          >
            {mobileOpen ? <X size={20} /> : <span className="font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0  z-40 sm:hidden" onClick={() => setMobileOpen(false)} />
          <div className="sm:hidden absolute inset-x-0 top-full bg-white border-b border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top duration-200 ease-out">
            <div className="p-4 flex flex-col gap-3">
              
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-indigo-600/70 font-medium truncate uppercase tracking-tight">System Admin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { setNotifOpen(true); setMobileOpen(false); }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-slate-700">
                    <Bell size={20} className="text-orange-500" />
                    <span className="font-semibold text-sm">Notifications</span>
                  </div>
                  {totalUnread > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>
                  )}
                </button>

                <button
                  onClick={() => handleMobileNav('/admin/chat')}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-slate-700">
                    <MessageSquare size={20} className="text-blue-500" />
                    <span className="font-semibold text-sm">Messages</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>

                <button
                  onClick={() => handleMobileNav('/settings')}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-slate-700">
                    <Settings size={20} className="text-slate-500" />
                    <span className="font-semibold text-sm">Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 font-bold mt-2 active:bg-red-100 transition-colors"
                >
                  <LogOut size={20} /> 
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notifications Dialog (Mobile Only) */}
      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <AlertDialogHeader className="px-5 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-base font-bold text-slate-900">Notifications</AlertDialogTitle>
              <AlertDialogCancel className="h-9 w-9 rounded-full bg-slate-100 border-none flex items-center justify-center text-slate-500 m-0">
                <X size={18} />
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <div className="bg-white">
            <NotificationList />
          </div>
          <div className="p-4 bg-slate-50 flex gap-3">
             <button
              onClick={() => { handleMobileNav('/admin/chat'); setNotifOpen(false); }}
              className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-100 active:scale-[0.98] transition-transform"
            >
              GO TO MESSAGES
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default AdminNav;