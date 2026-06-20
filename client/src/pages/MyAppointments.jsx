import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/api';
import { useToast } from '../components/Toast';
import { Calendar, AlertCircle } from 'lucide-react';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  const loadAppointments = async () => {
    try {
      const res = await appointmentService.getByPatient(user.id);
      setAppointments(res.data);
    } catch (err) {
      showToast('Could not load appointment details.', 'error');
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
    if (window.confirm('Cancel this consultation slot?')) {
      try {
        await appointmentService.delete(id);
        showToast('Consultation slot cancelled successfully', 'success');
        loadAppointments();
      } catch (err) {
        showToast('Failed to cancel consultation', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {ToastComponent}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 font-sans">My Consultations</h1>
        <p className="text-slate-500 mt-1">Review dates, approval status, and notes from doctors.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700">No scheduled appointments</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Reason for Visit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Doctor Feedback / Notes</th>
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
                  <td className="px-6 py-4">
                    {apt.prescriptionNotes ? (
                      <span className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 block text-xs max-w-xs">{apt.prescriptionNotes}</span>
                    ) : (
                      <span className="text-slate-400 italic">No feedback provided yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-1 px-3 rounded text-xs transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
