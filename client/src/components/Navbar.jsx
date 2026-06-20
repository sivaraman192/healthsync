import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, Calendar, User, Settings, Phone } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-teal-600 font-bold text-xl">
              <Activity className="h-6 w-6 text-teal-500 animate-pulse" />
              <span className="tracking-wide">HealthSync</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/contact" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            
            {user ? (
              <>
                <Link to={getDashboardPath()} className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                  <User className="h-4 w-4" /> Dashboard
                </Link>
                {user.role === 'PATIENT' && (
                  <>
                    <Link to="/book-appointment" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Book Appointment
                    </Link>
                    <Link to="/my-appointments" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">My Appointments</Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/doctor-management" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Manage Doctors</Link>
                    <Link to="/appointment-management" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Manage Appointments</Link>
                  </>
                )}
                <span className="text-slate-400">|</span>
                <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">{user.name} ({user.role})</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-slate-700 hover:text-teal-600 px-4 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
