import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, Fuel, Users, Gauge, Heart, ChevronLeft, ChevronRight, ArrowRight,
  SlidersHorizontal, Zap, Car,
} from "lucide-react";

/* ─── SAMPLE DATA ─── */
const SAMPLE_CARS = [
  {
    id: 1, name: "BMW M5 Competition", brand: "BMW", category: "Sedan",
    price: 4800, rating: 4.9, reviews: 128, seats: 5, fuel: "Petrol",
    transmission: "Automatic", mileage: "12 km/l", horsepower: 627,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    badge: "Most Popular", badgeColor: "#4f46e5", featured: true, available: true,
    tags: ["Sport", "Luxury"],
  },
  {
    id: 2, name: "Mercedes GLE 63 AMG", brand: "Mercedes", category: "SUV",
    price: 5500, rating: 4.8, reviews: 94, seats: 7, fuel: "Petrol",
    transmission: "Automatic", mileage: "10 km/l", horsepower: 603,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
    badge: "Top Rated", badgeColor: "#059669", featured: true, available: true,
    tags: ["Family", "Luxury"],
  },
  {
    id: 3, name: "Porsche 911 Carrera S", brand: "Porsche", category: "Sports",
    price: 7200, rating: 5.0, reviews: 61, seats: 2, fuel: "Petrol",
    transmission: "Automatic", mileage: "9 km/l", horsepower: 450,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    badge: "Premium", badgeColor: "#d97706", featured: true, available: true,
    tags: ["Sport", "Exclusive"],
  },
  {
    id: 4, name: "Tesla Model 3 LR", brand: "Tesla", category: "Electric",
    price: 3200, rating: 4.7, reviews: 215, seats: 5, fuel: "Electric",
    transmission: "Automatic", mileage: "580 km", horsepower: 358,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80",
    badge: "Eco Pick", badgeColor: "#059669", featured: false, available: true,
    tags: ["Electric", "Eco"],
  },
  {
    id: 5, name: "Range Rover Sport", brand: "Land Rover", category: "SUV",
    price: 6100, rating: 4.8, reviews: 77, seats: 5, fuel: "Diesel",
    transmission: "Automatic", mileage: "11 km/l", horsepower: 395,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80",
    badge: null, badgeColor: null, featured: false, available: true,
    tags: ["Luxury", "Family"],
  },
  {
    id: 6, name: "Audi RS7 Sportback", brand: "Audi", category: "Sedan",
    price: 5900, rating: 4.9, reviews: 88, seats: 5, fuel: "Petrol",
    transmission: "Automatic", mileage: "11 km/l", horsepower: 591,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
    badge: "New Arrival", badgeColor: "#0891b2", featured: false, available: false,
    tags: ["Sport", "Luxury"],
  },
];

const CATEGORIES = ["All", "Sedan", "SUV", "Sports", "Electric"];
const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

/* ─── STAR RATING ─── */
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={11}
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        color={s <= Math.round(rating) ? "#f59e0b" : "#cbd5e1"}
      />
    ))}
    <span className="text-xs text-slate-400 ml-0.5">{rating}</span>
  </div>
);

