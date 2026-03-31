import React, { useEffect, useRef } from "react";
import carImage from "../../assets/carpichero.png";
import howitwork from "../../assets/process.jpg";
import { Search, CheckSquare, Car } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & select",
    description:
      "Explore our fleet of premium cars. Filter by type, date, and location to find your perfect match.",
    accent: "#4f46e5",
    bg: "#EEF2FF",
  },
  {
    number: "02",
    icon: CheckSquare,
    title: "Book & confirm",
    description:
      "Reserve your car in a few taps. Receive instant confirmation via email — no waiting, no hassle.",
    accent: "#0891b2",
    bg: "#ECFEFF",
  },
  {
    number: "03",
    icon: Car,
    title: "Pick up & drive",
    description:
      "Head to the pickup location and hit the road. Clean, inspected, and ready for your adventure.",
    accent: "#059669",
    bg: "#ECFDF5",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".step-item").forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }, i * 130);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-28 px-6 lg:px-16 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
          >
            Up and running in{" "}
            <span className="text-indigo-600">3 steps</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 max-w-xl mx-auto">
            Renting a premium car has never been this effortless. From browse to
            drive in under 5 minutes.
          </p>
        </div>

        {/* Content */}
        <div ref={ref} className="flex flex-col lg:flex-row items-center gap-16">
          {/* Steps */}
          <div className="flex-1 flex flex-col gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="step-item group flex gap-5 p-6 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:border-slate-200 hover:shadow-md"
                  style={{
                    opacity: 0,
                    transform: "translateY(18px)",
                    transition:
                      "opacity 0.55s ease, transform 0.55s ease, box-shadow 0.2s, border-color 0.2s",
                  }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
                    style={{ background: step.bg, color: step.accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className="text-xs font-black tracking-widest"
                        style={{ color: step.accent }}
                      >
                        {step.number}
                      </span>
                      <h3 className="text-base font-bold text-slate-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image */}
          <div className="flex-1 relative flex items-center justify-center">
            <div
              className="absolute w-[380px] h-[380px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #e0e7ff 0%, #f0f4ff 55%, transparent 75%)",
              }}
            />
            <img
              src={howitwork}
              alt="Car"
              className="relative z-10  w-full rounded-2xl max-w-lg"
              style={{
                animation: "float 7s ease-in-out infinite",
                filter: "drop-shadow(0 20px 40px rgba(79,70,229,0.12))",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
