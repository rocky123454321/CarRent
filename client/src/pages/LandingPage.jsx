import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/hero.jsx';
import Cards from '../components/Cards.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Footer from '../components/Footer.jsx';
import Navigation from '../components/navigation2.jsx';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation/>
      <Hero />
      <HowItWorks />

      {/* Featured Cars Section */}
      <section className="py-24 px-6 lg:px-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          {/* Heading */}
          <div className="mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-4">
              Featured Cars
            </h2>
            <p className="text-lg lg:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover our top picks. Rent premium vehicles at unbeatable prices.
            </p>
          </div>

          {/* Car Cards */}
          <div className="flex justify-center">
            <div className="w-full max-w-7xl">
              <Cards />
            </div>
          </div>

          {/* Button */}
          <div className="mt-10">
            <Link to="/cars">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 lg:px-8 lg:py-4 text-lg lg:text-xl font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-300 border-0 tracking-wide uppercase">
                See All Cars
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

