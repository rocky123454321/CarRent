"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import { useRentalStore } from '../../store/RentalStore';
import Cards from '../../components/user/Cards';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  SlidersHorizontal,
  Calendar as CalIcon,
  X,
  Sparkles,
  Bell,
  Tag,
  ChevronRight,
  Clock,
  Zap,
  Gift,
  Megaphone,
  Star,
  Percent,
} from 'lucide-react';

// ── Map icon string → lucide component fallback ──
const TYPE_ICON = {
  promo:  Percent,
  notice: Megaphone,
};

// ── Date range definitions for all time-specific promos ──
// Each entry: { id, startMonth, startDay, endMonth, endDay }
const PROMO_RANGES = [
  { id: 'newyear-day',        sm:1,  sd:1,  em:1,  ed:1  },
  { id: 'newyear-week',       sm:1,  sd:2,  em:1,  ed:7  },
  { id: 'jan-mid',            sm:1,  sd:8,  em:1,  ed:14 },
  { id: 'jan-staycation',     sm:1,  sd:15, em:1,  ed:24 },
  { id: 'cny',                sm:1,  sd:25, em:2,  ed:5  },
  { id: 'feb-kickoff',        sm:2,  sd:1,  em:2,  ed:6  },
  { id: 'valentines',         sm:2,  sd:7,  em:2,  ed:14 },
  { id: 'valentines-day',     sm:2,  sd:14, em:2,  ed:14 },
  { id: 'post-valentine',     sm:2,  sd:15, em:2,  ed:28 },
  { id: 'march-kickoff',      sm:3,  sd:1,  em:3,  ed:10 },
  { id: 'womens-day',         sm:3,  sd:8,  em:3,  ed:8  },
  { id: 'grad-season',        sm:3,  sd:15, em:4,  ed:10 },
  { id: 'summer',             sm:3,  sd:15, em:5,  ed:31 },
  { id: 'holy-week-prep',     sm:3,  sd:20, em:3,  ed:31 },
  { id: 'april-fools',        sm:4,  sd:1,  em:4,  ed:1  },
  { id: 'holy-week',          sm:4,  sd:5,  em:4,  ed:15 },
  { id: 'post-holywk',        sm:4,  sd:16, em:4,  ed:30 },
  { id: 'labor-day',          sm:5,  sd:1,  em:5,  ed:1  },
  { id: 'mothers-day',        sm:5,  sd:5,  em:5,  ed:12 },
  { id: 'may-endmonth',       sm:5,  sd:13, em:5,  ed:31 },
  { id: 'june-independence-prep', sm:6, sd:1, em:6, ed:9 },
  { id: '66sale',             sm:6,  sd:6,  em:6,  ed:6  },
  { id: 'fathers-day',        sm:6,  sd:10, em:6,  ed:18 },
  { id: 'june-end',           sm:6,  sd:19, em:6,  ed:30 },
  { id: 'july-kickoff',       sm:7,  sd:1,  em:7,  ed:6  },
  { id: '77sale',             sm:7,  sd:7,  em:7,  ed:7  },
  { id: 'july-mid',           sm:7,  sd:8,  em:7,  ed:20 },
  { id: 'july-end',           sm:7,  sd:21, em:7,  ed:31 },
  { id: 'aug-kickoff',        sm:8,  sd:1,  em:8,  ed:7  },
  { id: '88sale',             sm:8,  sd:8,  em:8,  ed:8  },
  { id: 'aug-mid',            sm:8,  sd:9,  em:8,  ed:20 },
  { id: 'buwan-ng-wika',      sm:8,  sd:21, em:8,  ed:31 },
  { id: 'ber-kickoff',        sm:9,  sd:1,  em:9,  ed:10 },
  { id: '99sale',             sm:9,  sd:9,  em:9,  ed:9  },
  { id: 'sep-mid',            sm:9,  sd:11, em:9,  ed:25 },
  { id: 'sep-end',            sm:9,  sd:26, em:9,  ed:30 },
  { id: 'oct-kickoff',        sm:10, sd:1,  em:10, ed:9  },
  { id: '1010',               sm:10, sd:10, em:10, ed:10 },
  { id: 'undas-prep',         sm:10, sd:11, em:10, ed:25 },
  { id: 'halloween',          sm:10, sd:26, em:10, ed:31 },
  { id: 'undas',              sm:11, sd:1,  em:11, ed:2  },
  { id: 'nov-early',          sm:11, sd:3,  em:11, ed:10 },
  { id: '1111',               sm:11, sd:11, em:11, ed:11 },
  { id: 'nov-mid',            sm:11, sd:12, em:11, ed:20 },
  { id: 'nov-end',            sm:11, sd:21, em:11, ed:30 },
  { id: 'dec-kickoff',        sm:12, sd:1,  em:12, ed:7  },
  { id: 'immaculada',         sm:12, sd:8,  em:12, ed:11 },
  { id: '1212',               sm:12, sd:12, em:12, ed:12 },
  { id: 'dec-midweek',        sm:12, sd:13, em:12, ed:14 },
  { id: 'xmas',               sm:12, sd:15, em:12, ed:25 },
  { id: 'xmas-eve-prep',      sm:12, sd:22, em:12, ed:24 },
  { id: 'post-xmas',          sm:12, sd:26, em:12, ed:30 },
  { id: 'nye',                sm:12, sd:31, em:12, ed:31 },
];

