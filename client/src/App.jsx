import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import DoctorManagement from './pages/DoctorManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import ContactPage from './pages/ContactPage';
import HospitalWebsite from './pages/HospitalWebsite';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import ErrorPage from './pages/ErrorPage';

function AppContent() {
  const location = useLocation();
  const isDashboardOrLandingRoute = location.pathname.startsWith('/admin') ||
                                    location.pathname.startsWith('/doctor-management') ||
                                    location.pathname.startsWith('/appointment-management') ||
                                    location.pathname === '/' ||
                                    location.pathname === '/hospital';

  return (
    <div className={`flex flex-col min-h-screen ${isDashboardOrLandingRoute ? 'bg-[#050505] text-slate-100' : 'bg-slate-50'}`}>
      {!isDashboardOrLandingRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hospital" element={<HospitalWebsite />} />

          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <AdminLayout>
                  <PatientDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <AdminLayout>
                  <BookAppointment />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <AdminLayout>
                  <MyAppointments />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <AdminLayout>
                  <DoctorDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes wrapped in unified Layout */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <DoctorManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <AppointmentManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Error Status Routes */}
          <Route path="/unauthorized" element={<ErrorPage code={401} />} />
          <Route path="/forbidden" element={<ErrorPage code={403} />} />
          <Route path="/error" element={<ErrorPage code={500} />} />

          {/* Fallback */}
          <Route path="*" element={<ErrorPage code={404} />} />
        </Routes>
      </main>
      {!isDashboardOrLandingRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
