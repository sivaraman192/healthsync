import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
      showToast('Please enter email and password', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(formData);
      showToast('Logged in successfully', 'success');
      
      // Redirect based on role
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
      {ToastComponent}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-md w-full">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-1">Sign In to your HealthSync Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. yourname@mail.com"
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
            disabled={submitting}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition-all duration-150 flex items-center justify-center"
          >
            {submitting ? (
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-teal-600 font-semibold hover:underline">
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
