import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-teal-400 font-extrabold text-xl">🏥</span> HealthSync
            </h3>
            <p className="text-sm">
              Making healthcare smart, responsive, and patient-centric. Book appointments effortlessly with top certified specialists.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-teal-400 transition">Home</a></li>
              <li><a href="/contact" className="hover:text-teal-400 transition">Contact Us</a></li>
              <li><a href="/register" className="hover:text-teal-400 transition">Join as Patient</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/login?role=PATIENT" className="hover:text-teal-400 transition">Patient Portal</a></li>
              <li><a href="/login?role=DOCTOR" className="hover:text-teal-400 transition">Doctor Portal</a></li>
              <li><a href="/login?role=ADMIN" className="hover:text-teal-400 transition">Admin Console</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Emergency</h4>
            <p className="text-sm mb-2 text-red-400 font-medium">Need Urgent Help?</p>
            <p className="text-white font-bold text-lg">Call: 1-800-HEALTH-SYNC</p>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-8 pt-8 text-center text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} HealthSync. All rights reserved.</p>
          <p className="flex items-center gap-1 justify-center">
            Designed with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for recruiters and patients.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
