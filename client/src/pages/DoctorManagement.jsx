import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/api';
import { useToast } from '../components/Toast';
import { UserPlus, Edit, Trash, AlertCircle } from 'lucide-react';

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
        await doctorService.update(editId, updatePayload);
        showToast('Doctor profile updated successfully', 'success');
      } else {
        await doctorService.create(formData);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {ToastComponent}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Doctor Management</h1>
        <p className="text-slate-500 mt-1">Configure credentials, specializations, and schedule directories for HealthSync doctors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            {editId ? '✏️ Edit Doctor Profile' : '➕ Register Doctor'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Sarah Connor"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            {!editId && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@healthsync.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 321-4455"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Cardiology"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="8"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Days</label>
              <input
                type="text"
                name="availableDays"
                value={formData.availableDays}
                onChange={handleChange}
                placeholder="Mon, Wed, Fri"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Time</label>
              <input
                type="text"
                name="availableTime"
                value={formData.availableTime}
                onChange={handleChange}
                placeholder="09:00 AM - 02:00 PM"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-sm shadow transition flex justify-center"
              >
                {submitting ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                ) : editId ? (
                  'Update'
                ) : (
                  'Add Doctor'
                )}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Directory Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Doctor Directory ({doctors.length})</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="font-semibold">No doctors registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-base">Dr. {doc.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold uppercase">{doc.specialization} • {doc.experience} Years Exp</p>
                    <p className="text-xs text-slate-500">Email: {doc.email}</p>
                    {doc.phone && <p className="text-xs text-slate-500">Phone: {doc.phone}</p>}
                    <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                      <p className="font-bold text-slate-700 uppercase tracking-wide text-[10px] mb-0.5">Availability</p>
                      <p>{doc.availableDays || 'Not set'} @ {doc.availableTime || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end border-t border-slate-50 pt-3">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-slate-600 hover:text-teal-600 p-1.5 hover:bg-slate-50 rounded transition text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition text-xs flex items-center gap-1 font-semibold"
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
