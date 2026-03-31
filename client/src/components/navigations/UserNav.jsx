import React, { useState } from "react";
import { User, Search, Bell, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import brand from "../../assets/brand.png";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useCarStore } from "../../store/CarStore";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserNav = () => {
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useCarStore();
  const handleLogout = () => logout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  if (!user || user.role === "renter") return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full fixed top-0 left-0 px-6 py-4 z-50 border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Logo */}
        <Link to="/">
          <img src={brand} alt="brand" className="h-10" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">

          {/* Search */}
          <div className="relative w-[260px]">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-700 placeholder:text-slate-400 transition"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Favorites */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition">
            <Heart size={17} />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
              2
            </span>
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition">
            <Bell size={17} />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
              5
            </span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer">
                <span className="text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-60 rounded-2xl shadow-xl border border-slate-100 p-0 overflow-hidden"
              align="end"
            >
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
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold">
                      Member
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              {/* Settings */}
              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer rounded-xl px-3 py-2.5 gap-2.5 focus:bg-slate-50"
                >
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
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 transition"
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg px-5 py-4 flex flex-col gap-3">

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-700 placeholder:text-slate-400 transition"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Icon row */}
          <div className="flex items-center gap-2">
            <button className="relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
              <Heart size={16} /> Favorites
              <span className="absolute top-1.5 right-3 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">2</span>
            </button>
            <button className="relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
              <Bell size={16} /> Alerts
              <span className="absolute top-1.5 right-3 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">5</span>
            </button>
          </div>

          {/* User info strip */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
            </div>
          </div>

          {/* Actions */}
          <button onClick={() => navigate("/settings")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
            <Settings size={16} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm font-medium hover:bg-red-100 transition"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNav;