import React, { useEffect, useState, useMemo } from "react";
import {
  Search, Bell, Settings, LogOut, X, ChevronRight,
  TextAlignEnd, CheckCheck, MessageSquare,
} from "lucide-react";
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

const NotifIcon = ({ type, status }) => {
  if (type === "chat")
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
        <MessageSquare size={13} />
      </div>
    );
  const bg =
    status === "confirmed" ? "bg-blue-600"
    : status === "completed" ? "bg-emerald-600"
    : status === "cancelled" ? "bg-red-500"
    : "bg-zinc-400";
  return (
    <div className={`w-9 h-9 rounded-full ${bg} text-white flex items-center justify-center shrink-0`}>
      <CheckCheck size={13} />
    </div>
  );
};

const NotifRow = ({ n, onView }) => {
  const label = n.type === "chat" ? n.senderName : `Booking ${n.status}`;
  const sub   = n.type === "chat" ? n.message : `${n.carBrand} ${n.carModel} — status: ${n.status}`;

  return (
    <div
      onClick={() => onView(n)}
      className={`px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer
        ${!n.read ? "border-l-2 border-zinc-900 dark:border-white" : "border-l-2 border-transparent"}`}
    >
      <div className="flex items-start gap-3">
        <NotifIcon type={n.type} status={n.status} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-0.5">
            <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight truncate">
              {label}
              {n.type === "chat" && n.unreadCount > 1 && (
                <span className="ml-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[8px] px-1.5 py-0.5 rounded-full font-black">
                  {n.unreadCount}
                </span>
              )}
            </p>
            <span className="text-[9px] font-medium text-zinc-400 shrink-0 ml-2">
              {new Date(n.time || n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{sub}</p>
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
      <div className="overflow-y-auto max-h-[55vh] divide-y divide-zinc-100 dark:divide-zinc-900 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-zinc-400">
            <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-100 dark:border-zinc-800">
              <Bell size={18} className="opacity-30" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              {tab === "Unread" ? "All caught up" : "No Activity"}
            </p>
          </div>
        ) : (
          filtered.map((n) => <NotifRow key={n.id} n={n} onView={onView} />)
        )}
      </div>
    </div>
  );
};

const UserNav = () => {
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useCarStore();
  const { notifications, clearNotifications, markAllRead, markNotificationRead, setActiveConversation } = useChatStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const navigate = useNavigate();

  const totalUnread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  // ✅ Initialize socket ONCE — no cleanup/disconnect on unmount
  useEffect(() => {
    if (!user?._id || user.role === "renter") return;
    useChatStore.getState().initializeSocket(user._id);
  }, [user?._id, user?.role]);

  if (!user || user.role === "renter") return null;

  const handleViewNotification = (n) => {
    markNotificationRead(n.id);
    if (n.type === "chat") {
      setActiveConversation(n.userId);
      navigate("/chat", { state: { adminId: n.userId } });
    } else if (n.type === "booking-status") {
      navigate("/my-rentals");
    }
    setNotifOpen(false);
    setMobileOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== "/cars") navigate("/cars");
  };

  return (
    <nav className="bg-white/80 dark:bg-black backdrop-blur-md w-full fixed top-0 left-0 z-50 border-b border-zinc-100 dark:border-zinc-900 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16 relative">

        <Link to="/" className="shrink-0 active:scale-95 transition-transform">
          <img src={brand} alt="brand" className="h-6 dark:invert" />
        </Link>

        <div className="hidden md:flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {["Home", "My Rentals", "Chat"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-all"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex relative w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-1 ring-zinc-200 dark:ring-zinc-800 outline-none text-[10px] font-bold tracking-widest transition-all"
            />
          </div>

          <button className="relative flex lg:hidden md:hidden w-9 h-9 items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
            <Search size={16} onClick={() => navigate("/cars")} />
          </button>

          {/* Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden lg:flex items-center gap-2 p-1 pr-3 rounded-full border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                <div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px] uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{user?.name?.split(" ")[0]}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl shadow-2xl border-zinc-100 dark:border-zinc-900 p-0 mt-3 bg-white dark:bg-zinc-950 overflow-hidden" align="end">
              <DropdownMenuLabel className="px-5 py-4 border-b border-zinc-50 dark:border-zinc-900">
                <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[9px] text-zinc-400 font-medium mt-0.5">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg py-2.5 px-4 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-zinc-500 focus:text-zinc-900 dark:focus:text-white focus:bg-zinc-50 dark:focus:bg-zinc-900 flex items-center gap-3">
                  <Settings size={14} /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-50 dark:bg-zinc-900" />
              <div className="p-1.5">
                <DropdownMenuItem
                  onClick={() => { useChatStore.getState().disconnectSocket(); logout(); }}
                  className="rounded-lg py-2.5 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white focus:bg-zinc-900 dark:focus:bg-white focus:text-white dark:focus:text-zinc-950 flex items-center gap-3 cursor-pointer"
                >
                  <LogOut size={14} /> Sign Out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              mobileOpen ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
            }`}
          >
            {mobileOpen ? <X size={16} /> : <TextAlignEnd size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed h-[100vh] w-full backdrop-blur-2xl z-99 top-16 bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-8 flex flex-col h-full">
            <div className="flex flex-col gap-8">
              {["Home", "My Rentals", "Chat", "Settings"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase flex items-center justify-between"
                >
                  {item}
                  <ChevronRight size={24} className="opacity-10" />
                </Link>
              ))}
            </div>
            <div className="mt-auto mb-8 flex flex-col gap-3 pb-10 border-t border-zinc-100 dark:border-zinc-900 pt-8">
              <button
                onClick={() => { useChatStore.getState().disconnectSocket(); logout(); }}
                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

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
          <NotificationPanel notifications={notifications} onView={handleViewNotification} onClear={clearNotifications} onMarkAllRead={markAllRead} />
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default UserNav;