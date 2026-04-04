import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './../../store/authStore.js';
import { useRentalStore } from './../../store/RentalStore.js';
import { MessageSquare, Calendar, CarFront, BadgeCheck, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const BADGE_CLASS = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50",
  cancelled: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50",
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
    <div className="max-w-7xl space-y-6 transition-colors duration-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div className="space-y-1">
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-widest uppercase">Management</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Bookings</h1>
        {!loading && <p className="text-slate-500 dark:text-slate-400">{rentals.length} total rental{rentals.length !== 1 ? "s" : ""}</p>}
      </div>

      {/* ── DESKTOP TABLE (md+) ── */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-xl dark:bg-slate-800" />
                <Skeleton className="h-4 w-32 rounded-md dark:bg-slate-800" />
                <Skeleton className="h-4 w-20 rounded-md dark:bg-slate-800" />
                <Skeleton className="h-4 w-24 rounded-md dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  {["ID", "Car", "Renter", "Dates", "Status", "Total", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center py-20 bg-white dark:bg-slate-900">
                        <BadgeCheck size={40} className="text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                        <p className="text-slate-400 dark:text-slate-600 font-medium">No bookings found</p>
                      </div>
                    </td>
                  </tr>
                ) : rentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-5 font-mono text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      #{rental._id.slice(-6)}
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50">
                          <CarFront size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{rental.car?.brand} {rental.car?.model}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{rental.car?.licensePlate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs">
                          {rental.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{rental.user?.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{rental.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="opacity-40" />
                        <span className="text-xs font-medium">{formatDate(rental.rentalStartDate)} — {formatDate(rental.rentalEndDate)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${BADGE_CLASS[rental.status] || "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-700"}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap font-black text-slate-900 dark:text-white">
                      ₱{rental.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                          className="p-2 rounded-xl text-blue-600 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <div className="relative">
                          <select
                            value={rental.status}
                            disabled={updating[rental._id]}
                            onChange={(e) => updateStatus(rental._id, e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 cursor-pointer transition-all"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-4">
              <div className="flex justify-between"><Skeleton className="h-4 w-16 dark:bg-slate-800" /><Skeleton className="h-4 w-20 dark:bg-slate-800" /></div>
              <Skeleton className="h-10 w-full dark:bg-slate-800" />
            </div>
          ))
        ) : rentals.map((rental) => (
          <div key={rental._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">#{rental._id.slice(-6)}</span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${BADGE_CLASS[rental.status]}`}>
                {rental.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center shrink-0">
                <CarFront size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{rental.car?.brand} {rental.car?.model}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{rental.car?.licensePlate}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                  {rental.user?.name?.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{rental.user?.name}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(rental.rentalStartDate)} — {formatDate(rental.rentalEndDate)}</div>
                <div className="font-black text-slate-900 dark:text-white text-sm">₱{rental.totalPrice?.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800"
              >
                <MessageSquare size={14} /> Chat
              </button>
              <div className="relative flex-1">
                <select
                  value={rental.status}
                  disabled={updating[rental._id]}
                  onChange={(e) => updateStatus(rental._id, e.target.value)}
                  className="w-full appearance-none px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;