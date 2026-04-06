import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I book a car?",
    answer: "Browse our fleet, select your preferred vehicle, choose your dates, and confirm. Verification is handled instantly.",
  },
  {
    question: "Is insurance included?",
    answer: "Yes, all rentals come with comprehensive insurance coverage. Your safety is always covered.",
  },
  {
    question: "What are the requirements to rent?",
    answer: "You need a valid driver's license, a government-issued ID, and must be at least 21 years old.",
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes. Cancel for free up to 24 hours before your scheduled pick-up time.",
  },
  {
    question: "Is there a mileage limit?",
    answer: "Most standard rentals come with unlimited mileage so you can focus on the road.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">FAQ</p>
            <span className="h-px w-5 bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-zinc-900 dark:text-white">
            Common{" "}
            <span className="text-zinc-300 dark:text-zinc-700">questions.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left gap-4"
                >
                  <span className={`text-sm font-medium transition-colors ${isOpen ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`}>
                    {faq.question}
                  </span>
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                    {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div className="mt-14 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/40 px-8 py-10 text-center">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Still have questions?</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
            Can't find what you're looking for? Chat with our team.
          </p>
          <button className="rounded-full bg-zinc-900 dark:bg-white px-6 py-2.5 text-xs font-semibold tracking-wide text-white dark:text-zinc-900 hover:opacity-80 transition-opacity">
            Contact Support
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;