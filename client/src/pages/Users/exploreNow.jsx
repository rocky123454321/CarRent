"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import { useRentalStore } from '../../store/RentalStore';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import { Search, X, Bell, Tag, ChevronRight, Clock, Megaphone, Percent } from 'lucide-react';
import carImage from "../../assets/1.png";

const TYPE_ICON = { promo: Percent, notice: Megaphone };

const PROMO_RANGES = [
  { id: 'newyear-day',         sm:1,  sd:1,  em:1,  ed:1  },
  { id: 'newyear-week',        sm:1,  sd:2,  em:1,  ed:7  },
  { id: 'jan-mid',             sm:1,  sd:8,  em:1,  ed:14 },
  { id: 'jan-staycation',      sm:1,  sd:15, em:1,  ed:24 },
  { id: 'cny',                 sm:1,  sd:25, em:2,  ed:5  },
  { id: 'feb-kickoff',         sm:2,  sd:1,  em:2,  ed:6  },
  { id: 'valentines',          sm:2,  sd:7,  em:2,  ed:14 },
  { id: 'valentines-day',      sm:2,  sd:14, em:2,  ed:14 },
  { id: 'post-valentine',      sm:2,  sd:15, em:2,  ed:28 },
  { id: 'march-kickoff',       sm:3,  sd:1,  em:3,  ed:10 },
  { id: 'womens-day',          sm:3,  sd:8,  em:3,  ed:8  },
  { id: 'grad-season',         sm:3,  sd:15, em:4,  ed:10 },
  { id: 'summer',              sm:3,  sd:15, em:5,  ed:31 },
  { id: 'holy-week-prep',      sm:3,  sd:20, em:3,  ed:31 },
  { id: 'april-fools',         sm:4,  sd:1,  em:4,  ed:1  },
  { id: 'holy-week',           sm:4,  sd:5,  em:4,  ed:15 },
  { id: 'post-holywk',         sm:4,  sd:16, em:4,  ed:30 },
  { id: 'labor-day',           sm:5,  sd:1,  em:5,  ed:1  },
  { id: 'mothers-day',         sm:5,  sd:5,  em:5,  ed:12 },
  { id: 'may-endmonth',        sm:5,  sd:13, em:5,  ed:31 },
  { id: 'june-independence-prep', sm:6, sd:1, em:6, ed:9 },
  { id: '66sale',              sm:6,  sd:6,  em:6,  ed:6  },
  { id: 'fathers-day',         sm:6,  sd:10, em:6,  ed:18 },
  { id: 'june-end',            sm:6,  sd:19, em:6,  ed:30 },
  { id: 'july-kickoff',        sm:7,  sd:1,  em:7,  ed:6  },
  { id: '77sale',              sm:7,  sd:7,  em:7,  ed:7  },
  { id: 'july-mid',            sm:7,  sd:8,  em:7,  ed:20 },
  { id: 'july-end',            sm:7,  sd:21, em:7,  ed:31 },
  { id: 'aug-kickoff',         sm:8,  sd:1,  em:8,  ed:7  },
  { id: '88sale',              sm:8,  sd:8,  em:8,  ed:8  },
  { id: 'aug-mid',             sm:8,  sd:9,  em:8,  ed:20 },
  { id: 'buwan-ng-wika',       sm:8,  sd:21, em:8,  ed:31 },
  { id: 'ber-kickoff',         sm:9,  sd:1,  em:9,  ed:10 },
  { id: '99sale',              sm:9,  sd:9,  em:9,  ed:9  },
  { id: 'sep-mid',             sm:9,  sd:11, em:9,  ed:25 },
  { id: 'sep-end',             sm:9,  sd:26, em:9,  ed:30 },
  { id: 'oct-kickoff',         sm:10, sd:1,  em:10, ed:9  },
  { id: '1010',                sm:10, sd:10, em:10, ed:10 },
  { id: 'undas-prep',          sm:10, sd:11, em:10, ed:25 },
  { id: 'halloween',           sm:10, sd:26, em:10, ed:31 },
  { id: 'undas',               sm:11, sd:1,  em:11, ed:2  },
  { id: 'nov-early',           sm:11, sd:3,  em:11, ed:10 },
  { id: '1111',                sm:11, sd:11, em:11, ed:11 },
  { id: 'nov-mid',             sm:11, sd:12, em:11, ed:20 },
  { id: 'nov-end',             sm:11, sd:21, em:11, ed:30 },
  { id: 'dec-kickoff',         sm:12, sd:1,  em:12, ed:7  },
  { id: 'immaculada',          sm:12, sd:8,  em:12, ed:11 },
  { id: '1212',                sm:12, sd:12, em:12, ed:12 },
  { id: 'dec-midweek',         sm:12, sd:13, em:12, ed:14 },
  { id: 'xmas',                sm:12, sd:15, em:12, ed:25 },
  { id: 'xmas-eve-prep',       sm:12, sd:22, em:12, ed:24 },
  { id: 'post-xmas',           sm:12, sd:26, em:12, ed:30 },
  { id: 'nye',                 sm:12, sd:31, em:12, ed:31 },
];

