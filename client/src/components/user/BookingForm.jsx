import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowRight, X, MapPin, Calendar, Clock, User, Phone, Home, Tag } from "lucide-react"; // Added Tag icon
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

const Field = ({ label, error, children, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 ml-1">
      {Icon && <Icon size={12} className="text-zinc-400 dark:text-zinc-500" />}
      <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">{label}</label>
    </div>
    {children}
    {error && <p className="text-[9px] text-red-500 font-bold ml-1 uppercase tracking-tighter italic">! {error}</p>}
  </div>
);

const inputCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-4 text-[13px] text-zinc-900 dark:text-white font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white transition-all appearance-none";

const BookingForm = ({ car, onSuccess }) => {
  const { user, isAuthenticated } = useAuthStore();
  const bookCar = useBookingStore((s) => s.bookCar);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { fullName: user?.name || '' },
  });

  const pickupDate  = watch('pickupDate');
  const dropoffDate = watch('dropoffDate');
  
  const days = (pickupDate && dropoffDate)
    ? Math.max(1, differenceInDays(new Date(dropoffDate), new Date(pickupDate)) + 1)
    : 0;

  // ✅ PROMO UPDATE: Calculate price based on promo status
  const activePrice = car?.isPromo ? car?.promoPrice : car?.pricePerDay;
  const totalPrice = days * (activePrice || 0);

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
      totalDays: days,
      totalPrice: totalPrice,
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
      <div className="p-1 transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="mb-10 border-b border-zinc-100 dark:border-zinc-900 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-5 bg-zinc-900 dark:bg-zinc-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Fleet Booking</p>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none italic">
            SECURE YOUR <span className="text-zinc-300 dark:text-zinc-700">RIDE.</span>
          </h3>
          
          {/* ✅ PROMO UPDATE: Header price display */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
              {car?.brand} {car?.model} <span className="opacity-30 mx-1">|</span>
            </p>
            <div className="flex items-center gap-2">
               {car?.isPromo ? (
                 <>
                   <span className="text-rose-500 font-black text-[11px] flex items-center gap-1 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">
                     <Tag size={10} /> ₱{car?.promoPrice?.toLocaleString()}
                   </span>
                   <span className="text-zinc-300 dark:text-zinc-600 line-through text-[10px] font-bold">
                     ₱{car?.pricePerDay?.toLocaleString()}
                   </span>
                 </>
               ) : (
                 <span className="text-zinc-900 dark:text-white font-black text-[11px]">
                   ₱{car?.pricePerDay?.toLocaleString()} / DAY
                 </span>
               )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          {/* Section: Pick-up */}
          <div className="bg-white dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
                <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em]">01. Pick-up Data</p>
              </div>
            </div>
            
            <Field label="STATION" icon={MapPin} error={errors.pickupLocation?.message}>
              <select {...register('pickupLocation')} className={inputCls}>
                <option value="">Select Station...</option>
                {locations.map(l => <option key={l} value={l} className="dark:bg-zinc-900">{l}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="DATE" icon={Calendar} error={errors.pickupDate?.message}>
                <input type="date" {...register('pickupDate')} className={inputCls} />
              </Field>
              <Field label="SCHEDULE" icon={Clock} error={errors.pickupTime?.message}>
                <select {...register('pickupTime')} className={inputCls}>
                  <option value="">Time...</option>
                  {times.map(t => <option key={t} value={t} className="dark:bg-zinc-900">{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Section: Drop-off */}
          <div className="bg-white dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">02. Drop-off Data</p>
              </div>
            </div>
            
            <Field label="RETURN STATION" icon={MapPin} error={errors.dropoffLocation?.message}>
              <select {...register('dropoffLocation')} className={inputCls}>
                <option value="">Select Station...</option>
                {locations.map(l => <option key={l} value={l} className="dark:bg-zinc-900">{l}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="DATE" icon={Calendar} error={errors.dropoffDate?.message}>
                <input type="date" {...register('dropoffDate')} className={inputCls} />
              </Field>
              <Field label="SCHEDULE" icon={Clock} error={errors.dropoffTime?.message}>
                <select {...register('dropoffTime')} className={inputCls}>
                  <option value="">Time...</option>
                  {times.map(t => <option key={t} value={t} className="dark:bg-zinc-900">{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Renter Info */}
          <div className="px-2 space-y-6">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] italic">03. Renter Credentials</p>
            <Field label="LEGAL NAME" icon={User} error={errors.fullName?.message}>
              <input {...register('fullName')} placeholder="FULL NAME" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="PHONE LINE" icon={Phone} error={errors.phone?.message}>
                <input {...register('phone')} placeholder="09XXXXXXXXX" className={inputCls} />
              </Field>
              <Field label="ADDRESS" icon={Home} error={errors.address?.message}>
                <input {...register('address')} placeholder="CITY, STREET" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Price Summary Panel */}
          {days > 0 && (
            <div className="bg-zinc-900 dark:bg-white rounded-[2rem] p-8 flex items-center justify-between shadow-2xl transition-all animate-in slide-in-from-bottom-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em]">RENTAL PERIOD</p>
                <p className="text-white dark:text-zinc-950 font-black text-xl italic">{days} {days === 1 ? 'UNIT DAY' : 'UNIT DAYS'}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em]">TOTAL SETTLEMENT</p>
                <div className="flex flex-col items-end">
                   {/* ✅ PROMO UPDATE: Total Price Display */}
                   <p className="text-white dark:text-zinc-950 font-black text-3xl tracking-tighter">₱{totalPrice.toLocaleString()}</p>
                   {car?.isPromo && (
                     <p className="text-[8px] text-rose-500 font-black tracking-widest uppercase">PROMO RATE APPLIED</p>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !car?.isAvailable}
            className="w-full bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-300 text-white dark:text-zinc-950 font-black py-5 rounded-[1.5rem] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em]"
          >
            {isSubmitting ? (
              <span className="animate-pulse">SYNCHRONIZING...</span>
            ) : (
              <>
                CONTINUE TO SETTLEMENT
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>
      </div>

      {/* Payment Modal Wrapper */}
      {showPayment && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[3rem] shadow-2xl w-full max-w-lg relative overflow-hidden transition-all duration-300">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 rounded-full text-zinc-400 transition-all z-20"
            >
              <X size={20} />
            </button>
            <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="p-10 pt-16">
                <PaymentDemo
                  car={{
                    ...car,
                    pricePerDay: activePrice // ✅ PROMO UPDATE: Ensure payment demo shows the promo price
                  }}
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