import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-appointment"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-appointments"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-management"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DoctorManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-management"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AppointmentManagement />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