const ALWAYS_ON_IDS = [
  'new-vehicles','insurance-update','loyalty-program','app-exclusive',
  'refer-friend','long-term','group-booking','zero-deposit','first-time',
  'driver-available','gps-tracking','carbon-offset','student-discount',
  'senior-promo','corporate-rate','clean-guarantee','photo-shoot','music-festival'
];

const dateInRange = (date, sm, sd, em, ed) => {
  const m = date.getMonth() + 1, d = date.getDate();
  const cur = m * 100 + d, start = sm * 100 + sd, end = em * 100 + ed;
  if (start <= end) return cur >= start && cur <= end;
  return cur >= start || cur <= end;
};

const getPromosForDate = (date) => {
  const all = getSeasonalAnnouncements();
  const byId = {};
  all.forEach(a => { byId[a.id] = a; });
  return PROMO_RANGES.filter(r => dateInRange(date, r.sm, r.sd, r.em, r.ed)).map(r => byId[r.id]).filter(Boolean);
};

const getUpcomingEvents = () => {
  const seen = new Set(), events = [], today = new Date();
  for (let offset = 1; offset <= 120; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const m = d.getMonth() + 1, day = d.getDate();
    PROMO_RANGES.forEach(range => {
      if (range.sm === m && range.sd === day && !seen.has(range.id)) {
        const ann = getSeasonalAnnouncements().find(a => a.id === range.id);
        if (ann) { seen.add(range.id); events.push({ ...ann, startsOn: new Date(d), endsOn: new Date(d.getFullYear(), range.em - 1, range.ed) }); }
      }
    });
    if (events.length >= 8) break;
  }
  return events;
};

const getAlwaysOnPromos = () => getSeasonalAnnouncements().filter(a => ALWAYS_ON_IDS.includes(a.id)).slice(0, 4);
const getCurrentPromos  = () => getSeasonalAnnouncements().filter(a => !ALWAYS_ON_IDS.includes(a.id) && a.id !== 'default');
const fmt = (date) => date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });

