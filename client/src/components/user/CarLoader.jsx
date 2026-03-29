import React from "react";
import carGif from "../assets/car.gif";

const CarLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[51] flex flex-col justify-center items-center bg-white">
      
      {/* Car GIF */}
      <img
        src={carGif}
        alt="Loading Car"
        className="w-72 h-auto mb-8 animate-bounce"
      />
      
      {/* Animated Gradient Loading Text */}
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
        Loading
      </h1>

    </div>
  );
};

export default CarLoader;