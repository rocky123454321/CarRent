import React, { useState, useEffect } from "react";
import { TextAlignEnd, Moon, Sun, X } from "lucide-react";
import brand from "../../assets/brand.png";
import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";

const NonNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-zinc-100 bg-white backdrop-blur-md transition-all duration-300 dark:border-zinc-900 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        
        {/* Logo - Sized to match the landing page feel */}
        <Link to="/" className="transition-opacity hover:opacity-80">
          <img 
            src={brand} 
            alt="brand" 
            className="h-7 w-auto object-contain dark:brightness-0 dark:invert" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-full bg-zinc-900 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign Up
            </Link>
          </div>

          <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Theme Toggle - Sized exactly like the feature icons (h-10) */}
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800"
          >
            {darkMode ? <Sun size={14} className="text-zinc-400" /> : <Moon size={14} className="text-zinc-600" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-zinc-900 dark:text-white"
          >
            {mobileOpen ? <X size={20} /> : <TextAlignEnd  size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        absolute left-0 top-full w-full border-b border-zinc-100 bg-white/95 p-8 transition-all duration-500 dark:border-zinc-900 dark:bg-zinc-950/95 md:hidden
        ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}
      `}>
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:border-zinc-800 dark:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 items-center justify-center rounded-xl bg-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-zinc-900"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NonNav;