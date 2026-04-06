import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import  herocar1 from '../../assets/herocar1.png'
import  herocar2 from '../../assets/herocar2.png'
const MARQUEE_ITEMS = [
  "Premium Fleet", "Zero Hidden Fees", "Instant Booking",
  "24/7 Support", "Free Cancellation", "20,000+ Drivers",
];

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const { darkMode } = useThemeStore(); 
  const handleBrowseCars = () => {
    navigate(isAuthenticated ? "/cars" : "/login");
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) =>
    `transition-all duration-700 ${delay ? `delay-[${delay}ms]` : ""} ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-zinc-950">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 dark:border-zinc-900">
        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
          drivo.
        </span>
        <div className="hidden sm:flex items-center gap-8">
          {["Fleet", "Locations", "Pricing"].map((l) => (
            <a key={l} href="#"
              className="text-xs font-medium tracking-wide text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>
        <button onClick={handleBrowseCars}
          className="rounded-full border border-zinc-200 dark:border-zinc-800 px-5 py-2 text-xs font-semibold tracking-wide text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200">
          Book Now
        </button>
      </nav>

      {/* Body */}
      <div className="flex flex-1 flex-col lg:flex-row items-center gap-12 px-8 py-20 max-w-6xl mx-auto w-full">

        {/* Left */}
        <div className="flex-1 flex flex-col gap-7">

          {/* Eyebrow */}
          <div className={`inline-flex items-center gap-2.5 ${fadeUp(0)}`}>
            <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Premium Car Rentals
            </span>
          </div>

          {/* Heading */}
          <h1 className={`text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tighter leading-[1.0] text-zinc-900 dark:text-white ${fadeUp(100)}`}>
            Drive<br />
            <span className="text-zinc-300 dark:text-zinc-700">anything.</span><br />
            Go anywhere.
          </h1>

          {/* Subtext */}
          <p className={`text-sm leading-relaxed text-zinc-400 dark:text-zinc-500 max-w-xs ${fadeUp(150)}`}>
            No queues, no paperwork. Instant access to a curated fleet —
            ready when you are.
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap items-center gap-3 ${fadeUp(200)}`}>
            <button onClick={handleBrowseCars}
              className="group flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-6 py-3 text-xs font-semibold tracking-wide text-white dark:text-zinc-900 hover:opacity-80 transition-opacity">
              Explore Fleet
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => navigate("/how-it-works")}
              className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors tracking-wide">
              How it works <ChevronRight size={13} />
            </button>
          </div>

          {/* Stats */}
          <div className={`flex gap-8 pt-7 border-t border-zinc-100 dark:border-zinc-900 ${fadeUp(280)}`}>
            {[
              { num: "20k+", label: "Active drivers" },
              { num: "150+", label: "Vehicles" },
              { num: "4.9★", label: "Avg. rating" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{s.num}</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Image */}
        <div className={`flex-1 w-full max-w-lg ${fadeUp(150)}`}>
  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
    {/* Tinanggal ko yung bg-zinc para sure na walang sisilip na kulay sa likod habang nag-f-fade */}
    
    <img
      src={!darkMode ? herocar2 : herocar1}
      alt="Premium car"
      className="h-full w-full object-cover"
      style={{
        WebkitMaskImage: `linear-gradient(to bottom, transparent, black 10%, black 90%, transparent), 
                          linear-gradient(to right, transparent, black 10%, black 90%, transparent)`,
        maskImage: `linear-gradient(to bottom, transparent, black 10%, black 90%, transparent), 
                    linear-gradient(to right, transparent, black 10%, black 90%, transparent)`,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect'
      }}
      onError={(e) => {
        e.target.src = "https://placehold.co/900x675/f4f4f5/a1a1aa?text=Fleet";
      }}
    />

    {/* Live badge */}
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3.5 py-2">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        47 cars available now
      </span>
    </div>
  </div>
</div>
      </div>

      {/* Marquee */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 py-4 overflow-hidden">
        <div className="flex w-max" style={{ animation: "marquee 24s linear infinite" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i}
              className="flex items-center gap-6 whitespace-nowrap px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 dark:text-zinc-700">
              {item}
              <span className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </section>
  );
};

export default Hero;