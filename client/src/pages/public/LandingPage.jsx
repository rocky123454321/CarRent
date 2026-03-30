import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/public/hero.jsx";
import Cards from "../../components/user/Cards.jsx";
import FeaturedCarsSection from '../../components/public/FeaturedCarsSection.jsx'
import HowItWorks from "../../components/public/HowItWorks.jsx";
import Footer from "../../components/public/Footer.jsx";
import Nav from "../../components/public/navigation.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { Car, Users, MapPin, Star, Quote, Shield, Zap, Clock } from "lucide-react";

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
      <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-3">
        {eyebrow}
      </p>
    )}
    <h2
      className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight"
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
    >
      {title}{" "}
      {highlight && <span className="text-indigo-600">{highlight}</span>}
    </h2>
    {sub && (
      <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
        {sub}
      </p>
    )}
  </div>
);

/* ─── STATS ─── */
const StatsSection = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".stat-card").forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }, i * 90);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 px-6 lg:px-16 bg-white border-y border-slate-100">
      <div ref={ref} className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ icon: Icon, value, label, color, bg }) => (
          <div
            key={label}
            className="stat-card flex flex-col items-center text-center p-7 rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:border-slate-200"
            style={{
              opacity: 0,
              transform: "translateY(16px)",
              transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s",
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
              style={{ background: bg, color }}
            >
              <Icon size={22} />
            </div>
            <div
              className="text-3xl font-black text-slate-900 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {value}
            </div>
            <div className="text-slate-400 text-sm">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

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
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Why choose us"
          title="Everything you need,"
          highlight="nothing you don't."
          sub="We stripped away the complexity so you can focus on the drive."
        />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="feat-card p-7 rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-md hover:border-slate-200"
              style={{
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s",
              }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center rounded-xl mb-5"
                style={{ background: bg, color }}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
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
              }, i * 130);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 px-6 lg:px-16 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Reviews"
          title="Loved by"
          highlight="thousands."
          sub="Real renters, real stories. Here's what they say about us."
        />
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="tcard flex flex-col gap-5 p-7 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200"
              style={{
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.2s",
              }}
            >
              <Quote size={22} style={{ color: t.color }} className="opacity-50" />
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                "{t.text}"
              </p>
              <div
                className="flex items-center gap-3 pt-4 border-t border-slate-100"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
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
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="py-16 px-10 rounded-3xl border border-indigo-100"
          style={{
            background:
              "linear-gradient(135deg, #EEF2FF 0%, #f0f9ff 50%, #ECFDF5 100%)",
          }}
        >
          <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-4">
            Ready to drive?
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
          >
            Start your journey{" "}
            <span className="text-indigo-600">today.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto mb-10">
            Join 20,000+ renters. No hidden fees. No surprises. Just great cars.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/cars")}
              className="px-8 py-4 rounded-xl text-white font-semibold text-base bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
              style={{ boxShadow: "0 4px 20px rgba(79,70,229,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(79,70,229,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(79,70,229,0.3)";
              }}
            >
              Browse All Cars
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-xl font-semibold text-base text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 transition-all duration-200"
            >
              Create Free Account
            </button>
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
      if (user?.role === "renter") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, navigate]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-indigo-500"
              style={{
                animation: `dotBounce 0.7s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes dotBounce {
            from { transform: scaleY(0.4); opacity: 0.4; }
            to { transform: scaleY(1); opacity: 1; }
          }
        `}</style>
      </div>
    );

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <Nav />
      <Hero />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <FeaturedCarsSection/>
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
