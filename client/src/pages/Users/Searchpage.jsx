import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { SlidersHorizontal, RotateCcw, Image as ImageIcon, ServerCrash, Search } from 'lucide-react';

// --- SKELETON COMPONENT ---
const CardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-5 space-y-5 animate-pulse">
    <div className="w-full aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center">
      <ImageIcon className="text-zinc-200 dark:text-zinc-800" size={40} />
    </div>
    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/2 mx-auto" />
  </div>
);
//
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
  const { searchQuery, setSearchQuery, getCars, isLoading, error } = useCarStore();
  const [selectedCar, setSelectedCar] = useState(null);
  const [filterFuel, setFilterFuel] = useState('all');
  const [filterTrans, setFilterTrans] = useState('All');
  const [filterPrice, setFilterPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { getCars(); }, [getCars]);

  const hasActiveFilters = filterFuel !== 'all' || filterTrans !== 'All' || filterPrice !== 'all' || searchQuery;

  const resetFilters = () => {
    setFilterFuel('all'); setFilterTrans('All'); setFilterPrice('all'); setSearchQuery('');
  };

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto lg:max-w-none lg:justify-end">
        <div className='flex lg:hidden relative w-full max-w-[240px]'> 
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="SEARCH..."
            autoFocus
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-1 ring-zinc-200 dark:ring-zinc-800 outline-none text-[10px] font-bold tracking-widest transition-all"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-2xl transition-all duration-500 border z-[60] ${
            showFilters
              ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
              : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 text-zinc-400'
          }`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <div className="relative">
        {/* --- CLICK OUTSIDE OVERLAY --- */}
        {showFilters && (
          <div 
            className="fixed inset-0 z-40 bg-black/5 dark:bg-black/20" 
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Floating Filter Panel */}
        {showFilters && !isLoading && (
          <div className="absolute top-0 left-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl animate-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest italic">Engine</label>
                <div className="flex flex-wrap gap-2">
                  {FUEL_OPTIONS.map(f => (
                    <button key={f} onClick={() => setFilterFuel(f)} className={`px-4 py-2 rounded-xl text-[9px] font-bold border uppercase transition-all ${filterFuel === f ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white/50 dark:bg-zinc-900/50 border-zinc-100 text-zinc-400'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest italic">Drivetrain</label>
                <div className="flex flex-wrap gap-2">
                  {TRANS_OPTIONS.map(t => (
                    <button key={t} onClick={() => setFilterTrans(t)} className={`px-4 py-2 rounded-xl text-[9px] font-bold border uppercase transition-all ${filterTrans === t ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white/50 dark:bg-zinc-900/50 border-zinc-100 text-zinc-400'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest italic">Rate</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_OPTIONS.map(p => (
                    <button key={p.value} onClick={() => setFilterPrice(p.value)} className={`px-4 py-2 rounded-xl text-[9px] font-bold border uppercase transition-all ${filterPrice === p.value ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white/50 dark:bg-zinc-900/50 border-zinc-100 text-zinc-400'}`}>{p.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
                <button onClick={resetFilters} className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest"><RotateCcw size={12} /> Reset</button>
              </div>
            )}
          </div>
        )}

        {/* Grid Display */}
        <div className="relative pt-2">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
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
    </div>
  );
};

export default Searchpage;