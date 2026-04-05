import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Calendar, CarFront, BadgeCheck,
  ArrowLeft, X, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useRentalStore } from '../../store/RentalStore.js';
import { toast } from 'sonner';

// --- UPDATED STATUS STYLES FOR DARK MODE ---
const STATUS_STYLE = {
  pending:   { bg: 'bg-yellow-50 dark:bg-yellow-900/20',   text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-400', label: 'Pending'   },
  approved:  { bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-700 dark:text-blue-400',   dot: 'bg-blue-500',   label: 'Approved'  },
  active:    { bg: 'bg-green-50 dark:bg-green-900/20',    text: 'text-green-700 dark:text-green-400',  dot: 'bg-green-500',  label: 'Active'    },
  completed: { bg: 'bg-slate-100 dark:bg-slate-800/50',  text: 'text-slate-600 dark:text-slate-400',  dot: 'bg-slate-400',  label: 'Completed' },
  cancelled: { bg: 'bg-red-50 dark:bg-red-900/20',      text: 'text-red-600 dark:text-red-400',     dot: 'bg-red-400',    label: 'Cancelled' },
};

// ── Confirm Dialog with Dark Mode ──
const ConfirmDialog = ({ open, title, desc, confirmLabel, confirmColor, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{desc}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition shadow-lg shadow-black/10 ${confirmColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyRentals = () => {
  const navigate = useNavigate();
  const { userRentals, fetchUserRentals, isLoading, cancelRental, deleteRental } = useRentalStore();
  const [expandedId, setExpandedId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [processing, setProcessing] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchUserRentals(); }, [fetchUserRentals]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleChatSupport = (rental) => {
    const adminId = rental.car?.uploadedBy?._id || rental.car?.uploadedBy;
    navigate('/chat', {
      state: {
        adminId,
        context: 'rental',
        rentalId: rental._id,
        carName: `${rental.car?.brand} ${rental.car?.model}`,
      },
    });
  };

  const handleCancel = async (rental) => {
    setProcessing(p => ({ ...p, [rental._id]: true }));
    const result = await cancelRental(rental._id);
    if (result.success) {
      toast.success('Rental cancelled successfully');
      await fetchUserRentals();
    } else {
      toast.error(result.message || 'Failed to cancel rental');
    }
    setProcessing(p => ({ ...p, [rental._id]: false }));
    setDialog(null);
  };

  const handleDelete = async (rental) => {
    setProcessing(p => ({ ...p, [rental._id]: true }));
    const result = await deleteRental(rental._id);
    if (result.success) {
      toast.success('Rental record deleted');
      await fetchUserRentals();
    } else {
      toast.error(result.message || 'Failed to delete rental');
    }
    setProcessing(p => ({ ...p, [rental._id]: false }));
    setDialog(null);
  };

  const FILTERS = ['all', 'pending', 'approved', 'active', 'completed', 'cancelled'];
  const filtered = filter === 'all' ? userRentals : userRentals.filter(r => r.status === filter);
  const activeCount = userRentals.filter(r => ['pending', 'approved', 'active'].includes(r.status)).length;

  const canCancel = (status) => ['pending', 'approved'].includes(status);
  const canDelete = (status) => ['completed', 'cancelled'].includes(status);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">My Rentals</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
              {activeCount} active · {userRentals.length} total records
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            Rent a Car
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all capitalize
                ${filter === f
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-[#0a0a0a] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-900'}`}
            >
              {f === 'all' ? `All (${userRentals.length})` : `${STATUS_STYLE[f]?.label || f} (${userRentals.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-3xl text-center py-20">
            <BadgeCheck className="w-16 h-16 mx-auto mb-4 text-slate-100 dark:text-slate-800" />
            <p className="text-base font-bold text-slate-900 dark:text-white">No rentals found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto">
              {filter === 'all' ? 'Book your first car and track it here.' : `You don't have any ${filter} rentals.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((rental) => {
              const s = STATUS_STYLE[rental.status] || STATUS_STYLE.pending;
              const isExpanded = expandedId === rental._id;
              const isBusy = processing[rental._id];

              return (
                <div
                  key={rental._id}
                  className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/20 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                      {/* Car Icon */}
                      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                        <CarFront size={28} className="text-blue-500" />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">
                              {rental.car?.brand} {rental.car?.model}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">{rental.car?.licensePlate}</p>
                          </div>
                          <span className={`flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full shrink-0 uppercase tracking-wider shadow-sm ${s.bg} ${s.text}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${s.dot}`} />
                            {s.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Calendar size={14} className="text-blue-500" />
                          {formatDate(rental.rentalStartDate)} <span className="text-slate-300 dark:text-slate-700">→</span> {formatDate(rental.rentalEndDate)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5 pt-5 border-t border-slate-50 dark:border-white/5 gap-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">₱{rental.totalPrice?.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleChatSupport(rental)}
                              className="flex items-center gap-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-all"
                            >
                              <MessageSquare size={14} /> CHAT
                            </button>

                            {canCancel(rental.status) && (
                              <button
                                disabled={isBusy}
                                onClick={() => setDialog({ type: 'cancel', rental })}
                                className="flex items-center gap-2 text-[11px] font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                              >
                                <X size={14} /> CANCEL
                              </button>
                            )}

                            {canDelete(rental.status) && (
                              <button
                                disabled={isBusy}
                                onClick={() => setDialog({ type: 'delete', rental })}
                                className="flex items-center gap-2 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-all"
                              >
                                <Trash2 size={14} /> DELETE
                              </button>
                            )}

                            <button
                              onClick={() => setExpandedId(isExpanded ? null : rental._id)}
                              className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-all"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              DETAILS
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/50 p-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Rental Period</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-3 rounded-2xl shadow-sm">
                              <p className="text-[9px] font-bold text-blue-500 uppercase mb-1">Pick-up</p>
                              <p className="text-xs font-black dark:text-white">{formatDate(rental.rentalStartDate)}</p>
                            </div>
                            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-3 rounded-2xl shadow-sm">
                              <p className="text-[9px] font-bold text-blue-500 uppercase mb-1">Return</p>
                              <p className="text-xs font-black dark:text-white">{formatDate(rental.rentalEndDate)}</p>
                            </div>
                          </div>
                        </div>

                        {rental.personalDetails && (
                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-white/5">
                                <span className="text-[11px] font-bold text-slate-400">Full Name</span>
                                <span className="text-xs font-black dark:text-white">{rental.personalDetails.fullName}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-white/5">
                                <span className="text-[11px] font-bold text-slate-400">Phone</span>
                                <span className="text-xs font-black dark:text-white">{rental.personalDetails.phone}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!dialog}
        title={dialog?.type === 'cancel' ? 'Cancel Rental?' : 'Delete Record?'}
        desc={
          dialog?.type === 'cancel'
            ? `You are about to cancel your booking for ${dialog?.rental?.car?.brand} ${dialog?.rental?.car?.model}. Proceed?`
            : `Are you sure you want to remove this record? This action cannot be reversed.`
        }
        confirmLabel={dialog?.type === 'cancel' ? 'YES, CANCEL' : 'YES, DELETE'}
        confirmColor={dialog?.type === 'cancel' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}
        onConfirm={() => dialog?.type === 'cancel' ? handleCancel(dialog.rental) : handleDelete(dialog.rental)}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
};

export default MyRentals;