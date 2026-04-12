import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from '../../components/user/BookingForm';
import carImage from "../../assets/carpichero.png";

import {
  Fuel, Cog, ArrowLeft, Star, MapPin,
  Shield, Calendar, MessageSquare, X, Tag // Nagdagdag ng Tag icon
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
    <div className="space-y-4 md:space-y-6 pb-20 transition-colors duration-300">
      
      {/* Back button */}
      <button
        onClick={() => onBack ? onBack() : navigate(-1)}
        className="flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-black px-2"
      >
        <ArrowLeft size={14} />
        Return to Fleet
      </button>

      {/* ── Main View ── */}
      <div className="bg-white dark:bg-zinc-900/40 rounded-[2rem] md:rounded-[2.5rem] mx-1 md:mx-0">
        <div className="flex flex-col lg:flex-row">

          {/* Image Section */}
          <div className="lg:w-[55%] p-4 md:p-8 space-y-4 md:space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center h-56 md:h-72 lg:h-[480px] overflow-hidden group relative">
              {/* // PROMO UPDATE: Floating Promo Badge on Image */}
              {car.isPromo && (
                <div className="absolute top-6 left-6 z-10 bg-rose-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                  <Tag size={12} className="fill-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {car.promoLabel || "Special Offer"}
                  </span>
                </div>
              )}
              
              <img src={mainImage} alt={`${car.brand} ${car.model}`} className="h-full object-contain p-4 md:p-8 transition-transform duration-1000 group-hover:scale-110" />
            </div>
            {/* Gallery placeholder */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-50 dark:bg-zinc-900 rounded-xl md:rounded-2xl flex items-center justify-center h-20 md:h-24 overflow-hidden cursor-pointer transition-all group">
                  <img src={mainImage} alt={`view ${i}`} className="h-[60%] object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-[45%] p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-[150px]">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.25em] mb-1">{car.year} Release</p>
                  <h2 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-tight">{car.brand} {car.model}</h2>
                </div>
                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 md:px-4 md:py-2 rounded-full shrink-0 shadow-sm transition-colors ${
                  car.isAvailable 
                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}>
                  {car.isAvailable ? "Available" : "Occupied"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-6 md:mb-8">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-zinc-200 dark:text-zinc-800 fill-zinc-200 dark:fill-zinc-800"} />
                  ))}
                </div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{averageRating} ({ratings.length})</span>
              </div>

              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 md:mb-10 font-medium max-w-sm">
                The {car.brand} {car.model} offers an unparalleled driving experience. Pristine condition and ready for your next journey.
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                {[
                  { icon: Fuel,    label: "Fuel", value: car.fuelType },
                  { icon: Cog,     label: "Trans", value: car.transmission },
                  { icon: MapPin,  label: "Odo", value: `${car.mileage} km` },
                  { icon: Shield,  label: "Color", value: car.color },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl md:rounded-2xl p-3 md:px-5 md:py-4 transition-colors">
                    <p className="text-[8px] font-bold text-zinc-400 mb-0.5 flex items-center gap-1.5 uppercase tracking-widest truncate">
                      <item.icon size={10} className="text-zinc-900 dark:text-white" /> {item.label}
                    </p>
                    <p className="text-[10px] md:text-xs font-black text-zinc-900 dark:text-white truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {car.uploadedBy && (
                <div className="flex items-center gap-3 md:gap-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl md:rounded-3xl px-4 py-3 md:px-5 md:py-4 transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0 shadow-lg border-2 border-white dark:border-zinc-800 overflow-hidden">
                    <span className="text-white dark:text-zinc-900 font-black text-xs uppercase">{car.uploadedBy?.name?.charAt(0) || 'A'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Host</p>
                    <p className="text-xs md:text-sm font-black text-zinc-900 dark:text-white truncate">{car.uploadedBy?.name || 'Authorized Admin'}</p>
                  </div>
                  <button
                    onClick={handleChatWithAdmin}
                    className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all active:scale-90 shadow-sm"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                {/* // PROMO UPDATE: Price Display with Original Price Strike-through */}
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-0.5">Daily Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
                      ₱{(car.isPromo ? car.promoPrice : car.pricePerDay)?.toLocaleString()}
                    </p>
                    {car.isPromo && (
                      <p className="text-sm md:text-base font-bold text-zinc-400 line-through decoration-rose-500/50">
                        ₱{car.pricePerDay?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {/* Promo Season Label */}
                  {car.isPromo && car.promoSeason && (
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1">
                      {car.promoSeason} Limited Offer
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please login to book'); return; }
                    if (!car.isAvailable) { toast.error('This car is not available'); return; }
                    setShowBookingForm(true);
                  }}
                  disabled={!car.isAvailable}
                  className="w-full sm:flex-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 h-14 md:h-16 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-90 disabled:opacity-20 shadow-xl active:scale-[0.98]"
                >
                  Book Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ... Experiences Section and Booking Overlay remain the same ... */}
      
      {/* Experiences Section */}
      <div className="bg-white dark:bg-zinc-900/40 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 mx-1 md:mx-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Experiences</h3>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.25em] mt-1">Community Testimonials</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
              setShowReviewForm((prev) => !prev);
            }}
            className="flex items-center gap-2 text-[9px] font-black text-zinc-900 dark:text-white hover:opacity-60 transition-opacity uppercase tracking-widest"
          >
            <MessageSquare size={14} />
            {showReviewForm ? 'Cancel' : 'Post Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] mb-10">
            <form onSubmit={submitReview} className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)}>
                    <Star size={24} className={reviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-zinc-200 dark:text-zinc-800"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-4 md:p-6 bg-white dark:bg-zinc-950 rounded-xl md:rounded-2xl focus:outline-none text-xs md:text-sm min-h-[120px] shadow-sm"
                placeholder="How was your rental experience?"
              />
              <button
                type="submit"
                disabled={submittingReview || reviewRating === 0}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 h-12 md:h-14 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all shadow-lg"
              >
                {submittingReview ? 'Posting...' : 'Share Feedback'}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <p className="text-[9px] text-zinc-400 text-center py-10 uppercase tracking-widest animate-pulse">Fetching records...</p>
          ) : ratings.length === 0 ? (
            <div className="text-center py-10 md:py-16 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[1.5rem] md:rounded-[2rem]">
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">No reviews yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {ratings.slice(0, 6).map((review) => (
                <div key={review._id} className="p-6 md:p-8 bg-zinc-50/40 dark:bg-zinc-900/20 rounded-[1.5rem] md:rounded-[2rem] transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center font-black text-[9px] shadow-sm">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{review.user?.name || 'Verified Renter'}</p>
                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={8} className={j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-100 dark:text-zinc-800"} />
                      ))}
                    </div>
                  </div>
                  {review.review && <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium italic opacity-80">"{review.review}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Overlay */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xl z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-950 rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[95vh] animate-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="p-4 md:p-2">
              <BookingForm car={car} onSuccess={handleRentalSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailView;