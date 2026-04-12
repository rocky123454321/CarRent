import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Timer, Star, Car, ShieldCheck } from 'lucide-react';
import { useCarStore } from '../../store/CarStore';
import carImage from "../../assets/1.png";

const FlashDealPage = () => {
  const navigate = useNavigate();
  const { cars } = useCarStore();
  const [timeLeft, setTimeLeft] = useState('');

  // 10% discount logic preview
  const discountedCars = cars.filter(c => c.isAvailable).slice(0, 6);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      d.setHours(24, 0, 0, 0);
      const diff = d - new Date();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition">
          <ChevronLeft size={20} className="text-zinc-900 dark:text-white" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Limited Time</span>
          <h1 className="text-sm font-bold text-zinc-900 dark:text-white">Flash Deals</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Hero Timer Section */}
      <div className="px-4 py-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white shadow-2xl shadow-orange-500/20">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full flex items-center gap-2 mb-4">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Now</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">10% OFF EVERYTHING</h2>
            <p className="text-white/80 text-xs font-medium max-w-[200px] mb-6">Drive your dream car today at a fraction of the cost.</p>
            
            <div className="flex gap-4">
              {timeLeft.split(':').map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-black/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-mono font-black">
                    {unit}
                  </div>
                  <span className="text-[8px] font-bold uppercase mt-2 opacity-60">
                    {i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Car Grid */}
      <div className="px-4 space-y-4">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white px-1">Available for Flash Deal</h3>
        <div className="grid grid-cols-1 gap-4">
          {discountedCars.map((car) => (
            <div key={car._id} className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-5 transition-all hover:border-amber-500/50">
              <div className="w-32 h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center p-2">
                <img src={car.image || carImage} alt={car.model} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Save ₱{(car.pricePerDay * 0.1).toLocaleString()}</p>
                <h4 className="font-bold text-zinc-900 dark:text-white tracking-tight">{car.brand} {car.model}</h4>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-sm font-black text-zinc-900 dark:text-white">₱{(car.pricePerDay * 0.9).toLocaleString()}</span>
                   <span className="text-[10px] text-zinc-400 line-through">₱{car.pricePerDay.toLocaleString()}</span>
                </div>
              </div>
              <button className="h-10 w-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                <Zap size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashDealPage;