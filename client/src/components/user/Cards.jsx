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
    const searchMatch =
      !searchQuery ||
      `${car.brand} ${car.model} ${car.color}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const fuelMatch =
      !filterFuel || filterFuel === "all" || car.fuelType === filterFuel;
    const transMatch =
      !filterTransmission ||
      filterTransmission === "All" ||
      car.transmission === filterTransmission;

    const priceMatch = (() => {
      const p = car.pricePerDay;
      if (!filterPrice || filterPrice === "all") return true;
      if (filterPrice === "under1000") return p < 1000;
      if (filterPrice === "1000to2000") return p >= 1000 && p <= 2000;
      if (filterPrice === "2000to3000") return p > 2000 && p <= 3000;
      if (filterPrice === "above3000") return p > 3000;
      return true;
    })();

    return searchMatch && fuelMatch && transMatch && priceMatch && car.isAvailable === true;
  });

  const displayCars = limit ? filtered.slice(0, limit) : filtered;

  if (displayCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
          No cars match your filters.
        </p>
        <p className="text-zinc-300 dark:text-zinc-600 text-[10px] uppercase tracking-widest mt-2">
          Try adjusting the search
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
      {displayCars.map((car) => (
        <div
          key={car._id}
          onClick={() => handleSelect(car)}
          className="group bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300 cursor-pointer"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-0">
            <div className="truncate pr-2">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white tracking-tighter truncate">
                {car.brand} {car.model}
              </h3>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] mt-0.5">
                {car.year} · {car.color}
              </p>
            </div>
            <button
              className="text-zinc-300 dark:text-zinc-700 hover:text-red-500 dark:hover:text-red-500 transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={14} />
            </button>
          </div>

          {/* Image */}
          <div className="mx-4 my-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl flex justify-center items-center p-4 h-28 lg:h-36 group/img">
            <img
              src={car.image || carImage}
              alt={`${car.brand} ${car.model}`}
              className="max-h-full w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2"
            />
          </div>

          {/* Specs Bar */}
          <div className="flex justify-between px-5 py-2 border-t border-zinc-50 dark:border-zinc-900">
            <div className="flex flex-col items-center gap-1">
              <Fuel size={12} className="text-zinc-400" />
              <span className="text-[8px] lg:text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                {car.fuelType}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Cog size={12} className="text-zinc-400" />
              <span className="text-[8px] lg:text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                {car.transmission}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users size={12} className="text-zinc-400" />
              <span className="text-[8px] lg:text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                {car.mileage} km
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="flex flex-col">
              <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                Daily Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-zinc-900 dark:text-white leading-none">
                  ₱{car.pricePerDay.toLocaleString()}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">
                  /day
                </span>
              </div>
            </div>
            <button
              className="h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 group-hover:scale-110 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(car);
              }}
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