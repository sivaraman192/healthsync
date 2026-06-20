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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {ToastComponent}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Doctor Dashboard</h1>
        <p className="text-slate-500 mt-1">Hello, Dr. {user?.name}. Check schedules, accept bookings and record prescription guidelines.</p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">Your Assigned Consultations</h2>
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
          <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700">No appointments assigned</p>
          <p className="text-sm mt-1">Appointments scheduled for you will display here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                    apt.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-700' :
                    apt.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {apt.status}
                  </span>
                  <span className="text-xs text-slate-400">Appointment ID: #{apt.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-slate-700">
                  <p className="flex items-center gap-1.5"><User className="h-4 w-4 text-slate-400" /> <span className="font-semibold">{apt.patientName}</span> ({apt.patientEmail})</p>
                  <p className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {apt.appointmentDate} at <span className="font-medium">{apt.appointmentTime}</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Reason for Visit</p>
                  <p className="text-slate-700 text-sm font-medium mt-0.5">{apt.reason}</p>
                </div>

                {apt.prescriptionNotes && (
                  <div className="mt-4 bg-teal-50/50 border border-teal-100 rounded-xl p-4">
                    <p className="text-xs text-teal-800 font-bold uppercase tracking-wider flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Prescribed Guidance</p>
                    <p className="text-slate-700 text-sm mt-1 font-medium italic">"{apt.prescriptionNotes}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between items-end gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 shrink-0">
                {/* Accept/Reject actions */}
                {apt.status === 'PENDING' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'ACCEPTED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-4 rounded-lg text-sm transition flex items-center gap-1 w-1/2 md:w-auto justify-center"
                    >
                      <CheckCircle className="h-4 w-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-1.5 px-4 rounded-lg text-sm transition flex items-center gap-1 w-1/2 md:w-auto justify-center"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                )}

                {/* Complete/Prescription entry */}
                {apt.status === 'ACCEPTED' && (
                  <div className="w-full md:w-72 space-y-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Write Prescription & Close</label>
                    <textarea
                      value={prescriptionText[apt.id] || ''}
                      onChange={(e) => handleTextChange(apt.id, e.target.value)}
                      placeholder="e.g. Paracetamol 500mg, rest for 3 days"
                      rows="2"
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                    <button
                      onClick={() => handlePrescriptionSubmit(apt.id)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-1.5 rounded-lg text-sm font-semibold shadow transition"
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
