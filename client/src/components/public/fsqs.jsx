import React, { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a car?",
      answer: "Booking is simple. Just browse our fleet, select your preferred vehicle, choose your dates, and confirm your booking. Our AI system will handle the verification instantly."
    },
    {
      question: "Is insurance included in the price?",
      answer: "Yes, all our rentals come with comprehensive insurance coverage. We prioritize your safety and peace of mind on every journey."
    },
    {
      question: "What are the requirements to rent?",
      answer: "You need a valid driver's license, a government-issued ID, and you must be at least 21 years old. Some premium vehicles may require a higher age limit."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Absolutely. We offer flexible cancellation policies. You can cancel for free up to 24 hours before your scheduled pick-up time."
    },
    {
      question: "Is there a limit on mileage?",
      answer: "Most of our standard rentals come with unlimited mileage, so you can focus on the road ahead without worrying about extra costs."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24 px-6 transition-colors duration-500 dark:bg-slate-950 lg:px-16">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Frequently Asked <span className="text-indigo-600">Questions</span>
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
            Everything you need to know about our premium car rental service.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`overflow-hidden rounded-[2rem] border transition-all duration-300 ${
                  isOpen 
                    ? 'border-indigo-200 bg-indigo-50/30 shadow-xl shadow-indigo-500/5 dark:border-indigo-900/40 dark:bg-indigo-950/20' 
                    : 'border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-8 py-7 text-left outline-none"
                >
                  <span className={`text-lg font-bold tracking-tight transition-colors ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 rounded-full p-2 transition-all duration-300 ${isOpen ? 'rotate-180 bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                    {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                  </div>
                </button>
                
                {/* Smooth Height Transition Logic */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-8 pb-8 text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA Card */}
        <div className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-center dark:bg-indigo-950/40">
          {/* Subtle Glow Effect */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-600 opacity-20 blur-[80px]" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-600 opacity-20 blur-[80px]" />
          
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <MessageCircle size={24} />
            </div>
            <h4 className="mb-2 text-xl font-black text-white">Still have questions?</h4>
            <p className="mx-auto mb-8 max-w-sm text-sm font-medium text-slate-400 dark:text-indigo-200/60">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <button className="rounded-xl bg-white px-10 py-4 text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:scale-105 hover:bg-indigo-50 active:scale-95">
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;