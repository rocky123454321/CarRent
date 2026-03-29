import React, { useEffect } from "react";
import carImage from "../../assets/carpichero.png";
import { Fuel, Cog, Users, Heart } from "lucide-react";
import { useCarStore } from "../../store/CarStore";

const Cards = ({ limit, filterFuel, filterTransmission, filterPrice }) => {
  const { cars = [], getCars, searchQuery } = useCarStore();

  useEffect(() => { getCars(); }, []);

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

    return searchMatch && fuelMatch && transMatch && priceMatch;
  });

  const displayCars = limit ? filtered.slice(0, limit) : filtered;

  if (displayCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-sm">No cars match your filters.</p>
        <p className="text-gray-300 text-xs mt-1">Try adjusting or resetting the filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayCars.map((car) => (
        <div
          key={car._id}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors group"
        >
          {/* Heart */}
          <div className="flex justify-end p-2.5 pb-0">
            <button className="text-gray-300 hover:text-red-400 transition-colors">
              <Heart size={15} />
            </button>
          </div>

          {/* Name */}
          <div className="px-3 pb-2">
            <p className="font-medium text-sm text-gray-900">{car.brand} {car.model}</p>
            <p className="text-xs text-gray-400 mt-0.5">{car.color} · {car.year}</p>
          </div>

          {/* Image */}
          <div className="mx-3 bg-gray-50 rounded-xl flex justify-center p-3">
            <img
              src={car.image || carImage}
              alt={car.model}
              className="h-24 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Specs */}
          <div className="flex justify-between px-3 py-2.5 text-xs text-gray-400 border-t border-gray-50 mt-3">
            <span className="flex items-center gap-1"><Fuel size={11} />{car.fuelType}</span>
            <span className="flex items-center gap-1"><Cog size={11} />{car.transmission}</span>
            <span className="flex items-center gap-1"><Users size={11} />{car.mileage} km</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2.5">
            <p className="text-sm font-medium text-gray-900">
              ₱{car.pricePerDay.toLocaleString()}
              <span className="text-xs text-gray-400 font-normal"> /day</span>
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
              Rent now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;