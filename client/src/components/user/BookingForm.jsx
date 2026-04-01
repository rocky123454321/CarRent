import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowUpDown, MapPin, Calendar, Clock, User, Phone, Home } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from '../../store/authStore.js';
import axios from 'axios';
import { differenceInDays } from 'date-fns';

const pickupLocations = ['Manila', 'Cebu', 'Davao', 'Quezon City'];
const dropoffLocations = ['Manila', 'Cebu', 'Davao', 'Quezon City'];
const times = ['08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

const schema = yup.object({
  pickupLocation: yup.string().required('Pickup location required'),
  pickupDate: yup.date().required('Pickup date required').nullable(),
  pickupTime: yup.string().required('Pickup time required'),
  dropoffLocation: yup.string().required('Dropoff location required'),
  dropoffDate: yup.date().required('Dropoff date required').nullable(),
  dropoffTime: yup.string().required('Dropoff time required'),
  fullName: yup.string().required('Full name required'),
  phone: yup.string().required('Phone required').matches(/^[0-9]{11}$/, '11-digit phone required'),
  address: yup.string().required('Address required')
});

const BookingForm = ({ car, onSuccess }) => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const pickupDate = watch('pickupDate');
  const dropoffDate = watch('dropoffDate');

  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

  const getdays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const diff = differenceInDays(new Date(dropoffDate), new Date(pickupDate)) + 1;
    return diff > 0 ? diff : 0;
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to book');
      return;
    }

    if (!car?.isAvailable) {
      toast.error('Car not available');
      return;
    }

    if (pickupDate && dropoffDate && new Date(dropoffDate) <= new Date(pickupDate)) {
      toast.error('Drop-off date must be after pickup');
      return;
    }

    try {
      const startDate = new Date(pickupDate);
      startDate.setHours(
        parseInt(data.pickupTime.split(':')[0]),
        parseInt(data.pickupTime.split(':')[1].slice(0, 2))
      );

      const endDate = new Date(dropoffDate);
      endDate.setHours(
        parseInt(data.dropoffTime.split(':')[0]),
        parseInt(data.dropoffTime.split(':')[1].slice(0, 2))
      );

      const response = await axios.post(
        `${API_URL}/api/users/${car._id}/rent`,
        {
          rentalStartDate: startDate.toISOString(),
          rentalEndDate: endDate.toISOString(),
          personalDetails: {
            fullName: data.fullName,
            phone: data.phone,
            address: data.address
          }
        },
        { withCredentials: true }
      );

      toast.success('Car booked successfully!');
      reset();
      onSuccess?.(response.data.rental);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (!car) return null;

  const days = getdays();
  const totalPrice = days * (car.pricePerDay || 0);
  const showSummary = pickupDate && dropoffDate && new Date(dropoffDate) > new Date(pickupDate);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Book This Car</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Pickup */}
        <div className="space-y-3">
          <label className="font-semibold flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4" /> Pick-up
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                {...register('pickupLocation')}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select location</option>
                {pickupLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>
              )}
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="date"
                  {...register('pickupDate')}
                  className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <select
                  {...register('pickupTime')}
                  className="w-32 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Time</option>
                  {times.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {(errors.pickupDate || errors.pickupTime) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pickupDate?.message || errors.pickupTime?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Swap icon */}
        <div className="flex justify-center">
          <ArrowUpDown className="text-gray-400 w-5 h-5" />
        </div>

        {/* Drop-off */}
        <div className="space-y-3">
          <label className="font-semibold flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4" /> Drop-off
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                {...register('dropoffLocation')}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select location</option>
                {dropoffLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.dropoffLocation && (
                <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation.message}</p>
              )}
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="date"
                  {...register('dropoffDate')}
                  className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <select
                  {...register('dropoffTime')}
                  className="w-32 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Time</option>
                  {times.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {(errors.dropoffDate || errors.dropoffTime) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dropoffDate?.message || errors.dropoffTime?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              {...register('fullName')}
              defaultValue={user?.name || ''}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4" /> Phone
            </label>
            <input
              {...register('phone')}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="09123456789"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Home className="w-4 h-4" /> Address
            </label>
            <input
              {...register('address')}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, Manila"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Price Summary */}
        {showSummary && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{days} day{days !== 1 ? 's' : ''}</span>
              {' '}× ₱{car.pricePerDay?.toLocaleString()}/day
            </div>
            <div className="text-lg font-bold text-blue-600">
              Total: ₱{totalPrice.toLocaleString()}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !car?.isAvailable}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
        >
          {isSubmitting
            ? 'Booking...'
            : !car?.isAvailable
            ? 'Car Not Available'
            : 'Book Now'}
        </button>

      </form>
    </div>
  );
};

export default BookingForm;