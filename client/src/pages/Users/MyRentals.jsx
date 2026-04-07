import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Calendar, CarFront, BadgeCheck,
  ArrowLeft, X, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useRentalStore } from '../../store/RentalStore.js';
import { toast } from 'sonner';

// --- MINIMALIST STATUS STYLES ---
const STATUS_STYLE = {
  pending:   { bg: 'bg-amber-50 dark:bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400', label: 'Pending'   },
  approved:  { bg: 'bg-zinc-100 dark:bg-zinc-800/50',    text: 'text-zinc-900 dark:text-zinc-100',  dot: 'bg-zinc-500',  label: 'Approved'  },
  active:    { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Active'    },
  completed: { bg: 'bg-zinc-50 dark:bg-zinc-900/30',     text: 'text-zinc-400 dark:text-zinc-500',  dot: 'bg-zinc-300',  label: 'Completed' },
  cancelled: { bg: 'bg-rose-50 dark:bg-rose-500/10',     text: 'text-rose-600 dark:text-rose-400',   dot: 'bg-rose-400',    label: 'Cancelled' },
};

// --- SKELETON COMPONENT ---
const RentalSkeleton = () => (
  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 md:p-8 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-[1.25rem] shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/3" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/4" />
          </div>
          <div className="h-7 w-20 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
        </div>
        <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/2" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-900 gap-6">
          <div className="space-y-2">
            <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded w-16" />
            <div className="h-7 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-28" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
            <div className="h-11 w-11 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ConfirmDialog = ({ open, title, desc, confirmLabel, confirmColor, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">{desc}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
            Go Back
          </button>
          <button onClick={onConfirm} className={`flex-1 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-zinc-900/10 ${confirmColor}`}>
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
      state: { adminId, context: 'rental', rentalId: rental._id, carName: `${rental.car?.brand} ${rental.car?.model}` },
    });
  };

  const handleCancel = async (rental) => {
    setProcessing(p => ({ ...p, [rental._id]: true }));
    const result = await cancelRental(rental._id);
    if (result.success) {
      toast.success('Rental cancelled');
      await fetchUserRentals();
    }
    setProcessing(p => ({ ...p, [rental._id]: false }));
    setDialog(null);
  };

  const handleDelete = async (rental) => {
    setProcessing(p => ({ ...p, [rental._id]: true }));
    const result = await deleteRental(rental._id);
    if (result.success) {
      toast.success('Record removed');
      await fetchUserRentals();
    }
    setProcessing(p => ({ ...p, [rental._id]: false }));
    setDialog(null);
  };

  const FILTERS = ['all', 'pending', 'approved', 'active', 'completed', 'cancelled'];
  const filtered = filter === 'all' ? userRentals : userRentals.filter(r => r.status === filter);
  const activeCount = userRentals.filter(r => ['pending', 'approved', 'active'].includes(r.status)).length;

  const canCancel = (status) => ['pending', 'approved'].includes(status);
  const canDelete = (status) => ['completed', 'cancelled'].includes(status);

  return (
    <div className="transition-colors duration-300 pb-20">
      <div className="space-y-8">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Fleet Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
              <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-900 rounded opacity-50" />
            </div>
          ) : (
            <div>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">My Rentals</h2>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em] mt-3">
                {activeCount} Active Sessions <span className="mx-2 text-zinc-200">|</span> {userRentals.length} Total Logs
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/cars')}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all hover:opacity-90 shadow-xl shadow-zinc-900/10 active:scale-95"
          >
            New Reservation
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {isLoading ? (
             [1, 2, 3, 4].map(i => <div key={i} className="h-10 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0 animate-pulse" />)
          ) : (
            FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                  ${filter === f
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg shadow-zinc-900/10'
                    : 'bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-400'}`}
              >
                {f === 'all' ? `All Items (${userRentals.length})` : `${f} (${userRentals.filter(r => r.status === f).length})`}
              </button>
            ))
          )}
        </div>

        {/* List Logic */}
        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => <RentalSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="bg-zinc-50/50 dark:bg-zinc-950/50 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] text-center py-24">
              <BadgeCheck className="w-12 h-12 mx-auto mb-4 text-zinc-200 dark:text-zinc-800" />
              <p className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">No records found</p>
            </div>
          ) : (
            filtered.map((rental) => {
              const s = STATUS_STYLE[rental.status] || STATUS_STYLE.pending;
              const isExpanded = expandedId === rental._id;
              const isBusy = processing[rental._id];

              return (
                <div key={rental._id} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-500 group">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:border-zinc-900 dark:group-hover:border-zinc-500">
                        <CarFront size={24} className="text-zinc-900 dark:text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-black text-zinc-900 dark:text-white text-lg uppercase tracking-tight leading-none mb-2">
                              {rental.car?.brand} {rental.car?.model}
                            </h3>
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{rental.car?.licensePlate}</p>
                          </div>
                          <span className={`flex items-center gap-2 text-[9px] font-black px-4 py-2 rounded-full shrink-0 uppercase tracking-widest shadow-sm ${s.bg} ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${rental.status === 'active' ? 'animate-pulse' : ''}`} />
                            {s.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          <Calendar size={12} className="text-zinc-900 dark:text-white" />
                          {formatDate(rental.rentalStartDate)} <span className="text-zinc-200 dark:text-zinc-800">→</span> {formatDate(rental.rentalEndDate)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-900 gap-6">
                          <div>
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Settled Amount</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">₱{rental.totalPrice?.toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={() => handleChatSupport(rental)} className="h-11 px-5 flex items-center gap-2 text-[9px] font-black text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 rounded-xl transition-all uppercase tracking-widest">
                              <MessageSquare size={14} /> Contact
                            </button>

                            {canCancel(rental.status) && (
                              <button disabled={isBusy} onClick={() => setDialog({ type: 'cancel', rental })} className="h-11 px-5 flex items-center gap-2 text-[9px] font-black text-amber-600 border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-600 hover:text-white rounded-xl transition-all uppercase tracking-widest disabled:opacity-30">
                                <X size={14} /> Cancel
                              </button>
                            )}

                            {canDelete(rental.status) && (
                              <button disabled={isBusy} onClick={() => setDialog({ type: 'delete', rental })} className="h-11 px-5 flex items-center gap-2 text-[9px] font-black text-rose-600 border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-600 hover:text-white rounded-xl transition-all uppercase tracking-widest">
                                <Trash2 size={14} /> Remove
                              </button>
                            )}

                            <button onClick={() => setExpandedId(isExpanded ? null : rental._id)} className="h-11 w-11 flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-all">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-zinc-50 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/30 p-8 animate-in slide-in-from-top-2 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                          <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-5">Timeline Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
                              <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Check-in</p>
                              <p className="text-xs font-black dark:text-white">{formatDate(rental.rentalStartDate)}</p>
                            </div>
                            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
                              <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Check-out</p>
                              <p className="text-xs font-black dark:text-white">{formatDate(rental.rentalEndDate)}</p>
                            </div>
                          </div>
                        </div>
                        {rental.personalDetails && (
                          <div>
                            <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-5">Renter Information</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                <span className="text-[10px] font-bold text-zinc-400">Name</span>
                                <span className="text-xs font-black dark:text-white uppercase tracking-tight">{rental.personalDetails.fullName}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                <span className="text-[10px] font-bold text-zinc-400">Contact</span>
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
            })
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!dialog}
        title={dialog?.type === 'cancel' ? 'Confirm Cancellation' : 'Permanent Removal'}
        desc={dialog?.type === 'cancel' ? `Are you sure you want to cancel your booking for the ${dialog?.rental?.car?.brand} ${dialog?.rental?.car?.model}?` : `This will permanently delete the rental history for ${dialog?.rental?.car?.brand}. This action is irreversible.`}
        confirmLabel={dialog?.type === 'cancel' ? 'Yes, Cancel' : 'Yes, Delete'}
        confirmColor={dialog?.type === 'cancel' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-500 hover:bg-rose-600'}
        onConfirm={() => dialog?.type === 'cancel' ? handleCancel(dialog.rental) : handleDelete(dialog.rental)}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
};

export default MyRentals;