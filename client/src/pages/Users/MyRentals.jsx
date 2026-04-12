import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Calendar, CarFront, BadgeCheck,
  X, Trash2, ChevronDown, ChevronUp, Clock, MapPin,
  CreditCard, User, Phone, Home, Tag, Fuel, Settings2,
  Users, TrendingUp, AlertCircle, CheckCircle2, XCircle,
  Timer, Star, ArrowRight
} from 'lucide-react';
import { useRentalStore } from '../../store/RentalStore.js';
import { toast } from 'sonner';

// ── STATUS MAP (matches actual DB enum: pending, confirmed, completed, cancelled) ──
const STATUS = {
  pending:   {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-500/20',
    dot: 'bg-amber-400',
    icon: Clock,
    label: 'Pending',
    desc: 'Awaiting owner confirmation',
    pulse: true,
  },
  confirmed: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
    label: 'Confirmed',
    desc: 'Rental approved & active',
    pulse: true,
  },
  completed: {
    bg: 'bg-zinc-100 dark:bg-zinc-800/50',
    text: 'text-zinc-500 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    dot: 'bg-zinc-400',
    icon: BadgeCheck,
    label: 'Completed',
    desc: 'Rental successfully finished',
    pulse: false,
  },
  cancelled: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-500/20',
    dot: 'bg-rose-400',
    icon: XCircle,
    label: 'Cancelled',
    desc: 'Rental was cancelled',
    pulse: false,
  },
};

const getStatus = (s) => STATUS[s] || STATUS.pending;

// ── FILTERS (maps to actual DB values) ──
const FILTERS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

// ── HELPERS ──
const fmt = (date) =>
  new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

const diffDays = (start, end) =>
  Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000));

const countdown = (endDate) => {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return 'Due now';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return d > 0 ? `${d}d ${h}h remaining` : `${h}h remaining`;
};

