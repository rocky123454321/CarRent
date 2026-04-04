import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from '../../components/user/BookingForm';
import carImage from "../../assets/carpichero.png";


import { User } from "lucide-react";
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

  // ✅ Single declaration langEEEEEEEEEEEEEEEEE    
  const ratings          = useRatingStore((s) => s.ratings);
  const averageRating    = useRatingStore((s) => s.averageRating);
  const loading          = useRatingStore((s) => s.isLoading);
  const submittingReview = useRatingStore((s) => s.submitting);
  const fetchRatings     = useRatingStore((s) => s.fetchRatings);
  const submitReviewFn   = useRatingStore((s) => s.submitReview);

  const [showReviewForm, setShowReviewForm]   = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviewRating, setReviewRating]       = useState(0);
  const [reviewText, setReviewText]           = useState('');

  // ✅ Stable reference — hindi mag-re-render infinitely
  useEffect(() => {
    if (car?._id) fetchRatings(car._id);
  }, [car?._id]);

  const reset = useRatingStore((s) => s.reset);

useEffect(() => {
  if (car?._id) fetchRatings(car._id);
  return () => reset(); // ✅ i-clear ang ratings kapag nag-leave ng page
}, [car?._id]);

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
        <p className="text-gray-400 text-sm">No car selected.</p>
        <button
          onClick={() => onBack ? onBack() : navigate("/cars")}
          className="mt-4 text-blue-600 text-sm hover:underline"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const mainImage = car.image || carImage;

  return (
    <div className="space-y-6">

      {/* Back button */}
      <button
        onClick={() => onBack ? onBack() : navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to listings
      </button>

      {/* ── Images + Info ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Left: Images */}
          <div className="lg:w-[55%] p-5 space-y-3">
            <div className="bg-gray-50 rounded-2xl flex items-center justify-center h-56 overflow-hidden">
              <img src={mainImage} alt={`${car.brand} ${car.model}`} className="h-full object-contain" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl flex items-center justify-center h-20 overflow-hidden border-2 border-transparent hover:border-blue-400 cursor-pointer transition-all">
                  <img src={mainImage} alt={`view ${i}`} className="h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:w-[45%] p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{car.brand} {car.model}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                  car.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                }`}>
                  {car.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className={i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                ))}
                <span className="text-xs text-gray-400 ml-1">{averageRating} ({ratings.length} reviews)</span>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Experience the comfort and reliability of the {car.brand} {car.model}.
                This {car.year} {car.color?.toLowerCase()} vehicle is perfect for both city
                drives and long road trips, offering a smooth and enjoyable ride.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: Fuel,     label: "Fuel Type",    value: car.fuelType },
                  { icon: Cog,      label: "Transmission", value: car.transmission },
                  { icon: MapPin,   label: "Mileage",      value: `${car.mileage} km` },
                  { icon: Calendar, label: "Year",         value: car.year },
                  { icon: MapPin,   label: "Color",        value: car.color },
                  { icon: Shield,   label: "Plate No.",    value: car.licensePlate },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                        <ItemIcon size={11} /> {item.label}
                      </p>
                      <p className="text-sm font-medium text-gray-800">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ── Uploaded By ── */}
{car.uploadedBy && (
  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
      {car.uploadedBy?.profileImage ? (
        <img
          src={car.uploadedBy.profileImage}
          alt={car.uploadedBy.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-white font-bold text-sm">
          {car.uploadedBy?.name?.charAt(0)?.toUpperCase() || 'A'}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wide">Listed by</p>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {car.uploadedBy?.name || 'Admin'}
      </p>
      {car.uploadedBy?.email && (
        <p className="text-xs text-gray-400 truncate">{car.uploadedBy.email}</p>
      )}
    </div>
    <button
      onClick={handleChatWithAdmin}
      className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-50 transition shrink-0"
    >
      <MessageSquare size={12} />
      Chat
    </button>
  </div>
)}

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">₱{car.pricePerDay?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">per day</p>
                </div>
                <div className="flex items-center gap-2">
                
                  <button
                    onClick={() => {
                      if (!isAuthenticated) { toast.error('Please login to book'); return; }
                      if (!car.isAvailable) { toast.error('This car is not available'); return; }
                      setShowBookingForm(true);
                    }}
                    disabled={!car.isAvailable}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Form Modal ── */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative">
            <button onClick={() => setShowBookingForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
              <X size={20} />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Book this Car</h3>
              <p className="text-sm text-gray-400 mb-4">{car.brand} {car.model} · ₱{car.pricePerDay?.toLocaleString()}/day</p>
              <BookingForm car={car} onSuccess={handleRentalSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* ── Reviews ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Customer Reviews</h3>
            <p className="text-xs text-gray-400">What renters are saying about this car</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
              setShowReviewForm((prev) => !prev);
            }}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <MessageSquare size={15} />
            {showReviewForm ? 'Cancel' : 'Write a review'}
          </button>
        </div>

        {/* Review form */}
        {showReviewForm && (
          <div className="bg-gray-50 p-5 rounded-2xl mb-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Your Review</h4>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)}>
                    <Star size={24} className={reviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300 transition-colors"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px] text-sm"
                placeholder="Share your experience with this car..."
                maxLength={500}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingReview || reviewRating === 0}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowReviewForm(false); setReviewRating(0); setReviewText(''); }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Loading reviews...</p>
          ) : ratings.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            ratings.slice(0, 3).map((review) => (
              <div key={review._id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{review.user?.name || 'Anonymous'}</p>
                    <span className="text-xs text-gray-400 shrink-0">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className={j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  {review.review && <p className="text-sm text-gray-600 leading-relaxed">{review.review}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default CarDetailView;