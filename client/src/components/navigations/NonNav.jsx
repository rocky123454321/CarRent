import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import brand from "../../assets/brand.png";
import { Link } from "react-router-dom";

const NonNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full fixed top-0 left-0 px-6 py-4 shadow-sm z-50 border-b border-slate-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/">
          <img src={brand} alt="brand" className="h-10" />
        </Link>

        {/* Desktop Login/Signup */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 hover:text-slate-900 transition-all duration-150 bg-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-xl text-white font-semibold text-sm transition-all duration-150"
            style={{ background: "#4f46e5", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4338ca";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(79,70,229,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#4f46e5";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(79,70,229,0.3)";
            }}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            {!mobileOpen ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md p-6 pt-24 -z-10 flex flex-col gap-3 border-b border-slate-100 shadow-lg">
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm text-center hover:border-slate-300 hover:text-slate-900 bg-white transition-all duration-150"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setMobileOpen(false)}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm text-center transition-all duration-150"
            style={{ background: "#4f46e5" }}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NonNav;
