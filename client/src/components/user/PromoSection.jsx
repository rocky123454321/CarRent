import React, { useMemo } from 'react';
import { Tag, ArrowRight, Zap } from 'lucide-react';
import { useCarStore } from '../../store/CarStore';
import { getSeasonalAnnouncements } from '../../utils/seasonalAnnouncements';
import carImage from '../../assets/carpichero.png';

// Maps promoSeason to announcement data for banner color/label
const SEASON_THEME = {
  summer:     { gradient: 'from-amber-500 to-orange-500',   badge: 'bg-amber-400',   text: '☀️ Summer Deal'    },
  christmas:  { gradient: 'from-red-600 to-rose-500',       badge: 'bg-red-400',     text: '🎄 Christmas Promo' },
  valentines: { gradient: 'from-pink-500 to-rose-400',      badge: 'bg-pink-400',    text: '💝 Valentine\'s Deal' },
  halloween:  { gradient: 'from-orange-600 to-amber-700',   badge: 'bg-orange-500',  text: '🎃 Halloween Sale'  },
  new_year:   { gradient: 'from-violet-600 to-purple-500',  badge: 'bg-violet-400',  text: '🎆 New Year Deal'   },
  payday:     { gradient: 'from-indigo-600 to-blue-500',    badge: 'bg-indigo-400',  text: '💸 Payday Promo'    },
  sale:       { gradient: 'from-zinc-800 to-zinc-600',      badge: 'bg-zinc-500',    text: '🛍️ Limited Offer'   },
};

const DEFAULT_THEME = SEASON_THEME.sale;

const PromoSection = ({ onSelect }) => {
  const { cars } = useCarStore();
  const announcements = getSeasonalAnnouncements();
  const currentAnnouncement = announcements[0]; // use the top seasonal announcement

  // Pick a random promo car that matches current season or any active promo
  const promoCar = useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day   = now.getDate();

    // Determine current season (mirrors CarStore logic)
    let season = 'sale';
    if (month === 12 || (month === 1 && day === 1)) season = 'christmas';
    else if (month === 2)                           season = 'valentines';
    else if (month >= 3 && month <= 5)              season = 'summer';
    else if (month === 10)                          season = 'halloween';
    else if (day >= 28 || day <= 2)                 season = 'payday';

    const eligible = cars.filter(car =>
      car.isPromo &&
      car.isAvailable &&
      (!car.promoExpiry || new Date(car.promoExpiry) > now) &&
      (car.promoSeason === season || !car.promoSeason)
    );

    if (!eligible.length) return null;
    // Pick random one — changes on each page load (feels "fresh" each visit)
    return eligible[Math.floor(Math.random() * eligible.length)];
  }, [cars]);

  if (!promoCar) return null; // No promo cars — hide section entirely

  const theme = SEASON_THEME[promoCar.promoSeason] || DEFAULT_THEME;
  const savings = promoCar.promoPrice
    ? promoCar.pricePerDay - promoCar.promoPrice
    : null;
  const discountPct = savings
    ? Math.round((savings / promoCar.pricePerDay) * 100)
    : null;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap size={14} className="text-amber-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          {currentAnnouncement?.title || 'Seasonal Promo'}
        </p>
      </div>

      {/* Promo Card */}
      <div
        onClick={() => onSelect?.(promoCar)}
        className="relative overflow-hidden rounded-[2rem] cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-900/20 active:scale-[0.99]"
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`} />

        {/* Decorative Circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/10" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">

          {/* Left: Info */}
          <div className="flex-1 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`${theme.badge} text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full`}>
                {theme.text}
              </span>
              {promoCar.promoLabel && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Tag size={10} /> {promoCar.promoLabel}
                </span>
              )}
              {discountPct && (
                <span className="bg-white text-zinc-900 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Car Name */}
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">
                {promoCar.brand} {promoCar.model}
              </h3>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
                {promoCar.year} • {promoCar.color} • {promoCar.transmission}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              {promoCar.promoPrice ? (
                <>
                  <div>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest line-through">
                      ₱{promoCar.pricePerDay.toLocaleString()}/day
                    </p>
                    <p className="text-white text-3xl font-black tracking-tighter leading-none">
                      ₱{promoCar.promoPrice.toLocaleString()}
                      <span className="text-white/60 text-sm font-bold">/day</span>
                    </p>
                  </div>
                  {savings && (
                    <span className="mb-1 text-white/80 text-xs font-bold">
                      Save ₱{savings.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-white text-3xl font-black tracking-tighter leading-none">
                  ₱{promoCar.pricePerDay.toLocaleString()}
                  <span className="text-white/60 text-sm font-bold">/day</span>
                </p>
              )}
            </div>

            {/* CTA */}
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all group-hover:gap-3 w-fit">
              Book Now <ArrowRight size={14} />
            </button>
          </div>

          {/* Right: Car Image */}
          <div className="relative w-full md:w-64 h-40 md:h-48 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-[2rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700" />
            <img
              src={promoCar.image || carImage}
              alt={`${promoCar.brand} ${promoCar.model}`}
              className="relative z-10 h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;