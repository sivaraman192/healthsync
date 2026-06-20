import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useToast } from '../components/Toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'PATIENT' // Fixed role for public signups (PATIENT)
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      showToast('All fields are required', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      {ToastComponent}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-1">Register as a Patient for HealthSync</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 000-1234"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition-all duration-150 flex items-center justify-center"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-600">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="text-teal-600 font-semibold hover:underline">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
