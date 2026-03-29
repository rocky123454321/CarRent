import React, { useState } from "react";
import { User, Bell, Heart, Settings, LogOut, TextAlignStart, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const AdminNav = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => logout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user || user.role !== "renter") return null;

  return (
    <nav className="bg-white w-full fixed top-0  left-0 px-6 py-4 z-50 border-b border-gray-200 pl-[260px] flex items-center justify-between">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-4">
        <TextAlignStart size={25} className="text-gray-700 cursor-pointer ml-5 border-gray-200" />

        <div className="w-full max-w-sm">
          <input
            type="text"
            placeholder="Search cars..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700"
          />
        </div>
      </div>

      {/* Right: Desktop icons */}
      <div className="hidden md:flex items-center gap-4">
        <button className="relative p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition">
          <Heart size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
            2
          </span>
        </button>

        <button className="relative p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 transition">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
            5
          </span>
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
                  <p className="text-xs text-gray-500">Admin</p>
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

      {/* Mobile toggle */}
      <div className="md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {!mobileOpen ? <TextAlignStart size={24} /> : <X size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md p-6 pt-24 z-40">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search cars..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700"
            />

            <div className="flex justify-around mb-4">
              <div className="relative">
                <Heart size={24} />
                <span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1 rounded-full">
                  2
                </span>
              </div>
              <div className="relative">
                <Bell size={24} />
                <span className="absolute -top-1 -right-2 text-[10px] bg-red-500 text-white px-1 rounded-full">
                  5
                </span>
              </div>
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
        </div>
      )}
    </nav>
  );
};

export default AdminNav;