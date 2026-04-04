import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarStore } from '../../store/CarStore';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const FUEL_OPTIONS   = ['all', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const TRANS_OPTIONS  = ['All', 'Automatic', 'Manual'];
const PRICE_OPTIONS  = [
  { value: 'all',        label: 'Any price' },
  { value: 'under1000',  label: 'Under ₱1,000' },
  { value: '1000to2000', label: '₱1,000 – ₱2,000' },
  { value: '2000to3000', label: '₱2,000 – ₱3,000' },
  { value: 'above3000',  label: 'Above ₱3,000' },
];

const Popular = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, cars, getCars, isLoading } = useCarStore();

  const [selectedCar,    setSelectedCar]    = useState(null);
  const [filterFuel,     setFilterFuel]     = useState('all');
  const [filterTrans,    setFilterTrans]    = useState('All');
  const [filterPrice,    setFilterPrice]    = useState('all');
  const [showFilters,    setShowFilters]    = useState(false);

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
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">All Cars</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isLoading ? 'Loading...' : `${cars.filter(c => c.isAvailable).length} available cars`}
        </p>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand, model, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(p => !p)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition
            ${showFilters || hasActiveFilters
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 bg-white/30 rounded-full text-[10px] flex items-center justify-center font-bold">
              {[filterFuel !== 'all', filterTrans !== 'All', filterPrice !== 'all', !!searchQuery].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">

          {/* Fuel */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Fuel Type</p>
            <div className="flex flex-wrap gap-2">
              {FUEL_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilterFuel(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                    ${filterFuel === f
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Transmission</p>
            <div className="flex flex-wrap gap-2">
              {TRANS_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterTrans(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                    ${filterTrans === t
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Price Range</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_OPTIONS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setFilterPrice(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                    ${filterPrice === p.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Cars Grid — reuses your existing Cards component */}
      <Cards
        filterFuel={filterFuel}
        filterTransmission={filterTrans}
        filterPrice={filterPrice}
        onSelect={(car) => setSelectedCar(car)}
      />

    </div>
  );
};

export default Popular;