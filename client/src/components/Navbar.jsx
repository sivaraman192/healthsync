import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Building, LogOut, Calendar, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, ToastComponent } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  const isHome = location.pathname === '/' || location.pathname === '/hospital';

  return (
    <nav
      className="border-b border-white/5 py-4 px-6 md:px-12 select-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 99999,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'none',
        transform: 'none',
      }}
    >
      {ToastComponent}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">HealthSync</span>
              <span className="text-[8px] font-black text-cyan-405 ml-1.5 uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-full">HQ</span>
            </div>
          </Link>
        </div>

        {/* Menu Links */}
        <div className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-400">
          {isHome ? (
            <>
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About Hospital</a>
              <a href="#departments" className="hover:text-white transition-colors">Departments</a>
              <a href="#doctors" className="hover:text-white transition-colors">Doctors</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/#about" className="hover:text-white transition-colors">About Hospital</Link>
              <Link to="/#departments" className="hover:text-white transition-colors">Departments</Link>
              <Link to="/#doctors" className="hover:text-white transition-colors">Doctors</Link>
              <Link to="/#services" className="hover:text-white transition-colors">Services</Link>
              <Link to="/#contact" className="hover:text-white transition-colors">Contact</Link>
            </>
          )}

          {user ? (
            <>
              <Link to={getDashboardPath()} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                <User className="h-4 w-4" /> Dashboard
              </Link>
              {user.role === 'PATIENT' && (
                <Link to="/book-appointment" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Book Appointment
                </Link>
              )}
              <span className="text-slate-700">|</span>
              <span className="text-xs font-bold text-blue-450 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-400 hover:text-white px-3 py-2 transition-colors">Login</Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-cyan-550 hover:from-blue-550 hover:to-cyan-405 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
