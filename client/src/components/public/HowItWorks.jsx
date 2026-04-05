import React, { useEffect, useRef } from "react";
import { Search, CheckSquare, Car } from "lucide-react";
import howitwork from "../../assets/process.jpg";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & select",
    description: "Explore our fleet of premium cars. Filter by type, date, and location to find your perfect match.",
    accent: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    number: "02",
    icon: CheckSquare,
    title: "Book & confirm",
    description: "Reserve your car in a few taps. Receive instant confirmation via email — no waiting, no hassle.",
    accent: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    number: "03",
    icon: Car,
    title: "Pick up & drive",
    description: "Head to the pickup location and hit the road. Clean, inspected, and ready for your adventure.",
    accent: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".step-item").forEach((el, i) => {
              setTimeout(() => {
                el.classList.add("opacity-100", "translate-y-0");
                el.classList.remove("opacity-0", "translate-y-8");
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-slate-50 py-28 px-6 transition-colors duration-500 dark:bg-black lg:px-16">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Simple Process
          </p>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white lg:text-5xl">
            Up and running in <span className="text-indigo-600">3 steps</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-slate-500 dark:text-slate-400">
            Renting a premium car has never been this effortless. From browse to
            drive in under 5 minutes.
          </p>
        </div>

        {/* Content */}
        <div ref={sectionRef} className="flex flex-col items-center gap-16 lg:flex-row">
          
          {/* Steps List */}
          <div className="flex flex-1 flex-col gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="step-item group flex gap-6 rounded-3xl border border-slate-200/60 bg-white p-7 opacity-0 translate-y-8 transition-all duration-700 ease-out hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-white/5 dark:bg-[#0a0a0a] dark:hover:border-indigo-900/50"
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${step.bg} ${step.accent} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <span className={`text-[10px] font-black tracking-widest uppercase ${step.accent}`}>
                        Step {step.number}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image Showcase */}
          <div className="relative flex flex-1 items-center justify-center">
            {/* Ambient Glow */}
            <div className="absolute h-[400px] w-[400px] rounded-full bg-indigo-200/20 blur-[100px] dark:bg-indigo-600/10" />
            
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-[8px] border-white shadow-2xl dark:border-white/5">
              <img
                src={howitwork}
                alt="Process Illustration"
                className="w-full max-w-lg transition-transform duration-700 hover:scale-105"
                style={{
                  animation: "subtleFloat 6s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;