import React from 'react';
import carImage from '../../assets/carpichero.png';

const steps = [
  {
    number: '01',
    title: 'Browse and select',
    description: 'Choose from our wide range of premium cars, select the pickup and return dates and locations that suit you best.'
  },
  {
    number: '02',
    title: 'Book and confirm',
    description: 'Book your desired car with just a few clicks and receive an instant confirmation via email or SMS.'
  },
  {
    number: '03',
    title: 'Enjoy your ride',
    description: 'Pick up your car at the designated location and enjoy your premium driving experience with our top-quality vehicles.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 lg:px-24 bg-white">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">How it works</h2>
        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
          Renting a luxury car has never been easier. Our streamlined process makes it simple for you to book and confirm your vehicle of choice online.
        </p>
      </div>

      {/* Steps + Image */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 max-w-7xl mx-auto">
        
        {/* Left: Steps */}
        <div className="flex-1 flex flex-col gap-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4 p-6 bg-white shadow-md rounded-2xl items-start hover:shadow-2xl transition-shadow duration-300">
              
              {/* Step Number */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-xl text-lg">
                {step.number}
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Car Image */}
        <div className="flex-shrink-0 w-full lg:w-1/2 mb-8 lg:mb-0">
          <img 
            src={carImage} 
            alt="Car" 
            className="w-full h-auto rounded-3xl shadow-xl object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;