// ── SKELETON ──
const RentalSkeleton = () => (
  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 md:p-8 animate-pulse space-y-5">
    <div className="flex gap-5 items-start">
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-[1.25rem] shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded w-40" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-24" />
          </div>
          <div className="h-7 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
        </div>
        <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-56" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

// ── STAT MINI CARD ──
const MiniStat = ({ label, value, icon: Icon, color = 'zinc' }) => (
  <div className="flex flex-col gap-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3">
    <div className="flex items-center gap-1.5">
      <Icon size={10} className={`text-${color}-500`} />
      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
    <p className="text-xs font-black text-zinc-900 dark:text-white leading-none truncate">{value}</p>
  </div>
);

// ── CONFIRM DIALOG ──
const ConfirmDialog = ({ open, title, desc, confirmLabel, confirmColor, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-5">
          <AlertCircle size={22} className="text-zinc-900 dark:text-white" />
        </div>
        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">{desc}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
            Go Back
          </button>
          <button onClick={onConfirm} className={`flex-1 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all ${confirmColor}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── SUMMARY STATS BAR ──
const SummaryBar = ({ rentals }) => {
  const total     = rentals.length;
  const confirmed = rentals.filter(r => r.status === 'confirmed').length;
  const pending   = rentals.filter(r => r.status === 'pending').length;
  const completed = rentals.filter(r => r.status === 'completed').length;
  const cancelled = rentals.filter(r => r.status === 'cancelled').length;
  const totalSpent = rentals.filter(r => r.status !== 'cancelled').reduce((acc, r) => acc + (r.totalPrice || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div className="bg-zinc-900 dark:bg-white rounded-2xl p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Total Spent</span>
        <p className="text-xl font-black text-white dark:text-zinc-900 leading-none">₱{totalSpent.toLocaleString()}</p>
        <span className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold">{total} booking{total !== 1 ? 's' : ''}</span>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 flex flex-col gap-1">
        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Confirmed</span>
        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{confirmed}</p>
        <span className="text-[8px] text-emerald-500/70 font-bold">active rentals</span>
      </div>
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 flex flex-col gap-1">
        <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Pending</span>
        <p className="text-2xl font-black text-amber-600 dark:text-amber-400 leading-none">{pending}</p>
        <span className="text-[8px] text-amber-500/70 font-bold">awaiting confirm</span>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-1">
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Completed</span>
        <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{completed}</p>
        <span className="text-[8px] text-zinc-400 font-bold">finished trips</span>
      </div>
      <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl p-4 flex flex-col gap-1">
        <span className="text-[8px] font-black uppercase tracking-widest text-rose-500">Cancelled</span>
        <p className="text-2xl font-black text-rose-500 leading-none">{cancelled}</p>
        <span className="text-[8px] text-rose-400/70 font-bold">not completed</span>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ──
const MyRentals = () => {
  const navigate = useNavigate();
  const { userRentals, fetchUserRentals, isLoading, cancelRental, deleteRental } = useRentalStore();
  const [expandedId, setExpandedId] = useState(null);
  const [dialog, setDialog]         = useState(null);
  const [processing, setProcessing] = useState({});
  const [filter, setFilter]         = useState('all');

  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);

  const handleChatSupport = (rental) => {
    const adminId = rental.car?.uploadedBy?._id || rental.car?.uploadedBy;
    navigate('/chat', {
      state: {
        userId: adminId,
        context: 'rental',
        rentalId: rental._id,
        renterName: `${rental.car?.brand} ${rental.car?.model}`,
      },
    });
  };

  const handleCancel = async (rental) => {
    setProcessing(p => ({ ...p, [rental._id]: true }));
    const result = await cancelRental(rental._id);
    if (result.success) { toast.success('Rental cancelled'); await fetchUserRentals(); }
    setProcessing(p => ({ ...p, [rental._id]: false }));
    setDialog(null);
  };

  const handleDelete = async (rental) => {
    setProcessing(p => ({ ...p, [rental._id]: true }));
    const result = await deleteRental(rental._id);
    if (result.success) { toast.success('Record removed'); await fetchUserRentals(); }
    setProcessing(p => ({ ...p, [rental._id]: false }));
    setDialog(null);
  };

  // ── filter uses actual DB values ──
  const filtered = filter === 'all'
    ? userRentals
    : userRentals.filter(r => r.status === filter);

  // canCancel: pending or confirmed (DB values)
  const canCancel = (s) => ['pending', 'confirmed'].includes(s);
  const canDelete = (s) => ['completed', 'cancelled'].includes(s);

  return (
    <div className="pb-24 space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-52 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
            <div className="h-3 w-36 bg-zinc-100 dark:bg-zinc-900 rounded" />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Rental History</p>
            </div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
              My Rentals
            </h1>
          </div>
        )}
      </div>

      {/* ── SUMMARY STATS ── */}
      {!isLoading && userRentals.length > 0 && <SummaryBar rentals={userRentals} />}

      {/* ── FILTER TABS ── */}
    
<div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
  {isLoading
    ? [1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-10 w-28 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0 animate-pulse" />
      ))
    : FILTERS.map(f => {
        const active = filter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${active
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg'
                : 'bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-400'}`}
          >
            {f.label}
          </button>
        );
      })
  }
