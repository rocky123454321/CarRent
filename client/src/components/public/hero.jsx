import React, { useEffect, useRef } from "react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { isAuthenticated } = useAuthStore();

  const handleBrowseCars = () => {
    navigate(isAuthenticated ? "/cars" : "/login");
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // Modern staggered animation logic
    const items = el.querySelectorAll(".fu");
    items.forEach((item, i) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px) scale(0.98)";
      
      setTimeout(() => {
        item.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        item.style.opacity = "1";
        item.style.transform = "translateY(0) scale(1)";
      }, 150 + i * 100);
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white transition-colors duration-500 dark:bg-black"
    >
      {/* SaaS Mesh Background - Optimized for Dark Mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-50/50 blur-[120px] dark:bg-indigo-900/20" />
        <div className="absolute -bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-50/50 blur-[100px] dark:bg-blue-900/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center">
        
        {/* Animated Badge */}
        <div className="fu mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-[#0a0a0a] dark:text-indigo-400">
          <Sparkles size={12} className="animate-pulse" />
          The Future of Car Rentals
        </div>

        {/* Main Heading */}
        <h1 className="fu mb-8 text-[3.2rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white md:text-[5rem] lg:text-[6.2rem]">
          Your next journey <br />
          starts <span className="relative inline-block text-indigo-600 italic">
            here.
            <span className="absolute bottom-2 left-0 h-2 w-full bg-indigo-100/50 -z-10 dark:bg-indigo-900/30" />
          </span>
        </h1>

        {/* Subtext */}
        <p className="fu mb-12 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
          Premium car rentals simplified. No paperwork, no hidden fees—just 
          seamless technology connecting you to your dream ride in seconds.
        </p>

        {/* CTA Group */}
        <div className="fu flex flex-col items-center justify-center gap-4 sm:flex-row mb-20 w-full">
          <button
            onClick={handleBrowseCars}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-10 py-5 text-sm font-black text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-95 dark:shadow-none sm:w-auto"
          >
            Explore the Fleet
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => navigate("/how-it-works")}
            className="flex w-full items-center justify-center gap-1 rounded-2xl border border-transparent px-8 py-5 text-sm font-black uppercase tracking-[0.15em] text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white sm:w-auto"
          >
            How it works <ChevronRight size={16} />
          </button>
        </div>

        {/* Trust Footer */}
        <div className="fu flex w-full max-w-lg flex-col items-center gap-8 border-t border-slate-100 pt-12 dark:border-white/5">
          <div className="flex w-full items-center justify-around opacity-40 transition-all duration-500 hover:opacity-100 dark:text-white">
            <span className="text-xs font-black tracking-widest">TRUSTED</span>
            <span className="text-xs font-black tracking-widest">SECURE</span>
            <span className="text-xs font-black tracking-widest">FAST</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">★</span>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Verified by 20k+ Active Users
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;