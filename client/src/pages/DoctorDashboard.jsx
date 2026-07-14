import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService, doctorService } from '../services/api';
import { useToast } from '../components/Toast';
import { Calendar, User, FileText, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptionText, setPrescriptionText] = useState({});
  const { showToast, ToastComponent } = useToast();

  const loadAppointments = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      // Fetch assigned appointments based on doctor profile ID
      let doctorId = null;
      try {
        const docRes = await doctorService.getByEmail(user.email);
        doctorId = docRes.data?.id;
      } catch (emailErr) {
        console.warn("Could not find doctor by email endpoint, trying fallback to fetch all", emailErr);
        // Fallback: fetch all doctors and find by email
        const allDocsRes = await doctorService.getAll();
        const foundDoc = allDocsRes.data.find(d => d.email?.toLowerCase() === user.email.toLowerCase());
        if (foundDoc) {
          doctorId = foundDoc.id;
        }
      }

      if (!doctorId) {
        showToast('Doctor profile not found for logged in user.', 'error');
        setAppointments([]);
        setLoading(false);
        return;
      }

      const res = await appointmentService.getByDoctor(doctorId);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadAppointments();
    }
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      showToast(`Appointment status updated to ${status}`, 'success');
      loadAppointments();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handlePrescriptionSubmit = async (id) => {
    const notes = prescriptionText[id];
    if (!notes || !notes.trim()) {
      showToast('Please enter prescription notes', 'error');
      return;
    }

    try {
      await appointmentService.updatePrescription(id, notes);
      showToast('Prescription notes saved successfully', 'success');
      // Update local state to avoid refetching everything
      setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, prescriptionNotes: notes, status: 'COMPLETED' } : apt));
      setPrescriptionText(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      showToast('Failed to save prescription notes', 'error');
    }
  };

  const handleTextChange = (id, text) => {
    setPrescriptionText(prev => ({ ...prev, [id]: text }));
  };

  return (
    <div className="space-y-8 pb-10 text-left w-full">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      {ToastComponent}
      
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950/20 via-[#0d0d0d] to-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
            <span className="text-[9px] uppercase font-black text-purple-405 tracking-wider">Practitioner Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Consultation Console</h1>
          <p className="text-slate-400 text-xs">Hello, Dr. {user?.name}. Manage consultations, update booking slots and record e-prescriptions.</p>
        </div>
      </div>

      <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">Your Assigned Consultations</h2>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-[#111111]/45 border border-slate-800/60 rounded-3xl p-12 text-center text-slate-500 relative z-10">
          <Calendar className="h-10 w-10 text-slate-655 mx-auto mb-4" />
          <p className="font-semibold text-slate-350 text-sm">No appointments assigned</p>
          <p className="text-xs text-slate-500 mt-1">Appointments scheduled for you will display here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 relative z-10">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-[#111111]/45 border border-slate-800/60 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6 hover:border-slate-700/60 transition-all duration-300">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                    apt.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450' :
                    apt.status === 'ACCEPTED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                    apt.status === 'REJECTED' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                    'bg-amber-500/10 border-amber-500/30 text-amber-455'
                  }`}>
                    {apt.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Appt ID: #{apt.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-slate-300">
                  <p className="flex items-center gap-1.5"><User className="h-4 w-4 text-slate-550" /> <span className="font-semibold text-slate-200">{apt.patientName}</span> ({apt.patientEmail})</p>
                  <p className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-550" /> {apt.appointmentDate} at <span className="font-medium text-slate-200">{apt.appointmentTime}</span></p>
                </div>
                <div className="pt-1.5">
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Reason for Visit</p>
                  <p className="text-slate-300 text-xs font-semibold mt-0.5">{apt.reason}</p>
                </div>

                {apt.prescriptionNotes && (
                  <div className="mt-4 bg-slate-950 p-4 border border-slate-900 rounded-2xl">
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-wider flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-red-500" /> Prescribed Guidance</p>
                    <p className="text-slate-350 text-xs mt-1 font-semibold italic">"{apt.prescriptionNotes}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between items-end gap-4 border-t md:border-t-0 border-slate-900 pt-4 md:pt-0 shrink-0">
                {/* Accept/Reject actions */}
                {apt.status === 'PENDING' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'ACCEPTED')}
                      className="bg-emerald-500/10 hover:bg-emerald-555/20 border border-emerald-500/20 text-emerald-400 font-bold py-1.5 px-4 rounded-xl text-xs transition flex items-center gap-1 w-1/2 md:w-auto justify-center cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                      className="bg-red-500/15 hover:bg-red-550/20 border border-red-500/20 text-red-400 font-bold py-1.5 px-4 rounded-xl text-xs transition flex items-center gap-1 w-1/2 md:w-auto justify-center cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                )}

                {/* Complete/Prescription entry */}
                {apt.status === 'ACCEPTED' && (
                  <div className="w-full md:w-72 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Write Prescription & Close</label>
                    <textarea
                      value={prescriptionText[apt.id] || ''}
                      onChange={(e) => handleTextChange(apt.id, e.target.value)}
                      placeholder="e.g. Paracetamol 500mg, rest for 3 days"
                      rows="2"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl p-2.5 text-xs outline-none text-slate-200 placeholder-slate-655"
                    ></textarea>
                    <button
                      onClick={() => handlePrescriptionSubmit(apt.id)}
                      className="w-full bg-gradient-to-r from-red-655 to-rose-500 hover:from-red-500 hover:to-rose-450 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-500/10 transition cursor-pointer"
                    >
                      Submit & Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
