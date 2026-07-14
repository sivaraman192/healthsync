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
    <div className="space-y-10">
      {ToastComponent}

      {/* Header and Brand */}
      <div>
        <span className="text-[10px] text-red-550 font-extrabold uppercase tracking-widest bg-red-950/40 border border-red-800/30 px-3 py-1 rounded-full">
          Booking Ledger System
        </span>
        <h1 className="text-4xl font-black text-white mt-3 tracking-tight font-sans">Active Appointment Rosters</h1>
        <p className="text-slate-400 text-sm mt-1">Review Patient bookings, confirm schedule timelines, and manage triage database records.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-[#111827]/40 border border-slate-800/60 rounded-2xl p-12 text-center text-slate-500">
          <ShieldAlert className="h-10 w-10 text-slate-650 mx-auto mb-4" />
          <p className="font-semibold text-sm">No scheduled appointments found.</p>
        </div>
      ) : (
        <div className="bg-[#111827]/25 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-[10px] font-bold uppercase text-slate-500 tracking-wider bg-slate-900/10">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Patient Profile</th>
                  <th className="px-6 py-4">Doctor ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Reason for Visit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50 text-xs">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-550 font-mono">#{apt.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-200 block">{apt.patientName}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{apt.patientEmail}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">#{apt.doctorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-350 block">{apt.appointmentDate}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">{apt.appointmentTime}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-400 font-medium">{apt.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                        apt.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450' :
                        apt.status === 'ACCEPTED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                        apt.status === 'REJECTED' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        'bg-amber-500/10 border-amber-500/30 text-amber-455'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex gap-2.5 justify-end">
                        {apt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'ACCEPTED')}
                              className="text-emerald-400 hover:text-emerald-300 p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
                              title="Accept"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                              className="text-red-400 hover:text-red-350 p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
                              title="Reject"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="text-slate-450 hover:text-red-450 p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash className="h-3.5 w-3.5" />
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
