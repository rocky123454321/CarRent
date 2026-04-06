import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { Search, SlidersHorizontal, Sparkles, RotateCcw } from 'lucide-react';

const FUEL_OPTIONS   = ['all', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const TRANS_OPTIONS  = ['All', 'Automatic', 'Manual'];
const PRICE_OPTIONS  = [
  { value: 'all',        label: 'Any budget' },
  { value: 'under1000',  label: 'Under ₱1,000' },
  { value: '1000to2000', label: '₱1,000 – ₱2,000' },
  { value: '2000to3000', label: '₱2,000 – ₱3,000' },
  { value: 'above3000',  label: 'Above ₱3,000' },
];

const Recomended = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, cars, getCars, isLoading } = useCarStore();

  const [selectedCar,     setSelectedCar]     = useState(null);
  const [filterFuel,      setFilterFuel]      = useState('all');
  const [filterTrans,     setFilterTrans]     = useState('All');
  const [filterPrice,     setFilterPrice]     = useState('all');
  const [showFilters,     setShowFilters]     = useState(false);

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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 dark:bg-white rounded-xl">
               <Sparkles size={18} className="text-white dark:text-zinc-950" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">
              Elite Picks<span className="text-zinc-300 dark:text-zinc-800">.</span>
            </h1>
          </div>
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">
            {isLoading ? 'Synchronizing fleet data...' : `Curated selection: ${cars.filter(c => c.isAvailable).length} available units`}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={15} />
            <input 
              type="text"
              placeholder="SEARCH BY MODEL OR BRAND..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl text-[10px] font-bold tracking-widest focus:border-zinc-900 dark:focus:border-white outline-none transition-all dark:text-white uppercase placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            />
          </div>
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
      {showFilters && (
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
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 z-10 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
          </div>
        )}
        <Cards
          filterFuel={filterFuel}
          filterTransmission={filterTrans}
          filterPrice={filterPrice}
          onSelect={(car) => setSelectedCar(car)}
        />
      </div>

    </div>
  );
};

export default Recomended;