/* ─── SINGLE CAR CARD ─── */
const CarCard = ({ car, index }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 100);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-200 hover:-translate-y-1"
      style={{ minWidth: 0 }}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-slate-50 overflow-hidden">
        {!imgError ? (
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50">
            <Car size={48} className="text-indigo-200" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Badge */}
        {car.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-wide uppercase"
            style={{ background: car.badgeColor }}
          >
            {car.badge}
          </span>
        )}

        {/* Availability pill */}
        {!car.available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow">
              Unavailable
            </span>
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/60 transition-all duration-200 hover:scale-110"
        >
          <Heart
            size={14}
            fill={liked ? "#ef4444" : "none"}
            color={liked ? "#ef4444" : "#94a3b8"}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name & brand */}
        <div>
          <p className="text-[11px] text-slate-400 font-medium mb-0.5">{car.brand}</p>
          <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-1">{car.name}</h3>
        </div>

        <StarRating rating={car.rating} />

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users size={12} /> {car.seats} seats
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="flex items-center gap-1">
            <Fuel size={12} /> {car.fuel}
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="flex items-center gap-1">
            <Zap size={12} /> {car.horsepower} hp
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {car.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div>
            <span className="text-lg font-black text-slate-900">
              ₱{car.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400"> /day</span>
          </div>
          <button
            onClick={() => navigate(`/cars/${car.id}`)}
            disabled={!car.available}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: car.available ? "#4f46e5" : "#e2e8f0",
              color: car.available ? "#fff" : "#94a3b8",
            }}
            onMouseEnter={(e) => {
              if (car.available) e.currentTarget.style.background = "#4338ca";
            }}
            onMouseLeave={(e) => {
              if (car.available) e.currentTarget.style.background = "#4f46e5";
            }}
          >
            {car.available ? "Book now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN SECTION ─── */
const FeaturedCarsSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showSort, setShowSort] = useState(false);
  const [page, setPage] = useState(0);
  const CARDS_PER_PAGE = 3;
  const sortRef = useRef(null);

  /* Close sort dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Filter + sort logic */
  const displayed = useMemo(() => {
    let list = activeCategory === "All"
      ? SAMPLE_CARS
      : SAMPLE_CARS.filter((c) => c.category === activeCategory);

    switch (sortBy) {
      case "price_asc":  list = [...list].sort((a, b) => a.price - b.price); break;
      case "price_desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating":     list = [...list].sort((a, b) => b.rating - a.rating); break;
      default:           list = [...list].sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [activeCategory, sortBy]);

  /* Reset page on filter/sort change */
  useEffect(() => { setPage(0); }, [activeCategory, sortBy]);

  const totalPages = Math.ceil(displayed.length / CARDS_PER_PAGE);
  const paginated = displayed.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <section className="py-28 px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase mb-2">
              Top Picks
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
            >
              Featured <span className="text-indigo-600">cars.</span>
            </h2>
            <p className="mt-3 text-slate-400 text-base max-w-md">
              Hand-picked premium vehicles at unbeatable prices.
            </p>
          </div>

          {/* Sort dropdown */}
          <div ref={sortRef} className="relative flex-shrink-0">
            <button
              onClick={() => setShowSort(!showSort)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-slate-300 transition-all duration-150"
            >
              <SlidersHorizontal size={15} />
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-100"
                    style={{
                      color: sortBy === opt.value ? "#4f46e5" : "#475569",
                      background: sortBy === opt.value ? "#EEF2FF" : "transparent",
                      fontWeight: sortBy === opt.value ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== opt.value) e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== opt.value) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150"
              style={{
                background: activeCategory === cat ? "#4f46e5" : "#fff",
                color: activeCategory === cat ? "#fff" : "#64748b",
                borderColor: activeCategory === cat ? "#4f46e5" : "#e2e8f0",
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(79,70,229,0.25)" : "none",
              }}
            >
              {cat}
              <span
                className="ml-1.5 text-[10px] font-bold opacity-60"
              >
                {cat === "All"
                  ? SAMPLE_CARS.length
                  : SAMPLE_CARS.filter((c) => c.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Results meta */}
        <p className="text-xs text-slate-400 mb-5 font-medium">
          Showing {paginated.length} of {displayed.length} cars
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>

        {/* Card grid */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Car size={40} className="mb-3 text-slate-200" />
            <p className="font-semibold text-sm">No cars in this category yet.</p>
          </div>
        )}

        {/* Pagination + CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: page === i ? "#4f46e5" : "#fff",
                    color: page === i ? "#fff" : "#64748b",
                    borderColor: page === i ? "#4f46e5" : "#e2e8f0",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/cars")}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 transition-all duration-200"
          >
            View all cars
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarsSection;
