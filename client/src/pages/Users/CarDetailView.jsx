import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Users, ArrowLeft, Star, MapPin, Shield, Calendar } from "lucide-react";

const mockReviews = [
  { name: "Juan dela Cruz", rating: 5, date: "Jan 12, 2024", comment: "Great car! Very clean and smooth drive. Would rent again." },
  { name: "Maria Santos", rating: 4, date: "Dec 28, 2023", comment: "Good experience overall. The car was in excellent condition." },
  { name: "Carlo Reyes", rating: 5, date: "Dec 10, 2023", comment: "Super comfortable and fuel efficient. Highly recommended!" },
];

const CarDetailView = () => {
   const {state } = useLocation()
  const navigate = useNavigate();
  const car = state?.car;

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-sm">No car selected.</p>
        <button
          onClick={() => navigate("/cars")}
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
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to listings
      </button>

      {/* ── DIV 1: Images + Info ── */}
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
                  <Star key={i} size={13} className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                ))}
                <span className="text-xs text-gray-400 ml-1">4.0 (24 reviews)</span>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Experience the comfort and reliability of the {car.brand} {car.model}.
                This {car.year} {car.color.toLowerCase()} vehicle is perfect for both city
                drives and long road trips, offering a smooth and enjoyable ride.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: Fuel, label: "Fuel Type", value: car.fuelType },
                  { icon: Cog, label: "Transmission", value: car.transmission },
                  { icon: Users, label: "Mileage", value: `${car.mileage} km` },
                  { icon: Calendar, label: "Year", value: car.year },
                  { icon: MapPin, label: "Color", value: car.color },
                  { icon: Shield, label: "Plate No.", value: car.licensePlate },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                      <Icon size={11} /> {label}
                    </p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">₱{car.pricePerDay.toLocaleString()}</p>
                <p className="text-xs text-gray-400">per day</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DIV 2: Reviews ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-row justify-between">
          <div> <h3 className="text-lg font-bold text-gray-900 mb-1">Customer Reviews</h3>
            <p className="text-xs text-gray-400 mb-5">What renters are saying about this car</p></div>
          <div>
            < button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              See all reviews
            </button>
          </div>
          
       </div>
        <div className="space-y-4">
          {mockReviews.map((review, i) => (
            <div key={i} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-semibold text-sm">{review.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                  <span className="text-xs text-gray-400 shrink-0">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-1.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={11} className={j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CarDetailView;