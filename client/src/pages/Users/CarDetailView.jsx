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
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No car selected.</p>
        <button
          onClick={() => onBack ? onBack() : navigate("/cars")}
          className="mt-4 text-zinc-900 dark:text-white text-sm font-black hover:underline tracking-tighter"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const mainImage = car.image || carImage;

  return (
    <div className="space-y-6 pb-16 transition-colors duration-300">
      
      {/* Back button */}
      <button
        onClick={() => onBack ? onBack() : navigate(-1)}
        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-black"
      >
        <ArrowLeft size={14} />
        Return to Fleet
      </button>

      {/* ── Main View ── */}
      <div className="bg-white dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden transition-all">
        <div className="flex flex-col lg:flex-row">

          {/* Image Section */}
          <div className="lg:w-[55%] p-8 space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center h-72 lg:h-[480px] overflow-hidden border border-zinc-100 dark:border-zinc-800/50 group relative">
              <img src={mainImage} alt={`${car.brand} ${car.model}`} className="h-full object-contain p-8 transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center h-24 overflow-hidden border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-900 dark:hover:border-zinc-200 cursor-pointer transition-all group">
                  <img src={mainImage} alt={`view ${i}`} className="h-[60%] object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-[45%] p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-100 dark:border-zinc-800/50">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em] mb-1.5">{car.year} Release</p>
                  <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">{car.brand} {car.model}</h2>
                </div>
                {/* Available Badge - Green when true */}
                <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full shrink-0 shadow-sm transition-colors ${
                  car.isAvailable 
                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" 
                    : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                }`}>
                  {car.isAvailable ? "Available" : "Occupied"}
                </span>
              </div>

              {/* Yellow Stars Rating */}
              <div className="flex items-center gap-1.5 mb-8">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-zinc-200 dark:text-zinc-800 fill-zinc-200 dark:fill-zinc-800"} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">{averageRating} / 5 ({ratings.length} Reviews)</span>
              </div>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 font-medium max-w-sm">
                The {car.brand} {car.model} offers an unparalleled driving experience in {car.color?.toLowerCase()}. 
                Pristine condition and ready for your next journey.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Fuel,    label: "Fuel", value: car.fuelType },
                  { icon: Cog,     label: "Transmission", value: car.transmission },
                  { icon: MapPin,  label: "Odometer", value: `${car.mileage} km` },
                  { icon: Shield,  label: "Registration", value: car.licensePlate },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <p className="text-[9px] font-bold text-zinc-400 mb-1 flex items-center gap-2 uppercase tracking-widest">
                      <item.icon size={11} className="text-zinc-900 dark:text-white" /> {item.label}
                    </p>
                    <p className="text-xs font-black text-zinc-900 dark:text-white truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Provider Info */}
              {car.uploadedBy && (
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl px-5 py-4 border border-zinc-100 dark:border-zinc-800/50">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0 shadow-lg overflow-hidden border-2 border-white dark:border-zinc-800">
                    {car.uploadedBy?.profileImage ? (
                      <img src={car.uploadedBy.profileImage} alt={car.uploadedBy.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white dark:text-zinc-900 font-black text-sm uppercase">{car.uploadedBy?.name?.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Host Provider</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-white truncate">{car.uploadedBy?.name || 'Authorized Admin'}</p>
                  </div>
                  <button
                    onClick={handleChatWithAdmin}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all shadow-sm active:scale-90"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-6 pt-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Total Daily Rate</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">₱{car.pricePerDay?.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please login to book'); return; }
                    if (!car.isAvailable) { toast.error('This car is not available'); return; }
                    setShowBookingForm(true);
                  }}
                  disabled={!car.isAvailable}
                  className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-90 disabled:opacity-20 disabled:grayscale shadow-xl shadow-zinc-900/10 active:scale-[0.98]"
                >
                  Book this Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Overlay */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh] border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-8 right-8 z-10 w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-2">
              <BookingForm car={car} onSuccess={handleRentalSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* ── Testimonials/Reviews ── */}
      <div className="bg-white dark:bg-zinc-900/40 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 p-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Experiences</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em] mt-1">Community Testimonials</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
              setShowReviewForm((prev) => !prev);
            }}
            className="flex items-center gap-2 text-[10px] font-black text-zinc-900 dark:text-white hover:opacity-60 transition-opacity uppercase tracking-widest"
          >
            <MessageSquare size={14} />
            {showReviewForm ? 'Cancel' : 'Post Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[2rem] mb-12 border border-zinc-100 dark:border-zinc-800/50 animate-in slide-in-from-top-4 duration-500">
            <form onSubmit={submitReview} className="space-y-6">
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} className="transition-transform active:scale-90">
                    <Star size={32} className={reviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-zinc-200 dark:text-zinc-800"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800 dark:text-white text-sm min-h-[150px] transition-all"
                placeholder="How was your rental experience?"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={submittingReview || reviewRating === 0}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20 transition-all active:scale-95 shadow-lg shadow-zinc-900/5"
              >
                {submittingReview ? 'Posting...' : 'Share Feedback'}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {loading ? (
            <p className="text-[10px] text-zinc-400 text-center py-10 uppercase tracking-[0.3em] font-black animate-pulse">Fetching records...</p>
          ) : ratings.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800/50">
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Quiet for now. Be the first to shout.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {ratings.slice(0, 6).map((review) => (
                <div key={review._id} className="p-8 bg-zinc-50/40 dark:bg-zinc-900/20 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50 flex flex-col justify-between transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40 group">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center font-black text-[10px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{review.user?.name || 'Verified Renter'}</p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={10} className={j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-100 dark:text-zinc-800"} />
                        ))}
                      </div>
                    </div>
                    {review.review && <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">"{review.review}"</p>}
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