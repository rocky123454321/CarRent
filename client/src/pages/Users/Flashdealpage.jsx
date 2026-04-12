import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Star } from 'lucide-react';
import { useCarStore } from '../../store/CarStore';
import carImage from "../../assets/1.png";

const FlashDealPage = () => {
  const navigate = useNavigate();
  const { cars } = useCarStore();
  const [timeLeft, setTimeLeft] = useState('');

  // ─── RANDOM DAILY SELECTION LOGIC ─────────────────────────────────────────
  const dailyDeals = useMemo(() => {
    if (!cars || cars.length === 0) return [];

    // 1. Kuhanin ang "seed" base sa petsa ngayon (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);
    
    // 2. Simple hash function para maging number ang date string
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
      seed += today.charCodeAt(i);
    }

    // 3. Shuffle function gamit ang seed (deterministic random)
    const shuffle = (array, seed) => {
      let m = array.length, t, i;
      while (m) {
        i = Math.floor(Math.abs(Math.sin(seed++)) * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    };

    // 4. I-filter ang available cars at i-shuffle
    const availableCars = cars.filter(c => c.isAvailable);
    const shuffled = shuffle([...availableCars], seed);

    // 5. Pumili ng random number between 5 to 10 cards
    // Ginagamitan din ng seed para consistent ang bilang buong araw
    const countSeed = Math.floor(Math.abs(Math.cos(seed)) * 6) + 5; // Result: 5 to 10
    
    return shuffled.slice(0, countSeed);
  }, [cars]);

  // ─── TIMER LOGIC ──────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const diff = tomorrow - d;
      
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
        <div className="flex flex-col items-center text-center">
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
            <p className="text-white/80 text-xs font-medium max-w-[200px] mb-6">Resetting daily at midnight.</p>
            
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
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Car Grid */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Daily Picks</h3>
          <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500">
            {dailyDeals.length} units
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {dailyDeals.map((car) => (
            <div 
              key={car._id} 
              onClick={() => navigate(`/car/${car._id}`)}
              className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-5 transition-all hover:border-amber-500/50 cursor-pointer"
            >
              <div className="w-32 h-20 bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                <img 
                  src={car.image || carImage} 
                  alt={car.model} 
                  className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  Save ₱{(car.pricePerDay * 0.1).toLocaleString()}
                </p>
                <h4 className="font-bold text-zinc-900 dark:text-white tracking-tight">{car.brand} {car.model}</h4>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-sm font-black text-zinc-900 dark:text-white">₱{(car.pricePerDay * 0.9).toLocaleString()}</span>
                   <span className="text-[10px] text-zinc-400 line-through font-bold">₱{car.pricePerDay.toLocaleString()}</span>
                </div>
              </div>
              <button className="h-10 w-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg transition-transform active:scale-90">
                <Zap size={16} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashDealPage;