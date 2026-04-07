import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const FUEL_OPTIONS  = ['all', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const TRANS_OPTIONS = ['All', 'Automatic', 'Manual'];
const PRICE_OPTIONS = [
  { value: 'all',        label: 'Any price' },
  { value: 'under1000',  label: 'Under ₱1,000' },
  { value: '1000to2000', label: '₱1,000 – ₱2,000' },
  { value: '2000to3000', label: '₱2,000 – ₱3,000' },
  { value: 'above3000',  label: 'Above ₱3,000' },
];

// --- SKELETON ---
const CardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl overflow-hidden animate-pulse">
    <div className="p-5 pb-0 flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-32" />
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-20" />
      </div>
      <div className="h-5 w-5 bg-slate-100 dark:bg-zinc-800 rounded" />
    </div>
    <div className="h-40 mx-5 my-4 bg-slate-100 dark:bg-zinc-800 rounded-2xl" />
    <div className="flex justify-between px-5 py-4 border-t border-slate-50 dark:border-zinc-800/50">
      <div className="h-8 w-12 bg-slate-100 dark:bg-zinc-800 rounded" />
      <div className="h-8 w-12 bg-slate-100 dark:bg-zinc-800 rounded" />
      <div className="h-8 w-12 bg-slate-100 dark:bg-zinc-800 rounded" />
    </div>
    <div className="bg-slate-50 dark:bg-zinc-800/20 px-5 py-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
      <div className="space-y-1">
        <div className="h-2 w-16 bg-slate-100 dark:bg-zinc-800 rounded" />
        <div className="h-5 w-24 bg-slate-100 dark:bg-zinc-800 rounded" />
      </div>
      <div className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 rounded-full" />
    </div>
  </div>
);

const Popular = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, cars, getCars, isLoading } = useCarStore();

  const [selectedCar, setSelectedCar] = useState(null);
  const [filterFuel,  setFilterFuel]  = useState('all');
  const [filterTrans, setFilterTrans] = useState('All');
  const [filterPrice, setFilterPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { getCars(); }, [getCars]);

  const hasActiveFilters =
    filterFuel !== 'all' || filterTrans !== 'All' || filterPrice !== 'all' || searchQuery;

  const resetFilters = () => {
    setFilterFuel('all');
    setFilterTrans('All');
    setFilterPrice('all');
    setSearchQuery('');
  };

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-6 transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Explore Fleet
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {isLoading
              ? <span className="animate-pulse">Fetching latest units...</span>
              : `${cars.filter(c => c.isAvailable).length} premium cars available for rent`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search brand or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              showFilters
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500'
            }`}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && !isLoading && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-6 shadow-xl dark:shadow-black/20 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Fuel Type</p>
              <div className="flex flex-wrap gap-2">
                {FUEL_OPTIONS.map(f => (
                  <button key={f} onClick={() => setFilterFuel(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterFuel === f
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:border-blue-300 dark:hover:border-blue-800'
                    }`}>{f === 'all' ? 'All' : f}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Transmission</p>
              <div className="flex flex-wrap gap-2">
                {TRANS_OPTIONS.map(t => (
                  <button key={t} onClick={() => setFilterTrans(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterTrans === t
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:border-blue-300 dark:hover:border-blue-800'
                    }`}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Daily Rate</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map(p => (
                  <button key={p.value} onClick={() => setFilterPrice(p.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterPrice === p.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:border-blue-300 dark:hover:border-blue-800'
                    }`}>{p.label}</button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <button onClick={resetFilters} className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors">
                <RotateCcw size={12} /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="pt-2">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <Cards
            filterFuel={filterFuel}
            filterTransmission={filterTrans}
            filterPrice={filterPrice}
            onSelect={(car) => setSelectedCar(car)}
          />
        )}
      </div>

    </div>
  );
};

export default Popular;