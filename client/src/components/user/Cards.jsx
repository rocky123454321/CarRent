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

    const fuelMatch = !filterFuel || filterFuel === "all" || car.fuelType === filterFuel;
    const transMatch = !filterTransmission || filterTransmission === "All" || car.transmission === filterTransmission;

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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-sm font-medium">No cars match your filters.</p>
        <p className="text-gray-300 text-xs mt-1">Try adjusting or resetting the filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCars.map((car) => (
        <div
          key={car._id}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-colors hover:border-blue-200 cursor-pointer flex flex-col"
          onClick={() => handleSelect(car)}
        >
          {/* Header Section */}
          <div className="p-4 pb-0 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{car.brand} {car.model}</h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-tighter">
                {car.color} • {car.year}
              </p>
            </div>
            <Heart size={18} className="text-gray-300 hover:text-red-500 transition-colors" />
          </div>

          {/* Full-width Image Section */}
          <div className="w-full h-40 bg-gray-50/50 flex items-center justify-center mt-2 overflow-hidden">
            <img
              src={car.image || carImage}
              alt={car.model}
              className="w-full h-full object-contain p-4"
            />
          </div>

          {/* Specs Section */}
          <div className="px-4 py-3 flex justify-between border-b border-gray-50">
            <div className="flex items-center gap-1 text-gray-400">
              <Fuel size={14} className="text-blue-500" />
              <span className="text-[11px] font-semibold">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Cog size={14} className="text-blue-500" />
              <span className="text-[11px] font-semibold">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Users size={14} className="text-blue-500" />
              <span className="text-[11px] font-semibold">{car.mileage}km</span>
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-4 flex items-center justify-between mt-auto">
            <div>
              <span className="text-lg font-bold text-gray-900">₱{car.pricePerDay.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 font-normal">/day</span>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
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