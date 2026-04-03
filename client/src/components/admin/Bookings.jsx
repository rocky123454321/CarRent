import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './../../store/authStore.js';
import { useRentalStore } from './../../store/RentalStore.js';
import { MessageSquare, Calendar, CarFront, BadgeCheck, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const BADGE_CLASS = {
  pending:   "bg-amber-50 text-amber-700 border border-amber-100",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-100",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border border-red-100",
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
  }, [fetchRentals]); // stable ref

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="max-w-7xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className="space-y-1">
        <p className="text-indigo-600 font-semibold text-sm tracking-widest uppercase">Management</p>
        <h1 className="text-3xl font-black text-slate-900">Bookings</h1>
        {!loading && <p className="text-slate-500">{rentals.length} total rental{rentals.length !== 1 ? "s" : ""}</p>}
      </div>

      {/* ── DESKTOP TABLE (md+) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-xl" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["ID", "Car", "Renter", "Dates", "Status", "Total", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center py-16">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                          <BadgeCheck size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">No bookings yet</p>
                      </div>
                    </td>
                  </tr>
                ) : rentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-slate-50/60 transition-colors">

                    {/* ID */}
                    <td className="px-5 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      #{rental._id.slice(-6)}
                    </td>

                    {/* Car */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <CarFront size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{rental.car?.brand} {rental.car?.model}</p>
                          <p className="text-xs text-slate-400">{rental.car?.licensePlate}</p>
                        </div>
                      </div>
                    </td>

                    {/* Renter */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-slate-500">{rental.user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{rental.user?.name}</p>
                          <p className="text-xs text-slate-400">{rental.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-600">
                          {formatDate(rental.rentalStartDate)} — {formatDate(rental.rentalEndDate)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${BADGE_CLASS[rental.status] || "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                        {rental.status}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-800">
                      ₱{rental.totalPrice?.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition"
                        >
                          <MessageSquare size={13} /> Chat
                        </button>
                        <div className="relative">
                          <select
                            value={rental.status}
                            disabled={updating[rental._id]}
                            onChange={(e) => updateStatus(rental._id, e.target.value)}
                            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition cursor-pointer disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-14 rounded-md" />
            </div>
          ))
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <BadgeCheck size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No bookings yet</p>
          </div>
        ) : rentals.map((rental) => (
          <div key={rental._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 hover:shadow-md transition-all duration-200">

            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">#{rental._id.slice(-6)}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${BADGE_CLASS[rental.status] || "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                {rental.status}
              </span>
            </div>

            {/* Car */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <CarFront size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{rental.car?.brand} {rental.car?.model}</p>
                <p className="text-xs text-slate-400">{rental.car?.licensePlate}</p>
              </div>
            </div>

            {/* Renter */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-slate-500">{rental.user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{rental.user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{rental.user?.email}</p>
              </div>
            </div>

            {/* Dates + Total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span className="text-xs text-slate-500">
                  {formatDate(rental.rentalStartDate)} — {formatDate(rental.rentalEndDate)}
                </span>
              </div>
              <span className="font-black text-slate-900 text-sm">₱{rental.totalPrice?.toLocaleString()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => navigate('/admin/chat', { state: { userId: rental.user._id, renterName: rental.user?.name } })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition"
              >
                <MessageSquare size={13} /> Chat
              </button>
              <div className="relative flex-1">
                <select
                  value={rental.status}
                  disabled={updating[rental._id]}
                  onChange={(e) => updateStatus(rental._id, e.target.value)}
                  className="w-full appearance-none pl-3 pr-7 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition cursor-pointer disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;