import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import brand from "../../assets/brand.png";
import { Link } from "react-router-dom";

const NonNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full fixed top-0 left-0 px-6 py-4 shadow-sm z-50 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/">
          <img src={brand} alt="brand" className="h-10" />
        </Link>

        {/* Desktop Login/Signup */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
          >
            Sign Up
          </Link>
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
        <div className="md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md p-6 pt-24 -z-10 flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold text-center hover:bg-green-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold text-center hover:bg-emerald-600 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NonNav;