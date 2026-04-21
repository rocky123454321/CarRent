import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../../components/user/Cards';
import {
  MessageSquare, Calendar, CarFront, BadgeCheck,
  X, Trash2, ChevronDown, ChevronUp, Clock,
  CreditCard, User, Phone, Home, Tag, Fuel, Settings2,
  Users, AlertCircle, CheckCircle2, XCircle,
  Timer, ArrowRight, Receipt, Shield, Printer,
} from 'lucide-react';
import { useRentalStore } from '../../store/RentalStore.js';
import { useCarStore } from '../../store/CarStore.js';
import { toast } from 'sonner';

// ── STATUS MAP ──
const STATUS = {
  pending: {
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

const FILTERS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const fmt = (date) =>
  date ? new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const diffDays = (start, end) =>
  Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000));

const countdown = (endDate) => {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return 'Due now';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return d > 0 ? `${d}d ${h}h remaining` : `${h}h remaining`;
};

// ── SKELETONS ──
const RentalSkeleton = () => (
  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 animate-pulse space-y-5">
    <div className="flex gap-5 items-start">
      <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-[1.25rem] shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded w-40" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-24" />
          </div>
          <div className="h-7 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

// ── MINI STAT ──
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
  const total      = rentals.length;
  const confirmed  = rentals.filter(r => r.status === 'confirmed').length;
  const pending    = rentals.filter(r => r.status === 'pending').length;
  const completed  = rentals.filter(r => r.status === 'completed').length;
  const cancelled  = rentals.filter(r => r.status === 'cancelled').length;
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

// ── YOU MAY LIKE ──
const YouMayLike = ({ rentedCarIds = [] }) => {
  const { cars, getCars, isLoading } = useCarStore();

  useEffect(() => {
    if (cars.length === 0) getCars();
  }, [getCars, cars.length]);

  const suggestedCars = useMemo(() => {
    if (!cars || cars.length === 0) return [];
    return [...cars]
      .filter(car => !rentedCarIds.includes(car._id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }, [cars, rentedCarIds]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">You May Like</h3>
        <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{suggestedCars.length} items</span>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-32 w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] animate-pulse" />
          ))
        ) : (
          suggestedCars.map((car) => (
            <div key={car._id} className="w-full">
              <Cards manualData={[car]} variant="compact" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ── RECEIPT OVERLAY MODAL ──
// ─────────────────────────────────────────────
const ReceiptModal = ({ rental, onClose }) => {
  const overlayRef = useRef();

  if (!rental) return null;

  const days = diffDays(rental.rentalStartDate, rental.rentalEndDate);
  const s = getStatus(rental.status);
  const pd = rental.personalDetails || {};
  const pi = rental.paymentInfo || {};
  const bookingRef = rental.bookingRef || rental._id?.slice(-8).toUpperCase();
  const paidAt = rental.paidAt || fmt(rental.createdAt);

  const checks = [
    { label: 'Booking Reference',  value: bookingRef,               ok: !!bookingRef },
    { label: 'Payment Timestamp',  value: paidAt,                   ok: !!paidAt },
    { label: 'Cardholder on File', value: pd.fullName || '—',       ok: !!pd.fullName },
    { label: 'Card (masked)',      value: pi.cardLastFour ? `${pi.brand || ''} •••• ${pi.cardLastFour}` : '—', ok: !!pi.cardLastFour },
    { label: 'Transaction Status', value: rental.status === 'cancelled' ? 'Cancelled' : 'Verified', ok: rental.status !== 'cancelled' },
  ];
  const allOk = checks.every(c => c.ok);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Receipt – ${bookingRef}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Courier New',monospace;background:#fff;color:#111;padding:36px;max-width:460px;margin:0 auto}
        .logo{font-size:24px;font-weight:900;letter-spacing:-1.5px;margin-bottom:2px}
        .tagline{font-size:9px;color:#999;text-transform:uppercase;letter-spacing:3px;margin-bottom:4px}
        .ref-row{font-size:10px;color:#666;margin-bottom:28px;padding-bottom:12px;border-bottom:1px dashed #ddd}
        hr{border:none;border-top:1px dashed #ddd;margin:14px 0}
        .sec{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:10px}
        .row{display:flex;justify-content:space-between;font-size:12px;margin:5px 0}
        .muted{color:#888}
        .total-row{display:flex;justify-content:space-between;font-size:17px;font-weight:900;margin-top:4px}
        .stamp{text-align:center;margin-top:28px;padding:16px;border:2.5px solid ${allOk ? '#16a34a' : '#d97706'};border-radius:12px;color:${allOk ? '#16a34a' : '#d97706'};font-weight:900;font-size:13px;letter-spacing:4px;text-transform:uppercase}
        .footer{text-align:center;font-size:9px;color:#bbb;margin-top:20px;line-height:1.8}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
        .cell{background:#f5f5f5;border-radius:8px;padding:10px}
        .cell-lbl{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-bottom:4px}
        .cell-val{font-size:12px;font-weight:900}
        .cell-sub{font-size:10px;color:#888;margin-top:3px}
      </style></head><body>
      <div class="logo">DriveEasy</div>
      <div class="tagline">Official Rental Receipt</div>
      <div class="ref-row">Booking Ref: <strong>${bookingRef}</strong> &nbsp;·&nbsp; Paid: ${paidAt}</div>
      <div class="sec">Vehicle</div>
      <div class="row"><span>${rental.car?.brand || ''} ${rental.car?.model || ''}</span><span>₱${rental.car?.pricePerDay?.toLocaleString() || '—'}/day</span></div>
      <div class="row"><span class="muted">License Plate</span><span>${rental.car?.licensePlate || '—'}</span></div>
      <hr/>
      <div class="sec">Trip Details</div>
      <div class="grid2">
        <div class="cell">
          <div class="cell-lbl">Pick-up</div>
          <div class="cell-val">${rental.pickupLocation || '—'}</div>
          <div class="cell-sub">${fmt(rental.rentalStartDate)}${rental.pickupTime ? ' · ' + rental.pickupTime : ''}</div>
        </div>
        <div class="cell">
          <div class="cell-lbl">Drop-off</div>
          <div class="cell-val">${rental.dropoffLocation || '—'}</div>
          <div class="cell-sub">${fmt(rental.rentalEndDate)}${rental.dropoffTime ? ' · ' + rental.dropoffTime : ''}</div>
        </div>
      </div>
      <div class="row" style="margin-top:8px"><span class="muted">Duration</span><span>${days} day${days !== 1 ? 's' : ''}</span></div>
      <hr/>
      <div class="sec">Renter</div>
      <div class="row"><span class="muted">Name</span><span>${pd.fullName || '—'}</span></div>
      <div class="row"><span class="muted">Phone</span><span>${pd.phone || '—'}</span></div>
      <div class="row"><span class="muted">Address</span><span>${pd.address || '—'}</span></div>
      <hr/>
      <div class="sec">Payment</div>
      <div class="row"><span class="muted">Card</span><span>${pi.brand ? pi.brand + ' ' : ''}${pi.cardLastFour ? '•••• ' + pi.cardLastFour : '—'}</span></div>
      <div class="row"><span class="muted">Rate × Days</span><span>₱${rental.car?.pricePerDay?.toLocaleString() || '—'} × ${days}</span></div>
      <hr/>
      <div class="total-row"><span>TOTAL PAID</span><span>₱${rental.totalPrice?.toLocaleString()}</span></div>
      <div class="stamp">${allOk ? '✓ Payment Verified' : '⚠ Review Required'}</div>
      <div class="footer">DriveEasy · Official Receipt<br/>Keep this for your records.<br/>Transaction ID: ${rental._id}</div>
    </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        background: 'rgba(9,9,11,0.78)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div
        className="relative bg-white dark:bg-zinc-950 w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden"
        style={{ maxHeight: '92dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0">
              <Receipt size={14} className="text-white dark:text-zinc-900" />
            </div>
            <div>
              <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-none">Rental Receipt</p>
              <p className="text-[9px] font-bold text-zinc-400 font-mono mt-0.5 tracking-widest">{bookingRef}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92dvh - 145px)' }}>
          <div className="p-6 space-y-5">

            {/* Brand banner */}
            <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-black text-white dark:text-zinc-900 text-base tracking-tighter leading-none">DriveEasy</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Official Rental Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Paid At</p>
                <p className="text-[11px] font-black text-white dark:text-zinc-900 mt-0.5">{paidAt}</p>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                {rental.car?.images?.[0]
                  ? <img src={rental.car.images[0]} alt="" className="w-full h-full object-cover" />
                  : <CarFront size={18} className="text-zinc-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                  {rental.car?.brand} {rental.car?.model}
                </p>
                <p className="text-[10px] text-zinc-400 font-bold">
                  {rental.car?.licensePlate || 'N/A'} · ₱{rental.car?.pricePerDay?.toLocaleString()}/day
                </p>
              </div>
              <span className={`text-[9px] font-black px-2.5 py-1.5 rounded-xl border uppercase tracking-widest shrink-0 ${s.bg} ${s.text} ${s.border}`}>
                {s.label}
              </span>
            </div>

            {/* Trip grid */}
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Trip Details</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-blue-50 dark:bg-blue-500/8 border border-blue-100 dark:border-blue-500/15 rounded-2xl p-3.5">
                  <p className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Pick-up</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white mb-1 truncate">{rental.pickupLocation || '—'}</p>
                  <p className="text-[10px] text-zinc-400 font-bold">{fmt(rental.rentalStartDate)}</p>
                  {rental.pickupTime && <p className="text-[10px] text-zinc-400">{rental.pickupTime}</p>}
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-100 dark:border-emerald-500/15 rounded-2xl p-3.5">
                  <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2">Drop-off</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white mb-1 truncate">{rental.dropoffLocation || '—'}</p>
                  <p className="text-[10px] text-zinc-400 font-bold">{fmt(rental.rentalEndDate)}</p>
                  {rental.dropoffTime && <p className="text-[10px] text-zinc-400">{rental.dropoffTime}</p>}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Duration</span>
                <span className="text-xs font-black text-zinc-900 dark:text-white">{days} Day{days !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Renter */}
            {(pd.fullName || pd.phone || pd.address) && (
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Renter</p>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                  {[
                    { icon: User,  label: 'Full Name', value: pd.fullName },
                    { icon: Phone, label: 'Phone',     value: pd.phone    },
                    { icon: Home,  label: 'Address',   value: pd.address  },
                  ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5 gap-4">
                      <div className="flex items-center gap-2 shrink-0">
                        <Icon size={10} className="text-zinc-400" />
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">{label}</span>
                      </div>
                      <span className="text-xs font-black text-zinc-900 dark:text-white text-right truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment */}
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Payment Breakdown</p>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {pi.cardLastFour && (
                    <div className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Card</span>
                      <span className="text-xs font-black text-zinc-900 dark:text-white font-mono">
                        {pi.brand ? `${pi.brand} ` : ''}•••• {pi.cardLastFour}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Rate per Day</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">₱{rental.car?.pricePerDay?.toLocaleString() || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Days</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">× {days}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-4 bg-zinc-900 dark:bg-zinc-100">
                    <span className="text-[10px] font-black text-white dark:text-zinc-900 uppercase tracking-widest">Total Paid</span>
                    <span className="text-lg font-black text-white dark:text-zinc-900">₱{rental.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className={`rounded-2xl border p-4 space-y-2.5 ${allOk ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={12} className={allOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'} />
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400">Transaction Verification</p>
              </div>
              {checks.map(({ label, value, ok }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    {ok
                      ? <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                      : <AlertCircle  size={11} className="text-amber-400 shrink-0"   />
                    }
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400">{label}</span>
                  </div>
                  <span className={`text-[9px] font-black truncate max-w-[140px] ${ok ? 'text-zinc-800 dark:text-zinc-200' : 'text-amber-500'}`}>
                    {value}
                  </span>
                </div>
              ))}
              <div className={`pt-2.5 border-t text-center text-[9px] font-black uppercase tracking-[0.2em] ${allOk ? 'border-emerald-200 dark:border-emerald-700/30 text-emerald-600 dark:text-emerald-400' : 'border-amber-200 dark:border-amber-700/30 text-amber-600 dark:text-amber-400'}`}>
                {allOk ? '✓ Legitimate Transaction — Payment Verified' : '⚠ Some details missing — Contact support'}
              </div>
            </div>

            {/* Transaction ID */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Transaction ID</span>
              <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 font-mono truncate max-w-[160px]">{rental._id}</span>
            </div>

          </div>
        </div>

        {/* Sticky footer */}
        <div className="px-6 pb-6 pt-3 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Printer size={14} /> Print / Save Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ── MAIN PAGE ──
// ─────────────────────────────────────────────
const MyRentals = () => {
  const navigate = useNavigate();
  const { userRentals, fetchUserRentals, isLoading, cancelRental, deleteRental } = useRentalStore();
  const [expandedId,    setExpandedId]    = useState(null);
  const [dialog,        setDialog]        = useState(null);
  const [processing,    setProcessing]    = useState({});
  const [filter,        setFilter]        = useState('all');
  const [receiptRental, setReceiptRental] = useState(null);

  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);

  const rentedCarIds = userRentals.map(r => r.car?._id).filter(Boolean);

  const handleChatSupport = (rental) => {
    const adminId = rental.car?.uploadedBy?._id || rental.car?.uploadedBy;
    navigate('/chat', {
      state: { userId: adminId, context: 'rental', rentalId: rental._id, renterName: `${rental.car?.brand} ${rental.car?.model}` },
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

  const filtered = filter === 'all' ? userRentals : userRentals.filter(r => r.status === filter);
  const canCancel = (s) => ['pending', 'confirmed'].includes(s);
  const canDelete = (s) => ['completed', 'cancelled'].includes(s);

  return (
    <div className="pb-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* HEADER */}
      <div className="mb-8">
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
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">My Rentals</h1>
          </div>
        )}
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT */}
        <div className="flex-1 min-w-0 space-y-6">

          {!isLoading && userRentals.length > 0 && <SummaryBar rentals={userRentals} />}

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {isLoading
              ? [1,2,3,4,5].map(i => <div key={i} className="h-10 w-28 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0 animate-pulse" />)
              : FILTERS.map(f => {
                  const active = filter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
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

          {/* Rental list */}
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
                const s           = getStatus(rental.status);
                const isExpanded  = expandedId === rental._id;
                const isBusy      = processing[rental._id];
                const days        = diffDays(rental.rentalStartDate, rental.rentalEndDate);
                const pricePerDay = rental.car?.pricePerDay;
                const isActive    = rental.status === 'confirmed' || rental.status === 'pending';
                const carImage    = rental.car?.images?.[0] || rental.car?.image || null;

                return (
                  <div key={rental._id} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden">
                    <div className="p-5 md:p-7">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-50 dark:bg-zinc-900 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                          {carImage
                            ? <img src={carImage} alt="" className="w-full h-full object-cover" />
                            : <CarFront size={22} className="text-zinc-900 dark:text-white" />
                          }
                        </div>

                        <div className="flex-1 min-w-0">
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

                          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-4">{s.desc}</p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            <MiniStat icon={Calendar}   label="Check-in"  value={fmt(rental.rentalStartDate)} color="blue"   />
                            <MiniStat icon={Calendar}   label="Check-out" value={fmt(rental.rentalEndDate)}   color="blue"   />
                            <MiniStat icon={Timer}      label="Duration"  value={`${days} day${days !== 1 ? 's' : ''}`} color="violet" />
                            <MiniStat icon={CreditCard} label="Rate/Day"  value={pricePerDay ? `₱${pricePerDay.toLocaleString()}` : '—'} color="emerald" />
                          </div>

                          {isActive && (
                            <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl ${s.bg} ${s.border} border`}>
                              <Clock size={11} className={s.text} />
                              <span className={`text-[9px] font-black uppercase tracking-widest ${s.text}`}>
                                {rental.status === 'confirmed' ? countdown(rental.rentalEndDate) : 'Waiting for owner confirmation'}
                              </span>
                            </div>
                          )}

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
                              {/* ── RECEIPT BUTTON ── */}
                              <button
                                onClick={() => setReceiptRental(rental)}
                                className="h-10 px-4 flex items-center gap-1.5 text-[9px] font-black text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 rounded-xl transition-all uppercase tracking-widest"
                              >
                                <Receipt size={13} /> Receipt
                              </button>

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

                    {/* Expanded */}
                   {isExpanded && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    {/* Backdrop - Clickable para masara */}
    <div 
      className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
   onClick={() => setExpandedId(isExpanded ? null : rental._id)}
    />

    {/* Modal Content */}
    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
      
      {/* Sticky Header sa loob ng Overlay */}
      <div className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <h3 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.3em]">
          Booking Summary
        </h3>
        <button 
        onClick={() => setExpandedId(isExpanded ? null : rental._id)}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X size={16} className="text-zinc-500" />
        </button>
      </div>

      <div className="p-5 md:p-8 space-y-8">
        {/* Timeline Details */}
        <div>
          <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Calendar size={10} /> Timeline Details
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Check-in',   value: fmt(rental.rentalStartDate) },
              { label: 'Check-out',  value: fmt(rental.rentalEndDate)   },
              { label: 'Total Days', value: `${days} day${days !== 1 ? 's' : ''}` },
              { label: 'Booked On',  value: fmt(rental.createdAt)       },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-400 uppercase mb-1.5">{label}</p>
                <p className="text-xs font-black text-zinc-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Breakdown */}
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
              <div className="flex justify-between items-center px-5 py-3 bg-zinc-100 dark:bg-zinc-900">
                <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white">₱{rental.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        {rental.car && (
          <div>
            <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <CarFront size={10} /> Vehicle Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Tag,       label: 'Brand',         value: rental.car.brand         },
                { icon: CarFront,  label: 'Model',         value: rental.car.model         },
                { icon: Settings2, label: 'License Plate', value: rental.car.licensePlate },
                { icon: Fuel,      label: 'Fuel Type',     value: rental.car.fuelType      },
                { icon: Settings2, label: 'Transmission',  value: rental.car.transmission  },
                { icon: Users,     label: 'Capacity',      value: rental.car.seats ? `${rental.car.seats} seats` : '—' },
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

        {/* Renter Information */}
        {rental.personalDetails && (
          <div>
            <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <User size={10} /> Renter Information
            </h4>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {[
                  { icon: User,  label: 'Full Name', value: rental.personalDetails.fullName },
                  { icon: Phone, label: 'Phone',     value: rental.personalDetails.phone    },
                  { icon: Home,  label: 'Address',   value: rental.personalDetails.address  },
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

        {/* Footer/Rental ID */}
        <div className="flex items-center justify-between px-5 py-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Rental ID</span>
          <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 font-mono">{rental._id}</span>
        </div>
      </div>
    </div>
  </div>
)}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-6">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm">
            <YouMayLike rentedCarIds={rentedCarIds} />
            <div className="mt-6 p-4 rounded-3xl bg-zinc-900 dark:bg-zinc-100 text-center">
              <p className="text-[9px] font-black text-white dark:text-zinc-900 uppercase tracking-widest">Need Help?</p>
              <button className="mt-2 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-white transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECEIPT OVERLAY */}
      {receiptRental && (
        <ReceiptModal
          rental={receiptRental}
          onClose={() => setReceiptRental(null)}
        />
      )}

      {/* CONFIRM DIALOG */}
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