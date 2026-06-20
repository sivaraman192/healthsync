import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useToast } from '../components/Toast';
import { Users, UserCheck, Calendar, Clock, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  const loadStats = async () => {
    try {
      const res = await dashboardService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch dashboard statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {ToastComponent}
      <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Review hospital statistics, doctor rosters, and user schedules.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/doctor-management" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition">
            Manage Doctors
          </Link>
          <Link to="/appointment-management" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition">
            Manage Appointments
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Stat 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg"><Users className="h-6 w-6" /></div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase">Total Patients</h3>
              <p className="text-2xl font-bold text-slate-800">{stats.totalPatients}</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg"><UserCheck className="h-6 w-6" /></div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase">Total Doctors</h3>
              <p className="text-2xl font-bold text-slate-800">{stats.totalDoctors}</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-teal-50 text-teal-600 p-3 rounded-lg"><Calendar className="h-6 w-6" /></div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</h3>
              <p className="text-2xl font-bold text-slate-800">{stats.totalAppointments}</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-lg"><Clock className="h-6 w-6" /></div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase">Pending</h3>
              <p className="text-2xl font-bold text-slate-800">{stats.pendingAppointments}</p>
            </div>
          </div>

          {/* Stat 5 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg"><CheckCircle className="h-6 w-6" /></div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase">Completed</h3>
              <p className="text-2xl font-bold text-slate-800">{stats.completedAppointments}</p>
            </div>
          </div>
        </div>
      )}

      {/* Roster & Schedule Links card helper */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-3xl">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Welcome to HealthSync Administration</h3>
        <p className="text-slate-600 text-sm mb-6">Use the menu links or the top buttons to quickly manage the doctor directory or change existing booking statuses.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/doctor-management" className="text-teal-600 hover:text-teal-700 font-semibold text-sm">→ Add or Edit Doctors</Link>
          <Link to="/appointment-management" className="text-teal-600 hover:text-teal-700 font-semibold text-sm">→ Review and Update Appointment Statuses</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
