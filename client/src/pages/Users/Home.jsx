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
} from "@/components/ui/breadcrumb"

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
    <div className="min-h-screen bg-gray-50">
       <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Category</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
      <div className="w-full px-4 py-6">
        <div className="flex gap-4 items-start">

          {/* Sidebar */}
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

          {/* Main */}
          <div className="flex-1  min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-gray-900">Available cars</p>
                <p className="text-xs text-gray-400 mt-0.5">Browse and rent a car today</p>
              </div>

              {isFiltered && (
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {activeCategory !== "all" && (
                    <Badge variant="secondary" className="text-xs">{activeCategory}</Badge>
                  )}
                  {activeTransmission !== "All" && (
                    <Badge variant="secondary" className="text-xs">{activeTransmission}</Badge>
                  )}
                  {activePriceRange !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      {priceRanges.find((p) => p.value === activePriceRange)?.label}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={resetFilters}
                    className="text-xs text-gray-400 h-6 px-2">
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            <Cards
              filterFuel={activeCategory}
              filterTransmission={activeTransmission}
              filterPrice={activePriceRange}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;