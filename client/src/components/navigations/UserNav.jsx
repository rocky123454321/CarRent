import React, { useState } from "react";
import { User, Search, Bell, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import brand from "../../assets/brand.png";
import { useAuthStore } from "../../store/authStore";
import { useCarStore } from "../../store/CarStore";
import { Link } from "react-router-dom";

const UserNav = () => {
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useCarStore(); // ✅
  const handleLogout = () => logout();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user || user.role === "renter") return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full fixed top-0 left-0 px-6 py-4 shadow-sm z-50 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Logo */}
        <Link to="/">
          <img src={brand} alt="brand" className="h-10" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">

          {/* ✅ Search bar — now controlled */}
          <div className="relative w-[260px]">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100/70 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            {/* ✅ Clear button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Favorites & Notifications */}
          <button className="relative p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition group">
            <Heart size={20} className="text-gray-600 group-hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">2</span>
          </button>

          <button className="relative p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition group">
            <Bell size={20} className="text-gray-600 group-hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">5</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition"
            >
              <User size={20} className="text-gray-700" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{user?.email}</p>
                    <p className="text-xs text-gray-500">Logged in</p>
                  </div>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm transition">
                  <Settings size={16} className="text-gray-600" /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition border-t border-gray-100"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {!mobileOpen ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md p-6 pt-24 -z-10">
          {/* ✅ Mobile search — also controlled */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 border focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex justify-around mb-4">
            <div className="relative"><Heart size={24} /><span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1 rounded-full">2</span></div>
            <div className="relative"><Bell size={24} /><span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1 rounded-full">5</span></div>
            <User size={24} />
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors mb-2">
            <Settings size={18} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNav;