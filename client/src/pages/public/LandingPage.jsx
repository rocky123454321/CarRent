import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Zap, Shield, Clock, Star, Quote } from "lucide-react";

import Hero from "../../components/public/hero.jsx";
import HowItWorks from "../../components/public/HowItWorks.jsx";
import Nav from "../../components/public/navigation.jsx";
import FAQSection from "../../components/public/fsqs.jsx";
import Footer from "../../components/public/Footer.jsx";

/* ─── DATA ─── */
const features = [
  {
    icon: Zap,
    title: "Instant booking",
    desc: "Reserve any car in under 60 seconds. Confirmation sent immediately.",
  },
  {
    icon: Shield,
    title: "Fully insured",
    desc: "Every vehicle comes with comprehensive insurance. Drive with peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 support",
    desc: "Our team is always on standby. Need help at 3 AM? We've got you.",
  },
  {
    icon: Star,
    title: "Curated fleet",
    desc: "Hand-picked premium vehicles — inspected, cleaned, and ready to roll.",
  },
];

const testimonials = [
  {
    name: "Sofia Reyes",
    role: "Business Traveler",
    initials: "SR",
    text: "Absolutely seamless. Booked my car in under 2 minutes. No friction at all.",
  },
  {
    name: "Marco Tan",
    role: "Weekend Explorer",
    initials: "MT",
    text: "No hidden fees, clean cars, lightning-fast support. Best rental service I've used.",
  },
  {
    name: "Aiko Yamamoto",
    role: "Family Vacationer",
    initials: "AY",
    text: "Pickup was effortless and the car was in perfect condition. Will book again!",
  },
];

/* ─── SECTION HEADER ─── */
const SectionHeader = ({ eyebrow, title, highlight, sub }) => (
  <div className="mb-14 text-center">
    {eyebrow && (
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          {eyebrow}
        </p>
        <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
      </div>
    )}
    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-zinc-900 dark:text-white">
      {title}{" "}
      <span className="text-zinc-300 dark:text-zinc-700">{highlight}</span>
    </h2>
    {sub && (
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
        {sub}
      </p>
    )}
  </div>
);

/* ─── FEATURES ─── */
const FeaturesSection = () => {
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
    <section className="bg-white dark:bg-zinc-950 py-24 px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Core Benefits"
          title="Drive with"
          highlight="confidence."
          sub="A premium rental service designed for the modern driver."
        />
        <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 p-7 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                <Icon size={18} />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── TESTIMONIALS ─── */
const TestimonialsSection = () => {
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
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Community"
          title="Trusted by"
          highlight="thousands."
          sub="Hear from drivers who chose the premium way."
        />
        <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map(({ name, role, initials, text }, i) => (
            <div
              key={name}
              className="flex flex-col gap-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <Quote size={20} className="text-zinc-200 dark:text-zinc-700" />
              <p className="flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
                "{text}"
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-xs font-bold text-white dark:text-zinc-900">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">{role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── LANDING PAGE ─── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      const target = (user?.role === "renter" || user?.role === "admin") ? "/admin" : "/";
      navigate(target, { replace: true });
    }
  }, [isCheckingAuth, isAuthenticated, user, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;