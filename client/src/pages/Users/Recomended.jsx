import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { Search, X, SlidersHorizontal, ChevronDown, Sparkles, RotateCcw } from 'lucide-react';

const FUEL_OPTIONS   = ['all', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const TRANS_OPTIONS  = ['All', 'Automatic', 'Manual'];
const PRICE_OPTIONS  = [
  { value: 'all',        label: 'Any price' },
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

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-6 transition-colors duration-300">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-blue-500 fill-blue-500/20" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Recommended
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {isLoading ? 'Scanning fleet...' : `Found ${cars.filter(c => c.isAvailable).length} cars matching your profile`}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border transition-all duration-300 ${
              showFilters 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' 
              : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500'
            }`}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-2xl dark:shadow-black/40 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Fuel Type */}
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">Fuel Engine</label>
              <div className="flex flex-wrap gap-2">
                {FUEL_OPTIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterFuel(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterFuel === f
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {f === 'all' ? 'All Types' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">Transmission</label>
              <div className="flex flex-wrap gap-2">
                {TRANS_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTrans(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterTrans === t
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">Budget / Day</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setFilterPrice(p.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterPrice === p.value
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
               <span className="text-[10px] font-medium text-slate-400 italic">Filters are actively modifying the list</span>
               <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <RotateCcw size={12} /> Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid Display */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 backdrop-blur-[1px] rounded-3xl transition-all" />
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