import React, { useState, useEffect, useRef } from 'react';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import { ChevronRight, Car, ChevronLeft, Zap, Shield, Clock, Gift } from 'lucide-react';
import CarDetailView from './CarDetailView';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRentalStore } from '../../store/RentalStore';
import { useCarStore } from '../../store/CarStore';
import PromoSection from '../../components/user/PromoSection';
import carImage from "../../assets/1.png";

/* ─── STATUS STYLES ─── */
const STATUS_STYLE = {
  pending:   { bg: 'bg-amber-50 dark:bg-amber-900/10',   text: 'text-amber-600 dark:text-amber-500',  label: 'Pending'   },
  confirmed: { bg: 'bg-blue-50 dark:bg-blue-900/10',     text: 'text-blue-600 dark:text-blue-400',    label: 'Confirmed' },
  completed: { bg: 'bg-zinc-100 dark:bg-zinc-800',       text: 'text-zinc-500 dark:text-zinc-400',    label: 'Completed' },
  cancelled: { bg: 'bg-red-50 dark:bg-red-900/10',       text: 'text-red-600 dark:text-red-400',      label: 'Cancelled' },
};

/* ─── LEFT: SINGLE CYCLING BANNER ─── */
const LeftBanner = () => {
  const ANNOUNCEMENTS = getSeasonalAnnouncements();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, [ANNOUNCEMENTS.length]);

  const ann = ANNOUNCEMENTS[current];
  const displayImage = ann.image || carImage;

  return (
    <div className={`relative overflow-hidden rounded-[2rem] shadow-xl ${ann.color} group flex-1 min-w-0 min-h-[320px] flex items-center transition-all duration-700`}>
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-white/10 blur-[70px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-black/10 blur-[50px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col justify-between gap-4 px-6 py-7">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md self-start ${ann.tagBg}`}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-white" />
          <p className="text-[9px] font-black uppercase tracking-widest text-white">
            {ann.type === 'promo' ? 'Limited Offer' : 'Announcement'}
          </p>
        </div>

        <div className="flex justify-center items-center h-28">
          <img
            src={displayImage}
            alt={ann.title}
            className="h-full w-full max-w-[170px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.25)] transition-all duration-700 group-hover:scale-105 animate-float"
          />
        </div>

        <div className="space-y-1">
          <h3 className={`text-lg md:text-xl font-black tracking-tighter leading-tight ${ann.textColor}`}>
            {ann.title}
          </h3>
          <p className={`text-[10px] font-medium opacity-80 line-clamp-2 ${ann.subColor}`}>
            {ann.desc}
          </p>
        </div>

        <button className={`self-start inline-flex items-center dark:bg-black gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white shadow-md transition-all hover:scale-105 active:scale-95 ${ann.color.replace('bg-', 'text-')}`}>
          Explore Now
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
        {ANNOUNCEMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── RIGHT: 4 QUICK ACTION CARDS ─── */
const RightPanel = ({ cars, userRentals, onSelect, navigate, isLoadingRentals }) => {
  // ── CONNECTION 1: find active/approved rental from MyRentals data ──
  // case-insensitive match in case DB returns 'Active', 'APPROVED', etc.
  const activeRental = userRentals.find(r => {
    const s = (r.status || '').toLowerCase();
    return s === 'confirmed' || s === 'pending';
  });
  const featuredCar  = cars.filter(c => c.isAvailable).slice(0, 1)[0];

  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    if (!activeRental) return;
    const tick = () => {
      const diff = new Date(activeRental.rentalEndDate) - new Date();
      if (diff <= 0) { setCountdown('Due now'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setCountdown(d > 0 ? `${d}d ${h}h left` : `${h}h left`);
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [activeRental]);

  // ── CONNECTION 2: chat support handler — goes to AdminChatPage with rental context ──
  const handleChatSupport = () => {
    if (!activeRental) return;
    const adminId = activeRental.car?.uploadedBy?._id || activeRental.car?.uploadedBy;
    navigate('/chat', {
      state: {
        userId: adminId,
        context: 'rental',
        rentalId: activeRental._id,
        renterName: `${activeRental.car?.brand} ${activeRental.car?.model}`,
      },
    });
  };

  return (
    <div className="flex-1 min-w-0 grid grid-cols-2 grid-rows-2 gap-3 min-h-[320px]">

      {/* 1 — Featured Car */}
      <div
        onClick={() => featuredCar && onSelect(featuredCar)}
        className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-zinc-500/10 transition-all duration-300 flex flex-col justify-between p-4"
      >
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Featured</span>
          {featuredCar ? (
            <>
              <p className="font-bold text-xs text-zinc-900 dark:text-white tracking-tight mt-0.5 truncate">
                {featuredCar.brand} {featuredCar.model}
              </p>
              <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                {featuredCar.year} · {featuredCar.color}
              </p>
            </>
          ) : (
            <p className="font-bold text-xs text-zinc-400 mt-0.5">No cars yet</p>
          )}
        </div>
        {featuredCar && (
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Rate</p>
              <p className="text-sm font-black text-zinc-900 dark:text-white leading-none">
                ₱{featuredCar.pricePerDay.toLocaleString()}<span className="text-[8px] font-medium text-zinc-400">/day</span>
              </p>
            </div>
            <img
              src={featuredCar.image || carImage}
              alt={featuredCar.model}
              className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
            />
          </div>
        )}
        <div className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
          <ChevronRight size={11} className="text-white dark:text-zinc-900" />
        </div>
      </div>

      {/* 2 — Active Rental / Book Now — CONNECTION 1 + 2 */}
      <div
        onClick={() =>
          !isLoadingRentals && navigate(activeRental ? '/my-rentals' : '/cars')
        }
        className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col justify-between p-4 bg-zinc-900 dark:bg-white"
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {isLoadingRentals ? 'Loading...' : activeRental ? 'Active Rental' : 'Quick Book'}
          </span>
          <Car size={14} className="text-zinc-500 dark:text-zinc-400" />
        </div>

        {activeRental ? (
          <>
            <div className="mt-2">
              <p className="font-bold text-xs text-white dark:text-zinc-900 tracking-tight truncate">
                {activeRental.car?.brand} {activeRental.car?.model}
              </p>
              <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
                {activeRental.car?.color} · {activeRental.car?.year}
              </p>
              {/* status badge */}
              {(() => {
                const s = STATUS_STYLE[activeRental.status];
                return s ? (
                  <span className={`inline-flex items-center gap-1 mt-1.5 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                ) : null;
              })()}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{countdown}</span>
                <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-500">{userRentals.length} rental{userRentals.length > 1 ? 's' : ''} total</span>
              </div>
              <ChevronRight size={14} className="text-zinc-500 dark:text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </div>
            {/* Chat support shortcut */}
            <button
              onClick={(e) => { e.stopPropagation(); handleChatSupport(); }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 dark:bg-zinc-900/10 text-white dark:text-zinc-900 text-[8px] font-black uppercase tracking-widest hover:bg-white/20 dark:hover:bg-zinc-900/20 transition-all"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Contact Support
            </button>
          </>
        ) : isLoadingRentals ? (
          <div className="flex flex-col gap-2 mt-2 animate-pulse">
            <div className="h-3 bg-white/10 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-2 bg-white/10 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-2 bg-white/10 dark:bg-zinc-800 rounded w-1/3 mt-2" />
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-white dark:text-zinc-900 mt-2 leading-snug">
              No active rental yet
            </p>
            {userRentals.length > 0 && (
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mt-1">
                {userRentals.length} total rental{userRentals.length > 1 ? 's' : ''} on record
              </p>
            )}
            <div className="flex items-center gap-1 mt-3">
              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Browse cars</span>
              <ChevronRight size={12} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </>
        )}
      </div>

      {/* 3 — Flash Deal */}
      <FlashDealCard />

      {/* 4 — Trust Badges */}
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 p-4 flex flex-col justify-between">
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Why Us</span>
        <div className="flex flex-col gap-2 mt-2">
          {[
            { icon: Shield, color: 'emerald', label: 'Full Insurance Coverage' },
            { icon: Clock,  color: 'blue',    label: '24/7 Roadside Support'   },
            { icon: Gift,   color: 'amber',   label: 'Loyalty Points Earned'   },
            { icon: Zap,    color: 'violet',  label: 'Instant Confirmation'    },
          ].map(({ icon: Icon, color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-lg bg-${color}-50 dark:bg-${color}-900/30 flex items-center justify-center flex-shrink-0`}>
                <Icon size={10} className={`text-${color}-600 dark:text-${color}-400`} />
              </div>
              <span className="text-[9px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* ─── FLASH DEAL CARD ─── */
const FlashDealCard = () => {
  const getNextMidnight = () => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d;
  };

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = getNextMidnight() - new Date();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Flash Deal</span>
        <Zap size={12} className="text-white/70" />
      </div>
      <div className="mt-2">
        <p className="font-black text-white text-sm leading-tight tracking-tight">Today Only</p>
        <p className="text-[9px] text-white/80 font-medium mt-0.5">10% off on any available car</p>
      </div>
      <div className="mt-3 bg-black/20 rounded-xl px-3 py-2 text-center">
        <p className="font-black text-white text-base tracking-widest font-mono">{timeLeft}</p>
        <p className="text-[7px] font-bold text-white/60 uppercase tracking-widest mt-0.5">Ends tonight</p>
      </div>
    </div>
  );
};

/* ─── HERO BANNER SECTION ─── */
const HeroBannerSection = ({ cars, userRentals, onSelect, navigate, isLoadingRentals }) => (
  <>
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(-1deg); }
      }
      .animate-float { animation: float 5s ease-in-out infinite; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
    <div className="flex flex-col md:flex-row gap-3">
      <LeftBanner />
      <RightPanel
        cars={cars}
        userRentals={userRentals}
        onSelect={onSelect}
        navigate={navigate}
        isLoadingRentals={isLoadingRentals}
      />
    </div>
  </>
);

/* ─── CARD SKELETON ─── */
const CardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900/40 rounded-3xl overflow-hidden animate-pulse flex-shrink-0 w-[200px]">
    <div className="p-4 pb-0 flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-24" />
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-16" />
      </div>
      <div className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded" />
    </div>
    <div className="h-28 mx-4 my-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
    <div className="flex justify-between px-5 py-3 border-t border-zinc-50 dark:border-zinc-900">
      <div className="h-7 w-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
      <div className="h-7 w-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
      <div className="h-7 w-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
    </div>
    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-50 dark:border-zinc-900">
      <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-20" />
      <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
    </div>
  </div>
);

/* ─── SCROLLABLE CARDS ─── */
const ScrollableCards = ({ limit, onSelect, isLoading }) => {
  const { cars = [], searchQuery } = useCarStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const filtered = cars.filter((car) => {
    const searchMatch =
      !searchQuery ||
      `${car.brand} ${car.model} ${car.color}`.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch && car.isAvailable === true;
  });

  const displayCars = limit ? filtered.slice(0, limit) : filtered;

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-hidden -mx-4 px-4">
        {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (displayCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No cars available.</p>
      </div>
    );
  }

  return (
    <div className="relative group/scroll px-1">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-10 w-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full items-center justify-center shadow-lg border border-zinc-200 dark:border-zinc-800 hidden md:group-hover/scroll:flex transition-all hover:scale-110"
      >
        <ChevronLeft size={20} className="text-zinc-900 dark:text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-10 w-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full items-center justify-center shadow-lg border border-zinc-200 dark:border-zinc-800 hidden md:group-hover/scroll:flex transition-all hover:scale-110"
      >
        <ChevronRight size={20} className="text-zinc-900 dark:text-white" />
      </button>

      <div ref={scrollRef} className="overflow-x-auto hide-scrollbar -mx-4 px-4 scroll-smooth">
        <div className="flex gap-4 w-max pb-4">
          {displayCars.map((car) => (
            <div
              key={car._id}
              onClick={() => onSelect && onSelect(car)}
              className="group flex-shrink-0 w-[200px] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between p-4 pb-0">
                <div className="truncate pr-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white tracking-tighter truncate">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] mt-0.5">
                    {car.year} · {car.color}
                  </p>
                </div>
                <button
                  className="text-zinc-300 dark:text-zinc-700 hover:text-red-500 transition-colors flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="mx-4 my-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl flex justify-center items-center p-4 h-28">
                <img
                  src={car.image || carImage}
                  alt={`${car.brand} ${car.model}`}
                  className="max-h-full w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2"
                />
              </div>

              <div className="flex justify-between px-4 py-2 border-t border-zinc-50 dark:border-zinc-900">
                <div className="flex flex-col items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                    <path d="M3 22V10l9-8 9 8v12" /><line x1="12" y1="22" x2="12" y2="12" />
                  </svg>
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{car.fuelType}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                    <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{car.transmission}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">{car.mileage}km</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/20">
                <div className="flex flex-col">
                  <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Daily Rate</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base font-bold text-zinc-900 dark:text-white leading-none">
                      ₱{car.pricePerDay.toLocaleString()}
                    </span>
                    <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-medium">/day</span>
                  </div>
                </div>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 group-hover:scale-110 transition-all duration-300"
                  onClick={(e) => { e.stopPropagation(); onSelect && onSelect(car); }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── MY RENTALS PREVIEW STRIP ─── */
// CONNECTION 3: Shows recent rentals from MyRentals data directly on HomePage
const MyRentalsStrip = ({ userRentals, navigate }) => {
  const recent = userRentals.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section className="px-1">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">My Rentals</h2>
          <p className="text-sm text-zinc-500">Your recent booking history</p>
        </div>
        <button
          onClick={() => navigate('/my-rentals')}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
        >
          See All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {recent.map((rental) => {
          const s = STATUS_STYLE[rental.status] || STATUS_STYLE.pending;
          const adminId = rental.car?.uploadedBy?._id || rental.car?.uploadedBy;

          return (
            <div
              key={rental._id}
              onClick={() => navigate('/my-rentals')}
              className="group flex items-center gap-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl px-5 py-4 cursor-pointer hover:shadow-lg hover:shadow-zinc-500/5 transition-all duration-300"
            >
              {/* Car icon */}
              <div className="w-11 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-zinc-900 dark:group-hover:border-zinc-500 transition-colors">
                <Car size={18} className="text-zinc-900 dark:text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                  {rental.car?.brand} {rental.car?.model}
                </p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                  {new Date(rental.rentalStartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  {' → '}
                  {new Date(rental.rentalEndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Status + price */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${s.bg} ${s.text}`}>
                  {s.label}
                </span>
                <p className="text-[10px] font-black text-zinc-900 dark:text-white">
                  ₱{rental.totalPrice?.toLocaleString()}
                </p>
              </div>

              {/* Chat shortcut — only for active/approved */}
              {(rental.status === 'confirmed' || rental.status === 'pending') && adminId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/chat', {
                      state: {
                        userId: adminId,
                        context: 'rental',
                        rentalId: rental._id,
                        renterName: `${rental.car?.brand} ${rental.car?.model}`,
                      },
                    });
                  }}
                  className="ml-1 h-9 w-9 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:scale-110 transition-all duration-200 shrink-0"
                  title="Contact support"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─── HOME PAGE ─── */
const HomePage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userRentals, fetchUserRentals, isLoading: isLoadingRentals } = useRentalStore();
  const { cars, getCars, isLoading } = useCarStore();

  useEffect(() => {
    fetchUserRentals();
    getCars();
  }, [fetchUserRentals, getCars]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-12 pb-20 pt-4">

      {/* ── 1. Header ── */}
      <header className="flex flex-col gap-1 px-1">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Overview</p>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-none">
          Welcome back, <span className="text-zinc-400 dark:text-zinc-600">{firstName}.</span>
        </h1>
      </header>

      {/* ── 2. Hero: Left Banner + Right 4-Grid ── */}
      <HeroBannerSection
        cars={cars || []}
        userRentals={userRentals || []}
        onSelect={(car) => setSelectedCar(car)}
        navigate={navigate}
        isLoadingRentals={isLoadingRentals}
      />

      <PromoSection onSelect={(car) => setSelectedCar(car)} />

      {/* ── 3. My Rentals Strip (connected to MyRentals data + chat) ── */}
      <MyRentalsStrip userRentals={userRentals || []} navigate={navigate} />

      {/* ── 4. Premium Fleet ── */}
      <section className="px-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Premium Fleet</h2>
            <p className="text-sm text-zinc-500">Most selected by our community</p>
          </div>
          <button
            onClick={() => navigate('/popular')}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            See All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <ScrollableCards limit={10} onSelect={(car) => setSelectedCar(car)} isLoading={isLoading} />
      </section>

      {/* ── 5. Recommended ── */}
      <section className="pt-4 px-1">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Recommended Rides</h2>
        </div>
        <ScrollableCards limit={20} onSelect={(car) => setSelectedCar(car)} isLoading={isLoading} />
      </section>

    </div>
  );
};

export default HomePage;