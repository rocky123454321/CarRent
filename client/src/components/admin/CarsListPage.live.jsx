import React from "react";
import { Sparkles } from "lucide-react";
import AdminCardsLive from "./AdminCards.live";

const CarsListPageLive = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Promo Dashboard
          </p>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          Inventory Promo Control
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          View all cars, create promos per car, edit scheduled deals, and remove invalid
          promos without leaving the dashboard.
        </p>
      </div>

      <AdminCardsLive />
    </div>
  );
};

export default CarsListPageLive;
