import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap } from 'lucide-react';
import { useCarStore } from '../../store/CarStore';
import carImage from "../../assets/1.png";

// ✅ Single source of truth — edit src/utils/flashDeal.js para baguhin ang discount
import { getFlashDealData, getFlashPrice, getFlashSavings, FLASH_DISCOUNT_OPTIONS } from '../../utils/flashDeal.js';

const FlashDealPage = () => {
  const navigate = useNavigate();
  const { cars, getCars } = useCarStore();
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => { getCars(); }, [getCars]);

  // ✅ All flash logic comes from utility — one place to change
  const { discountPercent, dailyDeals } = getFlashDealData(cars);

  // Countdown to midnight
  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = next - now;
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { val: timeLeft.h, label: 'Hrs' },
    { val: timeLeft.m, label: 'Min' },
    { val: timeLeft.s, label: 'Sec' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition active:scale-90">
          <ChevronLeft size={20} className="text-zinc-900 dark:text-white" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Limited Time</span>
          <h1 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">Flash Deals</h1>
        </div>
        <div className="w-9 sm:w-10" />
      </header>

      <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        {/* Hero Timer */}
        <div className="py-6 sm:py-8">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-amber-500 to-orange-600 p-6 sm:p-8 lg:p-10 text-white shadow-2xl shadow-orange-500/20">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-1 rounded-full flex items-center gap-2 mb-3 sm:mb-4">
                <Zap size={12} fill="currentColor" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Today Only</span>
              </div>

              {/* ✅ Big discount % from utility */}
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-1">
                {discountPercent}%
              </h2>
              <p className="text-white/90 text-sm sm:text-base font-black uppercase tracking-widest mb-1">OFF</p>
              <p className="text-white/70 text-[10px] sm:text-xs font-medium max-w-[200px] sm:max-w-[260px] mb-6 sm:mb-8">
                {dailyDeals.length} random vehicle{dailyDeals.length !== 1 ? 's' : ''} today. New discount & picks every midnight.
              </p>

              {/* Timer */}
              <div className="flex gap-3 sm:gap-4">
                {units.map(({ val, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <div className="bg-black/20 backdrop-blur-md w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-mono font-black tabular-nums">
                      {val}
                    </div>
                    <span className="text-[7px] sm:text-[8px] font-bold uppercase mt-1.5 sm:mt-2 opacity-60 tracking-widest">{label}</span>
                  </div>
                ))}
              </div>

              {/* Possible discounts — highlight today's */}
              <div className="mt-5 sm:mt-6 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold">Possible:</span>
                {FLASH_DISCOUNT_OPTIONS.map(d => (
                  <span key={d} className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest transition-all ${
                    d === discountPercent
                      ? 'bg-white text-amber-600 scale-110'
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {d}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Car Grid */}
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Today's Picks</h3>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-0.5">
                {discountPercent}% off · New set at midnight
              </p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 px-2.5 sm:px-3 py-1 rounded-full">
              {dailyDeals.length} units
            </span>
          </div>

          {dailyDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-3xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <Zap size={24} className="text-amber-400" />
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No available cars right now.</p>
              <p className="text-zinc-300 dark:text-zinc-700 text-[10px] uppercase tracking-widest mt-1">Check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {dailyDeals.map((car) => {
                // ✅ Use utility — same formula as CarDetailView and Cards
                const flashPrice = getFlashPrice(car.pricePerDay, discountPercent);
                const savings    = getFlashSavings(car.pricePerDay, discountPercent);

                return (
                  <div
                    key={car._id}
                    onClick={() => navigate(`/car/${car._id}`, {
                      state: { car, isFlashDeal: true, discountPercent }
                    })}
                    className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
                  >
                    {/* Flash badge with today's % */}
                    <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-md">
                      <Zap size={7} fill="currentColor" /> -{discountPercent}%
                    </div>

                    <div className="flex flex-row sm:flex-col">
                      {/* Image */}
                      <div className="w-28 sm:w-full h-24 sm:h-40 lg:h-44 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center p-3 sm:p-5 shrink-0">
                        <img
                          src={car.image || carImage}
                          alt={`${car.brand} ${car.model}`}
                          className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
                        <div>
                          <p className="text-[8px] sm:text-[9px] font-black text-amber-500 uppercase tracking-widest mb-0.5">
                            Save ₱{savings.toLocaleString()} · {discountPercent}% off
                          </p>
                          <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white tracking-tight leading-tight truncate">
                            {car.brand} {car.model}
                          </h4>
                          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                            {car.year} · {car.color} · {car.fuelType}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                          <div>
                            <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-widest block leading-none mb-1">Flash Price</span>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                                ₱{flashPrice.toLocaleString()}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-zinc-300 dark:text-zinc-600 line-through font-bold">
                                ₱{car.pricePerDay.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[7px] text-zinc-400 font-medium">/day</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/car/${car._id}`, { state: { car, isFlashDeal: true, discountPercent } });
                            }}
                            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-md transition-all active:scale-90 group-hover:bg-amber-500 group-hover:dark:bg-amber-500 group-hover:text-white shrink-0"
                          >
                            <Zap size={14} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {dailyDeals.length > 0 && (
          <p className="text-center text-[9px] text-zinc-300 dark:text-zinc-700 uppercase tracking-widest font-bold mt-8 pb-4">
            New random picks & discount every midnight
          </p>
        )}
      </div>
    </div>
  );
};

export default FlashDealPage;