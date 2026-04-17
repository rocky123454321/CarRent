import React, { useEffect, useState, useMemo } from "react";
import {
  Bell, Settings, LogOut, TextAlignEnd, X, ChevronRight,
  Sun, Moon, TextAlignStart, Car, MessageSquare, CheckCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
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
import { useThemeStore } from "../../store/themeStore";

const NotifIcon = ({ type, status }) => {
  if (type === "chat")
    return (
      <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
        <MessageSquare size={14} />
      </div>
    );
  if (type === "new-booking")
    return (
      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
        <Car size={14} />
      </div>
    );
  const bg =
    status === "confirmed" ? "bg-blue-600"
    : status === "completed" ? "bg-emerald-600"
    : status === "cancelled" ? "bg-red-500"
    : "bg-zinc-400";
  return (
    <div className={`w-10 h-10 rounded-full ${bg} text-white flex items-center justify-center shrink-0`}>
      <CheckCheck size={14} />
    </div>
  );
};

const NotifRow = ({ n, onView }) => {
  const label =
    n.type === "chat" ? n.senderName
    : n.type === "new-booking" ? n.userName
    : `Booking ${n.status}`;

  const sub =
    n.type === "chat" ? n.message
    : n.type === "new-booking" ? `${n.carBrand} ${n.carModel} — ₱${n.totalPrice?.toLocaleString()}`
    : `${n.carBrand} ${n.carModel}`;

  return (
    <div
      onClick={() => onView(n)}
      className={`px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group
        ${!n.read ? "border-l-2 border-zinc-900 dark:border-white" : "border-l-2 border-transparent"}`}
    >
      <div className="flex items-start gap-3">
        <NotifIcon type={n.type} status={n.status} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight truncate">
              {label}
              {n.type === "chat" && n.unreadCount > 1 && (
                <span className="ml-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[8px] px-1.5 py-0.5 rounded-full font-black">
                  {n.unreadCount}
                </span>
              )}
            </p>
            <span className="text-[9px] font-bold text-zinc-400 shrink-0 ml-2">
              {new Date(n.time || n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate font-medium leading-snug">{sub}</p>
        </div>
      </div>
    </div>
  );
};

const TABS = ["All", "Newest", "Unread"];

const TabBar = ({ tab, setTab, unreadCount }) => (
  <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-4 pt-1">
    {TABS.map((t) => (
      <button
        key={t}
        onClick={() => setTab(t)}
        className={`relative px-3 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors
          ${tab === t ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
      >
        {t}
        {t === "Unread" && unreadCount > 0 && (
          <span className="ml-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[8px] px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
        {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />}
      </button>
    ))}
  </div>
);

const NotificationPanel = ({ notifications, onView, onClear, onMarkAllRead }) => {
  const [tab, setTab] = useState("All");

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filtered = useMemo(() => {
    if (tab === "Unread") return notifications.filter((n) => !n.read);
    if (tab === "Newest") return [...notifications].sort((a, b) => new Date(b.time || b.timestamp) - new Date(a.time || a.timestamp));
    return notifications;
  }, [tab, notifications]);

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="px-5 pt-4 pb-0 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity</h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={onClear} className="text-[9px] font-bold uppercase tracking-tighter hover:underline text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>
      <TabBar tab={tab} setTab={setTab} unreadCount={unreadCount} />
      <div className="overflow-y-auto max-h-[55vh] divide-y divide-zinc-50 dark:divide-zinc-900 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-zinc-400">
            <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-100 dark:border-zinc-800">
              <Bell size={18} className="opacity-30" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              {tab === "Unread" ? "All caught up" : "System Clear"}
            </p>
          </div>
        ) : (
          filtered.map((n) => <NotifRow key={n.id} n={n} onView={onView} />)
        )}
      </div>
    </div>
  );
};

const AdminNav = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { notifications, clearNotifications, markAllRead, markNotificationRead, setActiveConversation } = useChatStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { darkMode, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => { initTheme(); }, [initTheme]);

  // ✅ Initialize socket ONCE — no cleanup/disconnect on unmount
  useEffect(() => {
    if (user?._id) useChatStore.getState().initializeSocket(user._id);
  }, [user?._id]);

  const totalUnread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  if (!user || user.role !== "renter") return null;

  const handleViewNotification = (n) => {
    markNotificationRead(n.id);
    if (n.type === "chat") {
      setActiveConversation(n.userId);
      navigate("/admin/chat", { state: { userId: n.userId } });
    } else {
      navigate("/admin/bookings");
    }
    setNotifOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-99 bg-white/80 dark:bg-black backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900/50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-2xl text-zinc-900 dark:text-white active:scale-95 transition-all">
            <TextAlignStart size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
            {darkMode ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-zinc-900" />}
          </button>

          {/* Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
                <Bell size={16} />
                {totalUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center text-[8px] font-black text-white dark:text-zinc-900 px-1 ring-2 ring-white dark:ring-zinc-950">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 bg-white dark:bg-zinc-950 overflow-hidden rounded-2xl" align="end" sideOffset={10}>
              <NotificationPanel notifications={notifications} onView={handleViewNotification} onClear={clearNotifications} onMarkAllRead={markAllRead} />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
                  <div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px] uppercase shadow-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{user?.name?.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 mt-3 bg-white dark:bg-zinc-950 overflow-hidden" align="end">
                <DropdownMenuLabel className="px-5 py-4 border-b border-zinc-50 dark:border-zinc-900">
                  <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
                  <p className="text-[9px] font-medium text-zinc-400 mt-0.5">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuItem onClick={() => navigate("settings")} className="rounded-lg py-2.5 px-4 cursor-pointer flex items-center gap-3 text-zinc-500 hover:text-zinc-900 dark:focus:text-white focus:bg-zinc-50 dark:focus:bg-zinc-900 font-bold text-[10px] uppercase tracking-widest">
                    <Settings size={14} /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-50 dark:bg-zinc-900" />
                <div className="p-1.5">
                  <DropdownMenuItem
                    onClick={() => { useChatStore.getState().disconnectSocket(); logout(); }}
                    className="rounded-lg py-2.5 px-4 text-zinc-900 dark:text-white font-black cursor-pointer flex items-center gap-3 focus:bg-zinc-900 dark:focus:bg-white focus:text-white dark:focus:text-zinc-950 text-[10px] uppercase tracking-widest"
                  >
                    <LogOut size={14} /> Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`sm:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 ${
              mobileOpen ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
            }`}
          >
            {mobileOpen ? <X size={16} /> : <TextAlignEnd size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden fixed h-[100vh] w-full backdrop-blur-2xl z-50 top-[72px] bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-8 flex flex-col h-full">
            <div className="flex flex-col gap-8">
              {["Dashboard", "Chat", "Bookings", "Settings"].map((item) => (
                <Link
                  key={item}
                  to={item === "Dashboard" ? "/admin" : `/admin/${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center justify-between"
                >
                  {item}
                  {item === "Chat" && totalUnread > 0 && (
                    <span className="text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full px-2 py-0.5 font-black">{totalUnread}</span>
                  )}
                  <ChevronRight size={24} className="opacity-10" />
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3 pb-10 border-t border-zinc-100 dark:border-zinc-900 pt-8">
              <button
                onClick={() => { useChatStore.getState().disconnectSocket(); logout(); }}
                className="flex items-center mb-8 gap-3 p-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={notifOpen} onOpenChange={setNotifOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-[2.5rem] p-0 overflow-hidden border border-zinc-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950">
          <AlertDialogHeader className="px-6 py-5 border-b border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center justify-between w-full">
              <AlertDialogTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Activity</AlertDialogTitle>
              <AlertDialogCancel className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-zinc-950 dark:text-white m-0">
                <X size={18} />
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <NotificationPanel notifications={notifications} onView={handleViewNotification} onClear={clearNotifications} onMarkAllRead={markAllRead} />
          <div className="p-5 border-t border-zinc-50 dark:border-zinc-900">
            <button onClick={() => { navigate("/admin/chat"); setNotifOpen(false); }} className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-[0.98] transition-all">
              Open Messaging Center
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default AdminNav;