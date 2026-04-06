import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Fuel, Zap, Droplets, Leaf,
  LayoutGrid, SlidersHorizontal, RotateCcw
} from "lucide-react";

const fuelCategories = [
  { label: "ALL FLEET", value: "all", icon: LayoutGrid },
  { label: "PETROL", value: "Petrol", icon: Fuel },
  { label: "DIESEL", value: "Diesel", icon: Droplets },
  { label: "ELECTRIC", value: "Electric", icon: Zap },
  { label: "HYBRID", value: "Hybrid", icon: Leaf },
];

const transmissions = ["ALL", "AUTOMATIC", "MANUAL"];

const priceRanges = [
  { label: "ANY BUDGET", value: "all" },
  { label: "UNDER ₱1,000", value: "under1000" },
  { label: "₱1,000 – ₱2,000", value: "1000to2000" },
  { label: "₱2,000 – ₱3,000", value: "2000to3000" },
  { label: "ABOVE ₱3,000", value: "above3000" },
];

const Categorysidebar = ({
  activeCategory, setActiveCategory,
  activeTransmission, setActiveTransmission,
  activePriceRange, setActivePriceRange,
  isFiltered, resetFilters,
}) => {
  
  const sidebarStyle = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  return (
    <aside 
      className="hidden lg:block fixed left-0 top-0 h-screen mt-14 w-60 py-6 transition-all duration-500"
      style={sidebarStyle}
    >
      <div className="h-full bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-900 overflow-hidden shadow-sm transition-all">
        <ScrollArea className="h-full">

          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-50 dark:border-zinc-900/50">
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={14} className="text-zinc-900 dark:text-white" />
              <span className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em]">Refine</span>
            </div>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="group flex items-center gap-1.5 text-[9px] font-bold text-red-500 uppercase tracking-widest transition-all"
              >
                <RotateCcw size={10} className="group-hover:rotate-[-45deg] transition-transform" />
                Clear
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-8 mt-4">

            {/* Fuel Type Section */}
            <div className="space-y-3">
              <p className="text-[9px] text-zinc-400 dark:text-zinc-600 px-2 uppercase tracking-[0.3em] font-black italic">
                Engine Type
              </p>
              <div className="flex flex-col gap-1">
                {fuelCategories.map(({ label, value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveCategory(value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all text-left w-full uppercase
                      ${activeCategory === value
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-lg shadow-zinc-200 dark:shadow-none"
                        : "text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                  >
                    <Icon size={14} className={activeCategory === value ? "animate-pulse" : "opacity-50"} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-50 dark:bg-zinc-900/50" />

            {/* Transmission Section */}
            <div className="space-y-3">
              <p className="text-[9px] text-zinc-400 dark:text-zinc-600 px-2 uppercase tracking-[0.3em] font-black italic">
                Drivetrain
              </p>
              <div className="flex flex-col gap-1">
                {transmissions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTransmission(t)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all text-left w-full uppercase
                      ${activeTransmission === t
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-lg shadow-zinc-200 dark:shadow-none"
                        : "text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                  >
                    {t}
                    {activeTransmission === t && <div className="w-1 h-1 rounded-full bg-current" />}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-50 dark:bg-zinc-900/50" />

            {/* Price Range Section */}
            <div className="space-y-3">
              <p className="text-[9px] text-zinc-400 dark:text-zinc-600 px-2 uppercase tracking-[0.3em] font-black italic">
                Daily Rate
              </p>
              <div className="flex flex-col gap-1">
                {priceRanges.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setActivePriceRange(value)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all text-left w-full uppercase
                      ${activePriceRange === value
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-lg shadow-zinc-200 dark:shadow-none"
                        : "text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                  >
                    {label}
                    {activePriceRange === value && <div className="w-1 h-1 rounded-full bg-current" />}
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