import React from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Users, Heart, ArrowRight } from "lucide-react";
import { useCarStore } from "../../store/CarStore";
import { useNavigate } from "react-router-dom";

const Cards = ({ limit, filterFuel, filterTransmission, filterPrice, onSelect }) => {
  const navigate = useNavigate();
  const { cars = [], searchQuery } = useCarStore();

  // NO useEffect here — parent (Searchpage) handles fetching

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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No cars match your filters.</p>
        <p className="text-zinc-300 dark:text-zinc-600 text-[10px] uppercase tracking-widest mt-2">Try adjusting the search</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCars.map((car) => (
        <div
          key={car._id}
          onClick={() => handleSelect(car)}
          className="group relative bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-none transition-all duration-500 cursor-pointer"
        >
          {/* Header Info */}
          <div className="p-5 pb-0 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base tracking-tight truncate w-40">
                {car.brand} {car.model}
              </h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mt-1">
                {car.year} • {car.color}
              </p>
            </div>
            <button
              className="text-zinc-300 dark:text-zinc-700 hover:text-red-500 transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Image Section */}
          <div className="relative h-40 flex items-center justify-center p-6">
            <div className="absolute inset-x-6 inset-y-10 bg-zinc-50 dark:bg-zinc-800/30 rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
            <img
              src={car.image || carImage}
              alt={car.model}
              className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2"
            />
          </div>

          {/* Specs Bar */}
          <div className="flex justify-between px-5 py-4 border-t border-zinc-50 dark:border-zinc-800/50">
            <div className="flex flex-col items-center gap-1">
              <Fuel size={14} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{car.fuelType}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Cog size={14} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{car.transmission}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users size={14} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{car.mileage} km</span>
            </div>
          </div>

          {/* Footer - Price & CTA */}
          <div className="bg-zinc-50 dark:bg-zinc-800/20 px-5 py-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Daily Rate</p>
              <p className="text-lg font-black text-zinc-900 dark:text-white leading-none">
                ₱{car.pricePerDay.toLocaleString()}
              </p>
            </div>
            <button
              className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-zinc-900/10"
              onClick={(e) => { e.stopPropagation(); handleSelect(car); }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;