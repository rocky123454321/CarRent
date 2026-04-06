import React, { useEffect, useRef, useState } from "react";
import { Search, CheckSquare, Car } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & select",
    description: "Explore our fleet of premium cars. Filter by type, date, and location to find your perfect match.",
  },
  {
    number: "02",
    icon: CheckSquare,
    title: "Book & confirm",
    description: "Reserve your car in a few taps. Receive instant confirmation via email — no waiting, no hassle.",
  },
  {
    number: "03",
    icon: Car,
    title: "Pick up & drive",
    description: "Head to the pickup location and hit the road. Clean, inspected, and ready for your adventure.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/30 py-24 px-8">
      <div className="mx-auto max-w-4xl"> {/* Ginawa nating max-w-4xl para hindi masyadong malapad ang cards */}

        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Simple Process
            </p>
            <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-zinc-900 dark:text-white">
            Up and running in{" "}
            <span className="text-zinc-300 dark:text-zinc-700">3 steps.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
            From browse to drive in under 5 minutes.
          </p>
        </div>

        {/* Content - Full width and Centered */}
        <div ref={ref} className="grid grid-cols-1 gap-4">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div
              key={number}
              className="flex gap-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Icon size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600">
                    {number}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;