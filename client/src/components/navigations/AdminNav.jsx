import React, { useState } from "react";
import { User, Bell, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminNav = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => logout();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || user.role !== "renter") return null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-3.5 flex items-center gap-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="hidden sm:block w-full max-w-xs">
        <input
          type="text"
          placeholder="Search cars..."
          className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-slate-700 placeholder:text-slate-400 transition"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />
      

      {/* Right icons */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
            5
          </span>
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer">
              <span className="text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-60 rounded-2xl shadow-xl border border-slate-100 p-0 overflow-hidden" align="end">
            {/* User info */}
            <DropdownMenuLabel className="px-4 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email || ""}
                  </p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold">
                    Admin
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Settings */}
            <DropdownMenuGroup className="p-1.5">
              <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 gap-2.5 focus:bg-slate-50">
                <Settings size={15} className="text-slate-400" />
                <span className="text-sm text-slate-600">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="mx-1.5" />

            {/* Logout */}
            <div className="p-1.5">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-xl px-3 py-2.5 gap-2.5 text-red-500 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut size={15} />
                <span className="text-sm font-medium">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile search toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 transition"
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Mobile search bar drop-down */}
      {mobileOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 px-4 py-3 shadow-sm">
          <input
            type="text"
            placeholder="Search cars..."
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-slate-700 placeholder:text-slate-400 transition"
          />
        </div>
      )}
    </header>
  );
};

export default AdminNav;