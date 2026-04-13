import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap } from 'lucide-react';
import { useCarStore } from '../../store/CarStore';
import carImage from "../../assets/1.png";

const FlashDealPage = () => {
  const navigate = useNavigate();
  const { cars, getCars } = useCarStore();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => { getCars(); }, [getCars]);

  const dailyDeals = useMemo(() => {
    if (!cars || cars.length === 0) return [];
    const today = new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

    const shuffle = (array, s) => {
      const arr = [...array];
      let m = arr.length, t, idx;
      while (m) { idx = Math.floor(Math.abs(Math.sin(s++)) * m--); t = arr[m]; arr[m] = arr[idx]; arr[idx] = t; }
      return arr;
    };

    const availableCars = cars.filter(c => c.isAvailable);
    const shuffled = shuffle(availableCars, seed);
    const count = Math.floor(Math.abs(Math.cos(seed)) * 6) + 3; // 3 to 8
    return shuffled.slice(0, count);
  }, [cars]);

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

      {/* Hero Timer */}
      <div className="px-4 py-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white shadow-2xl shadow-orange-500/20">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full flex items-center gap-2 mb-4">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Now</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">10% OFF EVERYTHING</h2>
            <p className="text-white/80 text-xs font-medium max-w-[200px] mb-6">
              System picks {dailyDeals.length} vehicles daily. Resets at midnight.
            </p>
            <div className="flex gap-4">
              {timeLeft.split(':').map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-black/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-mono font-black">{unit}</div>
                  <span className="text-[8px] font-bold uppercase mt-2 opacity-60">{i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}</span>
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
          <div>
            <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Daily Picks</h3>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">System-selected · Resets daily</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 px-3 py-1 rounded-full">
            {dailyDeals.length} units
          </span>
        </div>

        {dailyDeals.length === 0 ? (
          <div className="text-center py-16"><p className="text-zinc-400 text-sm font-medium">No available cars right now.</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {dailyDeals.map((car) => {
              const flashPrice = Math.round(car.pricePerDay * 0.9);
              const savings    = car.pricePerDay - flashPrice;
              return (
                <div
                  key={car._id}
                  // ✅ THE FIX: pass car object as route state
                  onClick={() => navigate(`/car/${car._id}`, { state: { car } })}
                  className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 flex items-center gap-5 transition-all hover:border-amber-500/50 cursor-pointer"
                >
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Zap size={7} fill="currentColor" /> Flash
                  </div>
                  <div className="w-32 h-20 bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center p-2 shadow-sm shrink-0">
                    <img src={car.image || carImage} alt={car.model} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Save ₱{savings.toLocaleString()} today</p>
                    <h4 className="font-bold text-zinc-900 dark:text-white tracking-tight truncate">{car.brand} {car.model}</h4>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">{car.year} · {car.color} · {car.fuelType}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-black text-zinc-900 dark:text-white">₱{flashPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-zinc-400 line-through font-bold">₱{car.pricePerDay.toLocaleString()}</span>
                      <span className="text-[8px] font-bold text-zinc-400">/day</span>
                    </div>
                  </div>
                  <button className="h-10 w-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg transition-transform active:scale-90 shrink-0">
                    <Zap size={16} fill="currentColor" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashDealPage;