import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from '../../store/authStore.js';
import { differenceInDays } from 'date-fns';
import PaymentDemo from './PaymentDemo';
import { useBookingStore } from '../../store/BookingStore.js';

const locations = ['Manila', 'Cebu', 'Davao', 'Quezon City'];
const times = ['08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

const schema = yup.object({
  pickupLocation:  yup.string().required('Required'),
  pickupDate:      yup.date().required('Required').nullable(),
  pickupTime:      yup.string().required('Required'),
  dropoffLocation: yup.string().required('Required'),
  dropoffDate:     yup.date().required('Required').nullable(),
  dropoffTime:     yup.string().required('Required'),
  fullName:        yup.string().required('Full name required'),
  phone:           yup.string().required('Phone required').matches(/^[0-9]{11}$/, 'Must be 11 digits'),
  address:         yup.string().required('Address required'),
});

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const BookingForm = ({ car, onSuccess }) => {
  const { user, isAuthenticated } = useAuthStore();
  const bookCar = useBookingStore((s) => s.bookCar);
  const [showPayment, setShowPayment]   = useState(false);
  const [pendingData, setPendingData]   = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { fullName: user?.name || '' },
  });

  const pickupDate  = watch('pickupDate');
  const dropoffDate = watch('dropoffDate');
  const days        = (pickupDate && dropoffDate)
    ? Math.max(0, differenceInDays(new Date(dropoffDate), new Date(pickupDate)) + 1)
    : 0;
  const totalPrice  = days * (car?.pricePerDay || 0);

  const onSubmit = (data) => {
    if (!isAuthenticated) return toast.error('Please login to book');
    if (new Date(data.dropoffDate) <= new Date(data.pickupDate))
      return toast.error('Return date must be after pick-up date');
    setPendingData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    if (!pendingData) return;
    const result = await bookCar(car._id, {
      rentalStartDate:  new Date(pendingData.pickupDate).toISOString(),
      rentalEndDate:    new Date(pendingData.dropoffDate).toISOString(),
      personalDetails: {
        fullName: pendingData.fullName,
        phone:    pendingData.phone,
        address:  pendingData.address,
      },
    });
    if (result.success) {
      reset();
      setShowPayment(false);
      onSuccess?.(result.rental);
    }
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Book this Car</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {car?.brand} {car?.model} · ₱{car?.pricePerDay?.toLocaleString()}/day
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Pick-up */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pick-up</p>
            <Field label="Location" error={errors.pickupLocation?.message}>
              <select {...register('pickupLocation')} className={inputCls}>
                <option value="">Select location</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" error={errors.pickupDate?.message}>
                <input type="date" {...register('pickupDate')} className={inputCls} />
              </Field>
              <Field label="Time" error={errors.pickupTime?.message}>
                <select {...register('pickupTime')} className={inputCls}>
                  <option value="">Select time</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Drop-off */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drop-off</p>
            <Field label="Location" error={errors.dropoffLocation?.message}>
              <select {...register('dropoffLocation')} className={inputCls}>
                <option value="">Select location</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" error={errors.dropoffDate?.message}>
                <input type="date" {...register('dropoffDate')} className={inputCls} />
              </Field>
              <Field label="Time" error={errors.dropoffTime?.message}>
                <select {...register('dropoffTime')} className={inputCls}>
                  <option value="">Select time</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Renter Info */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Details</p>
            <Field label="Full Name" error={errors.fullName?.message}>
              <input {...register('fullName')} placeholder="Juan dela Cruz" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register('phone')} placeholder="09123456789" className={inputCls} />
              </Field>
              <Field label="Address" error={errors.address?.message}>
                <input {...register('address')} placeholder="123 Main St, City" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Price Summary */}
          {days > 0 && (
            <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Duration</p>
                <p className="text-white font-bold">{days} {days === 1 ? 'day' : 'days'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Total</p>
                <p className="text-white font-bold text-xl">₱{totalPrice.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !car?.isAvailable}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            <ArrowRight size={16} />
          </button>

        </form>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition z-10"
            >
              <X size={16} />
            </button>
            <div className="p-6">
              <PaymentDemo
                car={car}
                rentalDetails={{
                  days,
                  pickup:  pendingData?.pickupLocation,
                  dropoff: pendingData?.dropoffLocation,
                }}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;