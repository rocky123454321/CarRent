import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; 
import { 
  Car, Users, MapPin, Star, Quote, Shield, Zap, Clock, ChevronRight 
} from "lucide-react";

// Components
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
    accent: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    icon: Shield,
    title: "Fully insured",
    desc: "Every vehicle comes with comprehensive insurance. Drive with peace of mind.",
    accent: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Clock,
    title: "24/7 support",
    desc: "Our team is always on standby. Need help at 3 AM? We've got you.",
    accent: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    icon: Star,
    title: "Curated fleet",
    desc: "Hand-picked premium vehicles — inspected, cleaned, and ready to roll.",
    accent: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const testimonials = [
  {
    name: "Sofia Reyes",
    role: "Business Traveler",
    initials: "SR",
    text: "Absolutely seamless. The AI suggestions were spot-on and I booked my car in under 2 minutes.",
    theme: "bg-indigo-600",
  },
  {
    name: "Marco Tan",
    role: "Weekend Explorer",
    initials: "MT",
    text: "Best rental service I've used. No hidden fees, clean cars, and lightning-fast support.",
    theme: "bg-cyan-600",
  },
  {
    name: "Aiko Yamamoto",
    role: "Family Vacationer",
    initials: "AY",
    text: "Pickup was effortless and the car was in perfect condition. Will definitely book again!",
    theme: "bg-emerald-600",
  },
];

/* ─── REUSABLE SECTION HEADER ─── */
const SectionHeader = ({ eyebrow, title, highlight, sub }) => (
  <div className="mb-16 text-center">
    {eyebrow && (
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-5xl">
      {title} <span className="text-indigo-600">{highlight}</span>
    </h2>
    {sub && (
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400 md:text-lg">
        {sub}
      </p>
    )}
  </div>
);

/* ─── FEATURES SECTION ─── */
const FeaturesSection = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".feat-card").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("opacity-100", "translate-y-0");
              el.classList.remove("opacity-0", "translate-y-10");
            }, i * 100);
          });
        }
      });
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-white py-24 px-6 transition-colors duration-500 dark:bg-black lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Core Benefits"
          title="Drive with"
          highlight="Confidence."
          sub="Experience a premium rental service designed for the modern driver."
        />
        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc, accent, bg }) => (
            <div
              key={title}
              className="feat-card group rounded-[2.5rem] border border-slate-100 bg-white p-8 opacity-0 translate-y-10 transition-all duration-700 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5 dark:border-white/5 dark:bg-[#0a0a0a] dark:hover:border-indigo-900/40"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${bg} ${accent} shadow-sm transition-transform group-hover:scale-110`}>
                <Icon size={24} />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── TESTIMONIALS SECTION ─── */
const TestimonialsSection = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".t-card").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("opacity-100", "scale-100");
              el.classList.remove("opacity-0", "scale-95");
            }, i * 150);
          });
        }
      });
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-slate-50/50 py-24 px-6 transition-colors duration-500 dark:bg-[#0a0a0a]/20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Community Feedback"
          title="Trusted by"
          highlight="thousands."
          sub="Hear from our global community of explorers who chose the premium way."
        />
        <div ref={ref} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="t-card group flex flex-col gap-8 rounded-[2.5rem] border border-slate-100 bg-white p-10 opacity-0 scale-95 transition-all duration-700 hover:shadow-xl dark:border-white/5 dark:bg-[#0a0a0a]"
            >
              <div className="flex justify-between items-center">
                <Quote size={32} className="text-indigo-600/20 transition-transform group-hover:rotate-12" />
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="flex-1 text-[15px] font-medium italic leading-relaxed text-slate-600 dark:text-slate-300">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50 dark:border-white/5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black text-white shadow-lg ${t.theme}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── MAIN LANDING PAGE ─── */
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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="h-3 w-3 animate-bounce rounded-full bg-indigo-600" 
              style={{ animationDelay: `${i * 0.15}s` }} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-600 selection:text-white dark:bg-black transition-colors duration-500">
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