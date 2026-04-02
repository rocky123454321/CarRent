import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowUpDown, MapPin, User, Phone, Home, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from '../../store/authStore.js';
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import PaymentDemo from './PaymentDemo';

const pickupLocations = ['Manila', 'Cebu', 'Davao', 'Quezon City'];
const dropoffLocations = ['Manila', 'Cebu', 'Davao', 'Quezon City'];
const times = ['08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

const schema = yup.object({
  pickupLocation:  yup.string().required('Pickup location required'),
  pickupDate:      yup.date().required('Pickup date required').nullable(),
  pickupTime:      yup.string().required('Pickup time required'),
  dropoffLocation: yup.string().required('Dropoff location required'),
  dropoffDate:     yup.date().required('Dropoff date required').nullable(),
  dropoffTime:     yup.string().required('Dropoff time required'),
  fullName:        yup.string().required('Full name required'),
  phone:           yup.string().required('Phone required').matches(/^[0-9]{11}$/, '11-digit phone required'),
  address:         yup.string().required('Address required'),
});

const API_URL = import.meta.env.MODE === "development" ? "https://car-rent-nine-murex.vercel.app/" : "";

const BookingForm = ({ car, onSuccess }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [showPayment, setShowPayment] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const pickupDate  = watch('pickupDate');
  const dropoffDate = watch('dropoffDate');

  const getDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const diff = differenceInDays(new Date(dropoffDate), new Date(pickupDate)) + 1;
    return diff > 0 ? diff : 0;
  };

  const days       = getDays();
  const totalPrice = days * (car?.pricePerDay || 0);
  const showSummary = pickupDate && dropoffDate && new Date(dropoffDate) > new Date(pickupDate);

  const onSubmit = (data) => {
    if (!isAuthenticated || !user) { toast.error('Please login to book'); return; }
    if (!car?.isAvailable)          { toast.error('Car not available'); return; }
    if (new Date(dropoffDate) <= new Date(pickupDate)) {
      toast.error('Drop-off date must be after pickup'); return;
    }
    setPendingData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    if (!pendingData) return;
    const data = pendingData;

    try {
      const startDate = new Date(data.pickupDate);
      startDate.setHours(parseInt(data.pickupTime.split(':')[0]), parseInt(data.pickupTime.split(':')[1].slice(0, 2)));
      const endDate = new Date(data.dropoffDate);
      endDate.setHours(parseInt(data.dropoffTime.split(':')[0]), parseInt(data.dropoffTime.split(':')[1].slice(0, 2)));

      const response = await axios.post(`${API_URL}/api/users/${car._id}/rent`, {
        rentalStartDate: startDate.toISOString(),
        rentalEndDate:   endDate.toISOString(),
        personalDetails: {
          fullName: data.fullName,
          phone:    data.phone,
          address:  data.address,
        },
      }, { withCredentials: true });

      reset();
      setShowPayment(false);
      setPendingData(null);
      onSuccess?.(response.data.rental);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (!car) return null;

  return (
    <>
      {/* ── Booking Form Modal ── */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto p-8 my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Book This Car</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Pick-up */}
          <div className="grid grid-cols-1 w-50 md:grid-cols-2 gap-3">
  <div>
    <select {...register('pickupLocation')} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition">
      <option value="">Select location</option>
      {pickupLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
    </select>
  </div>

  <div className="flex gap-2">
    <input 
      type="date" 
      {...register('pickupDate')} 
      className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" 
    />
    <select 
      {...register('pickupTime')} 
      className="w-28 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="">Time</option>
      {times.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  </div>
</div>
          <div className="flex justify-center"><ArrowUpDown className="text-gray-400 w-5 h-5" /></div>

          {/* Drop-off */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" /> Drop-off
            </label>
            <div className="grid grid-cols-1 w-50 md:grid-cols-2 gap-3">
              <div>
                <select {...register('dropoffLocation')} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">Select location</option>
                  {dropoffLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation.message}</p>}
              </div>
              <div className="flex gap-2">
                <input type="date" {...register('dropoffDate')} className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" />
                <select {...register('dropoffTime')} className="w-32 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">Time</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {(errors.dropoffDate || errors.dropoffTime) && (
              <p className="text-red-500 text-xs mt-1">{errors.dropoffDate?.message || errors.dropoffTime?.message}</p>
            )}
          </div>

          {/* Personal details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><User className="w-4 h-4" /> Full Name</label>
              <input {...register('fullName')} defaultValue={user?.name || ''} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" placeholder="Juan dela Cruz" />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Phone className="w-4 h-4" /> Phone</label>
              <input {...register('phone')} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" placeholder="09123456789" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Home className="w-4 h-4" /> Address</label>
              <input {...register('address')} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" placeholder="123 Main St, Manila" />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
          </div>

          {/* Price summary */}
          {showSummary && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{days} day{days !== 1 ? 's' : ''}</span>
                {' '}× ₱{car.pricePerDay?.toLocaleString()}/day
              </div>
              <div className="text-lg font-bold text-blue-600">Total: ₱{totalPrice.toLocaleString()}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !car?.isAvailable}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md transition-colors duration-200"
          >
            {isSubmitting ? 'Validating...' : !car?.isAvailable ? 'Car Not Available' : 'Continue to Payment →'}
          </button>
        </form>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative my-4">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
            >
              <X size={15} />
            </button>
            <div className="p-6 pt-8">
              <PaymentDemo
                car={car}
                rentalDetails={{
                  days,
                  pickup: pendingData?.pickupLocation || '',
                  dropoff: pendingData?.dropoffLocation || '',
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