const EventPill = ({ ann, showDate }) => {
  const Icon = TYPE_ICON[ann.type] || Bell;
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 ${ann.color} hover:scale-[1.02] transition-all duration-300`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {showDate && ann.startsOn && (
            <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mb-1">
              {fmt(ann.startsOn)}{ann.endsOn && ann.endsOn.toDateString() !== ann.startsOn.toDateString() ? ` → ${fmt(ann.endsOn)}` : ''}
            </p>
          )}
          <p className={`text-xs font-black leading-tight tracking-tight ${ann.textColor}`}>{ann.title}</p>
          <p className={`text-[9px] font-medium mt-1 line-clamp-2 opacity-80 ${ann.subColor}`}>{ann.desc}</p>
        </div>
        <div className="shrink-0 w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={13} className="text-white" />
        </div>
      </div>
      {ann.type === 'promo' && (
        <div className="absolute top-2 left-2">
          <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full">Promo</span>
        </div>
      )}
    </div>
  );
};

const buildPromoDateMap = () => {
  const map = {}, today = new Date();
  for (let offset = 0; offset <= 90; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const events = getPromosForDate(d).filter(e => e.id !== 'default' && !ALWAYS_ON_IDS.includes(e.id));
    if (events.length > 0) map[d.toDateString()] = events;
  }
  return map;
};

const MarkedCalendar = ({ date, setDate, promoMap, rentalDates }) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  return (
    <div className="relative w-full select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition text-slate-500 text-xs font-black">‹</button>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{viewMonth.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</p>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition text-slate-500 text-xs font-black">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[8px] font-black uppercase tracking-wider text-slate-300 dark:text-slate-600 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNum);
          const key = cellDate.toDateString();
          const hasPromo = !!promoMap[key];
          const isRental = rentalDates.some(rd => rd.toDateString() === key);
          const isToday = key === today.toDateString();
          const isSelected = date && date.toDateString() === key;
          const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <div key={dayNum} className="relative flex flex-col items-center py-0.5"
              onMouseEnter={() => (hasPromo || isRental) && setHoveredDate(key)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button onClick={() => !isPast && setDate(cellDate)}
                className={`w-7 h-7 rounded-full text-[11px] font-black transition-all flex items-center justify-center
                  ${isSelected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' :
                    isToday ? 'bg-blue-500 text-white' :
                    isPast  ? 'text-slate-200 dark:text-slate-700 cursor-default' :
                    hasPromo ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50' :
                    isRental ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50' :
                               'text-slate-600 dark:text-slate-300 hover:bg-slate-100'}`}
              >{dayNum}</button>
              <div className="flex gap-0.5 mt-0.5 h-1.5">
                {hasPromo && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                {isRental  && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
              </div>
              {hoveredDate === key && (hasPromo || isRental) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-44 pointer-events-none">
                  <div className="bg-slate-900 rounded-2xl p-3 shadow-xl">
                    {isRental && <div className="flex items-center gap-1.5 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /><p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Your Rental</p></div>}
                    {(promoMap[key] || []).slice(0, 2).map(ev => (
                      <div key={ev.id} className="mb-1 last:mb-0">
                        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /><p className="text-[9px] font-black text-white leading-tight">{ev.title}</p></div>
                        <p className="text-[8px] text-slate-400 mt-0.5 pl-3 line-clamp-1">{ev.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RightSidebar = ({ date, setDate }) => {
  const { userRentals, fetchUserRentals } = useRentalStore();
  const [tab, setTab] = useState('upcoming');
  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);
  const promoMap = buildPromoDateMap();
  const rentalDates = [];
  userRentals.filter(r => r.status !== 'cancelled').forEach(r => {
    const start = new Date(r.rentalStartDate), end = new Date(r.rentalEndDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) rentalDates.push(new Date(d));
  });
  const upcomingEvents = getUpcomingEvents();
  const currentPromos  = getCurrentPromos();
  const alwaysOnPromos = getAlwaysOnPromos();
  const TABS = [
    { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
    { key: 'active',   label: 'Active',   count: currentPromos.length  },
    { key: 'deals',    label: 'Deals',    count: alwaysOnPromos.length },
  ];
  const displayed = tab === 'upcoming' ? upcomingEvents : tab === 'active' ? currentPromos : alwaysOnPromos;
  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-5">
        <MarkedCalendar date={date} setDate={setDate} promoMap={promoMap} rentalDates={rentalDates} />
      </div>
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-5">
        <div className="flex gap-1.5 mb-4">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all
                ${tab === t.key ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}
            >
              {t.label}
              <span className={`text-[7px] px-1 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10'}`}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto hide-scrollbar">
          {displayed.length === 0
            ? <div className="text-center py-8"><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No promotions</p></div>
            : displayed.map(ann => <EventPill key={ann.id} ann={ann} showDate={tab === 'upcoming'} />)
          }
        </div>
      </div>
    </div>
  );
};

