import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorService, appointmentService } from '../services/api';
import { useToast } from '../components/Toast';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';

const BookAppointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientEmail: user?.email || '',
    patientId: user?.id || '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });

  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.name || '',
        patientEmail: user.email || '',
        patientId: user.id || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorService.getAll();
        setDoctors(res.data);
      } catch (err) {
        showToast('Failed to load doctors list.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime || !formData.reason) {
      showToast('All fields are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentService.create(formData);
      showToast('Appointment booked successfully! Pending Doctor review.', 'success');
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      showToast('Failed to book appointment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find((doc) => doc.id === parseInt(formData.doctorId));

  return (
    <div className="space-y-8 pb-10 text-left w-full relative">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      {ToastComponent}
      
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950/20 via-[#0d0d0d] to-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] uppercase font-black text-red-505 tracking-wider">Outpatient Scheduler</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Book Consultation</h1>
          <p className="text-slate-400 text-xs">Select a certified specialist, schedule a suitable time slot and fill in the details.</p>
        </div>
      </div>

      <div className="bg-[#0c0c0e]/60 border border-white/5 rounded-3xl p-8 shadow-xl relative z-10 backdrop-blur-md max-w-3xl">

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-red-550/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>No certified doctors are currently listed in our directory. (Admin can add new doctor profiles via the Admin Console).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Choose Doctor */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Medical Practitioner</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-205 transition-colors"
              >
                <option value="" className="bg-[#111111]">-- Choose Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id} className="bg-[#111111]">
                    Dr. {doc.name} - {doc.specialization} ({doc.experience} Years Exp)
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctor && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-xs text-slate-350 space-y-1">
                <p className="font-bold flex items-center gap-1 text-slate-200"><User className="h-4 w-4 text-red-500" /> Doctor Schedule Info</p>
                <p>Available Days: <span className="font-semibold text-slate-200">{selectedDoctor.availableDays}</span></p>
                <p>Available Hours: <span className="font-semibold text-slate-200">{selectedDoctor.availableTime}</span></p>
              </div>
            )}

            {/* Choose Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 transition-colors"
              />
            </div>

            {/* Choose Time */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preferred Time Slot</label>
              <input
                type="text"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                placeholder="e.g. 10:30 AM"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for Visit</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly describe your symptoms or reason for scheduling..."
                rows="4"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655 transition-colors"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gradient-to-r from-red-655 to-rose-500 hover:from-red-500 hover:to-rose-450 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-500/10 transition flex items-center justify-center cursor-pointer"
            >
              {submitting ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white animate-pulse"></span>
              ) : (
                'Schedule Appointment'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
