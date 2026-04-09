import React from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Users, Heart, ArrowRight } from "lucide-react";
import { useCarStore } from "../../store/CarStore";
import { useNavigate } from "react-router-dom";

const Cards = ({ limit, filterFuel, filterTransmission, filterPrice, onSelect }) => {
  const navigate = useNavigate();
  const { cars = [], searchQuery } = useCarStore();

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

    const fuelMatch  = !filterFuel || filterFuel === "all" || car.fuelType === filterFuel;
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
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No cars match your filters.</p>
        <p className="text-zinc-300 dark:text-zinc-600 text-[10px] uppercase tracking-widest mt-2">Try adjusting the search</p>
      </div>
    );
  }

  return (
    // Naka-2 columns na sa mobile (grid-cols-2) at niliitan ang gap
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
      {displayCars.map((car) => (
        <div
          key={car._id}
          onClick={() => handleSelect(car)}
          className="group relative bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500 cursor-pointer"
        >
          {/* Header Info - Mas maliit na padding at font sizes */}
          <div className="p-3 lg:p-4 pb-0 flex justify-between items-start">
            <div className="truncate">
              <h3 className="font-bold text-zinc-900 dark:text-white text-xs lg:text-sm tracking-tight truncate">
                {car.brand} {car.model}
              </h3>
              <p className="text-[8px] lg:text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                {car.year} • {car.color}
              </p>
            </div>
            <button
              className="text-zinc-300 dark:text-zinc-700 hover:text-red-500"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={14} />
            </button>
          </div>

          {/* Image Section - Niliitan ang height (h-24 to h-32) */}
          <div className="relative h-24 lg:h-32 flex items-center justify-center p-3">
            <div className="absolute inset-x-3 inset-y-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl -rotate-1 group-hover:rotate-0 transition-transform duration-700" />
            <img
              src={car.image || carImage}
              alt={car.model}
              className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Specs Bar - Mas compact na icons at text */}
          <div className="flex justify-between px-3 py-2 border-t border-zinc-50 dark:border-zinc-800/50">
            <div className="flex flex-col items-center gap-0.5">
              <Fuel size={12} className="text-zinc-400" />
              <span className="text-[7px] lg:text-[9px] font-bold text-zinc-400 uppercase">{car.fuelType}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Cog size={12} className="text-zinc-400" />
              <span className="text-[7px] lg:text-[9px] font-bold text-zinc-400 uppercase">{car.transmission}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Users size={12} className="text-zinc-400" />
              <span className="text-[7px] lg:text-[9px] font-bold text-zinc-400 uppercase">{car.mileage} km</span>
            </div>
          </div>

          {/* Footer - Compact price and button */}
          <div className="bg-zinc-50/50 dark:bg-zinc-800/20 px-3 py-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-[8px] font-bold text-zinc-400 uppercase leading-none mb-0.5">Daily Rate</p>
              <p className="text-sm lg:text-lg font-black text-zinc-900 dark:text-white leading-none">
                ₱{car.pricePerDay.toLocaleString()}
              </p>
            </div>
            <button
              className="h-7 w-7 lg:h-9 lg:w-9 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 group-hover:scale-110 transition-all duration-300"
              onClick={(e) => { e.stopPropagation(); handleSelect(car); }}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;