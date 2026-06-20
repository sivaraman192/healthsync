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
        navigate('/patient-dashboard');
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      {ToastComponent}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <span>📅</span> Book Consultation
        </h1>
        <p className="text-slate-500 mb-6">Select a certified specialist, schedule a suitable time slot and fill in the details.</p>

        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>No certified doctors are currently listed in our directory. (Admin can add new doctor profiles via the Admin Console).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Choose Doctor */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Medical Practitioner</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.name} - {doc.specialization} ({doc.experience} Years Exp)
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctor && (
              <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 text-sm text-teal-800 space-y-1">
                <p className="font-bold flex items-center gap-1"><User className="h-4 w-4" /> Doctor Schedule Info</p>
                <p>Available Days: <span className="font-semibold">{selectedDoctor.availableDays}</span></p>
                <p>Available Hours: <span className="font-semibold">{selectedDoctor.availableTime}</span></p>
              </div>
            )}

            {/* Choose Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Choose Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
              <input
                type="text"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                placeholder="e.g. 10:30 AM"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Visit</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly describe your symptoms or reason for scheduling..."
                rows="4"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition flex items-center justify-center"
            >
              {submitting ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
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
