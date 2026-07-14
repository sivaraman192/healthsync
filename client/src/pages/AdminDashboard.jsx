import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardService, patientService, departmentService, notificationService } from '../services/api';
import { useToast } from '../components/Toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Activity, 
  TrendingUp, 
  Flame, 
  Database,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  FileText,
  AlertTriangle,
  History,
  FlaskConical,
  Pill,
  HeartHandshake,
  Search,
  Settings,
  Trash,
  Plus,
  Edit3,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Send,
  Volume2
} from 'lucide-react';

const COLORS = ['#3b82f6', '#06b6d4', '#eab308', '#a78bfa'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    acceptedAppointments: 0,
    cancelledAppointments: 0,
    todayAppointments: 0,
    emergencyCases: 0,
    revenueData: [],
    appointmentData: [],
    departmentData: []
  });
  
  const [activePanel, setActivePanel] = useState('analytics'); // analytics, patients, departments
  const [loading, setLoading] = useState(true);

  // Patient List State
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientGenderFilter, setPatientGenderFilter] = useState('ALL');
  const [patientBloodFilter, setPatientBloodFilter] = useState('ALL');

  // Department List State
  const [departments, setDepartments] = useState([]);
  const [deptForm, setDeptForm] = useState({ id: null, name: '', code: '', description: '', icon: 'Stethoscope' });
  const [editingDept, setEditingDept] = useState(false);
  const [savingDept, setSavingDept] = useState(false);

  // Calendar State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDayAppointments, setCalendarDayAppointments] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);

  // Recent Activity State
  const [recentActivities, setRecentActivities] = useState([]);

  // Broadcast Notification State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const loadStats = async () => {
    try {
      const res = await dashboardService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch dashboard statistics.', 'error');
    }
  };

  const loadPatients = async () => {
    try {
      const res = await patientService.getAll();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await departmentService.getAll();
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllAppointments = async () => {
    try {
      // Direct call to fetch all appointments
      const res = await fetch('http://localhost:8080/api/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setAppointmentsList(data);
      
      // Seed Calendar appointments for today on load
      const todayStr = new Date().toISOString().substring(0, 10);
      const matches = data.filter(a => a.appointmentDate === todayStr);
      setCalendarDayAppointments(matches);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const res = await notificationService.getAll();
      setRecentActivities(res.data.slice(0, 8)); // Grab top 8 recent notifications as activities
    } catch (err) {
      console.error(err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      loadStats(), 
      loadPatients(), 
      loadDepartments(), 
      loadAllAppointments(),
      loadRecentActivities()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this patient record and credentials?')) {
      try {
        await patientService.delete(id);
        showToast('Patient account removed successfully', 'success');
        loadAll();
      } catch (err) {
        showToast('Failed to delete patient profile', 'error');
      }
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code || !deptForm.description) {
      showToast('All department fields are required', 'error');
      return;
    }

    setSavingDept(true);
    try {
      if (deptForm.id) {
        await departmentService.update(deptForm.id, deptForm);
        showToast('Department updated successfully', 'success');
      } else {
        await departmentService.create(deptForm);
        showToast('Department registered successfully', 'success');
      }
      setDeptForm({ id: null, name: '', code: '', description: '', icon: 'Stethoscope' });
      setEditingDept(false);
      loadAll();
    } catch (err) {
      showToast('Failed to save department details', 'error');
    } finally {
      setSavingDept(false);
    }
  };

  const handleEditDept = (dept) => {
    setDeptForm({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      description: dept.description,
      icon: dept.icon || 'Stethoscope'
    });
    setEditingDept(true);
  };

  const handleDeleteDept = async (id) => {
    if (window.confirm('Delete this department?')) {
      try {
        await departmentService.delete(id);
        showToast('Department deleted successfully', 'success');
        loadAll();
      } catch (err) {
        showToast('Failed to delete department', 'error');
      }
    }
  };

  // Broadcast announcement
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      showToast('Please enter title and message', 'error');
      return;
    }

    setSendingBroadcast(true);
    try {
      const payload = {
        title: broadcastTitle,
        message: broadcastMessage,
        type: 'SYSTEM_BROADCAST',
        role: broadcastTarget === 'ALL' ? null : broadcastTarget
      };
      
      const res = await fetch('http://localhost:8080/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('Announcement broadcasted successfully!', 'success');
        setBroadcastTitle('');
        setBroadcastMessage('');
        loadRecentActivities();
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('Failed to send announcement broadcast', 'error');
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Filter patients list
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.fullName?.toLowerCase().includes(patientSearch.toLowerCase()) || 
                          p.email?.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesGender = patientGenderFilter === 'ALL' || p.gender === patientGenderFilter;
    const matchesBlood = patientBloodFilter === 'ALL' || p.bloodGroup === patientBloodFilter;
    return matchesSearch && matchesGender && matchesBlood;
  });

  // Calendar Helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(selectedDate);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => null);
  const calendarCells = [...blanksArray, ...daysArray];

  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const matches = appointmentsList.filter(a => a.appointmentDate === dateStr);
    setCalendarDayAppointments(matches);
    showToast(`Loaded ${matches.length} consultations scheduled on ${dateStr}`, 'info');
  };

  const hasAppointmentOnDay = (day) => {
    if (!day) return false;
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointmentsList.some(a => a.appointmentDate === dateStr);
  };

  return (
    <div className="space-y-8 pb-10 select-none text-left w-full">
      {ToastComponent}

      {/* Header Summary */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/20 via-[#0d0d0d] to-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] uppercase font-black text-red-500 tracking-wider">Clinical Telemetry Operations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">Administrative Command</h1>
          <p className="text-slate-400 text-xs max-w-lg">Real-time oversight of patient registrations, medical roster allocation, and telemetry logs.</p>
        </div>
        <div className="bg-[#111111]/85 border border-white/10 p-4.5 rounded-2xl flex flex-col items-end text-right shrink-0">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Database Linkage</p>
          <p className="text-cyan-400 text-xs font-extrabold flex items-center gap-1.5 mt-1">
            <ShieldCheck className="h-4 w-4 text-cyan-400" /> Active RDBMS Synced
          </p>
          <span className="text-[9px] text-slate-600 mt-0.5">Epic Command System Level 3</span>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="flex flex-wrap border-b border-white/5 gap-1.5">
        {[
          { id: 'analytics', label: 'Hospital Analytics', icon: Activity },
          { id: 'patients', label: `Patient Records (${patients.length})`, icon: Users },
          { id: 'departments', label: `Departments (${departments.length})`, icon: FlaskConical }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 rounded-t-xl ${
                activePanel === tab.id 
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

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-500 text-xs mt-4">Connecting to MySQL database...</p>
        </div>
      ) : (
        <div className="relative z-10 w-full">
          <AnimatePresence mode="wait">

            {/* TAB: Analytics Dashboard */}
            {activePanel === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 w-full"
              >
                {/* 9 core stats counter cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {[
                    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-blue-400' },
                    { title: 'Total Doctors', value: stats.totalDoctors, icon: HeartHandshake, color: 'text-purple-400' },
                    { title: 'Departments', value: departments.length, icon: FlaskConical, color: 'text-cyan-405' },
                    { title: 'Today\'s Visits', value: stats.todayAppointments, icon: Clock, color: 'text-orange-400' },
                    { title: 'Pending Approval', value: stats.pendingAppointments, icon: AlertTriangle, color: 'text-amber-400' },
                    { title: 'Accepted Visits', value: stats.acceptedAppointments, icon: CheckCircle, color: 'text-emerald-450' },
                    { title: 'Cancelled Slots', value: stats.cancelledAppointments, icon: XCircle, color: 'text-red-405' },
                    { title: 'Emergency Cases', value: stats.emergencyCases, icon: Flame, color: 'text-red-500 animate-pulse' },
                    { title: 'Estimated Revenue', value: `$${(stats.totalAppointments * 125).toLocaleString()}`, icon: TrendingUp, color: 'text-cyan-300' }
                  ].map((metric, midx) => {
                    const Icon = metric.icon;
                    return (
                      <div key={midx} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start text-slate-505">
                          <Icon className={`h-5 w-5 ${metric.color}`} />
                          <span className="text-[9px] text-slate-650 font-mono">#0{midx+1}</span>
                        </div>
                        <div className="mt-2 text-left">
                          <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{metric.title}</h3>
                          <p className="text-2xl font-black text-white mt-1 leading-none">{metric.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recharts Graphical Bento */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Graph */}
                  <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl">
                    <h3 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" /> Revenue Stream Analytics
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity="0.2"/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                          <XAxis dataKey="month" stroke="#4b5563" fontSize={10} />
                          <YAxis stroke="#4b5563" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#2c2c2c', borderRadius: '10px' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#areaColor)" />
                          <Area type="monotone" dataKey="expenses" stroke="#a78bfa" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Department Workload Allocation Pie */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 mb-6">Workload Allocation</h3>
                      <div className="h-48 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.departmentData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {stats.departmentData?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#2c2c2c', borderRadius: '10px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-400 font-bold border-t border-white/5 pt-3">
                      {stats.departmentData?.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span>{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Histograms & Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Appointment load */}
                  <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl">
                    <h3 className="text-sm font-bold text-slate-100 mb-6">Weekly Consultation Load</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.appointmentData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                          <XAxis dataKey="day" stroke="#4b5563" fontSize={10} />
                          <YAxis stroke="#4b5563" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#2c2c2c', borderRadius: '10px' }} />
                          <Bar dataKey="appointments" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Telemetry settings status */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-100">Telemetry Hardware</h3>
                    <div className="space-y-4 text-xs">
                      {[
                        { title: 'Stateless Security Filter', detail: 'Token signature active', color: 'bg-emerald-500' },
                        { title: 'MySQL Command Registry', detail: 'DB pool: 10 connections max', color: 'bg-cyan-500' },
                        { title: 'EHR Encrypted Logs', detail: 'End-to-end telemetry active', color: 'bg-purple-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.color} mt-1.5 shrink-0`} />
                          <div className="text-left">
                            <p className="font-bold text-slate-205">{item.title}</p>
                            <p className="text-[10px] text-slate-500">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calendar, Activities, and Quick Actions Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Interactive Calendar Widget */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5"><CalendarIcon className="h-4 w-4 text-blue-500" /> Medical Calendar</h3>
                        <span className="text-[10px] font-bold text-slate-505">{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</span>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
                      </div>

                      <div className="grid grid-cols-7 gap-1.5 text-xs font-mono text-center">
                        {calendarCells.map((day, idx) => {
                          const hasAppt = hasAppointmentOnDay(day);
                          return (
                            <button
                              key={idx}
                              onClick={() => handleDateClick(day)}
                              disabled={!day}
                              className={`p-1.5 rounded-lg font-bold transition-all relative ${
                                !day ? 'text-transparent cursor-default' : 
                                hasAppt 
                                  ? 'bg-blue-600/10 border border-blue-500/35 text-white hover:bg-blue-600 hover:text-white' 
                                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {day}
                              {hasAppt && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-405" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Booked Consultations on Clicked Date */}
                    <div className="border-t border-white/5 pt-4 mt-6">
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Slot Details</p>
                      <div className="mt-2 space-y-2 max-h-24 overflow-y-auto">
                        {calendarDayAppointments.length === 0 ? (
                          <p className="text-[10px] text-slate-600 italic">No bookings on this day.</p>
                        ) : (
                          calendarDayAppointments.map((a, idx) => (
                            <div key={idx} className="p-2 bg-white/5 border border-white/5 rounded-xl text-[10px] flex justify-between items-center">
                              <div>
                                <p className="font-bold text-slate-200">{a.patientName}</p>
                                <p className="text-[8px] text-slate-500 font-mono">Time: {a.appointmentTime}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-cyan-950 border border-cyan-800/40 text-cyan-405">{a.status}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5"><History className="h-4 w-4 text-blue-500" /> Recent Activity</h3>
                      <div className="space-y-4 max-h-72 overflow-y-auto">
                        {recentActivities.length === 0 ? (
                          <p className="text-[10px] text-slate-600 italic">No activity recorded.</p>
                        ) : (
                          recentActivities.map((act) => (
                            <div key={act.id} className="flex gap-3 text-left">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                              <div>
                                <p className="text-xs font-extrabold text-slate-202">{act.title}</p>
                                <p className="text-[10px] text-slate-455 leading-relaxed">{act.message}</p>
                                <span className="text-[8px] text-slate-600 font-mono block mt-0.5">
                                  {act.createdAt ? act.createdAt.replace('T', ' ').substring(0, 16) : ''}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions & Broadcast Announcement */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl space-y-6">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-500" /> Command Actions</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <button 
                          onClick={() => navigate('/doctor-management')}
                          className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-slate-205"
                        >
                          <PlusCircle className="h-4 w-4 text-purple-400" /> Doctors
                        </button>
                        <button 
                          onClick={() => { setActivePanel('departments'); setEditingDept(false); }}
                          className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-slate-205"
                        >
                          <FlaskConical className="h-4 w-4 text-cyan-405" /> Dept Wing
                        </button>
                        <button 
                          onClick={() => navigate('/appointment-management')}
                          className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-slate-205"
                        >
                          <CalendarIcon className="h-4 w-4 text-amber-400" /> Bookings
                        </button>
                        <button 
                          onClick={() => showToast('Please click the Message icon in the top header to inspect active chats.', 'info')}
                          className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-slate-205"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-400" /> Open Chat
                        </button>
                      </div>
                    </div>

                    {/* Broadcast Notification Form */}
                    <div className="border-t border-white/5 pt-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1"><Volume2 className="h-3.5 w-3.5 text-blue-500" /> Broadcast System Alert</h4>
                      <form onSubmit={handleSendBroadcast} className="space-y-3 mt-3">
                        <input 
                          type="text" 
                          placeholder="Notification Title..."
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white/5 border border-white/5 focus:border-blue-500 rounded-xl text-[11px] outline-none text-slate-200 placeholder-slate-655"
                        />
                        <textarea 
                          rows={2} 
                          placeholder="Notification alert payload details..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white/5 border border-white/5 focus:border-blue-500 rounded-xl text-[11px] outline-none text-slate-200 placeholder-slate-655"
                        />
                        <div className="flex gap-2">
                          <select 
                            value={broadcastTarget}
                            onChange={(e) => setBroadcastTarget(e.target.value)}
                            className="bg-[#0f0f12] border border-white/5 rounded-xl text-[10px] font-bold text-slate-355 outline-none px-2.5 cursor-pointer"
                          >
                            <option value="ALL">All Roles</option>
                            <option value="DOCTOR">Doctors Only</option>
                            <option value="PATIENT">Patients Only</option>
                          </select>
                          <button 
                            type="submit" 
                            disabled={sendingBroadcast}
                            className="flex-grow py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[10px] transition-colors flex justify-center items-center gap-1.5 cursor-pointer"
                          >
                            {sendingBroadcast ? 'Sending...' : <span className="flex items-center gap-1">Broadcast <Send className="h-3 w-3" /></span>}
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: Patients Records Management */}
            {activePanel === 'patients' && (
              <motion.div
                key="patients"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 w-full"
              >
                {/* Search / Filters Panel */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-white/5 rounded-xl w-72">
                    <Search className="h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search patient name or email..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-650 w-full"
                    />
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    {/* Gender select */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-xs">
                      <span className="text-[9px] uppercase font-bold text-slate-500">Gender:</span>
                      <select 
                        value={patientGenderFilter} 
                        onChange={(e) => setPatientGenderFilter(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-350 cursor-pointer font-bold text-xs"
                      >
                        <option value="ALL">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Blood group select */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-xs">
                      <span className="text-[9px] uppercase font-bold text-slate-500">Blood:</span>
                      <select 
                        value={patientBloodFilter} 
                        onChange={(e) => setPatientBloodFilter(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-355 cursor-pointer font-bold text-xs"
                      >
                        <option value="ALL">All Blood Groups</option>
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

                {/* Patients Table */}
                {filteredPatients.length === 0 ? (
                  <div className="bg-[#111]/40 border border-white/5 p-12 rounded-[28px] text-center text-slate-500">
                    <Users className="h-10 w-10 text-slate-650 mx-auto mb-4" />
                    <p className="font-semibold text-sm">No patient profiles match the filter criteria.</p>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-[28px] overflow-hidden shadow-xl w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] font-bold uppercase text-slate-500 tracking-widest bg-[#111]/60">
                          <th className="px-6 py-4">Full Name</th>
                          <th className="px-6 py-4">Demographics</th>
                          <th className="px-6 py-4">Contact Info</th>
                          <th className="px-6 py-4">Blood Group</th>
                          <th className="px-6 py-4">Chronic History</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {filteredPatients.map((pat) => (
                          <tr key={pat.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-405 flex items-center justify-center font-bold text-white text-[10px]">
                                  {pat.fullName?.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-205">{pat.fullName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              {pat.gender}, {pat.age} Yrs <br />
                              <span className="text-[10px] text-slate-600">DOB: {pat.dob}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              {pat.phone} <br />
                              <span className="text-[10px] text-slate-550">{pat.email}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-0.5 bg-blue-950/40 border border-blue-900/30 text-blue-400 text-[10px] rounded-lg font-bold">
                                {pat.bloodGroup || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-slate-500 italic">
                              {pat.medicalHistory || 'No active chronic history recorded.'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeletePatient(pat.id)}
                                className="text-red-405/85 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all cursor-pointer"
                                title="Delete account"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Clinical Departments Management */}
            {activePanel === 'departments' && (
              <motion.div
                key="departments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full"
              >
                {/* Form Column */}
                <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl h-fit relative">
                  <h3 className="text-sm font-bold text-slate-100 mb-5 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-blue-500" />
                    {editingDept ? 'Modify Department' : 'Register Clinical Wing'}
                  </h3>
                  
                  <form onSubmit={handleDeptSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department Name</label>
                      <input 
                        type="text" 
                        value={deptForm.name}
                        onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                        placeholder="Cardiology"
                        className="w-full bg-[#181818]/60 border border-white/5 focus:border-blue-550 rounded-xl p-2.5 text-xs outline-none text-slate-200 placeholder-slate-650"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Code Identifier</label>
                      <input 
                        type="text" 
                        value={deptForm.code}
                        onChange={(e) => setDeptForm({...deptForm, code: e.target.value})}
                        placeholder="CARD"
                        className="w-full bg-[#181818]/60 border border-white/5 focus:border-blue-550 rounded-xl p-2.5 text-xs outline-none text-slate-200 placeholder-slate-650"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Lucide Icon Name</label>
                      <input 
                        type="text" 
                        value={deptForm.icon}
                        onChange={(e) => setDeptForm({...deptForm, icon: e.target.value})}
                        placeholder="Heart"
                        className="w-full bg-[#181818]/60 border border-white/5 focus:border-blue-550 rounded-xl p-2.5 text-xs outline-none text-slate-200 placeholder-slate-650"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                      <textarea 
                        rows={3}
                        value={deptForm.description}
                        onChange={(e) => setDeptForm({...deptForm, description: e.target.value})}
                        placeholder="Cardiovascular health and surgery ward..."
                        className="w-full bg-[#181818]/60 border border-white/5 focus:border-blue-550 rounded-xl p-2.5 text-xs outline-none text-slate-200 placeholder-slate-655"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={savingDept}
                        className="flex-grow py-2.5 bg-blue-600 hover:bg-blue-550 text-white rounded-xl font-bold text-xs transition-colors flex justify-center cursor-pointer"
                      >
                        {savingDept ? 'Saving...' : editingDept ? 'Update Wing' : 'Register Wing'}
                      </button>
                      {editingDept && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeptForm({ id: null, name: '', code: '', description: '', icon: 'Stethoscope' });
                            setEditingDept(false);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Directory Column */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-100">Registered Clinical Wings ({departments.length})</h3>
                  
                  {departments.length === 0 ? (
                    <div className="bg-[#111]/40 border border-white/5 p-12 rounded-[28px] text-center text-slate-500">
                      <AlertTriangle className="h-10 w-10 text-slate-655 mx-auto mb-4" />
                      <p className="font-semibold text-sm">No departments registered.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departments.map((dept) => (
                        <div key={dept.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-white/10 transition-colors">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white text-xs">{dept.name}</h4>
                                <span className="inline-block mt-0.5 text-[8px] font-black text-cyan-405 bg-cyan-950 border border-cyan-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {dept.code}
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-405 leading-relaxed italic">"{dept.description}"</p>
                          </div>
                          <div className="flex gap-2 justify-end border-t border-white/5 pt-3 mt-4">
                            <button
                              onClick={() => handleEditDept(dept)}
                              className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded transition-all text-[10px] flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDept(dept.id)}
                              className="text-red-405 hover:text-red-400 p-1 hover:bg-red-500/5 rounded transition-all text-[10px] flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <Trash className="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
