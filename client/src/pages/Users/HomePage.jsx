import React, { useState, useEffect } from 'react';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import { ChevronRight, Bell, Calendar, Clock, CheckCircle, Star, MapPin } from 'lucide-react';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRentalStore } from '../../store/RentalStore';

const STATUS_STYLE = {
  pending:   { bg: 'bg-yellow-50',  text: 'text-yellow-700', dot: 'bg-yellow-400', label: 'Pending'   },
  active:    { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500',  label: 'Active'    },
  approved:  { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Approved'  },
  completed: { bg: 'bg-slate-100',  text: 'text-slate-600',  dot: 'bg-slate-400',  label: 'Completed' },
  cancelled: { bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-400',    label: 'Cancelled' },
};

const AnnouncementBanner = () => {
  const ANNOUNCEMENTS = getSeasonalAnnouncements();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const ann = ANNOUNCEMENTS[current];
  const Icon = ann.icon;

  return (
    <div className={`${ann.color} rounded-2xl p-5 relative overflow-hidden transition-all duration-500`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute right-8 -bottom-8 w-20 h-20 rounded-full bg-white/10" />

      <div className={`inline-flex items-center gap-1.5 ${ann.tagBg} rounded-full px-3 py-1 mb-3`}>
        <Icon size={11} className={ann.textColor} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${ann.textColor}`}>
          {ann.type === 'promo' ? 'Promo' : ann.type === 'notice' ? 'Notice' : 'Alert'}
        </span>
      </div>

      <h3 className={`font-bold text-base leading-snug mb-1 ${ann.textColor}`}>{ann.title}</h3>
      <p className={`text-xs leading-relaxed mb-4 ${ann.subColor}`}>{ann.desc}</p>

      <button className="bg-white/20 hover:bg-white/30 transition text-white text-xs font-semibold px-4 py-1.5 rounded-xl">
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
  const { userRentals, fetchUserRentals, isLoading } = useRentalStore();

  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const activeRental = userRentals.find(r => r.status === 'active' || r.status === 'approved');
  const recentRentals = userRentals.filter(r => r._id !== activeRental?._id).slice(0, 2);

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-8 pb-10">

      {/* ── 1. Header ── */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-0.5">Dashboard</p>
          <h1 className="text-2xl font-bold text-slate-900">
            Hey, {firstName}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Ready for your next trip?</p>
        </div>
      
      </header>

      {/* ── 2. Announcement Banner ── */}
      <AnnouncementBanner />

   
      {/* ── 4. Active Rental ── */}
      {activeRental && (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-slate-800">Active Rental</h2>
            <button
              onClick={() => navigate('/my-rentals')}
              className="text-blue-600 text-sm font-semibold flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-base">
                  {activeRental.car?.brand} {activeRental.car?.model}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeRental.car?.color} · {activeRental.car?.year}
                </p>
              </div>
              {(() => {
                const s = STATUS_STYLE[activeRental.status] || STATUS_STYLE.pending;
                return (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Calendar size={10} /> Pick-up
                </p>
                <p className="text-xs font-semibold text-slate-700">
                  {new Date(activeRental.rentalStartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Clock size={10} /> Return
                </p>
                <p className="text-xs font-semibold text-slate-700">
                  {new Date(activeRental.rentalEndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-sm text-slate-500">
                Total: <span className="font-bold text-slate-800">₱{activeRental.totalPrice?.toLocaleString()}</span>
              </p>
              <button
                onClick={() => navigate('/my-rentals')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
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
            <h2 className="text-lg font-bold text-slate-800">Recent Rentals</h2>
            <button
              onClick={() => navigate('/my-rentals')}
              className="text-blue-600 text-sm font-semibold flex items-center gap-0.5"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {recentRentals.map((rental) => {
              const s = STATUS_STYLE[rental.status] || STATUS_STYLE.pending;
              return (
                <div
                  key={rental._id}
                  onClick={() => navigate('/my-rentals')}
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-blue-200 transition"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {rental.car?.brand} {rental.car?.model}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {new Date(rental.rentalStartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                      {' → '}
                      {new Date(rental.rentalEndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}>
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
          <h2 className="text-xl font-bold text-slate-800">Popular</h2>
          <button
            onClick={() => navigate('/popular')}
            className="text-blue-600 text-sm font-semibold flex items-center gap-0.5"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <Cards limit={3} onSelect={(car) => setSelectedCar(car)} />
      </section>

      {/* ── 7. Recommended ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Recommended for You</h2>
          <button
            onClick={() => navigate('/recomended')}
            className="text-blue-600 text-sm font-semibold flex items-center gap-0.5"
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