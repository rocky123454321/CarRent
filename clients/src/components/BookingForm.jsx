import React from "react";
import { ArrowUpDown } from "lucide-react";

const BookingForm = () => {
  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-12">
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pick-Up Section */}
        <div className="flex-1">
          <h2 className="font-semibold text-lg mb-2">Pick-Up</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Location */}
            <select className="w-full p-3 bg-gray-100 rounded-xl appearance-none">
              <option>Select City</option>
              <option>Manila</option>
              <option>Cebu</option>
              <option>Davao</option>
            </select>
            
            {/* Date */}
            <input
              type="date"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />
            
            {/* Time */}
            <select className="w-full p-3 bg-gray-100 rounded-xl appearance-none">
              <option>Select Time</option>
              <option>08:00 AM</option>
              <option>12:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="hidden lg:flex justify-center items-center">
          <ArrowUpDown className="text-gray-400 text-2xl " />
        </div>

        {/* Drop-Off Section */}
        <div className="flex-1">
          <h2 className="font-semibold text-lg mb-2">Drop-Off</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Location */}
            <select className="w-full p-3 bg-gray-100 rounded-xl appearance-none">
              <option>Select City</option>
              <option>Manila</option>
              <option>Cebu</option>
              <option>Davao</option>
            </select>

            {/* Date */}
            <input
              type="date"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />

            {/* Time */}
            <select className="w-full p-3 bg-gray-100 rounded-xl appearance-none">
              <option>Select Time</option>
              <option>08:00 AM</option>
              <option>12:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookingForm;