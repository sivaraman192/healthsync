import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { appointmentService, patientService, notificationService, prescriptionService } from '../services/api';
import { useToast } from '../components/Toast';
import { 
  Calendar, 
  AlertCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  User, 
  Bell, 
  Edit3, 
  ArrowRight,
  Download,
  Check,
  Building,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, medical, notifications, profile
  const [loading, setLoading] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const { showToast, ToastComponent } = useToast();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    address: '',
    city: '',
    state: '',
    pincode: '',
    medicalHistory: ''
  });

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      
      // 1. Fetch appointments
      const apptRes = await appointmentService.getByPatient(user.id);
      setAppointments(apptRes.data);

      // 2. Fetch patient profile
      const patientRes = await patientService.getMe();
      setPatientProfile(patientRes.data);
      setProfileData({
        fullName: patientRes.data.fullName || '',
        phone: patientRes.data.phone || '',
        age: patientRes.data.age || '',
        gender: patientRes.data.gender || 'Male',
        dob: patientRes.data.dob || '',
        bloodGroup: patientRes.data.bloodGroup || 'O+',
        address: patientRes.data.address || '',
        city: patientRes.data.city || '',
        state: patientRes.data.state || '',
        pincode: patientRes.data.pincode || '',
        medicalHistory: patientRes.data.medicalHistory || ''
      });

      // 3. Fetch notifications
      const notifRes = await notificationService.getAll();
      setNotifications(notifRes.data);

      // 4. Fetch prescriptions
      const rxRes = await prescriptionService.getByPatient(patientRes.data.id);
      setPrescriptions(rxRes.data);

    } catch (err) {
      console.error(err);
      showToast('Could not load patient dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment slot?')) {
      try {
        await appointmentService.delete(id);
        showToast('Appointment slot cancelled', 'success');
        loadData();
      } catch (err) {
        showToast('Failed to cancel appointment', 'error');
      }
    }
  };

  const handleMarkNotificationRead = async (notifId) => {
    try {
      await notificationService.markAsRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullName || !profileData.phone) {
      showToast('Name and phone number are required', 'error');
      return;
    }

    setSubmittingProfile(true);
    try {
      const res = await patientService.updateMe(profileData);
      setPatientProfile(res.data);
      showToast('Medical profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update medical profile', 'error');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleDownloadPrescription = (rx) => {
    // Generate text/file simulated download
    const content = `HEALTHSYNC MEDICAL E-PRESCRIPTION\n\nPrescription ID: #RX-${rx.id}\nPatient Name: ${profileData.fullName}\nDoctor ID: #${rx.doctorId}\nDiagnosis: ${rx.diagnosis}\nMedicines:\n${rx.medicines}\nNotes: ${rx.notes || 'None'}\nDate: ${rx.createdAt ? rx.createdAt.substring(0, 10) : 'N/A'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_RX_${rx.id}.txt`;
    link.click();
    showToast('Prescription text file downloaded successfully', 'success');
  };

  return (
    <div className="space-y-8 pb-10 text-left w-full">
      {/* Background glow decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {ToastComponent}

      {/* Header Panel */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-[#0d0d0d] to-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <span className="text-[9px] uppercase font-black text-blue-405 tracking-wider">Patient Health Sync</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Patient Console</h1>
          <p className="text-slate-400 text-xs">Hello, {profileData.fullName || user?.name || 'User'}. Manage consultations, download electronic health prescriptions, and check telemetry alerts.</p>
        </div>

        <Link 
          to="/book-appointment" 
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all cursor-pointer shrink-0"
        >
          Book Consultation Slot
        </Link>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap border-b border-white/5 gap-1.5 mb-8 relative z-10">
        {[
          { id: 'appointments', label: 'Appointments Booked', icon: Calendar },
          { id: 'medical', label: 'Medical & E-Rx', icon: FileText },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.isRead).length})`, icon: Bell },
          { id: 'profile', label: 'Edit Medical Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 rounded-t-xl ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-white bg-white/5' 
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-500 text-xs mt-4">Syncing telemetry data...</p>
        </div>
      ) : (
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            
            {/* TAB: Appointments */}
            {activeTab === 'appointments' && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {appointments.length === 0 ? (
                  <div className="bg-[#111]/45 border border-white/10 rounded-[28px] p-12 text-center text-slate-500">
                    <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="font-extrabold text-sm text-slate-350">No scheduled visits found.</p>
                    <p className="text-xs text-slate-550 mt-1">Book your first doctor appointment above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:border-white/10 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${
                              apt.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450' :
                              apt.status === 'ACCEPTED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                              apt.status === 'REJECTED' ? 'bg-red-500/10 border-red-500/30 text-red-405' :
                              'bg-amber-500/10 border-amber-500/30 text-amber-455'
                            }`}>
                              {apt.status}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono">ID: #{apt.id}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-400">Practitioner Desk ID: #{apt.doctorId}</p>
                            <p className="text-sm font-extrabold text-white">Date: {apt.appointmentDate} at {apt.appointmentTime}</p>
                            <p className="text-xs text-slate-500 italic mt-1">"Reason: {apt.reason}"</p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end gap-3 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                          {apt.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-550/20 text-red-400 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                          {apt.prescriptionNotes && (
                            <div className="bg-slate-950 border border-white/5 p-3 rounded-xl max-w-xs text-left">
                              <p className="text-[9px] text-red-500 font-black uppercase tracking-wider flex items-center gap-1"><FileText className="h-3 w-3" /> Quick Prescribed Note</p>
                              <p className="text-[10px] text-slate-350 mt-1 leading-snug">{apt.prescriptionNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Medical Records */}
            {activeTab === 'medical' && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {prescriptions.length === 0 ? (
                  <div className="bg-[#111]/45 border border-white/10 rounded-[28px] p-12 text-center text-slate-500">
                    <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="font-extrabold text-sm text-slate-350">No medical records or prescriptions found.</p>
                    <p className="text-xs text-slate-550 mt-1">Prescriptions will display here once doctor signs them off.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.map((rx) => (
                      <div key={rx.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-56 hover:border-white/10 transition-all">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-cyan-405 bg-cyan-950 border border-cyan-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Medical Record
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">RX: #{rx.id}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-white">Diagnosis: {rx.diagnosis}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-bold">Medicines: {rx.medicines}</p>
                            {rx.notes && <p className="text-[10px] text-slate-500 mt-1">Note: {rx.notes}</p>}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4">
                          <span className="text-[9px] font-bold text-slate-600">Issued: {rx.createdAt ? rx.createdAt.substring(0, 10) : 'N/A'}</span>
                          <button
                            onClick={() => handleDownloadPrescription(rx)}
                            className="px-3.5 py-1.5 bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-blue-400 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {notifications.length === 0 ? (
                  <div className="bg-[#111]/45 border border-white/10 rounded-[28px] p-12 text-center text-slate-500">
                    <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="font-extrabold text-sm text-slate-350">Notifications dashboard clear.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => { if (!notif.isRead) handleMarkNotificationRead(notif.id); }}
                        className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                          notif.isRead 
                            ? 'bg-[#0f0f0f]/40 border-white/5 text-slate-500' 
                            : 'bg-blue-600/5 border-blue-550/15 text-white hover:bg-blue-600/10'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${notif.isRead ? 'bg-slate-700' : 'bg-blue-500 shadow-md shadow-blue-500/80 animate-pulse'}`} />
                          <div className="text-left">
                            <p className="text-xs font-bold">{notif.title}</p>
                            <p className="text-[10px] text-slate-455 mt-0.5 leading-snug">{notif.message}</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold text-slate-600 shrink-0">{notif.createdAt ? notif.createdAt.substring(11, 16) : ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Edit Profile */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <form onSubmit={handleProfileSubmit} className="bg-[#0f0f0f] border border-white/5 p-6 md:p-8 rounded-[28px] max-w-2xl mx-auto space-y-6">
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">1. Demographic Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number *</label>
                        <input
                          type="text"
                          name="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={profileData.age}
                          onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Gender</label>
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818] border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Blood Group</label>
                        <select
                          name="bloodGroup"
                          value={profileData.bloodGroup}
                          onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818] border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        >
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">2. Contact Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={profileData.pincode}
                          onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                          className="w-full px-4 py-2.5 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">3. Medical Profile history</h3>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Chronic ailments & drug allergies</label>
                      <textarea
                        rows={3}
                        name="medicalHistory"
                        value={profileData.medicalHistory}
                        onChange={(e) => setProfileData({...profileData, medicalHistory: e.target.value})}
                        className="w-full px-4 py-3 bg-[#181818]/60 border border-white/5 focus:border-blue-500 rounded-xl text-xs outline-none text-slate-205"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProfile}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    {submittingProfile ? 'Saving...' : <span className="flex items-center gap-1.5">Update Medical Profile <Check className="h-4 w-4" /></span>}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
