import React from 'react';
import Cards from '../components/Cards';
import BookingForm from '../components/BookingForm';

const Category = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Booking Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <BookingForm />
      </div>

      {/* Popular Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Popular Cars</h2>
          <button className="text-blue-600 font-semibold hover:underline">
            View all
          </button>
        </div>

        <Cards limit={3} />
      </section>

      {/* Recommended Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recommended Cars</h2>
          <button className="text-blue-600 font-semibold hover:underline">
            View all
          </button>
        </div>

        <Cards limit={3} />
      </section>
    </div>
  );
};

export default Category;

