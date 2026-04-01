import React, { useState } from 'react';
import Cards from '../../components/user/Cards';
import CarDetailView from './CarDetailView';

const Category = () => {
  const [selectedCar, setSelectedCar] = useState(null);

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