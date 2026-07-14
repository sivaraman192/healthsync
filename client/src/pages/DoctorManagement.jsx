import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/api';
import { useToast } from '../components/Toast';
import { UserPlus, Edit, Trash, AlertCircle, Sparkles } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    availableDays: '',
    availableTime: '',
    password: '',
  });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const loadDoctors = async () => {
    try {
      const res = await doctorService.getAll();
      setDoctors(res.data);
    } catch (err) {
      showToast('Could not load doctor registry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.specialization || !formData.experience) {
      showToast('Name, Email, Specialization and Experience are required.', 'error');
      return;
    }

    if (!editId && !formData.password) {
      showToast('Password is required for registering a new doctor.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editId) {
        // Exclude password from update payload to avoid overwriting password inadvertently
        const { password, ...updatePayload } = formData;
        const payload = {
          ...updatePayload,
          experience: Number(updatePayload.experience)
        };
        console.log("Axios request payload (update):", payload);
        await doctorService.update(editId, payload);
        showToast('Doctor profile updated successfully', 'success');
      } else {
        const payload = {
          ...formData,
          experience: Number(formData.experience)
        };
        console.log("Axios request payload (create):", payload);
        await doctorService.create(payload);
        showToast('New doctor added successfully', 'success');
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        availableDays: '',
        availableTime: '',
        password: '',
      });
      setEditId(null);
      loadDoctors();
    } catch (err) {
      showToast('Operation failed. Check details.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (doc) => {
    setEditId(doc.id);
    setFormData({
      name: doc.name,
      email: doc.email,
      phone: doc.phone || '',
      specialization: doc.specialization,
      experience: doc.experience,
      availableDays: doc.availableDays || '',
      availableTime: doc.availableTime || '',
      password: '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this doctor from the registry?')) {
      try {
        await doctorService.delete(id);
        showToast('Doctor deleted successfully', 'success');
        loadDoctors();
      } catch (err) {
        showToast('Failed to delete doctor profile', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      availableDays: '',
      availableTime: '',
      password: '',
    });
  };

  return (
    <div className="space-y-10">
      {ToastComponent}

      {/* Header and Brand */}
      <div>
        <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest bg-red-950/40 border border-red-800/30 px-3 py-1 rounded-full">
          Roster Management System
        </span>
        <h1 className="text-4xl font-black text-white mt-3 tracking-tight font-sans">Medical Practitioners Registry</h1>
        <p className="text-slate-400 text-sm mt-1">Configure credentials, specialization attributes, and duty schedules for HealthSync doctors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-slate-900/25 border border-slate-800/60 p-6 rounded-2xl shadow-xl h-fit relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-full" />
          <h3 className="text-base font-bold text-slate-100 mb-5 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-red-500" />
            {editId ? 'Edit Doctor Profile' : 'Register Doctor'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Sarah Connor"
                className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
              />
            </div>
            {!editId && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@healthsync.com"
                className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 321-4455"
                className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Cardiology"
                  className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Exp (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="8"
                  className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Available Days</label>
              <input
                type="text"
                name="availableDays"
                value={formData.availableDays}
                onChange={handleChange}
                placeholder="Mon, Wed, Fri"
                className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Available Time</label>
              <input
                type="text"
                name="availableTime"
                value={formData.availableTime}
                onChange={handleChange}
                placeholder="09:00 AM - 02:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-905/60 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655 transition-colors"
              />
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-red-605 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-red-500/10 transition-all flex justify-center cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                ) : editId ? (
                  'Update Profile'
                ) : (
                  'Add Practitioner'
                )}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer border border-slate-750"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Directory Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-100">Registered Roster Directory ({doctors.length})</h3>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-[#111827]/40 border border-slate-800/60 rounded-2xl p-12 text-center text-slate-500">
              <AlertCircle className="h-10 w-10 text-slate-650 mx-auto mb-4" />
              <p className="font-semibold text-sm">No doctors registered yet.</p>
              <p className="text-xs text-slate-600 mt-1">Use the registry panel to create a doctor shift roster.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-[#111827]/40 border border-slate-800/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-750 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full" />
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">Dr. {doc.name}</h4>
                      <span className="inline-block mt-1 text-[9px] font-bold text-red-400 bg-red-950/40 border border-red-800/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {doc.specialization}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p>Experience: {doc.experience} Years</p>
                      <p className="truncate">Email: {doc.email}</p>
                      {doc.phone && <p>Phone: {doc.phone}</p>}
                    </div>
                    <div className="pt-2 text-[10px] text-slate-350 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                      <p className="font-bold text-slate-500 uppercase tracking-wider text-[9px] mb-0.5">Shift Telemetry</p>
                      <p>{doc.availableDays || 'Not set'} @ {doc.availableTime || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end border-t border-slate-850/60 pt-3 mt-4">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-slate-450 hover:text-red-400 p-1.5 hover:bg-slate-900 rounded-lg transition-colors text-[10px] flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-405/80 hover:text-red-400 p-1.5 hover:bg-red-500/5 rounded-lg transition-colors text-[10px] flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
