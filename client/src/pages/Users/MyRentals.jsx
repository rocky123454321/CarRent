import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Calendar, CarFront, BadgeCheck,
  ArrowLeft, X, Trash2, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { useRentalStore } from '../../store/RentalStore.js';
import { toast } from 'sonner';
import axios from 'axios';



const STATUS_STYLE = {
  pending:   { bg: 'bg-yellow-50',  text: 'text-yellow-700', dot: 'bg-yellow-400', label: 'Pending'   },
  approved:  { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Approved'  },
  active:    { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500',  label: 'Active'    },
  completed: { bg: 'bg-slate-100',  text: 'text-slate-600',  dot: 'bg-slate-400',  label: 'Completed' },
  cancelled: { bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-400',    label: 'Cancelled' },
};

// ── Confirm Dialog ──
const ConfirmDialog = ({ open, title, desc, confirmLabel, confirmColor, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{desc}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition ${confirmColor}`}
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
  const { 
    userRentals, 
    fetchUserRentals, 
    isLoading, 
    cancelRental, // Idagdag ito
    deleteRental  // Idagdag ito
  } = useRentalStore();
  const [expandedId,  setExpandedId]  = useState(null);
  const [dialog,      setDialog]      = useState(null); // { type, rental }
  const [processing,  setProcessing]  = useState({});
  const [filter,      setFilter]      = useState('all');

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
// --- FIXED HANDLERS ---
// --- UPDATED HANDLERS ---
const handleCancel = async (rental) => {
  setProcessing(p => ({ ...p, [rental._id]: true }));
  
  const result = await cancelRental(rental._id); // 1. Update sa Database
  
  if (result.success) {
    toast.success('Rental cancelled successfully');
    await fetchUserRentals(); // 2. Kunin ulit ang updated data para mag-reflect sa UI
  } else {
    toast.error(result.message || 'Failed to cancel rental');
  }
  
  setProcessing(p => ({ ...p, [rental._id]: false }));
  setDialog(null);
};

const handleDelete = async (rental) => {
  setProcessing(p => ({ ...p, [rental._id]: true }));
  
  const result = await deleteRental(rental._id); // 1. Delete sa Database
  
  if (result.success) {
    toast.success('Rental record deleted');
    await fetchUserRentals(); // 2. Kunin ulit ang listahan (mawawala na yung dinelete)
  } else {
    toast.error(result.message || 'Failed to delete rental');
  }
  
  setProcessing(p => ({ ...p, [rental._id]: false }));
  setDialog(null);
};

  const FILTERS = ['all', 'pending', 'approved', 'active', 'completed', 'cancelled'];

  const filtered = filter === 'all'
    ? userRentals
    : userRentals.filter(r => r.status === filter);

  const activeCount = userRentals.filter(r =>
    ['pending', 'approved', 'active'].includes(r.status)
  ).length;

  const canCancel = (status) => ['pending', 'approved'].includes(status);
  const canDelete = (status) => ['completed', 'cancelled'].includes(status);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Rentals</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {activeCount} active · {userRentals.length} total
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Rent a Car
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold border transition capitalize
                ${filter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'}`}
            >
              {f === 'all' ? `All (${userRentals.length})` : `${STATUS_STYLE[f]?.label || f} (${userRentals.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl text-center py-16">
            <BadgeCheck className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-semibold text-slate-500">No rentals found</p>
            <p className="text-xs text-slate-400 mt-1">
              {filter === 'all' ? 'Book your first car and track it here' : `No ${filter} rentals`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/')}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
              >
                Browse Cars
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((rental) => {
              const s          = STATUS_STYLE[rental.status] || STATUS_STYLE.pending;
              const isExpanded = expandedId === rental._id;
              const isBusy     = processing[rental._id];

              return (
                <div
                  key={rental._id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-100 transition"
                >
                  {/* Main Row */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-4">

                      {/* Icon */}
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <CarFront size={22} className="text-blue-500" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {rental.car?.brand} {rental.car?.model}
                            </p>
                            <p className="text-xs text-slate-400">{rental.car?.licensePlate}</p>
                          </div>
                          <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                          <Calendar size={11} />
                          {formatDate(rental.rentalStartDate)} → {formatDate(rental.rentalEndDate)}
                        </div>

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <p className="text-base font-bold text-slate-900">
                            ₱{rental.totalPrice?.toLocaleString()}
                            <span className="text-xs font-normal text-slate-400 ml-1">total</span>
                          </p>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Chat */}
                            <button
                              onClick={() => handleChatSupport(rental)}
                              className="flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                            >
                              <MessageSquare size={12} /> Chat
                            </button>

                            {/* Cancel — only pending/approved */}
                            {canCancel(rental.status) && (
                              <button
                                disabled={isBusy}
                                onClick={() => setDialog({ type: 'cancel', rental })}
                                className="flex items-center gap-1 text-xs font-semibold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                              >
                                <X size={12} /> Cancel
                              </button>
                            )}

                            {/* Delete — only completed/cancelled */}
                            {canDelete(rental.status) && (
                              <button
                                disabled={isBusy}
                                onClick={() => setDialog({ type: 'delete', rental })}
                                className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            )}

                            {/* Expand toggle */}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : rental._id)}
                              className="flex items-center gap-1 text-xs font-semibold text-slate-500 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
                            >
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Rental Details</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: 'Pick-up',     value: formatDate(rental.rentalStartDate) },
                          { label: 'Return',      value: formatDate(rental.rentalEndDate)   },
                          { label: 'Plate No.',   value: rental.car?.licensePlate           },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white border border-slate-200 rounded-xl px-3 py-2">
                            <p className="text-[10px] text-slate-400 font-medium mb-0.5">{label}</p>
                            <p className="text-xs font-semibold text-slate-700">{value || '—'}</p>
                          </div>
                        ))}
                      </div>

                      {/* Personal details if available */}
                      {rental.personalDetails && (
                        <>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-3 mb-2">Personal Details</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { label: 'Full Name', value: rental.personalDetails?.fullName },
                              { label: 'Phone',     value: rental.personalDetails?.phone    },
                              { label: 'Address',   value: rental.personalDetails?.address  },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-white border border-slate-200 rounded-xl px-3 py-2">
                                <p className="text-[10px] text-slate-400 font-medium mb-0.5">{label}</p>
                                <p className="text-xs font-semibold text-slate-700 truncate">{value || '—'}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={!!dialog}
        title={dialog?.type === 'cancel' ? 'Cancel this rental?' : 'Delete this record?'}
        desc={
          dialog?.type === 'cancel'
            ? `Are you sure you want to cancel your booking for ${dialog?.rental?.car?.brand} ${dialog?.rental?.car?.model}? This cannot be undone.`
            : `This will permanently remove the rental record for ${dialog?.rental?.car?.brand} ${dialog?.rental?.car?.model}.`
        }
        confirmLabel={dialog?.type === 'cancel' ? 'Yes, Cancel' : 'Yes, Delete'}
        confirmColor={dialog?.type === 'cancel' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}
        onConfirm={() => dialog?.type === 'cancel' ? handleCancel(dialog.rental) : handleDelete(dialog.rental)}
        onCancel={() => setDialog(null)}
      />
    </>
  );
};

export default MyRentals;