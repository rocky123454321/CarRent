import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowRight, X, MapPin, Calendar, Clock, CreditCard } from "lucide-react";
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

// Reusable Field Component with Dark Mode Support
const Field = ({ label, error, children, icon: Icon }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-1.5 ml-1">
      {Icon && <Icon size={12} className="text-slate-400" />}
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
    </div>
    {children}
    {error && <p className="text-[10px] text-red-500 font-bold ml-1 italic">{error}</p>}
  </div>
);

const inputCls = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

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
        phone:     pendingData.phone,
        address:   pendingData.address,
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
      <div className="p-1 transition-colors duration-300">
        {/* Header */}
        <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Reservation</h3>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
              {car?.brand} {car?.model} <span className="text-slate-300 dark:text-slate-700 mx-1">|</span> ₱{car?.pricePerDay?.toLocaleString()}/day
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-2xl">
            <CreditCard className="text-blue-600" size={20} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Section: Pick-up */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Pick-up Details</p>
            </div>
            
            <Field label="Location" icon={MapPin} error={errors.pickupLocation?.message}>
              <select {...register('pickupLocation')} className={inputCls}>
                <option value="">Select location</option>
                {locations.map(l => <option key={l} value={l} className="dark:bg-slate-900">{l}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" icon={Calendar} error={errors.pickupDate?.message}>
                <input type="date" {...register('pickupDate')} className={inputCls} />
              </Field>
              <Field label="Time" icon={Clock} error={errors.pickupTime?.message}>
                <select {...register('pickupTime')} className={inputCls}>
                  <option value="">Select time</option>
                  {times.map(t => <option key={t} value={t} className="dark:bg-slate-900">{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Section: Drop-off */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Drop-off Details</p>
            </div>
            
            <Field label="Location" icon={MapPin} error={errors.dropoffLocation?.message}>
              <select {...register('dropoffLocation')} className={inputCls}>
                <option value="">Select location</option>
                {locations.map(l => <option key={l} value={l} className="dark:bg-slate-900">{l}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" icon={Calendar} error={errors.dropoffDate?.message}>
                <input type="date" {...register('dropoffDate')} className={inputCls} />
              </Field>
              <Field label="Time" icon={Clock} error={errors.dropoffTime?.message}>
                <select {...register('dropoffTime')} className={inputCls}>
                  <option value="">Select time</option>
                  {times.map(t => <option key={t} value={t} className="dark:bg-slate-900">{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Renter Info */}
          <div className="px-1 space-y-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Renter Identity</p>
            <Field label="Full Name" error={errors.fullName?.message}>
              <input {...register('fullName')} placeholder="Juan dela Cruz" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register('phone')} placeholder="09123456789" className={inputCls} />
              </Field>
              <Field label="City Address" error={errors.address?.message}>
                <input {...register('address')} placeholder="123 Main St, City" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Price Summary Panel */}
          {days > 0 && (
            <div className="bg-slate-900 dark:bg-blue-600 rounded-3xl p-6 flex items-center justify-between shadow-xl shadow-blue-600/10 transition-all animate-in zoom-in-95">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Duration</p>
                <p className="text-white font-black text-lg">{days} {days === 1 ? 'DAY' : 'DAYS'}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Grand Total</p>
                <p className="text-white font-black text-2xl tracking-tighter">₱{totalPrice.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !car?.isAvailable}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Validating...</span>
            ) : (
              <>
                Continue to Payment
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>
      </div>

      {/* Payment Modal Wrapper */}
      {showPayment && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-hidden transition-all duration-300">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-full text-slate-500 transition-all z-20 shadow-sm"
            >
              <X size={20} />
            </button>
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="p-8 pt-12">
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
        </div>
      )}
    </>
  );
};

export default BookingForm;