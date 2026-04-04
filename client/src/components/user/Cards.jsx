import React, { useEffect } from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Users, Heart } from "lucide-react";
import { useCarStore } from "../../store/CarStore";
import { useNavigate } from "react-router-dom";

const Cards = ({ limit, filterFuel, filterTransmission, filterPrice, onSelect }) => {
  const navigate = useNavigate();
  const { cars = [], getCars, searchQuery } = useCarStore();

  useEffect(() => { getCars(); }, [getCars]);

  const handleSelect = (car) => {
    if (onSelect) {
      onSelect(car);
    } else {
      navigate("/cars/" + car._id, { state: { car } });
    }
  };

  const filtered = cars.filter((car) => {
    const searchMatch = !searchQuery ||
      `${car.brand} ${car.model} ${car.color}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const fuelMatch  = !filterFuel         || filterFuel === "all"  || car.fuelType     === filterFuel;
    const transMatch = !filterTransmission || filterTransmission === "All" || car.transmission === filterTransmission;

    const priceMatch = (() => {
      const p = car.pricePerDay;
      if (!filterPrice || filterPrice === "all") return true;
      if (filterPrice === "under1000")  return p < 1000;
      if (filterPrice === "1000to2000") return p >= 1000 && p <= 2000;
      if (filterPrice === "2000to3000") return p > 2000 && p <= 3000;
      if (filterPrice === "above3000")  return p > 3000;
      return true;
    })();

    return searchMatch && fuelMatch && transMatch && priceMatch && car.isAvailable === true;
  });

  const displayCars = limit ? filtered.slice(0, limit) : filtered;

  if (displayCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No cars match your filters.</p>
        <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">Try adjusting or resetting the filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayCars.map((car) => (
        <div
          key={car._id}
          onClick={() => handleSelect(car)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-md dark:hover:shadow-blue-500/10 transition-all group cursor-pointer"
        >
          {/* Heart / Favorite */}
          <div className="flex justify-end p-3 pb-0">
            <button
              className="text-slate-300 dark:text-slate-700 hover:text-red-400 dark:hover:text-red-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={16} />
            </button>
          </div>

          {/* Name & Details */}
          <div className="px-4 pb-3">
            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {car.brand} {car.model}
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
              {car.color} • {car.year}
            </p>
          </div>

          {/* Image Container */}
          <div className="mx-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex justify-center items-center p-4 h-32 transition-colors">
            <img
              src={car.image || carImage}
              alt={car.model}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Specs / Icons */}
          <div className="flex justify-between px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-800/50 mt-3">
            <span className="flex items-center gap-1.5"><Fuel size={12} className="text-blue-500/70" />{car.fuelType}</span>
            <span className="flex items-center gap-1.5"><Cog size={12} className="text-blue-500/70" />{car.transmission}</span>
            <span className="flex items-center gap-1.5"><Users size={12} className="text-blue-500/70" />{car.mileage} km</span>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-3 bg-gray-50/50 dark:bg-slate-800/30">
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                ₱{car.pricePerDay.toLocaleString()}
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal uppercase ml-0.5">/ day</span>
              </p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              onClick={(e) => { e.stopPropagation(); handleSelect(car); }}
            >
              Rent now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;