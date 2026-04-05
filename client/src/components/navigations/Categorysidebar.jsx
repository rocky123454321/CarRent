import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Fuel, Zap, Droplets, Leaf,
  LayoutGrid, SlidersHorizontal, RotateCcw
} from "lucide-react";

const fuelCategories = [
  { label: "All cars", value: "all", icon: LayoutGrid },
  { label: "Petrol", value: "Petrol", icon: Fuel },
  { label: "Diesel", value: "Diesel", icon: Droplets },
  { label: "Electric", value: "Electric", icon: Zap },
  { label: "Hybrid", value: "Hybrid", icon: Leaf },
];

const transmissions = ["All", "Automatic", "Manual"];

const priceRanges = [
  { label: "Any price", value: "all" },
  { label: "Under ₱1,000", value: "under1000" },
  { label: "₱1,000 – ₱2,000", value: "1000to2000" },
  { label: "₱2,000 – ₱3,000", value: "2000to3000" },
  { label: "Above ₱3,000", value: "above3000" },
];

const Categorysidebar = ({
  activeCategory, setActiveCategory,
  activeTransmission, setActiveTransmission,
  activePriceRange, setActivePriceRange,
  isFiltered, resetFilters,
}) => {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen mt-13 w-56 py-6 transition-colors duration-300">
      {/* Container with Dark Mode support */}
      <div className="h-full bg-white dark:bg-black border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm transition-all">
        <ScrollArea className="h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-gray-400 dark:text-slate-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-white">Filters</span>
            </div>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                <RotateCcw size={11} />
                Reset
              </button>
            )}
          </div>

          <div className="p-2.5 flex flex-col gap-3">

            {/* Fuel Type */}
            <div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 px-2 mb-1 uppercase tracking-wide font-bold">
                Fuel type
              </p>
              <div className="flex flex-col gap-0.5">
                {fuelCategories.map(({ label, value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveCategory(value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left w-full active:scale-95
                      ${activeCategory === value
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
                      }`}
                  >
                    <Icon size={12} className={activeCategory === value ? "text-blue-600 dark:text-blue-400" : ""} />
                    {label}
                    {activeCategory === value && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Transmission */}
            <div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 px-2 mb-1 uppercase tracking-wide font-bold">
                Transmission
              </p>
              <div className="flex flex-col gap-0.5">
                {transmissions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTransmission(t)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left w-full active:scale-95
                      ${activeTransmission === t
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
                      }`}
                  >
                    {t}
                    {activeTransmission === t && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Price Range */}
            <div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 px-2 mb-1 uppercase tracking-wide font-bold">
                Price / day
              </p>
              <div className="flex flex-col gap-0.5">
                {priceRanges.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setActivePriceRange(value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left w-full active:scale-95
                      ${activePriceRange === value
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900"
                      }`}
                  >
                    {label}
                    {activePriceRange === value && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default Categorysidebar;