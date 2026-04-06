import React from "react";

const links = {
  Product: [
    { label: "Fleet", href: "/cars" },
    { label: "Pricing", href: "/pricing" },
    { label: "Locations", href: "/locations" },
    { label: "How it works", href: "/how-it-works" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund", href: "/refund" },
    { label: "Contact", href: "/contact" },
  ],
};

const Footer = () => (
  <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 px-8 py-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-2 gap-12 md:grid-cols-4">

        
        <div className="col-span-2">
          <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">supernova.</span>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
            Your trusted platform for effortless car rentals. Find the perfect ride or earn by listing yours.
          </p>
          {/* Twitter */}
          <a
            href="#"
            className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 transition-colors"
          >
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.857L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([group, items]) => (
          <div key={group}>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
              {group}
            </p>
            <ul className="space-y-3">
              {items.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-8 sm:flex-row">
        <p className="text-[10px] font-medium text-zinc-300 dark:text-zinc-700">
          © 2024 drivo. All rights reserved.
        </p>
        <p className="text-[10px] font-medium text-zinc-300 dark:text-zinc-700">
          Built with care.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;