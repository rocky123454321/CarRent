import React, { useState } from 'react';
import Cards from '../../components/user/Cards';
import BookingForm from '../../components/user/BookingForm';
import CarDetailView from './CarDetailView';

const Category = () => {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {selectedCar ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />
        </div>
      ) : (
        <>
          {/* Booking Form */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <BookingForm />
          </div>

          {/* Popular Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Popular Cars</h2>
              <button className="text-blue-600 font-semibold hover:underline">View all</button>
            </div>
            <Cards limit={3} onSelect={(car) => setSelectedCar(car)} />
          </section>

          {/* Recommended Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Recommended Cars</h2>
              <button className="text-blue-600 font-semibold hover:underline">View all</button>
            </div>
            <Cards limit={3} onSelect={(car) => setSelectedCar(car)} />
          </section>
        </>
      )}

    </div>
  );
};

export default Category;