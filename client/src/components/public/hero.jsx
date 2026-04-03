import React, { useEffect, useRef } from "react";
import car from "../../assets/carpichero.png";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; // 1. Import ang auth store

const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { isAuthenticated } = useAuthStore(); // 2. Kunin ang auth status

  // 3. Logic para sa Protected Navigation
  const handleBrowseCars = () => {
    if (isAuthenticated) {
      navigate("/cars"); // Kung login na, punta sa listahan ng cars
    } else {
      navigate("/login"); // Else, login muna
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll(".fu").forEach((item, i) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      setTimeout(() => {
        item.style.transition = "opacity 0.65s ease, transform 0.65s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 80 + i * 110);
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center bg-white overflow-hidden"
      style={{ paddingTop: "72px" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 65% 38%, #EEF2FF 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-12 items-center py-24">
        <div className="space-y-8">
          <div className="fu inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-500 tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI-Powered Platform
          </div>

          <h1
            className="fu text-[3.4rem] lg:text-[4.2rem] xl:text-[4.8rem] font-black text-slate-900 leading-[1.06] tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Drive your
            <br />
            <span className="text-indigo-600">dream car</span>
            <br />
            today.
          </h1>

          <p className="fu text-lg lg:text-xl text-slate-500 leading-relaxed max-w-md">
            Book premium vehicles in minutes with smart AI-powered suggestions
            tailored to your journey.
          </p>

          <div className="fu flex flex-wrap items-center gap-3">
            {/* 4. Ginabmit ang handleBrowseCars dito */}
            <button
              onClick={handleBrowseCars}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              style={{ boxShadow: "0 4px 20px rgba(79,70,229,0.3)" }}
            >
              Browse Cars
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            
            <button
              onClick={() => navigate("/how-it-works")}
              className="inline-flex items-center gap-1 px-5 py-3.5 text-slate-500 font-semibold text-base hover:text-slate-800 transition-colors"
            >
              How it works <ChevronRight size={15} />
            </button>
          </div>

          <div className="fu flex items-center gap-4 pt-1">
            <div className="flex -space-x-2.5">
              {["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Trusted by 20,000+ renters</p>
              <p className="text-xs text-amber-500 font-medium">
                ★★★★★ <span className="text-slate-400 font-normal">4.9 average rating</span>
              </p>
            </div>
          </div>
        </div>

        <div className="fu relative hidden lg:flex items-center justify-center">
          <div
            className="absolute w-[480px] h-[480px] rounded-full"
            style={{
              background: "radial-gradient(circle, #e0e7ff 0%, #f0f4ff 50%, transparent 75%)",
            }}
          />
          <img
            src={car}
            alt="Premium Car"
            className="relative z-10 w-full max-w-xl"
            style={{
              animation: "heroFloat 7s ease-in-out infinite",
              filter: "drop-shadow(0 28px 44px rgba(79,70,229,0.13))",
            }}
          />
          {[
            { text: "500+ Cars", icon: "🚗", style: { top: "6%", right: "0" }, delay: "0s" },
            { text: "Instant Booking", icon: "⚡", style: { bottom: "12%", left: "0" }, delay: "1.2s" },
          ].map(({ text, icon, style, delay }) => (
            <div
              key={text}
              className="absolute flex items-center gap-2.5 px-4 py-2.5 z-[20] rounded-2xl bg-white border border-slate-100 shadow-md text-sm font-semibold text-slate-700"
              style={{ ...style, animation: `chipFloat 5s ease-in-out ${delay} infinite` }}
            >
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes chipFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;