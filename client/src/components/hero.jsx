import React from "react";
import car from "../assets/carpichero.png";
import {ArrowRight} from 'lucide-react'
const Hero = () => {
  return (
    <section className="bg-white w-full min-h-screen flex items-center justify-between px-10 lg:px-24">
      {/* Left content */}
      <div className="flex-1 space-y-6">
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
         Discover the world on wheels with our car rental service
        </h1>
        <p className="text-slate-600 text-xl lg:text-2xl max-w-md leading-relaxed">
         Choose, book, and enjoy a seamless driving experience with smart AI-powered suggestions.
        </p>
        <div className="flex flex-wrap gap-4">
         <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
  {/* Primary Button */}
<button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl">
  Get Started 
  <ArrowRight size={20} />
</button>
  
</div>
        </div>
      </div>

      {/* Right image */}
      <div className="flex-1 hidden lg:block">
        <img src={car} alt="car pic" className="w-full h-auto object-contain" />
      </div>
    </section>
  );
};

export default Hero;


