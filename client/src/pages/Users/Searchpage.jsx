import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { SlidersHorizontal, RotateCcw, Image as ImageIcon, ServerCrash } from 'lucide-react';

// --- SKELETON COMPONENT ---
const CardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-5 space-y-5 animate-pulse">
    <div className="w-full aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center">
      <ImageIcon className="text-zinc-200 dark:text-zinc-800" size={40} />
    </div>
    <div className="space-y-3 px-2">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/2" />
        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/4" />
      </div>
      <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/3" />
      <div className="pt-4 flex gap-2">
        <div className="h-10 flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
        <div className="h-10 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
      </div>
    </div>
  </div>
);

const FUEL_OPTIONS  = ['all', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const TRANS_OPTIONS = ['All', 'Automatic', 'Manual'];
const PRICE_OPTIONS = [
  { value: 'all',        label: 'Any budget' },
  { value: 'under1000',  label: 'Under ₱1,000' },
  { value: '1000to2000', label: '₱1,000 – ₱2,000' },
  { value: '2000to3000', label: '₱2,000 – ₱3,000' },
  { value: 'above3000',  label: 'Above ₱3,000' },
];

const Searchpage = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, cars, getCars, isLoading, error } = useCarStore();

  const [selectedCar,  setSelectedCar]  = useState(null);
  const [filterFuel,   setFilterFuel]   = useState('all');
  const [filterTrans,  setFilterTrans]  = useState('All');
  const [filterPrice,  setFilterPrice]  = useState('all');
  const [showFilters,  setShowFilters]  = useState(false);

  useEffect(() => { getCars(); }, [getCars]);

  const hasActiveFilters =
    filterFuel !== 'all' || filterTrans !== 'All' || filterPrice !== 'all' || searchQuery;

  const resetFilters = () => {
    setFilterFuel('all');
    setFilterTrans('All');
    setFilterPrice('all');
    setSearchQuery('');
  };

  const fontStyle = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10" style={fontStyle}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3" />
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">
            {isLoading
              ? 'Synchronizing fleet data...'
              : `Curated selection: ${cars.filter(c => c.isAvailable).length} available units`}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3.5 rounded-2xl border transition-all duration-500 ${
              showFilters
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200 dark:shadow-none'
                : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:border-zinc-900 dark:hover:border-white'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && !isLoading && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] p-8 shadow-2xl shadow-zinc-100 dark:shadow-none animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Fuel Type */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.3em] block italic">Engine Config</label>
              <div className="flex flex-wrap gap-2">
                {FUEL_OPTIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterFuel(f)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all border uppercase ${
                      filterFuel === f
                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                        : 'bg-transparent border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.3em] block italic">Drivetrain</label>
              <div className="flex flex-wrap gap-2">
                {TRANS_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTrans(t)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all border uppercase ${
                      filterTrans === t
                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                        : 'bg-transparent border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.3em] block italic">Rate Bracket</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setFilterPrice(p.value)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all border uppercase ${
                      filterPrice === p.value
                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                        : 'bg-transparent border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-10 pt-6 border-t border-zinc-50 dark:border-zinc-900 flex justify-between items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-50">Filter overrides active</span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-[0.2em] transition-all group"
              >
                <RotateCcw size={12} className="group-hover:rotate-[-45deg] transition-transform" /> Reset Parameters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid Display */}
      <div className="relative min-h-[400px]">

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ServerCrash className="w-12 h-12 text-zinc-200 dark:text-zinc-800" />
            <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Failed to load fleet</p>
            <p className="text-[10px] text-rose-400 font-mono">{error}</p>
            <button
              onClick={() => getCars()}
              className="mt-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Cards */}
        {!isLoading && !error && (
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

export default Searchpage;