// ── Check if a date falls within a promo range ──
const dateInRange = (date, sm, sd, em, ed) => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const cur   = m * 100 + d;
  const start = sm * 100 + sd;
  const end   = em * 100 + ed;
  if (start <= end) return cur >= start && cur <= end;
  return cur >= start || cur <= end;
};

// ── Get promos active on a specific future date ──
const getPromosForDate = (date) => {
  const all = getSeasonalAnnouncements();
  const byId = {};
  all.forEach(a => { byId[a.id] = a; });
  return PROMO_RANGES
    .filter(r => dateInRange(date, r.sm, r.sd, r.em, r.ed))
    .map(r => byId[r.id])
    .filter(Boolean);
};

// ── Upcoming events: finds next distinct promo start dates ──
const getUpcomingEvents = () => {
  const seen   = new Set();
  const events = [];
  const today  = new Date();

  for (let offset = 1; offset <= 120; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const m = d.getMonth() + 1;
    const day = d.getDate();

    // Only show on the START day of a promo range
    PROMO_RANGES.forEach(range => {
      if (range.sm === m && range.sd === day && !seen.has(range.id)) {
        const all = getSeasonalAnnouncements();
        const ann = all.find(a => a.id === range.id);
        if (ann) {
          seen.add(range.id);
          events.push({
            ...ann,
            startsOn: new Date(d),
            endsOn: new Date(d.getFullYear(), range.em - 1, range.ed),
          });
        }
      }
    });

    if (events.length >= 8) break;
  }

  return events.slice(0, 8);
};

// ── Always-on promos (permanent deals) ──
const getAlwaysOnPromos = () => {
  const all = getSeasonalAnnouncements();
  const alwaysOnIds = [
    'new-vehicles','insurance-update','loyalty-program','app-exclusive',
    'refer-friend','long-term','group-booking','zero-deposit','first-time',
    'driver-available','gps-tracking','carbon-offset','student-discount',
    'senior-promo','corporate-rate','clean-guarantee','photo-shoot',
    'music-festival',
  ];
  return all.filter(a => alwaysOnIds.includes(a.id)).slice(0, 4);
};

// ── Current active promos (today) ──
const getCurrentPromos = () => {
  const alwaysOnIds = [
    'new-vehicles','insurance-update','loyalty-program','app-exclusive',
    'refer-friend','long-term','group-booking','zero-deposit','first-time',
    'driver-available','gps-tracking','carbon-offset','student-discount',
    'senior-promo','corporate-rate','clean-guarantee','photo-shoot',
    'music-festival','default',
  ];
  return getSeasonalAnnouncements().filter(a => !alwaysOnIds.includes(a.id));
};

const fmt = (date) =>
  date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });

