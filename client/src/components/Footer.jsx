import React from 'react';
import { Heart, Building } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-slate-500 py-12 mt-auto border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-white font-black text-lg flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-450 flex items-center justify-center font-bold text-white text-xs">
                <Building className="h-4 w-4" />
              </div>
              <span className="tracking-tight">HealthSync</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Making healthcare smart, responsive, and patient-centric. Book appointments effortlessly with top certified specialists.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="/contact" className="hover:text-red-400 transition-colors">Contact Us</a></li>
              <li><a href="/register" className="hover:text-red-400 transition-colors">Join as Patient</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/login?role=PATIENT" className="hover:text-red-400 transition-colors">Patient Portal</a></li>
              <li><a href="/login?role=DOCTOR" className="hover:text-red-400 transition-colors">Doctor Portal</a></li>
              <li><a href="/login?role=ADMIN" className="hover:text-red-400 transition-colors">Admin Console</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Emergency</h4>
            <p className="text-xs mb-1.5 text-red-450 font-bold">Need Urgent Help?</p>
            <p className="text-white font-black text-base">Call: 1-800-HEALTH-SYNC</p>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-8 pt-8 text-center text-[10px] flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
          <p>&copy; {new Date().getFullYear()} HealthSync. Powered by StackKraft. All rights reserved.</p>
          <p className="flex items-center gap-1 justify-center">
            Designed with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> for medical excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
