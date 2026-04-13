import React from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Users, ArrowRight, Tag, Zap } from "lucide-react"; // In-import ang Zap
import { useCarStore } from "../../store/CarStore";
import { useNavigate } from "react-router-dom";

const Cards = ({ limit, filterFuel, filterTransmission, filterPrice, onSelect, onlyPromo }) => {
  const navigate = useNavigate();
  const { cars = [], searchQuery } = useCarStore();

  const handleSelect = (car) => {
    if (onSelect) {
      onSelect(car._id);
    } else {
      // ✅ Sinisiguro natin na kasama ang car object sa navigation state
      navigate("/cars/" + car._id, { state: { car } });
    }
  };

  const filtered = cars.filter((car) => {
    // Check if flash deal is active
    const isFlash = car.isFlashDeal || car.flashDeal?.isActive;

    // 1. Promo Filter: Ngayon, isasama na rin ang Flash Deals kung 'onlyPromo' ang active
    const promoMatch = onlyPromo ? (car.isPromo || isFlash) : true;

    // 2. Search Filter
    const searchMatch =
      !searchQuery ||
      `${car.brand} ${car.model} ${car.color}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // 3. Fuel Filter
    const fuelMatch =
      !filterFuel || filterFuel === "all" || car.fuelType === filterFuel;

    // 4. Transmission Filter
    const transMatch =
      !filterTransmission ||
      filterTransmission === "All" ||
      car.transmission === filterTransmission;

    // 5. Price Filter (Updated logic para isama ang Flash Price)
    const priceMatch = (() => {
      let p = car.pricePerDay;
      if (isFlash) p = car.flashDeal?.discountedPrice || car.promoPrice;
      else if (car.isPromo) p = car.promoPrice;

      if (!filterPrice || filterPrice === "all") return true;
      if (filterPrice === "under1000") return p < 1000;
      if (filterPrice === "1000to2000") return p >= 1000 && p <= 2000;
      if (filterPrice === "2000to3000") return p > 2000 && p <= 3000;
      if (filterPrice === "above3000") return p > 3000;
      return true;
    })();

    return promoMatch && searchMatch && fuelMatch && transMatch && priceMatch && car.isAvailable === true;
  });

  const displayCars = limit ? filtered.slice(0, limit) : filtered;

  if (displayCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
          {onlyPromo ? "No active promos available right now." : "No cars match your filters."}
        </p>
        <p className="text-zinc-300 dark:text-zinc-600 text-[10px] uppercase tracking-widest mt-2">
          Try adjusting the search
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5">
      {displayCars.map((car) => {
        // ✅ Pre-calculate Flash Status for UI
        const isFlash = car.isFlashDeal || car.flashDeal?.isActive;
        const currentPrice = isFlash 
          ? (car.flashDeal?.discountedPrice || car.promoPrice) 
          : (car.isPromo ? car.promoPrice : car.pricePerDay);

        return (
          <div
            key={car._id}
            onClick={() => handleSelect(car)}
            className="group bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300 cursor-pointer relative"
          >
            {/* Flash Deal Badge (Priority over Regular Promo) */}
            {isFlash ? (
              <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg uppercase tracking-widest animate-pulse">
                <Zap size={8} className="fill-white" />
                Flash Deal
              </div>
            ) : car.isPromo && (
              <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg uppercase tracking-widest">
                <Tag size={8} className="fill-white" />
                {car.promoLabel || "Promo"}
              </div>
            )}

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
            </div>

            {/* Image */}
            <div className="mx-4 my-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl flex justify-center items-center p-4 h-28 lg:h-36">
              <img
                src={car.image || carImage}
                alt={`${car.brand} ${car.model}`}
                className="max-h-full w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2"
              />
            </div>

            {/* Specs */}
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
                <span className="text-[8px] lg:text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide truncate max-w-[40px]">
                  {car.mileage}
                </span>
              </div>
            </div>

            {/* Pricing Footer */}
            <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                  Daily Rate
                </span>
                <div className="flex flex-col items-start leading-none">
                  {(car.isPromo || isFlash) && (
                    <span className="text-[9px] text-zinc-300 dark:text-zinc-600 line-through font-bold mb-0.5">
                      ₱{car.pricePerDay.toLocaleString()}
                    </span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-bold tracking-tight leading-none ${
                      isFlash ? 'text-amber-500' : (car.isPromo ? 'text-rose-500' : 'text-zinc-900 dark:text-white')
                    }`}>
                      ₱{currentPrice.toLocaleString()}
                    </span>
                    <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-tighter">
                      /day
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                className={`h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm active:scale-90 ${
                  isFlash 
                    ? 'bg-amber-500 text-white hover:bg-amber-600' 
                    : (car.isPromo ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950')
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(car);
                }}
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;