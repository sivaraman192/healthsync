import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { useToast } from '../components/Toast';
import { Building, Sparkles, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    address: '',
    city: '',
    state: '',
    pincode: '',
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Core validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      showToast('Mandatory fields: Name, Email, Password, Confirm Password and Phone.', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        medicalHistory: formData.medicalHistory
      };

      await authService.register(payload);
      showToast('Registration successful! Redirecting to Login...', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] py-16 flex items-center justify-center px-6 bg-[#030303] relative overflow-hidden font-sans select-none">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {ToastComponent}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0f0f0f]/90 border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl max-w-2xl w-full relative z-10 backdrop-blur-2xl text-left"
      >
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-4">
            <Building className="h-6 w-6 text-white" />
          </div>
          <span className="text-[9px] text-cyan-405 font-extrabold uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full">
            Patient Self-Registration
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-4 tracking-tight">Create Medical Profile</h2>
          <p className="text-slate-400 text-xs mt-1">Register for appointment bookings & EHR vaults</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">1. Personal Credentials</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Demographics */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">2. Demographics & Contact</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#181818] border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#181818] border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-1234"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Metropolis"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Medical History */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">3. Clinical Background</h3>
            
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Medical History (Chronic illness, drug allergies, surgeries)</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Type-2 Diabetes under insulin, penicillin allergy, no active surgeries..."
                className="w-full px-4 py-3 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white animate-pulse"></span>
            ) : (
              <span className="flex items-center gap-1.5">Register Profile <UserPlus className="h-4.5 w-4.5" /></span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-550">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-400 font-bold hover:underline cursor-pointer">
            Log In here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
