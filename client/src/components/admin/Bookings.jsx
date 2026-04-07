import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './../../store/authStore.js';
import { useRentalStore } from './../../store/RentalStore.js';
import { MessageSquare, Calendar, CarFront, BadgeCheck, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Updated Badge Colors to match the Zinc/Premium theme
const BADGE_CLASS = {
  pending:   "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50",
  confirmed: "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  cancelled: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
};

const Bookings = () => {
  const { user }     = useAuthStore();
  const navigate     = useNavigate();
  const rentals      = useRentalStore((s) => s.adminRentals);
  const loading      = useRentalStore((s) => s.isLoading);
  const updating     = useRentalStore((s) => s.updating);
  const fetchRentals = useRentalStore((s) => s.fetchAdminRentals);
  const updateStatus = useRentalStore((s) => s.updateRentalStatus);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'renter') fetchRentals();
  }, [fetchRentals, user?.role]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="mt-18  lg:ml-5 max-w-7xl space-y-6 transition-colors duration-300">

      {/* Header - Matching Landing Page Typography */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Management
          </p>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white">Bookings</h1>
        {!loading && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {rentals.length} total rental{rentals.length !== 1 ? "s" : ""} recorded
          </p>
        )}
      </div>

      {/* ── DESKTOP TABLE (md+) ── */}
      <div className="hidden md:block bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
                <Skeleton className="h-4 flex-1 bg-zinc-100 dark:bg-zinc-900" />
                <Skeleton className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
                  {["ID", "Car", "Renter", "Dates", "Status", "Total", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 bg-white dark:bg-zinc-950">
                        <BadgeCheck size={40} className="text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-400 dark:text-zinc-600 text-xs font-medium">No bookings found</p>
                    </td>
                  </tr>
                ) : rentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                      #{rental._id.slice(-6)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800">
                          <CarFront size={16} className="text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{rental.car?.brand} {rental.car?.model}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-tighter">{rental.car?.licensePlate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center font-bold text-white dark:text-zinc-900 text-[10px]">
                          {rental.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white text-xs">{rental.user?.name}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{rental.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-zinc-300 dark:text-zinc-600" />
                        <span className="text-[11px] font-medium">{formatDate(rental.rentalStartDate)} — {formatDate(rental.rentalEndDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${BADGE_CLASS[rental.status] || "bg-zinc-50 text-zinc-400 border-zinc-100"}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-bold text-zinc-900 dark:text-white">
                      ₱{rental.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all"
                        >
                          <MessageSquare size={14} />
                        </button>
                        <div className="relative">
                          <select
                            value={rental.status}
                            disabled={updating[rental._id]}
                            onChange={(e) => updateStatus(rental._id, e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-zinc-900/10 disabled:opacity-50 cursor-pointer transition-all"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MOBILE CARDS (< md) ── */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 p-5 space-y-4">
              <div className="flex justify-between"><Skeleton className="h-4 w-16 bg-zinc-100 dark:bg-zinc-900" /><Skeleton className="h-4 w-20 bg-zinc-100 dark:bg-zinc-900" /></div>
              <Skeleton className="h-10 w-full bg-zinc-100 dark:bg-zinc-900" />
            </div>
          ))
        ) : rentals.map((rental) => (
          <div key={rental._id} className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-400 uppercase">#{rental._id.slice(-6)}</span>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${BADGE_CLASS[rental.status]}`}>
                {rental.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0">
                <CarFront size={18} className="text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{rental.car?.brand} {rental.car?.model}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-widest">{rental.car?.licensePlate}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-[9px] font-bold text-white dark:text-zinc-900">
                  {rental.user?.name?.charAt(0).toUpperCase()}
                </div>
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{rental.user?.name}</p>
              </div>
              <div className="flex items-center justify-between text-[9px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
                <div className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(rental.rentalStartDate)} — {formatDate(rental.rentalEndDate)}</div>
                <div className="font-bold text-zinc-900 dark:text-white text-xs">₱{rental.totalPrice?.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all"
              >
                <MessageSquare size={14} /> Chat
              </button>
              <div className="relative flex-1">
                <select
                  value={rental.status}
                  disabled={updating[rental._id]}
                  onChange={(e) => updateStatus(rental._id, e.target.value)}
                  className="w-full appearance-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:ring-1 focus:ring-zinc-900/10"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;