// ─── PROMO CAR CARD ───────────────────────────────────────────────────────────
const PromoCarCard = ({ car }) => {
  const navigate = useNavigate();
  const isExpired = car.promoExpiry && new Date(car.promoExpiry) < new Date();

  // ✅ THE FIX: pass car object as route state
  const handleClick = () => navigate(`/car/${car._id}`, { state: { car } });

  return (
    <div onClick={handleClick} className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 cursor-pointer">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <span className="bg-rose-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md">{car.promoLabel || 'Promo'}</span>
        {car.promoSeason && <span className="bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-[7px] font-bold px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 capitalize">{car.promoSeason.replace('_', ' ')}</span>}
        {isExpired && <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Expired</span>}
      </div>
      {car.promoExpiry && !isExpired && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 text-white text-[7px] font-bold px-2 py-0.5 rounded-full">
          <Clock size={7} />
          {new Date(car.promoExpiry).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
        </div>
      )}
      <div className="mx-4 mt-10 mb-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl flex justify-center items-center p-6 h-36">
        <img src={car.image || carImage} alt={`${car.brand} ${car.model}`} className="max-h-full w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2" />
      </div>
      <div className="px-5 pt-1 pb-0">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white tracking-tighter">{car.brand} {car.model}</h3>
        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{car.color} · {car.year} · {car.fuelType}</p>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 px-5 py-4 mt-3 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div>
          <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-widest block mb-0.5">Promo Rate</span>
          <span className="text-[9px] text-zinc-300 dark:text-zinc-600 line-through font-bold block leading-none">₱{car.pricePerDay.toLocaleString()}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-rose-500">₱{(car.promoPrice || car.pricePerDay).toLocaleString()}</span>
            <span className="text-[8px] text-zinc-400 font-medium">/day</span>
          </div>
        </div>
        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-rose-500 text-white transition-all group-hover:scale-110 shadow-md shadow-rose-500/30">
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ExploreNow = () => {
  const { cars, searchQuery, setSearchQuery, getCars } = useCarStore();
  const [date, setDate] = useState(new Date());
  useEffect(() => { getCars(); }, [getCars]);

const promoCars = (cars || []).filter(car => {
    const match = !searchQuery || `${car.brand} ${car.model} ${car.color}`.toLowerCase().includes(searchQuery.toLowerCase());
    const isOccupied = car.status === 'occupied' || car.isAvailable === false || car.occupied === true;
    return match && car.isPromo === true && !isOccupied && (!car.promoExpiry || new Date(car.promoExpiry) >= new Date());
});
  const expiredPromos = (cars || []).filter(car => {
    const match = !searchQuery || `${car.brand} ${car.model} ${car.color}`.toLowerCase().includes(searchQuery.toLowerCase());
    return match && car.isPromo === true && car.promoExpiry && new Date(car.promoExpiry) < new Date();
  });

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#050505]">
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
      <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-px w-5 bg-zinc-200 dark:bg-zinc-800" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Renter Promos</p>
              </div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Explore Deals</h1>
              <p className="text-sm text-zinc-400 mt-1">{promoCars.length} active promo{promoCars.length !== 1 ? 's' : ''} from our renters</p>
            </div>
          
          </div>

          {promoCars.length === 0 && expiredPromos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-3xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4"><Tag size={24} className="text-zinc-300 dark:text-zinc-700" /></div>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">{searchQuery ? 'No promos match your search.' : 'No active promos right now.'}</p>
              <p className="text-zinc-300 dark:text-zinc-700 text-xs mt-1">Check back soon — renters update deals regularly.</p>
            </div>
          ) : (
            <>
              {promoCars.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /><h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Active Promos</h2></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {promoCars.map(car => <PromoCarCard key={car._id} car={car} />)}
                  </div>
                </div>
              )}
              {expiredPromos.length > 0 && (
                <div className="opacity-50">
                  <div className="flex items-center gap-2 mb-4"><span className="h-2 w-2 rounded-full bg-zinc-400" /><h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Expired Deals</h2></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {expiredPromos.map(car => <PromoCarCard key={car._id} car={car} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="hidden lg:block w-[340px] shrink-0"><div className="sticky top-8"><RightSidebar date={date} setDate={setDate} /></div></div>
      </div>
    </div>
  );
};

export default ExploreNow;