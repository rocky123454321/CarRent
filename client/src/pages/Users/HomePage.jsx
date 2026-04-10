import React, { useState, useEffect } from 'react';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import { ChevronRight, Car } from 'lucide-react';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRentalStore } from '../../store/RentalStore';
import { useCarStore } from '../../store/CarStore';
import PromoSection from '../../components/user/PromoSection';
import carImage from "../../assets/1.png";

/* ─── STATUS STYLES ─── */
const STATUS_STYLE = {
  pending:   { bg: 'bg-amber-50 dark:bg-amber-900/10',    text: 'text-amber-600 dark:text-amber-500', dot: 'bg-amber-400', label: 'Pending'   },
  active:    { bg: 'bg-zinc-900 dark:bg-white',           text: 'text-white dark:text-zinc-900',      dot: 'bg-green-400', label: 'Active'    },
  approved:  { bg: 'bg-blue-50 dark:bg-blue-900/10',       text: 'text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500',  label: 'Approved'  },
  completed: { bg: 'bg-zinc-100 dark:bg-zinc-800',        text: 'text-zinc-500 dark:text-zinc-400',   dot: 'bg-zinc-400',  label: 'Completed' },
  cancelled: { bg: 'bg-red-50 dark:bg-red-900/10',        text: 'text-red-600 dark:text-red-400',     dot: 'bg-red-400',   label: 'Cancelled' },
};

/* ─── ANNOUNCEMENT BANNER (COMPACT VERSION) ─── */
const AnnouncementBanner = () => {
  const ANNOUNCEMENTS = getSeasonalAnnouncements();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, [ANNOUNCEMENTS.length]);

  const ann = ANNOUNCEMENTS[current];
  const displayImage = ann.image || carImage;

  return (
    <div className={`relative overflow-hidden rounded-[2rem] transition-all duration-700 shadow-xl ${ann.color} group min-h-[280px] md:min-h-[320px] lg:min-h-[300px] flex items-center`}>
      
      {/* Premium Ambient Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none group-hover:opacity-50 transition-opacity" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-black/10 blur-[60px] rounded-full pointer-events-none" />

      {/* Main Responsive Grid */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-6 px-6 py-8 lg:px-12 lg:py-4">
        
        {/* Left Side: Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 lg:space-y-4">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md ${ann.tagBg}`}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-white" />
            <p className="text-[9px] font-black uppercase tracking-widest text-white">
              {ann.type === 'promo' ? 'Limited Offer' : 'Announcement'}
            </p>
          </div>

          {/* Typography */}
          <div className="space-y-1">
            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter leading-tight transition-all duration-500 ${ann.textColor}`}>
              {ann.title}
            </h3>
            <p className={`text-xs md:text-sm max-w-xs md:max-w-sm font-medium transition-all duration-500 opacity-90 ${ann.subColor}`}>
              {ann.desc}
            </p>
          </div>

          {/* Action Button */}
          <button className={`group/btn mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white shadow-lg transition-all hover:scale-105 active:scale-95 ${ann.color.replace('bg-', 'text-')}`}>
            Explore Now
            <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        {/* Right Side: Visual Image */}
        <div className="relative hidden sm:flex justify-center items-center h-32 md:h-40 lg:h-56">
          <div className="absolute w-32 h-32 bg-white/10 blur-[40px] rounded-full" />
          <img
            src={displayImage}
            alt="Promotion Visual"
            className="relative z-10 w-full max-w-[280px] lg:max-w-[400px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] transition-all duration-1000 group-hover:scale-105 animate-float"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
        {ANNOUNCEMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/* ─── CARD SKELETON (NO BORDERS) ─── */
const CardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden animate-pulse">
    <div className="p-5 pb-0 flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-32" />
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-20" />
      </div>
      <div className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded" />
    </div>
    <div className="h-40 mx-5 my-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
    <div className="flex justify-between px-5 py-4">
      <div className="h-8 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
      <div className="h-8 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
      <div className="h-8 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
    </div>
  </div>
);

const HomePage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userRentals, fetchUserRentals } = useRentalStore();
  const { getCars, isLoading } = useCarStore();

  useEffect(() => {
    fetchUserRentals();
    getCars();
  }, [fetchUserRentals, getCars]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const activeRental = userRentals.find(r => r.status === 'active' || r.status === 'approved');

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className=" space-y-12 pb-20 pt-4">

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

      {/* ── 2. Announcement ── */}
      <AnnouncementBanner />

      {/* ── 3. Active Rental ── */}
      {activeRental && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 px-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Current Trip</h2>
              <p className="text-xs text-zinc-500">Your active booking details</p>
            </div>
            <button
              onClick={() => navigate('/my-rentals')}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              Manage Booking
            </button>
          </div>

          <div className="group relative rounded-3xl bg-white dark:bg-zinc-900/60 p-6 transition-all shadow-sm hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">
                    {activeRental.car?.brand} {activeRental.car?.model}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <span className="uppercase tracking-wider font-medium">{activeRental.car?.color}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span>{activeRental.car?.year}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(() => {
                  const s = STATUS_STYLE[activeRental.status] || STATUS_STYLE.pending;
                  return (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  );
                })()}
                <button
                  onClick={() => navigate('/my-rentals')}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">Pick-up Date</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {new Date(activeRental.rentalStartDate).toLocaleDateString('en-PH', { month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1 text-right md:text-left">
                <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">Return Date</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {new Date(activeRental.rentalEndDate).toLocaleDateString('en-PH', { month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <PromoSection onSelect={(car) => setSelectedCar(car)} />

      {/* ── 4. Premium Fleet ── */}
      <section className="px-1">
        <div className="flex justify-between items-end mb-8">
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div><Cards limit={3} onSelect={(car) => setSelectedCar(car)} /></div>
        )}
      </section>

      {/* ── 5. Recommended ── */}
      <section className="pt-4 px-1">
        <div className="flex flex-row gap-1 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Recommended Rides</h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <Cards limit={6} onSelect={(car) => setSelectedCar(car)} />
        )}
      </section>

    </div>
  );
};

export default HomePage;