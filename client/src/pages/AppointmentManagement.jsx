import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import { useToast } from '../components/Toast';
import { Calendar, User, Clock, ShieldAlert, Check, X, Trash } from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  const loadAppointments = async () => {
    try {
      const res = await appointmentService.getAll();
      setAppointments(res.data);
    } catch (err) {
      showToast('Could not load appointment database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      showToast(`Appointment status updated to ${status}`, 'success');
      loadAppointments();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment record?')) {
      try {
        await appointmentService.delete(id);
        showToast('Appointment record deleted successfully', 'success');
        loadAppointments();
      } catch (err) {
        showToast('Failed to delete appointment record', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {ToastComponent}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Appointment Management</h1>
        <p className="text-slate-500 mt-1">Review Patient bookings, change scheduling status, and remove records.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
          <ShieldAlert className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700">No scheduled appointments</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-xs">#{apt.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{apt.patientName}</span>
                      <span className="text-xs text-slate-500 block">{apt.patientEmail}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">#{apt.doctorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{apt.appointmentDate}</span>
                      <span className="block text-xs text-slate-500">{apt.appointmentTime}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-600 font-medium">{apt.reason}</td>
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
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex gap-2 justify-end">
                        {apt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'ACCEPTED')}
                              className="text-emerald-600 hover:text-emerald-700 p-1 bg-emerald-50 rounded hover:bg-emerald-100 transition"
                              title="Accept"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-700 p-1 bg-red-50 rounded hover:bg-red-100 transition"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="text-slate-500 hover:text-red-600 p-1 hover:bg-slate-50 rounded transition"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
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

export default AppointmentManagement;
