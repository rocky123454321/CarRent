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

const Recomended = () => {
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

export default Recomended;