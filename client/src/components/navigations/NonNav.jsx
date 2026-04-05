import React, { useState, useEffect } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import brand from "../../assets/brand.png";
import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";

const NonNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleTheme, initTheme } = useThemeStore();

  // Siguraduhin na tama ang theme pagka-load ng app
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-white/5/60 dark:bg-black/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/" className="transition-opacity hover:opacity-80">
          <img src={brand} alt="brand" className="h-9 w-auto object-contain dark:brightness-110" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-4 md:flex">
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 dark:border-white/5 dark:bg-[#0a0a0a] dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-400 animate-pulse" />
            ) : (
              <Moon size={18} className="text-indigo-600" />
            )}
          </button>

          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 active:scale-95"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/5"
          >
            {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-slate-600" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-600 dark:text-slate-300"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Animated Slide Down) */}
      <div className={`
        absolute left-0 top-full w-full border-b border-slate-200 bg-white/95 p-6 backdrop-blur-lg transition-all duration-300 dark:border-white/5 dark:bg-black/95 md:hidden
        ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}
      `}>
        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex h-12 items-center justify-center rounded-xl border border-slate-200 font-semibold text-slate-700 dark:border-white/5 dark:text-slate-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setMobileOpen(false)}
            className="flex h-12 items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NonNav;