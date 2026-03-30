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
   <aside className="hidden lg:block fixed left-0 top-0 h-screen mt-13 w-56 py-6">
  <div className="h-full bg-white border border-gray-100  overflow-hidden shadow-sm">
    <ScrollArea className="h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-3">

        {/* Fuel Type */}
        <div>
          <p className="text-[10px] text-gray-400 px-2 mb-1 uppercase tracking-wide">
            Fuel type
          </p>
          <div className="flex flex-col gap-0.5">
            {fuelCategories.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left w-full
                  ${activeCategory === value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <Icon size={12} />
                {label}
                {activeCategory === value && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Transmission */}
        <div>
          <p className="text-[10px] text-gray-400 px-2 mb-1 uppercase tracking-wide">
            Transmission
          </p>
          <div className="flex flex-col gap-0.5">
            {transmissions.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTransmission(t)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left w-full
                  ${activeTransmission === t
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {t}
                {activeTransmission === t && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <p className="text-[10px] text-gray-400 px-2 mb-1 uppercase tracking-wide">
            Price / day
          </p>
          <div className="flex flex-col gap-0.5">
            {priceRanges.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActivePriceRange(value)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left w-full
                  ${activePriceRange === value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {label}
                {activePriceRange === value && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
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