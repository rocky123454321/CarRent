import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from '../../components/user/BookingForm';
import carImage from "../../assets/carpichero.png";

import {
  Fuel, Cog, ArrowLeft, Star, MapPin,
  Shield, Calendar, MessageSquare, X
} from "lucide-react";
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore.js';
import { useRatingStore } from '../../store/RatingStore';
import { format } from 'date-fns';

const CarDetailView = ({ car: carProp, onBack }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = carProp || state?.car;
  const { user, isAuthenticated } = useAuthStore();

  const ratings          = useRatingStore((s) => s.ratings);
  const averageRating    = useRatingStore((s) => s.averageRating);
  const loading          = useRatingStore((s) => s.isLoading);
  const submittingReview = useRatingStore((s) => s.submitting);
  const fetchRatings     = useRatingStore((s) => s.fetchRatings);
  const submitReviewFn   = useRatingStore((s) => s.submitReview);
  const reset            = useRatingStore((s) => s.reset);

  const [showReviewForm, setShowReviewForm]   = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviewRating, setReviewRating]       = useState(0);
  const [reviewText, setReviewText]           = useState('');

  useEffect(() => {
    if (car?._id) fetchRatings(car._id);
    return () => reset();
  }, [car?._id, fetchRatings, reset]);

  useEffect(() => {
    document.body.style.overflow = showBookingForm ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showBookingForm]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user || reviewRating === 0) {
      toast.error('Please login and select a rating');
      return;
    }
    const success = await submitReviewFn(car._id, reviewRating, reviewText);
    if (success) {
      setReviewRating(0);
      setReviewText('');
      setShowReviewForm(false);
    }
  };

  const handleRentalSuccess = () => {
    toast.success('Rental confirmed!');
    setShowBookingForm(false);
    navigate('/my-rentals');
  };

  const handleChatWithAdmin = () => {
    if (!isAuthenticated) { toast.error('Please login to chat'); return; }
    const adminId = car?.uploadedBy?._id || car?.uploadedBy;
    if (!adminId) { toast.error('Could not find the car owner'); return; }
    navigate('/chat', {
      state: { adminId, context: 'car', carId: car._id, carName: `${car.brand} ${car.model}` }
    });
  };

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-sm">No car selected.</p>
        <button
          onClick={() => onBack ? onBack() : navigate("/cars")}
          className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const mainImage = car.image || carImage;

  return (
    <div className="space-y-6 pb-10 transition-colors duration-300">
      
      {/* Back button */}
      <button
        onClick={() => onBack ? onBack() : navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium"
      >
        <ArrowLeft size={16} />
        Back to listings
      </button>

      {/* ── Images + Info ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Left: Images */}
          <div className="lg:w-[55%] p-6 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center h-64 lg:h-80 overflow-hidden border border-slate-100 dark:border-slate-800">
              <img src={mainImage} alt={`${car.brand} ${car.model}`} className="h-full object-contain p-4 transition-transform hover:scale-105 duration-500" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center h-20 overflow-hidden border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all">
                  <img src={mainImage} alt={`view ${i}`} className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:w-[45%] p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-50 dark:border-slate-800">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{car.brand} {car.model}</h2>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shrink-0 ${
                  car.isAvailable 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}>
                  {car.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700"} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">{averageRating} ({ratings.length} reviews)</span>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                Experience the comfort and reliability of the {car.brand} {car.model}. 
                This {car.year} {car.color?.toLowerCase()} vehicle is perfect for both city 
                drives and long road trips, offering a smooth and enjoyable ride.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Fuel,    label: "Fuel",     value: car.fuelType },
                  { icon: Cog,     label: "Trans",    value: car.transmission },
                  { icon: MapPin,  label: "Mileage",  value: `${car.mileage} km` },
                  { icon: Calendar, label: "Year",     value: car.year },
                  { icon: MapPin,  label: "Color",    value: car.color },
                  { icon: Shield,  label: "Plate",    value: car.licensePlate },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.label} className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5 uppercase tracking-tighter">
                        <ItemIcon size={11} className="text-blue-500" /> {item.label}
                      </p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Listed By */}
            {car.uploadedBy && (
              <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl px-4 py-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                  {car.uploadedBy?.profileImage ? (
                    <img src={car.uploadedBy.profileImage} alt={car.uploadedBy.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-sm uppercase">{car.uploadedBy?.name?.charAt(0) || 'A'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest">Listed by</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{car.uploadedBy?.name || 'Admin'}</p>
                </div>
                <button
                  onClick={handleChatWithAdmin}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shrink-0 active:scale-95"
                >
                  <MessageSquare size={13} /> Chat
                </button>
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">₱{car.pricePerDay?.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Per rental day</p>
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please login to book'); return; }
                    if (!car.isAvailable) { toast.error('This car is not available'); return; }
                    setShowBookingForm(true);
                  }}
                  disabled={!car.isAvailable}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X size={18} />
            </button>
            <BookingForm car={car} onSuccess={handleRentalSuccess} />
          </div>
        </div>
      )}

      {/* ── Reviews ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Reviews</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Feedback from recent renters</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
              setShowReviewForm((prev) => !prev);
            }}
            className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-tighter"
          >
            <MessageSquare size={14} />
            {showReviewForm ? 'Close' : 'Write Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl mb-8 animate-in slide-in-from-top-4 duration-300">
            <form onSubmit={submitReview} className="space-y-5">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} className="transition-transform active:scale-90">
                    <Star size={28} className={reviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-800 hover:text-yellow-300 transition-colors"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-slate-200 text-sm min-h-[120px] transition-all"
                placeholder="How was your ride? Share the details..."
                maxLength={500}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingReview || reviewRating === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl text-sm font-black disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-all active:scale-95 shadow-lg shadow-blue-500/10"
                >
                  {submittingReview ? 'Sending...' : 'Post Review'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowReviewForm(false); setReviewRating(0); setReviewText(''); }}
                  className="px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-10 font-medium">Fetching reviews...</p>
          ) : ratings.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 dark:text-slate-600 text-sm font-medium">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {ratings.slice(0, 5).map((review) => (
                <div key={review._id} className="flex gap-4 p-5 bg-slate-50/30 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-colors">
                  <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-900 shadow-sm">
                    <span className="text-slate-600 dark:text-slate-400 font-black text-sm uppercase">
                      {review.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{review.user?.name || 'Anonymous'}</p>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} className={j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-800 fill-slate-200 dark:fill-slate-800"} />
                      ))}
                    </div>
                    {review.review && <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{review.review}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailView;