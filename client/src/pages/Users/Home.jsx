import { useState } from "react";
import Cards from "../../components/user/Cards";
import Categorysidebar from "../../components/navigations/Categorysidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const priceRanges = [
  { label: "Any price", value: "all" },
  { label: "Under ₱1,000", value: "under1000" },
  { label: "₱1,000 – ₱2,000", value: "1000to2000" },
  { label: "₱2,000 – ₱3,000", value: "2000to3000" },
  { label: "Above ₱3,000", value: "above3000" },
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTransmission, setActiveTransmission] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState("all");

  const isFiltered =
    activeCategory !== "all" ||
    activeTransmission !== "All" ||
    activePriceRange !== "all";

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveTransmission("All");
    setActivePriceRange("all");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full px-6 py-4">
        {/* Breadcrumb with Dark Mode Support */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/" 
                className="text-gray-500 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="dark:text-slate-600" />
            <BreadcrumbItem>
              <BreadcrumbPage className="dark:text-white font-bold">Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-auto shrink-0">
            <Categorysidebar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeTransmission={activeTransmission}
              setActiveTransmission={setActiveTransmission}
              activePriceRange={activePriceRange}
              setActivePriceRange={setActivePriceRange}
              isFiltered={isFiltered}
              resetFilters={resetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Available Cars
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Browse and rent a car today
                </p>
              </div>

              {/* Active Filter Badges */}
              {isFiltered && (
                <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
                  {activeCategory !== "all" && (
                    <Badge variant="secondary" className="text-[10px] dark:bg-slate-800 dark:text-white uppercase font-bold tracking-wider">
                      {activeCategory}
                    </Badge>
                  )}
                  {activeTransmission !== "All" && (
                    <Badge variant="secondary" className="text-[10px] dark:bg-slate-800 dark:text-white uppercase font-bold tracking-wider">
                      {activeTransmission}
                    </Badge>
                  )}
                  {activePriceRange !== "all" && (
                    <Badge variant="secondary" className="text-[10px] dark:bg-slate-800 dark:text-white uppercase font-bold tracking-wider">
                      {priceRanges.find((p) => p.value === activePriceRange)?.label}
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-7 px-3 transition-all"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Cards Container */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Cards
                filterFuel={activeCategory}
                filterTransmission={activeTransmission}
                filterPrice={activePriceRange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;