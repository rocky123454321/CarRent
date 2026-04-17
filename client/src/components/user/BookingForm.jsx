"use client"

import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowRight, X, MapPin, Calendar, Clock, User, Phone, Home, Tag, Zap } from "lucide-react";
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

const inputCls = "w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none";

const Field = ({ label, error, children, icon: Icon }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
      {Icon && <Icon size={11} />}
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const SectionCard = ({ step, title, children }) => (
  <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 flex items-center gap-3">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{step}</span>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

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

  const isFlashActive = car?.flashDeal?.isActive || car?.isFlashDeal;
  const activePrice = isFlashActive
    ? (car?.flashDeal?.discountedPrice || car?.promoPrice)
    : (car?.isPromo ? car?.promoPrice : car?.pricePerDay);

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
      rentalStartDate: new Date(pendingData.pickupDate).toISOString(),
      rentalEndDate:   new Date(pendingData.dropoffDate).toISOString(),
      totalDays: days,
      totalPrice,
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
      <div className="font-sans">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Book a Vehicle</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reserve Your Ride</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{car?.brand} {car?.model}</span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            {isFlashActive ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Zap size={10} fill="currentColor" /> ₱{activePrice?.toLocaleString()}/day
              </span>
            ) : car?.isPromo ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
                <Tag size={10} /> ₱{car?.promoPrice?.toLocaleString()}/day
              </span>
            ) : (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">₱{car?.pricePerDay?.toLocaleString()}/day</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pick-up */}
          <SectionCard step="1" title="Pick-up Details">
            <Field label="Station" icon={MapPin} error={errors.pickupLocation?.message}>
              <select {...register('pickupLocation')} className={inputCls}>
                <option value="">Select station</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" icon={Calendar} error={errors.pickupDate?.message}>
                <input type="date" {...register('pickupDate')} className={inputCls} />
              </Field>
              <Field label="Time" icon={Clock} error={errors.pickupTime?.message}>
                <select {...register('pickupTime')} className={inputCls}>
                  <option value="">Select time</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </SectionCard>

          {/* Drop-off */}
          <SectionCard step="2" title="Drop-off Details">
            <Field label="Return Station" icon={MapPin} error={errors.dropoffLocation?.message}>
              <select {...register('dropoffLocation')} className={inputCls}>
                <option value="">Select station</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" icon={Calendar} error={errors.dropoffDate?.message}>
                <input type="date" {...register('dropoffDate')} className={inputCls} />
              </Field>
              <Field label="Time" icon={Clock} error={errors.dropoffTime?.message}>
                <select {...register('dropoffTime')} className={inputCls}>
                  <option value="">Select time</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </SectionCard>

          {/* Renter Info */}
          <SectionCard step="3" title="Your Information">
            <Field label="Full Name" icon={User} error={errors.fullName?.message}>
              <input {...register('fullName')} placeholder="Juan dela Cruz" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" icon={Phone} error={errors.phone?.message}>
                <input {...register('phone')} placeholder="09XXXXXXXXX" className={inputCls} />
              </Field>
              <Field label="Address" icon={Home} error={errors.address?.message}>
                <input {...register('address')} placeholder="City, Street" className={inputCls} />
              </Field>
            </div>
          </SectionCard>

          {/* Price Summary */}
          {days > 0 && (
            <div className={`rounded-2xl p-5 flex items-center justify-between transition-all ${
              isFlashActive
                ? 'bg-amber-500'
                : 'bg-blue-600'
            }`}>
              <div>
                <p className="text-xs font-medium text-white/70 mb-0.5">Rental Period</p>
                <p className="text-lg font-bold text-white">{days} {days === 1 ? 'Day' : 'Days'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-white/70 mb-0.5">Total</p>
                <p className="text-2xl font-bold text-white">₱{totalPrice.toLocaleString()}</p>
                {isFlashActive && (
                  <p className="text-[10px] text-white/70 font-semibold flex items-center gap-1 justify-end mt-0.5">
                    <Zap size={9} fill="currentColor" /> Flash deal applied
                  </p>
                )}
                {!isFlashActive && car?.isPromo && (
                  <p className="text-[10px] text-white/70 font-semibold mt-0.5">Promo rate applied</p>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !car?.isAvailable}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>Continue to Payment <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Complete Payment</p>
              <button
                onClick={() => setShowPayment(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="p-6">
                <PaymentDemo
                  car={{ ...car, pricePerDay: activePrice }}
                  rentalDetails={{ days, pickup: pendingData?.pickupLocation, dropoff: pendingData?.dropoffLocation }}
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