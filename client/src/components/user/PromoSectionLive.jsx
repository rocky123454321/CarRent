import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, Tag, Zap } from "lucide-react";
import carImage from "../../assets/carpichero.png";
import { useCarStore } from "../../store/CarStore";
import {
  formatPeso,
  formatPromoCountdown,
  getActivePromo,
  getEffectivePricePerDay,
  getSavingsAmount,
} from "../../utils/promo";

const PromoSectionLive = ({ onSelect }) => {
  const { cars = [] } = useCarStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const promoCar = useMemo(() => {
    const activePromoCars = cars.filter((car) => getActivePromo(car, now));
    if (!activePromoCars.length) return null;
    return activePromoCars[0];
  }, [cars, now]);

  if (!promoCar) return null;

  const promo = getActivePromo(promoCar, now);
  const discountedPrice = getEffectivePricePerDay(promoCar);
  const savings = getSavingsAmount(promoCar);
  const countdown = formatPromoCountdown(promo?.endDate, now);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Zap size={14} className="text-amber-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Active Promo
        </p>
      </div>

      <div
        onClick={() => onSelect?.(promoCar)}
        className="relative cursor-pointer overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                {promo?.discount}% off
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                <Tag size={10} />
                {promo?.title}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-black/15 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                <Clock3 size={10} />
                Ends in {countdown}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter md:text-3xl">
                {promoCar.brand} {promoCar.model}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/70">
                {promoCar.year} • {promoCar.color || "Color TBD"} • {promoCar.transmission || "Auto"}
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 line-through">
                  {formatPeso(promoCar.pricePerDay)}/day
                </p>
                <p className="text-3xl font-black tracking-tighter">
                  {formatPeso(discountedPrice)}
                  <span className="ml-1 text-sm font-bold text-white/70">/day</span>
                </p>
              </div>
              <span className="text-sm font-bold text-white/80">Save {formatPeso(savings)}</span>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm transition-all hover:bg-white/25">
              View Deal <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative h-40 w-full shrink-0 md:h-48 md:w-64">
            <div className="absolute inset-0 rounded-[2rem] bg-white/10 -rotate-3 transition-transform duration-500" />
            <img
              src={promoCar.image || carImage}
              alt={`${promoCar.brand} ${promoCar.model}`}
              className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSectionLive;
