import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Building, Sparkles, LogIn, Key, Mail } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };
      const loggedUser = await login(payload);
      showToast('Welcome back, ' + loggedUser.name + '!', 'success');
      
      setTimeout(() => {
        if (loggedUser.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (loggedUser.role === 'DOCTOR') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }, 1000);
    } catch (err) {
      showToast(err.response?.data?.message || (err.message === "Network Error" ? "Network Connection Error: Server is offline. Please start Spring Boot on port 8080." : "Login failed. Please verify credentials."), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 bg-[#030303] relative overflow-hidden font-sans select-none">
      {/* Background glow balls */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      
      {ToastComponent}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0f0f0f]/90 border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl max-w-md w-full relative z-10 backdrop-blur-2xl text-left"
      >
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-4">
            <Building className="h-6 w-6 text-white" />
          </div>
          <span className="text-[9px] text-cyan-405 font-extrabold uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full">
            Security Gate Active
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-4 tracking-tight">Console Login</h2>
          <p className="text-slate-400 text-xs mt-1">Access the HealthSync Clinical Core</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-500" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@healthsync.com"
              className="w-full px-4 py-3 bg-[#181818]/60 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-blue-500" /> Password
              </label>
              <button 
                type="button" 
                onClick={() => showToast('Please contact system administrator to reset password.', 'info')} 
                className="text-[9px] text-slate-500 hover:text-white hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#181818]/60 border border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {submitting ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white animate-pulse"></span>
            ) : (
              <span className="flex items-center gap-1.5">Sign In <LogIn className="h-4.5 w-4.5" /></span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-550">
          Don't have a patient account?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-400 font-bold hover:underline cursor-pointer">
            Register here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