// ── Event pill ──
const EventPill = ({ ann, showDate }) => {
  const Icon = TYPE_ICON[ann.type] || Bell;
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 ${ann.color} group cursor-pointer hover:scale-[1.02] transition-all duration-300`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {showDate && ann.startsOn && (
            <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mb-1">
              {fmt(ann.startsOn)}{ann.endsOn && ann.endsOn.toDateString() !== ann.startsOn.toDateString() ? ` → ${fmt(ann.endsOn)}` : ''}
            </p>
          )}
          <p className={`text-xs font-black leading-tight tracking-tight ${ann.textColor}`}>
            {ann.title}
          </p>
          <p className={`text-[9px] font-medium mt-1 line-clamp-2 opacity-80 ${ann.subColor}`}>
            {ann.desc}
          </p>
        </div>
        <div className="shrink-0 w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={13} className="text-white" />
        </div>
      </div>
      {ann.type === 'promo' && (
        <div className="absolute top-2 left-2">
          <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full">
            Promo
          </span>
        </div>
      )}
    </div>
  );
};

// ── Build a map of date-string -> promo events for that day ──
const buildPromoDateMap = () => {
  const map = {};
  const today = new Date();
  for (let offset = 0; offset <= 90; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const events = getPromosForDate(d);
    if (events.length > 0) {
      map[d.toDateString()] = events;
    }
  }
  return map;
};

// ── Custom calendar with promo dot markers + hover tooltip ──
const MarkedCalendar = ({ date, setDate, promoMap, rentalDates }) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPos, setTooltipPos]   = useState({ x: 0, y: 0 });

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDay    = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const monthLabel = viewMonth.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  return (
    <div className="relative w-full select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition text-slate-500 dark:text-slate-400 text-xs font-black">‹</button>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{monthLabel}</p>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition text-slate-500 dark:text-slate-400 text-xs font-black">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[8px] font-black uppercase tracking-wider text-slate-300 dark:text-slate-600 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNum);
          const key = cellDate.toDateString();
          const hasPromo   = !!promoMap[key];
          const isRental   = rentalDates.some(rd => rd.toDateString() === key);
          const isToday    = key === today.toDateString();
          const isSelected = date && date.toDateString() === key;
          const isPast     = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const events     = promoMap[key] || [];

          return (
            <div
              key={dayNum}
              className="relative flex flex-col items-center py-0.5"
              onMouseEnter={(e) => {
                if (hasPromo || isRental) {
                  setHoveredDate(key);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPos({ x: rect.left, y: rect.top });
                }
              }}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                onClick={() => !isPast && setDate(cellDate)}
                className={`w-7 h-7 rounded-full text-[11px] font-black transition-all flex items-center justify-center
                  ${isSelected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' :
                    isToday    ? 'bg-blue-500 text-white' :
                    isPast     ? 'text-slate-200 dark:text-slate-700 cursor-default' :
                    hasPromo   ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' :
                    isRental   ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' :
                    'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                {dayNum}
              </button>

              {/* Dot indicators */}
              <div className="flex gap-0.5 mt-0.5 h-1.5">
                {hasPromo  && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                {isRental  && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
              </div>

              {/* Tooltip */}
              {hoveredDate === key && (hasPromo || isRental) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-44 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-3 shadow-xl">
                    {isRental && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Your Rental</p>
                      </div>
                    )}
                    {events.slice(0, 2).map(ev => (
                      <div key={ev.id} className="mb-1 last:mb-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <p className="text-[9px] font-black text-white leading-tight">{ev.title}</p>
                        </div>
                        <p className="text-[8px] text-slate-400 mt-0.5 pl-3 line-clamp-1">{ev.desc}</p>
                      </div>
                    ))}
                    {events.length > 2 && (
                      <p className="text-[8px] text-slate-500 mt-1 pl-3">+{events.length - 2} more</p>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Promo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Your Rental</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Today</span>
        </div>
      </div>
    </div>
  );
};

// ── Right sidebar ──
const RightSidebar = ({ date, setDate }) => {
  const { userRentals, fetchUserRentals } = useRentalStore();
  const upcomingEvents  = getUpcomingEvents();
  const currentPromos   = getCurrentPromos();
  const alwaysOnPromos  = getAlwaysOnPromos();
  const [tab, setTab]   = useState('upcoming');

  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);

  // Build promo date map once
  const promoMap = buildPromoDateMap();

  // Flatten all rental start/end date ranges into individual dates
  const rentalDates = [];
  userRentals.filter(r => r.status !== 'cancelled').forEach(r => {
    const start = new Date(r.rentalStartDate);
    const end   = new Date(r.rentalEndDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      rentalDates.push(new Date(d));
    }
  });

  const TABS = [
    { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
    { key: 'active',   label: 'Active',   count: currentPromos.length  },
    { key: 'deals',    label: 'Deals',    count: alwaysOnPromos.length },
  ];

  const displayed =
    tab === 'upcoming' ? upcomingEvents :
    tab === 'active'   ? currentPromos  :
    alwaysOnPromos;

  return (
    <div className="space-y-5">

      {/* ── Custom Marked Calendar ── */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-5">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Bell className="text-blue-500" size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calendar</span>
        </div>
        <MarkedCalendar date={date} setDate={setDate} promoMap={promoMap} rentalDates={rentalDates} />
      </div>

      {/* ── Promos & Events ── */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-5">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <Sparkles className="text-amber-500" size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Promos & Events</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-4">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all
                ${tab === t.key
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
            >
              {t.label}
              <span className={`text-[7px] px-1 py-0.5 rounded-full font-black
                ${tab === t.key ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-200 dark:bg-white/10'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p className="text-[9px] text-slate-400 font-medium mb-3 px-1">
          {tab === 'upcoming' && 'Promos starting in the next few days'}
          {tab === 'active'   && 'Deals available right now today'}
          {tab === 'deals'    && 'Permanent deals available anytime'}
        </p>

        {/* Event list */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto hide-scrollbar">
          {displayed.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">No events found</p>
            </div>
          ) : (
            displayed.map((ann) => (
              <EventPill key={ann.id} ann={ann} showDate={tab === 'upcoming'} />
            ))
          )}
        </div>

        <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-100 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-white transition-all">
          View All Promos <ChevronRight size={11} />
        </button>
      </div>

    </div>
  );
};

// ── Mobile Events Sheet ──
const MobileEventsSheet = ({ open, onClose }) => {
  const currentPromos  = getCurrentPromos();
  const upcomingEvents = getUpcomingEvents();
  const alwaysOn       = getAlwaysOnPromos();
  const all            = [...currentPromos, ...upcomingEvents, ...alwaysOn];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-t-[2.5rem] p-6 animate-in slide-in-from-bottom-10 duration-500 border-t border-white/10 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-500" size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Promos & Events</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500">
            <X size={18} />
          </button>
        </div>

        {currentPromos.length > 0 && (
          <div className="mb-4 shrink-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Active Today</p>
            <div className="space-y-2">
              {currentPromos.slice(0, 3).map(ann => (
                <EventPill key={ann.id} ann={ann} showDate={false} />
              ))}
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1 hide-scrollbar space-y-4">
          {upcomingEvents.length > 0 && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Coming Soon</p>
              <div className="space-y-2">
                {upcomingEvents.map(ann => (
                  <EventPill key={ann.id} ann={ann} showDate={true} />
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Always Available</p>
            <div className="space-y-2">
              {alwaysOn.map(ann => (
                <EventPill key={ann.id} ann={ann} showDate={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Mobile Calendar Sheet ──
const MobileCalSheet = ({ open, onClose, date, setDate }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-10 duration-500 border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Select Date</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center mb-8">
          <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); onClose(); }} />
        </div>
        <button onClick={onClose} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
          Confirm Date
        </button>
      </div>
    </div>
  );
};

// ── Main Page ──
const ExploreNow = () => {
  const { searchQuery, setSearchQuery, cars, getCars, isLoading } = useCarStore();
  const [selectedCar, setSelectedCar]   = useState(null);
  const [date, setDate]                 = useState(new Date());
  const [showFilters, setShowFilters]   = useState(false);
  const [isCalOpen, setIsCalOpen]       = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  const activePromoCount = getCurrentPromos().length;

  useEffect(() => { getCars(); }, [getCars]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#050505]">
      <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-8">

        {/* ── LEFT: FLEET ── */}
        <div className="flex-1 space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-blue-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Premium Fleet</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Explore Now
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                />
              </div>

              {/* Mobile: Events button */}
              <button
                onClick={() => setIsEventsOpen(true)}
                className="lg:hidden relative p-3 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 text-amber-500 shadow-sm"
              >
                <Sparkles size={20} />
                {activePromoCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">
                    {activePromoCount}
                  </span>
                )}
              </button>

              {/* Mobile: Calendar button */}
              <button
                onClick={() => setIsCalOpen(true)}
                className="lg:hidden p-3 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 shadow-sm"
              >
                <CalIcon size={20} />
              </button>

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-2xl border transition-all ${
                  showFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Active promo banner strip (mobile) */}
          {activePromoCount > 0 && (
            <div className="lg:hidden flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {getCurrentPromos().slice(0, 3).map(ann => (
                <div
                  key={ann.id}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl ${ann.color} cursor-pointer`}
                >
                  <Tag size={10} className="text-white shrink-0" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                    {ann.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Car Grid */}
          <div className="pt-2">
            <Cards onSelect={setSelectedCar} />
          </div>
        </div>

        {/* ── RIGHT: DESKTOP SIDEBAR ── */}
        <div className="hidden lg:block w-[340px] shrink-0 space-y-0">
          <div className="sticky top-8">
            <RightSidebar date={date} setDate={setDate} />
          </div>
        </div>
      </div>

      {/* ── MOBILE OVERLAYS ── */}
      <MobileCalSheet    open={isCalOpen}    onClose={() => setIsCalOpen(false)}    date={date} setDate={setDate} />
      <MobileEventsSheet open={isEventsOpen} onClose={() => setIsEventsOpen(false)} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ExploreNow;