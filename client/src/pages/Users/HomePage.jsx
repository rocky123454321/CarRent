import React, { useState, useEffect } from 'react';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import { ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRentalStore } from '../../store/RentalStore';

// In-update ang status styles para sa better visibility sa dark mode
const STATUS_STYLE = {
  pending:   { bg: 'bg-yellow-50 dark:bg-yellow-900/20',   text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-400', label: 'Pending'   },
  active:    { bg: 'bg-green-50 dark:bg-green-900/20',    text: 'text-green-700 dark:text-green-400',  dot: 'bg-green-500',  label: 'Active'    },
  approved:  { bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-700 dark:text-blue-400',   dot: 'bg-blue-500',   label: 'Approved'  },
  completed: { bg: 'bg-slate-100 dark:bg-slate-800',     text: 'text-slate-600 dark:text-slate-400',  dot: 'bg-slate-400',  label: 'Completed' },
  cancelled: { bg: 'bg-red-50 dark:bg-red-900/20',       text: 'text-red-600 dark:text-red-400',     dot: 'bg-red-400',    label: 'Cancelled' },
};

const AnnouncementBanner = () => {
  const ANNOUNCEMENTS = getSeasonalAnnouncements();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, [ANNOUNCEMENTS.length]);

  const ann = ANNOUNCEMENTS[current];
  const Icon = ann.icon;

  return (
    <div className={`${ann.color} rounded-2xl p-5 relative overflow-hidden transition-all duration-500 shadow-lg`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute right-8 -bottom-8 w-20 h-20 rounded-full bg-white/10" />

      <div className={`inline-flex items-center gap-1.5 ${ann.tagBg} rounded-full px-3 py-1 mb-3`}>
        <Icon size={11} className={ann.textColor} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${ann.textColor}`}>
          {ann.type === 'promo' ? 'Promo' : ann.type === 'notice' ? 'Notice' : 'Alert'}
        </span>
      </div>

      <h3 className={`font-bold text-base leading-snug mb-1 ${ann.textColor}`}>{ann.title}</h3>
      <p className={`text-xs leading-relaxed mb-4 ${ann.subColor} opacity-90`}>{ann.desc}</p>

      <button className="bg-white/20 hover:bg-white/30 transition text-white text-xs font-semibold px-4 py-1.5 rounded-xl backdrop-blur-md">
        Learn more →
      </button>

      <div className="flex gap-1.5 mt-4">
        {ANNOUNCEMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userRentals, fetchUserRentals } = useRentalStore();

  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const activeRental = userRentals.find(r => r.status === 'active' || r.status === 'approved');
  const recentRentals = userRentals.filter(r => r._id !== activeRental?._id).slice(0, 2);

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-8 pb-10 min-h-screen transition-colors duration-300">

      {/* ── 1. Header ── */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-0.5">Dashboard</p>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Hey, {firstName}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Ready for your next trip?</p>
        </div>
      </header>

      {/* ── 2. Announcement Banner ── */}
      <AnnouncementBanner />

      {/* ── 4. Active Rental ── */}
      {activeRental && (
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Active Rental</h2>
            <button
              onClick={() => navigate('/my-rentals')}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-0.5 hover:underline"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-slate-800 dark:text-white text-base">
                  {activeRental.car?.brand} {activeRental.car?.model}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                  {activeRental.car?.color} · {activeRental.car?.year}
                </p>
              </div>
              {(() => {
                const s = STATUS_STYLE[activeRental.status] || STATUS_STYLE.pending;
                return (
                  <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
                    {s.label}
                  </span>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl px-4 py-3 border border-transparent dark:border-slate-800">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1 font-bold uppercase tracking-tighter">
                  <Calendar size={10} /> Pick-up
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {new Date(activeRental.rentalStartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl px-4 py-3 border border-transparent dark:border-slate-800">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1 font-bold uppercase tracking-tighter">
                  <Clock size={10} /> Return
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {new Date(activeRental.rentalEndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-1">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Total: <span className="font-black text-slate-900 dark:text-white">₱{activeRental.totalPrice?.toLocaleString()}</span>
              </p>
              <button
                onClick={() => navigate('/my-rentals')}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/20 active:scale-95"
              >
                View Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Recent Rentals ── */}
      {recentRentals.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Recent Rentals</h2>
            <button
              onClick={() => navigate('/my-rentals')}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-0.5"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2.5">
            {recentRentals.map((rental) => {
              const s = STATUS_STYLE[rental.status] || STATUS_STYLE.pending;
              return (
                <div
                  key={rental._id}
                  onClick={() => navigate('/my-rentals')}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:border-blue-200 dark:hover:border-blue-900 transition shadow-sm active:scale-[0.99]"
                >
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {rental.car?.brand} {rental.car?.model}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate uppercase mt-0.5">
                      {new Date(rental.rentalStartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                      {' → '}
                      {new Date(rental.rentalEndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. Popular ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Popular</h2>
          <button
            onClick={() => navigate('/popular')}
            className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-0.5"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <Cards limit={3} onSelect={(car) => setSelectedCar(car)} />
      </section>

      {/* ── 7. Recommended ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Recommended for You</h2>
          <button
            onClick={() => navigate('/recomended')}
            className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-0.5"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <Cards limit={6} onSelect={(car) => setSelectedCar(car)} />
      </section>

    </div>
  );
};

export default HomePage;