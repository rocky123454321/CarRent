import React from "react";
import carImage from "../assets/carpichero.png";
import { Fuel, Cog, Users, Heart } from "lucide-react";

const Cards = ({ limit }) => {
  const cars = [
    { id: 1, name: "Koenigsegg", type: "Sport", price: "$99.00", specs: ["90L", "Manual", "2 People"], image: carImage },
    { id: 2, name: "Lamborghini Aventador", type: "Supercar", price: "$129.00", specs: ["80L", "Automatic", "2 People"], image: carImage },
    { id: 3, name: "Porsche 911", type: "Sport", price: "$110.00", specs: ["70L", "Manual", "2 People"], image: carImage },
    { id: 4, name: "Ferrari F8", type: "Supercar", price: "$140.00", specs: ["75L", "Automatic", "2 People"], image: carImage },
    { id: 5, name: "McLaren 720S", type: "Supercar", price: "$135.00", specs: ["85L", "Automatic", "2 People"], image: carImage },
    { id: 6, name: "Audi R8", type: "Sport", price: "$120.00", specs: ["65L", "Manual", "2 People"], image: carImage },
  ];

  const displayCars = limit ? cars.slice(0, limit) : cars;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
      {displayCars.map((car) => (
        <div
          key={car.id}
          className="bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative border border-gray-100 group"
        >
          {/* Heart */}
          <div className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition cursor-pointer">
            <Heart size={18} />
          </div>

          {/* Name */}
          <div className="p-4 pb-2">
            <h3 className="font-semibold text-slate-900 text-base">{car.name}</h3>
            <p className="text-xs text-slate-400">{car.type}</p>
          </div>

          {/* Image */}
          <div className="flex justify-center px-4 pb-3">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-36 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Specs */}
          <div className="flex justify-between px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Fuel size={14} />
              {car.specs[0]}
            </div>
            <div className="flex items-center gap-1">
              <Cog size={14} />
              {car.specs[1]}
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              {car.specs[2]}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
            <div className="text-base font-semibold text-slate-900">
              {car.price}
              <span className="text-xs text-gray-400"> /day</span>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
              Rent Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;