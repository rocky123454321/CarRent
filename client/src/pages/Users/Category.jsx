import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { useCarStore } from '../../store/CarStore';

const Category = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const { searchQuery, setSearchQuery } = useCarStore();

  if (selectedCar) {
    return (
      <CarDetailView
        car={selectedCar}
        onBack={() => setSelectedCar(null)}
      />
    );
  }

  return (
    <div className="space-y-10">

      {/* Search Bar */}
    {/* Search Bar - Mobile Only */}
<div className="relative md:hidden">
  <input
    type="text"
    placeholder="Search cars..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition"
  />
  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery("")}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
    >
      <X size={13} />
    </button>
  )}
</div>

      {/* Popular Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Popular Cars</h2>
          <button className="text-blue-600 font-semibold hover:underline text-sm">View all</button>
        </div>
        <Cards limit={3} onSelect={(car) => setSelectedCar(car)} />
      </section>

      {/* Recommended Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recommended Cars</h2>
          <button className="text-blue-600 font-semibold hover:underline text-sm">View all</button>
        </div>
        <Cards limit={6} onSelect={(car) => setSelectedCar(car)} />
      </section>

    </div>
  );
};

export default Category;