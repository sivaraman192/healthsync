import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/api';
import { useToast } from '../components/Toast';
import { Calendar, AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      const res = await appointmentService.getByPatient(user.id);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.delete(id);
        showToast('Appointment cancelled successfully', 'success');
        loadAppointments();
      } catch (err) {
        showToast('Failed to cancel appointment', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {ToastComponent}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Patient Dashboard</h1>
          <p className="text-slate-500 mt-1">Hello, {user?.name}. Manage your appointments and view doctors' prescriptions.</p>
        </div>
        <Link to="/book-appointment" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition">
          Book Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg"><Calendar className="h-6 w-6" /></div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Scheduled</h3>
            <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-lg"><Clock className="h-6 w-6" /></div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Pending Status</h3>
            <p className="text-2xl font-bold text-slate-800">{appointments.filter(a => a.status === 'PENDING').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg"><CheckCircle className="h-6 w-6" /></div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Completed Visits</h3>
            <p className="text-2xl font-bold text-slate-800">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">Your Appointments</h2>
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700">No appointments scheduled</p>
          <p className="text-sm mt-1">Get started by booking your first visit with our doctors.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Prescription / Remarks</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{apt.appointmentDate}</span>
                      <span className="block text-xs text-slate-500">{apt.appointmentTime}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{apt.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                        apt.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-700' :
                        apt.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {apt.prescriptionNotes ? (
                        <div className="flex items-start gap-1 text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                          <FileText className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                          <span>{apt.prescriptionNotes}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {apt.status === 'PENDING' ? (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-1 px-3 rounded text-xs transition"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
