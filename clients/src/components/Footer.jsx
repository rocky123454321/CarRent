import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-10 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl lg:text-3xl font-black mb-4">SUPERNOVA</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-md">
            Your trusted platform for effortless car rentals. Find the perfect ride or earn by listing yours.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          
            
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="/services" className="text-slate-400 hover:text-white transition duration-200 font-medium">Services</a></li>
            <li><a href="/cars" className="text-slate-400 hover:text-white transition duration-200 font-medium">Cars</a></li>
            <li><a href="/pricing" className="text-slate-400 hover:text-white transition duration-200 font-medium">Pricing</a></li>
            <li><a href="/about" className="text-slate-400 hover:text-white transition duration-200 font-medium">About</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xl font-bold mb-6">Legal</h4>
          <ul className="space-y-3">
            <li><a href="/privacy" className="text-slate-400 hover:text-white transition duration-200 font-medium">Privacy</a></li>
            <li><a href="/terms" className="text-slate-400 hover:text-white transition duration-200 font-medium">Terms</a></li>
            <li><a href="/refund" className="text-slate-400 hover:text-white transition duration-200 font-medium">Refund</a></li>
            <li><a href="/contact" className="text-slate-400 hover:text-white transition duration-200 font-medium">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 pt-8 mt-12 text-center">
        <p className="text-slate-400 text-lg font-medium">
          © 2024 SUPERNOVA. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


