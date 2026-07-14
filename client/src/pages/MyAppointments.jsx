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
    <div className="space-y-8 pb-10 text-left w-full relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      {ToastComponent}
      
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950/20 via-[#0d0d0d] to-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] uppercase font-black text-red-505 tracking-wider">Outpatient Journal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">My Consultations</h1>
          <p className="text-slate-400 text-xs">Review schedules, approval status, and notes from medical specialists.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-[#111111]/45 border border-slate-800/60 rounded-3xl p-12 text-center text-slate-500 relative z-10">
          <AlertCircle className="h-10 w-10 text-slate-650 mx-auto mb-4 animate-bounce" />
          <p className="font-semibold text-sm text-slate-350">No scheduled appointments</p>
        </div>
      ) : (
        <div className="bg-[#111111]/25 border border-slate-800/60 rounded-3xl overflow-hidden shadow-xl relative z-10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-[10px] font-bold uppercase text-slate-500 tracking-wider bg-slate-900/10">
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Reason for Visit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Doctor Feedback / Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50 text-xs">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-200 block">{apt.appointmentDate}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">{apt.appointmentTime}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-300 max-w-xs truncate">{apt.reason}</td>
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
                    <td className="px-6 py-4">
                      {apt.prescriptionNotes ? (
                        <span className="text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-900 block text-[11px] max-w-xs">{apt.prescriptionNotes}</span>
                      ) : (
                        <span className="text-slate-600 italic">No feedback provided yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {apt.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="bg-red-500/15 hover:bg-red-550/20 text-red-400 font-bold py-1.5 px-3 rounded-lg border border-red-500/20 text-[10px] transition-all cursor-pointer"
                        >
                          Cancel Slot
                        </button>
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

export default MyAppointments;
