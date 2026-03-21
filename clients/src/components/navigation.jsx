import React, { useState } from "react";
import { TextAlignEnd , X } from "lucide-react";
import brand from "../assets/brand.png";

const buttonBaseClass =
  "px-6 py-2.5 text-sm lg:text-base font-semibold rounded-full border border-gray-200 transition duration-200 hover:shadow-md transform hover:scale-105 active:scale-95";

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white/70 backdrop-blur-xl w-full fixed top-0 left-0 px-6 py-4 lg:py-5 shadow-sm z-50 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={brand} alt="brand-image" className="h-10" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 justify-center space-x-10 text-slate-700 font-semibold">
          <a href="/services" className="relative hover:text-blue-600 transition">
            Service
          </a>
          <a href="/cars" className="relative hover:text-blue-600 transition">
            Cars
          </a>
          <a href="/about" className="relative hover:text-blue-600 transition">
            About
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-3">
          <a
            href="/login"
            className={`${buttonBaseClass} text-slate-700 bg-white hover:bg-slate-50`}
          >
            Login
          </a>
          <a
            href="/signup"
            className={`${buttonBaseClass} text-white bg-blue-600 hover:bg-blue-700`}
          >
            Signup
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {!mobileOpen ? <TextAlignEnd  size={26} /> : <X size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md transform transition-transform duration-300 z-40 ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col px-6 pt-24 pb-6 space-y-5 text-slate-700">
          <a href="/services" className="font-semibold hover:text-blue-600 transition">
            Service
          </a>
          <a href="/cars" className="font-semibold hover:text-blue-600 transition">
            Cars
          </a>
          <a href="/about" className="font-semibold hover:text-blue-600 transition">
            About
          </a>

          <div className="pt-4 flex flex-col gap-3">
            <a
              href="/login"
              className={`${buttonBaseClass} text-slate-700 bg-white text-center`}
            >
              Login
            </a>
            <a
              href="/signup"
              className={`${buttonBaseClass} text-white bg-blue-600 text-center`}
            >
              Signup
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;


