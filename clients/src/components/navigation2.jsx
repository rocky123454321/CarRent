import React, { useState } from "react";
import {
  Menu ,
  X,
  User,
  Search,
  Bell,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import brand from "../assets/brand.png";

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full fixed top-0 left-0 px-6 py-4 shadow-sm z-50 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <img src={brand} alt="brand" className="h-10" />

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">

          {/* 🔍 Search */}
          <div className="relative w-[260px]">
            <input
              type="text"
              placeholder="Search cars..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100/70 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* ❤️ Favorite */}
          <button className="relative p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition group">
            <Heart size={20} className="text-gray-600 group-hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
              2
            </span>
          </button>

          {/* 🔔 Notification */}
          <button className="relative p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition group">
            <Bell size={20} className="text-gray-600 group-hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
              5
            </span>
          </button>

          {/* 👤 Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition"
            >
              <User size={20} className="text-gray-700" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <a className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sm">
                  <Settings size={16} /> Settings
                </a>
                <a className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sm">
                  <LogOut size={16} /> Logout
                </a>
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

      {/* 📱 Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md transition-transform duration-300 ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-6 pt-24 pb-6 space-y-6">

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search cars..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 border focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Icons */}
          <div className="flex justify-around">
            <div className="relative">
              <Heart size={24} />
              <span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1 rounded-full">2</span>
            </div>
            <div className="relative">
              <Bell size={24} />
              <span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1 rounded-full">5</span>
            </div>
            <User size={24} />
          </div>

          {/* Buttons */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <Settings size={18} /> Settings
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;