</div>

      {/* ── RENTAL LIST ── */}
      <div className="space-y-4">
        {isLoading ? (
          [1,2,3].map(i => <RentalSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] text-center py-24 space-y-3">
            <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto">
              <CarFront size={22} className="text-zinc-300 dark:text-zinc-700" />
            </div>
            <p className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">No records found</p>
            <button onClick={() => navigate('/cars')} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 rounded-xl hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all">
              Browse Cars <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          filtered.map((rental) => {
            const s          = getStatus(rental.status);
            const StatusIcon = s.icon;
            const isExpanded = expandedId === rental._id;
            const isBusy     = processing[rental._id];
            const days       = diffDays(rental.rentalStartDate, rental.rentalEndDate);
            const pricePerDay = rental.car?.pricePerDay;
            const isActive   = rental.status === 'confirmed' || rental.status === 'pending';

            return (
              <div
                key={rental._id}
                className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden "
              >
                <div className="p-5 md:p-7">

                  {/* ── TOP ROW ── */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                    {/* Car Icon */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-50 dark:bg-zinc-900 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 group-hover:border-zinc-900 dark:group-hover:border-zinc-500 transition-colors">
                      <CarFront size={22} className="text-zinc-900 dark:text-white" />
                    </div>

                    <div className="flex-1 min-w-0">

                      {/* Car name + status badge */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-black text-zinc-900 dark:text-white text-lg uppercase tracking-tight leading-none mb-1 truncate">
                            {rental.car?.brand} {rental.car?.model}
                          </h3>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            {rental.car?.licensePlate || 'N/A'}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full border shrink-0 uppercase tracking-widest ${s.bg} ${s.text} ${s.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
                          {s.label}
                        </span>
                      </div>

                      {/* Status description */}
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-4">{s.desc}</p>

                      {/* ── MINI STATS GRID ── */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        <MiniStat icon={Calendar} label="Check-in"  value={fmt(rental.rentalStartDate)} color="blue" />
                        <MiniStat icon={Calendar} label="Check-out" value={fmt(rental.rentalEndDate)}   color="blue" />
                        <MiniStat icon={Timer}    label="Duration"  value={`${days} day${days !== 1 ? 's' : ''}`} color="violet" />
                        <MiniStat icon={CreditCard} label="Rate/Day" value={pricePerDay ? `₱${pricePerDay.toLocaleString()}` : '—'} color="emerald" />
                      </div>

                      {/* Countdown for active */}
                      {isActive && (
                        <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl ${s.bg} ${s.border} border`}>
                          <Clock size={11} className={s.text} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${s.text}`}>
                            {rental.status === 'confirmed' ? countdown(rental.rentalEndDate) : 'Waiting for owner confirmation'}
                          </span>
                        </div>
                      )}

                      {/* ── BOTTOM ROW: price + actions ── */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-zinc-50 dark:border-zinc-900 gap-4">
                        <div className="flex items-end gap-4">
                          <div>
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                              ₱{rental.totalPrice?.toLocaleString()}
                            </p>
                          </div>
                          <div className="pb-0.5">
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Duration</p>
                            <p className="text-sm font-black text-zinc-500 dark:text-zinc-400">{days}d</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleChatSupport(rental)}
                            className="h-10 px-4 flex items-center gap-2 text-[9px] font-black text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 rounded-xl transition-all uppercase tracking-widest"
                          >
                            <MessageSquare size={13} /> Contact
                          </button>

                          {canCancel(rental.status) && (
                            <button
                              disabled={isBusy}
                              onClick={() => setDialog({ type: 'cancel', rental })}
                              className="h-10 px-4 flex items-center gap-2 text-[9px] font-black text-amber-600 border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-600 hover:text-white rounded-xl transition-all uppercase tracking-widest disabled:opacity-30"
                            >
                              <X size={13} /> Cancel
                            </button>
                          )}

                          {canDelete(rental.status) && (
                            <button
                              disabled={isBusy}
                              onClick={() => setDialog({ type: 'delete', rental })}
                              className="h-10 px-4 flex items-center gap-2 text-[9px] font-black text-rose-600 border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-600 hover:text-white rounded-xl transition-all uppercase tracking-widest"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          )}

                          <button
                            onClick={() => setExpandedId(isExpanded ? null : rental._id)}
                            className="h-10 w-10 flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-all"
                          >
                            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── EXPANDED DETAILS ── */}
                {isExpanded && (
                  <div className="border-t border-zinc-50 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/20 p-5 md:p-7 animate-in slide-in-from-top-2 duration-300 space-y-6">

                    {/* Section: Rental Timeline */}
                    <div>
                      <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Calendar size={10} /> Timeline Details
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-400 uppercase mb-1.5">Check-in</p>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">{fmt(rental.rentalStartDate)}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-400 uppercase mb-1.5">Check-out</p>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">{fmt(rental.rentalEndDate)}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-400 uppercase mb-1.5">Total Days</p>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">{days} day{days !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl">
                          <p className="text-[8px] font-black text-zinc-400 uppercase mb-1.5">Booked On</p>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">{fmt(rental.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Section: Payment Breakdown */}
                    <div>
                      <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <CreditCard size={10} /> Payment Breakdown
                      </h4>
                      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                          <div className="flex justify-between items-center px-5 py-3">
                            <span className="text-[10px] font-bold text-zinc-400">Rate per Day</span>
                            <span className="text-xs font-black text-zinc-900 dark:text-white">₱{pricePerDay?.toLocaleString() || '—'}</span>
                          </div>
                          <div className="flex justify-between items-center px-5 py-3">
                            <span className="text-[10px] font-bold text-zinc-400">Number of Days</span>
                            <span className="text-xs font-black text-zinc-900 dark:text-white">{days}</span>
                          </div>
                          <div className="flex justify-between items-center px-5 py-3 bg-zinc-50 dark:bg-zinc-900/50">
                            <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Total</span>
                            <span className="text-sm font-black text-zinc-900 dark:text-white">₱{rental.totalPrice?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Car Details */}
                    {rental.car && (
                      <div>
                        <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <CarFront size={10} /> Vehicle Details
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { icon: Tag,      label: 'Brand',        value: rental.car.brand       },
                            { icon: CarFront, label: 'Model',        value: rental.car.model       },
                            { icon: Settings2,label: 'License Plate',value: rental.car.licensePlate},
                            { icon: Fuel,     label: 'Fuel Type',    value: rental.car.fuelType    },
                            { icon: Settings2,label: 'Transmission', value: rental.car.transmission},
                            { icon: Users,    label: 'Capacity',     value: rental.car.seats ? `${rental.car.seats} seats` : '—' },
                          ].map(({ icon: Icon, label, value }) => value && (
                            <div key={label} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Icon size={9} className="text-zinc-400" />
                                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">{label}</p>
                              </div>
                              <p className="text-xs font-black text-zinc-900 dark:text-white uppercase">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Renter Info */}
                    {rental.personalDetails && (
                      <div>
                        <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <User size={10} /> Renter Information
                        </h4>
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                          <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                            {[
                              { icon: User,   label: 'Full Name', value: rental.personalDetails.fullName },
                              { icon: Phone,  label: 'Phone',     value: rental.personalDetails.phone    },
                              { icon: Home,   label: 'Address',   value: rental.personalDetails.address  },
                            ].map(({ icon: Icon, label, value }) => value && (
                              <div key={label} className="flex items-center justify-between px-5 py-3 gap-4">
                                <div className="flex items-center gap-2 shrink-0">
                                  <Icon size={11} className="text-zinc-400" />
                                  <span className="text-[10px] font-bold text-zinc-400">{label}</span>
                                </div>
                                <span className="text-xs font-black text-zinc-900 dark:text-white text-right truncate">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section: Rental ID */}
                    <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Rental ID</span>
                      <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 font-mono">{rental._id}</span>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── CONFIRM DIALOG ── */}
      <ConfirmDialog
        open={!!dialog}
        title={dialog?.type === 'cancel' ? 'Confirm Cancellation' : 'Permanent Removal'}
        desc={
          dialog?.type === 'cancel'
            ? `Cancel your booking for ${dialog?.rental?.car?.brand} ${dialog?.rental?.car?.model}? This cannot be undone.`
            : `Permanently delete rental record for ${dialog?.rental?.car?.brand} ${dialog?.rental?.car?.model}? This is irreversible.`
        }
        confirmLabel={dialog?.type === 'cancel' ? 'Yes, Cancel' : 'Yes, Delete'}
        confirmColor={dialog?.type === 'cancel' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-500 hover:bg-rose-600'}
        onConfirm={() => dialog?.type === 'cancel' ? handleCancel(dialog.rental) : handleDelete(dialog.rental)}
        onCancel={() => setDialog(null)}
      />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MyRentals;