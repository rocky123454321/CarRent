import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; // Siguraduhing tugma ang casing sa filename
import { 
  Car, Users, MapPin, Star, Quote, Shield, Zap, Clock, ChevronRight 
} from "lucide-react";

// Components
import Hero from "../../components/public/hero.jsx";
import HowItWorks from "../../components/public/HowItWorks.jsx";
import FeaturedCarsSection from '../../components/public/FeaturedCarsSection.jsx';
import Footer from "../../components/public/Footer.jsx";
import Nav from "../../components/public/navigation.jsx";

/* ─── DATA ─── */
const stats = [
  { icon: Car, value: "500+", label: "Cars available", color: "#4f46e5", bg: "#EEF2FF" },
  { icon: Users, value: "20K+", label: "Happy renters", color: "#0891b2", bg: "#ECFEFF" },
  { icon: MapPin, value: "50+", label: "Pickup locations", color: "#059669", bg: "#ECFDF5" },
  { icon: Star, value: "4.9", label: "Average rating", color: "#d97706", bg: "#FFFBEB" },
];

const testimonials = [
  {
    name: "Sofia Reyes",
    role: "Business Traveler",
    initials: "SR",
    rating: 5,
    text: "Absolutely seamless. The AI suggestions were spot-on and I booked my car in under 2 minutes.",
    color: "#4f46e5",
    bg: "#EEF2FF",
  },
  {
    name: "Marco Tan",
    role: "Weekend Explorer",
    initials: "MT",
    rating: 5,
    text: "Best rental service I've used. No hidden fees, clean cars, and lightning-fast support.",
    color: "#0891b2",
    bg: "#ECFEFF",
  },
  {
    name: "Aiko Yamamoto",
    role: "Family Vacationer",
    initials: "AY",
    rating: 5,
    text: "Pickup was effortless and the car was in perfect condition. Will definitely book again!",
    color: "#059669",
    bg: "#ECFDF5",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant booking",
    desc: "Reserve any car in under 60 seconds. Confirmation sent immediately.",
    color: "#4f46e5",
    bg: "#EEF2FF",
  },
  {
    icon: Shield,
    title: "Fully insured",
    desc: "Every vehicle comes with comprehensive insurance. Drive with peace of mind.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    icon: Clock,
    title: "24/7 support",
    desc: "Our team is always on standby. Need help at 3 AM? We've got you.",
    color: "#0891b2",
    bg: "#ECFEFF",
  },
  {
    icon: Star,
    title: "Curated fleet",
    desc: "Hand-picked premium vehicles — inspected, cleaned, and ready to roll.",
    color: "#d97706",
    bg: "#FFFBEB",
  },
];

/* ─── REUSABLE SECTION HEADER ─── */
const SectionHeader = ({ eyebrow, title, highlight, sub, center = true }) => (
  <div className={`mb-16 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <p className="text-indigo-600 font-bold text-[11px] tracking-[0.2em] uppercase mb-3">
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
      {title} {highlight && <span className="text-indigo-600">{highlight}</span>}
    </h2>
    {sub && (
      <p className="mt-5 text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
        {sub}
      </p>
    )}
  </div>
);

/* ─── FEATURES ─── */
const FeaturesSection = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".feat-card").forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Core Benefits"
          title="Drive with"
          highlight="Confidence."
          sub="Experience a premium rental service designed for the modern driver."
        />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="feat-card p-8 rounded-[2rem] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-6 shadow-sm" style={{ background: bg, color }}>
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
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
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".tcard").forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 lg:px-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Community Feedback"
          title="Trusted by"
          highlight="thousands."
          sub="Don't just take our word for it. Hear from our global community of explorers."
        />
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="tcard p-8 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-500"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              <div className="flex justify-between items-start">
                <Quote size={28} style={{ color: t.color }} className="opacity-20" />
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 text-[15px] leading-relaxed flex-1 font-medium italic">"{t.text}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── CTA BANNER ─── */
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6 lg:px-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden py-20 px-8 md:px-16 rounded-[3rem] text-center border border-indigo-50 shadow-2xl shadow-indigo-100" style={{ background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)" }}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
          
          <div className="relative z-10">
            <p className="text-indigo-600 font-bold text-[11px] tracking-[0.3em] uppercase mb-6">Ready to hit the road?</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">Start your journey <span className="text-indigo-600">now.</span></h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate("/login")} 
                className="group w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
              >
                Browse Fleet <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate("/signup")} 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-slate-700 font-bold text-base border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                Join Now — It's Free
              </button>
            </div>
            <p className="mt-8 text-slate-400 text-xs font-medium">No hidden fees • 24/7 Support • Flexible Cancellation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── MAIN PAGE ─── */
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 rounded-full bg-indigo-600 animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-600 selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturesSection />
        <FeaturedCarsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;