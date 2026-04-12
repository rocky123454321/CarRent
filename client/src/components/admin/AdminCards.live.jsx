import React, { useEffect, useMemo } from "react";
import { CalendarRange, Fuel, Gauge } from "lucide-react";
import carImage from "../../assets/carpichero.png";
import { useAdminCarStore } from "../../store/AdminCarStore";
import { usePromoStore } from "../../store/PromoStore";
import { useAuthStore } from "../../store/authStore";
import { formatPeso, getActivePromo, getPromoStatus } from "../../utils/promo";
import PromoManagerDialog from "./PromoManagerDialog";

const AdminCardsLive = () => {
  const { user } = useAuthStore();
  const { cars, getAdminCars, isLoading, error } = useAdminCarStore();
  const { promos, fetchPromos } = usePromoStore();

  const refreshData = async () => {
    if (!user?._id) return;
    await Promise.all([getAdminCars(user._id), fetchPromos({ adminId: user._id })]);
  };

  useEffect(() => {
    refreshData();
  }, [user?._id]);

  const promosByCarId = useMemo(() => {
    const map = new Map();
    promos.forEach((promo) => {
      const existing = map.get(promo.carId) || [];
      existing.push(promo);
      map.set(promo.carId, existing);
    });
    return map;
  }, [promos]);

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[2rem] border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-[#0a0a0a]"
          >
            <div className="mb-4 h-44 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-5 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-2 h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-5 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
        {error}
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-center dark:border-white/5 dark:bg-[#0a0a0a]">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">No Cars Found</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
          Add a car first to start creating promos.
        </h2>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => {
        const carPromos = promosByCarId.get(car._id) || [];
        const activePromo = getActivePromo(car);
        const nextPromo =
          carPromos.find((promo) => getPromoStatus(promo) === "upcoming") ||
          carPromos.find((promo) => getPromoStatus(promo) === "active") ||
          null;

        return (
          <article
            key={car._id}
            className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-[#0a0a0a]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span
                className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                  car.isAvailable
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                }`}
              >
                {car.isAvailable ? "Available" : "Unavailable"}
              </span>
              {activePromo ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  {activePromo.discount}% live
                </span>
              ) : null}
            </div>

            <div className="mb-5 flex h-44 items-center justify-center rounded-[1.5rem] bg-zinc-50 p-6 dark:bg-white/5">
              <img
                src={car.image || carImage}
                alt={`${car.brand} ${car.model}`}
                className="max-h-full w-auto object-contain"
              />
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  {car.brand} {car.model}
                </h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  {car.year} • {car.color || "Color TBD"}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Base Rate</p>
                  <p className="mt-1 text-lg font-black text-zinc-900 dark:text-white">
                    {formatPeso(car.pricePerDay)}
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Promo Status</p>
                  <p className="mt-1 text-sm font-black text-zinc-900 dark:text-white">
                    {activePromo
                      ? `${activePromo.title} (${activePromo.discount}% off)`
                      : nextPromo
                        ? `${nextPromo.title} (${getPromoStatus(nextPromo)})`
                        : "No promo scheduled"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">
                  <Fuel size={11} />
                  {car.fuelType || "Fuel TBD"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">
                  <Gauge size={11} />
                  {car.transmission || "Transmission TBD"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">
                  <CalendarRange size={11} />
                  {carPromos.length} promo{carPromos.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="pt-2">
                <PromoManagerDialog car={car} promos={carPromos} onRefresh={refreshData} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AdminCardsLive;
