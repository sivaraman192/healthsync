import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Sparkles, 
  Activity, 
  Users, 
  Calendar, 
  Check, 
  ArrowRight,
  ShieldAlert, 
  Clock, 
  Bell, 
  Star,
  MapPin,
  Phone,
  Mail,
  Heart,
  Globe,
  Award,
  ShieldCheck,
  Stethoscope,
  Briefcase,
  GraduationCap,
  FileBadge,
  Smartphone,
  Eye,
  Smile,
  Flame,
  Scan,
  FlaskConical,
  Accessibility,
  Brain,
  Baby,
  ChevronRight,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

// 16 Professional Services Data
const servicesList = [
  { name: 'Cardiology', desc: 'Comprehensive heart care, cardiology screenings, and vascular health.', icon: Heart, sub: 'Heart Care' },
  { name: 'Neurology', desc: 'Expert treatment for spinal cord, brain, and central nervous system disorders.', icon: Brain, sub: 'Brain Specialist' },
  { name: 'Orthopedics', desc: 'Joint replacement, fracture repairs, bone health, and sports medicine.', icon: Activity, sub: 'Bone Specialist' },
  { name: 'Pediatrics', desc: 'Attentive pediatric care, immunizations, and newborn checks.', icon: Baby, sub: 'Child Specialist' },
  { name: 'Gynecology', desc: 'Women\'s health, prenatal care, fertility, and wellness screenings.', icon: Users, sub: 'Women\'s Health' },
  { name: 'Dermatology', desc: 'Clinical treatments for skin conditions, cancer screening, and acne.', icon: Sparkles, sub: 'Skin Specialist' },
  { name: 'ENT', desc: 'Diagnostic and surgical ear, nose, throat, head, and neck care.', icon: Stethoscope, sub: 'Ear Nose Throat' },
  { name: 'Ophthalmology', desc: 'Advanced eye surgery, vision therapy, and diagnostic scanning.', icon: Eye, sub: 'Eye Care' },
  { name: 'Dental Care', desc: 'Orthodontics, cosmetic dental surgery, and routine hygiene care.', icon: Smile, sub: 'Teeth Care' },
  { name: 'General Medicine', desc: 'Internal medicine, general checkups, and routine vaccinations.', icon: Stethoscope, sub: 'General Care' },
  { name: 'Emergency Care', desc: 'Trauma support, cardiac resuscitation, and acute response desk.', icon: Flame, sub: '24x7 Critical Care' },
  { name: 'ICU', desc: 'Intensive care ward with automated vital monitors and life support.', icon: ShieldAlert, sub: 'Critical Support' },
  { name: 'Radiology', desc: 'Digital X-Rays, high-resolution MRI scans, and ultrasound screens.', icon: Scan, sub: 'Advanced Imaging' },
  { name: 'Laboratory', desc: 'Stat blood panel analysis, pathology screening, and biopsy testing.', icon: FlaskConical, sub: 'Pathology Diagnostics' },
  { name: 'Physiotherapy', desc: 'Injury rehab, occupational sports therapy, and joint wellness.', icon: Accessibility, sub: 'Rehab Services' },
  { name: 'Mental Health', desc: 'Clinical psychology, counseling therapy, and psychiatric assessments.', icon: Brain, sub: 'Wellness Counseling' }
];

// Professional Doctor Cards Data
const doctorsList = [
  {
    id: 1,
    name: 'Dr. Adrian Sterling',
    qual: 'MD, FACC',
    dept: 'Cardiology',
    exp: 18,
    rating: '4.9',
    languages: ['English', 'Spanish'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    education: 'Johns Hopkins School of Medicine',
    schedule: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)',
    patientsCount: '15,000+',
    certificates: ['Board Certified in Cardiovascular Disease', 'Fellow of the American College of Cardiology']
  },
  {
    id: 2,
    name: 'Dr. Sarah Jenkins',
    qual: 'MD, PhD',
    dept: 'Neurology',
    exp: 15,
    rating: '4.8',
    languages: ['English', 'German'],
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    education: 'Harvard Medical School',
    schedule: 'Tue, Thu (02:00 PM - 06:00 PM)',
    patientsCount: '12,500+',
    certificates: ['American Board of Psychiatry and Neurology', 'Society for Neuroscience Member']
  },
  {
    id: 3,
    name: 'Dr. Rajesh Koothrapali',
    qual: 'MS, MCh (Ortho)',
    dept: 'Orthopedics',
    exp: 14,
    rating: '4.9',
    languages: ['English', 'Hindi'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    education: 'Stanford University School of Medicine',
    schedule: 'Mon, Tue, Thu (10:00 AM - 04:00 PM)',
    patientsCount: '11,000+',
    certificates: ['Fellow of American Academy of Orthopaedic Surgeons', 'Board Certified Orthopedic Surgeon']
  },
  {
    id: 4,
    name: 'Dr. Emily Watson',
    qual: 'MD, FACP',
    dept: 'General Medicine',
    exp: 10,
    rating: '4.7',
    languages: ['English', 'French'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    education: 'Oxford University Medical Sciences Division',
    schedule: 'Mon to Fri (09:00 AM - 05:00 PM)',
    patientsCount: '9,800+',
    certificates: ['Board Certified in Internal Medicine', 'American College of Physicians Member']
  }
];

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [activeSection, setActiveSection] = useState('home');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Contact Form State
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sendingContact, setSendingContact] = useState(false);



  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }
    setSendingContact(true);
    setTimeout(() => {
      showToast('Thank you for contacting us. We will get back to you shortly!', 'success');
      setContactData({ name: '', email: '', phone: '', message: '' });
      setSendingContact(false);
    }, 1200);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <div className="bg-[#030303] text-slate-100 min-h-screen relative font-sans overflow-x-hidden antialiased select-none pt-[80px]">
      {ToastComponent}

      {/* Floating Animated Background Blobs */}
      <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute top-[800px] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[12s]" />
      <div className="absolute top-[2000px] left-[5%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* FIXED GLASSMORPHIC NAVBAR */}
      <header className="fixed top-0 left-0 right-0 w-full z-[99999] backdrop-blur-xl bg-[#030303]/80 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">HealthSync</span>
            <span className="text-[9px] font-black text-cyan-400 ml-2 uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-full">HQ</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-8 text-xs font-bold text-slate-400">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About Hospital' },
            { id: 'departments', label: 'Departments' },
            { id: 'doctors', label: 'Doctors' },
            { id: 'services', label: 'Services' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className={`hover:text-white transition-colors relative py-1.5 ${activeSection === item.id ? 'text-white' : ''}`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Call to Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-xs font-medium text-slate-450 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                Logged as <span className="font-bold text-blue-400">{user.name}</span>
              </span>
              <Link 
                to={getDashboardPath()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4.5 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all">
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[90vh] flex flex-col justify-center py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Intro Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-800/30 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" /> AI-Powered Smart Healthcare
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              The Next Generation of <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Clinical Excellence
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl"
            >
              Experience seamless clinical scheduling, digital medical vaults, 24/7 critical trauma dispatching, and automated prescription processing. Connected. Secure. Stateless.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white font-black py-4 px-8 rounded-2xl text-xs shadow-xl shadow-blue-500/10 transition-all flex items-center gap-2 group cursor-pointer"
              >
                Book Appointment <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#doctors" 
                className="bg-[#111111]/80 hover:bg-[#1a1a1a] border border-white/5 text-slate-300 font-bold py-4 px-8 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Find Doctor
              </a>
            </motion.div>
          </div>

          {/* Right Preview Panel (Hospital Preview & Animated Cards) */}
          <div className="lg:col-span-5 w-full flex justify-center relative">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] p-6 shadow-2xl relative backdrop-blur-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live System Activity</span>
                </div>
                <span className="text-[9px] text-cyan-400 font-extrabold bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-0.5 rounded-full">
                  Emergency Desk Online
                </span>
              </div>

              {/* Animated Notification / Telemetry Cards */}
              <div className="space-y-4">
                
                {/* Emergency Alert Card */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-500/5 border border-red-500/15 p-4 rounded-2xl flex items-center gap-4 hover:border-red-500/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] text-red-500 uppercase font-black tracking-wider">Emergency Desk Alert</p>
                    <p className="text-xs font-bold text-white">Trauma Unit active 24x7</p>
                    <p className="text-[10px] text-slate-400">Response time: &lt; 2 minutes</p>
                  </div>
                </motion.div>

                {/* Appointment Success Card */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] text-emerald-500 uppercase font-black tracking-wider">Slot Confirmed</p>
                    <p className="text-xs font-bold text-white">Cardiology Consult Approved</p>
                    <p className="text-[10px] text-slate-400">Dr. Adrian Sterling • Tomorrow 10:00 AM</p>
                  </div>
                </motion.div>

                {/* Medicine Reminder Card */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-blue-500/5 border border-blue-500/15 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] text-blue-500 uppercase font-black tracking-wider">Prescription Released</p>
                    <p className="text-xs font-bold text-white">E-Prescription #HS-4819</p>
                    <p className="text-[10px] text-slate-400">Alice Johnson • 2 items ready for dispatch</p>
                  </div>
                </motion.div>
              </div>

              {/* Hospital Stats Mini Ledger */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
                <div className="bg-[#121212]/40 p-3.5 rounded-xl border border-white/5 text-left">
                  <span className="text-xs font-bold text-cyan-400">99.99%</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">Platform Uptime</p>
                </div>
                <div className="bg-[#121212]/40 p-3.5 rounded-xl border border-white/5 text-left">
                  <span className="text-xs font-bold text-purple-400">HIPAA Secured</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">Audit Ledger</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Counter Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-white/5 mt-16 text-left">
          {[
            { value: '50K+', label: 'Patients Treated' },
            { value: '120+', label: 'Certified Doctors' },
            { value: '16+', label: 'Medical Departments' },
            { value: '18K+', label: 'Successful Operations' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</span>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT HOSPITAL SECTION */}
      <section id="about" className="py-24 border-t border-white/5 bg-[#070707]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full">
              Mission & Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-none pt-2">Defining the Standard of Care</h2>
            <p className="text-slate-400 text-xs md:text-sm">HealthSync blends bleeding-edge digital tools with world-renowned medical practices.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Philosophy & Overview */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/20 transition-all">
                <h3 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-blue-500" /> Our Mission
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To provide compassionate, comprehensive, and world-class multi-specialty healthcare to every individual using advanced cloud architectures and state-of-the-art diagnostic systems.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/20 transition-all">
                <h3 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-purple-500" /> Our Vision
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To lead global medicine through continuous infrastructure improvements, predictive clinical diagnostics, and stateless, patient-centric records that ensure safety and privacy.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-450 tracking-widest mb-3">Why Choose HealthSync?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Medical Excellence', desc: 'Renowned expert physician teams.' },
                    { title: '24/7 Emergency Support', desc: 'Active trauma response team.' },
                    { title: 'Modern Infrastructure', desc: 'Clean, smart clinics & labs.' },
                    { title: 'Advanced Equipment', desc: 'High-res MRI, CT, & ECG grids.' }
                  ].map((feat, fidx) => (
                    <div key={fidx} className="flex gap-3">
                      <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{feat.title}</p>
                        <p className="text-[10px] text-slate-455 mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Hospital Images / Visual Panel */}
            <div className="relative">
              <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-2xl relative h-96 w-full">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" 
                  alt="Hospital Interior" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Float Card: Achievements */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#0c0c0c]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[8px] text-cyan-400 uppercase font-black tracking-wider">Hospital Milestone</p>
                    <p className="text-xs font-bold text-white">#1 Multi-Specialty Ward</p>
                  </div>
                  <span className="text-[10px] font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
                    Acredited A+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS SECTION (GRID OF DEPARTMENTS) */}
      <section id="departments" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full">
              Clinical Specialities
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-none pt-2">Medical Departments</h2>
            <p className="text-slate-400 text-xs md:text-sm">Roster-managed clinics staffed with senior board-certified consultants.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Cardiology', code: 'CARD', desc: 'Heart diagnostics & surgical care.', icon: Heart },
              { name: 'Neurology', code: 'NEUR', desc: 'Nervous system & brain wellness.', icon: Brain },
              { name: 'Orthopedics', code: 'ORTH', desc: 'Bone structures & joint rehab.', icon: Activity },
              { name: 'Pediatrics', code: 'PEDI', desc: 'Comprehensive baby & child care.', icon: Baby },
              { name: 'Gynecology', code: 'GYNE', desc: 'Maternal health & diagnostics.', icon: Users },
              { name: 'Dermatology', code: 'DERM', desc: 'Clinical skin & hair treatments.', icon: Sparkles },
              { name: 'General Medicine', code: 'GMED', desc: 'Primary healthcare & consultations.', icon: Stethoscope },
              { name: 'Emergency Support', code: 'EMER', desc: '24x7 trauma & resuscitation.', icon: Flame }
            ].map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover-lift hover:border-blue-500/30 transition-all flex flex-col justify-between h-44"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">{dept.code}</span>
                    <h3 className="text-xs font-extrabold text-white mt-1">{dept.name}</h3>
                    <p className="text-[10px] text-slate-500 leading-snug mt-1">{dept.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 border-t border-white/5 bg-[#050505]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full">
              Comprehensive List
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-none pt-2">Our Healthcare Services</h2>
            <p className="text-slate-400 text-xs md:text-sm">We provide 16 professional services designed to satisfy any clinical triage requirement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {servicesList.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#111111]/70 border border-white/5 p-6 rounded-2xl hover:border-blue-500/20 transition-all flex flex-col justify-between h-56"
                >
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{svc.sub}</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <h3 className="text-xs font-black text-white">{svc.name}</h3>
                    <p className="text-[10px] text-slate-405 leading-relaxed line-clamp-3">{svc.desc}</p>
                  </div>
                  <Link 
                    to="/register" 
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 mt-4 flex items-center gap-1 group"
                  >
                    Book Slot <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOCTORS DIRECTORY SECTION */}
      <section id="doctors" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-955/40 border border-blue-900/30 px-3 py-1 rounded-full">
              Expert Faculty
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-none pt-2">Our Certified Specialists</h2>
            <p className="text-slate-400 text-xs md:text-sm">Consult with verified senior healthcare practitioners to book consultation slots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {doctorsList.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white/5 border border-white/10 rounded-[28px] overflow-hidden hover:border-blue-500/30 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-64 w-full bg-[#111] overflow-hidden">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-[#030303]/90 border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold text-white">
                    {doc.exp} Years Exp
                  </div>
                </div>

                <div className="p-6 space-y-4 text-left">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{doc.name}</h3>
                    <p className="text-[10px] text-slate-500">{doc.qual} • {doc.dept}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {doc.languages.map((lang, lIdx) => (
                      <span key={lIdx} className="text-[8px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-md font-bold">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-405 border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" /> {doc.rating}
                    </span>
                    <button 
                      onClick={() => setSelectedDoctor(doc)}
                      className="text-blue-450 hover:underline font-bold"
                    >
                      View Profile
                    </button>
                  </div>
                  
                  <Link 
                    to="/register" 
                    className="w-full text-center py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-blue-400 font-bold text-[10px] transition-all block"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR DETAILED PROFILE MODAL */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoctor(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-[32px] max-w-2xl w-full overflow-hidden shadow-2xl relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-5 relative h-64 md:h-full min-h-[300px] bg-slate-900">
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name} 
                    className="w-full h-full object-cover object-top" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
                </div>
                
                <div className="md:col-span-7 p-8 text-left space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-cyan-400 bg-cyan-950 border border-cyan-800/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedDoctor.dept} Department
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-2">{selectedDoctor.name}</h2>
                    <p className="text-xs text-slate-400">{selectedDoctor.qual}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                    <div className="space-y-1">
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Experience</p>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-blue-500" /> {selectedDoctor.exp} Years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider">Patients Served</p>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-purple-500" /> {selectedDoctor.patientsCount}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <GraduationCap className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Education</p>
                        <p className="text-xs font-bold text-slate-200">{selectedDoctor.education}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Clock className="h-4.5 w-4.5 text-cyan-405 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide"> Roster Schedule</p>
                        <p className="text-xs font-bold text-slate-200">{selectedDoctor.schedule}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <FileBadge className="h-4.5 w-4.5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Certificates</p>
                        <ul className="text-[10px] text-slate-400 list-disc list-inside space-y-0.5 font-medium">
                          {selectedDoctor.certificates.map((cert, cidx) => (
                            <li key={cidx}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link 
                      to="/register" 
                      className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-550 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 transition-colors"
                    >
                      Book consultation
                    </Link>
                    <button 
                      onClick={() => setSelectedDoctor(null)}
                      className="px-5 py-3 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT PAGE SECTION */}
      <section id="contact" className="py-24 border-t border-white/5 bg-[#050505]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-none pt-2">Emergency & Support Contact</h2>
            <p className="text-slate-400 text-xs md:text-sm">Reach our clinical triage desks or emergency dispatch hotline instantly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details & Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Emergency Call Card */}
              <div className="bg-red-500/5 border border-red-500/15 p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-red-500 font-black uppercase tracking-wider">Emergency Dispatch 24x7</span>
                    <h3 className="text-sm font-extrabold text-white">+1 (555) 911-0000</h3>
                  </div>
                </div>
              </div>

              {/* General Contact Info List */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Hospital Address</p>
                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                      777 HealthSync Plaza, Medical District, Silicon Valley, CA 94025
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="h-5 w-5 text-cyan-405 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">E-Mail Address</p>
                    <p className="text-xs text-slate-350 font-semibold">support@healthsync.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Operating Hours</p>
                    <p className="text-xs text-slate-350 font-semibold leading-relaxed">
                      Mon - Sun: 24 Hours Emergency Desk (Roster desks open 9:00 AM - 6:00 PM)
                    </p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-3 justify-start opacity-70">
                <a href="#" className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-xs font-bold text-slate-400 hover:text-white">TW</a>
                <a href="#" className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-xs font-bold text-slate-400 hover:text-white">LN</a>
                <a href="#" className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-xs font-bold text-slate-400 hover:text-white">GH</a>
              </div>
            </div>

            {/* Premium Contact Form */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-2xl">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      value={contactData.name}
                      onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      placeholder="Alice Johnson"
                      className="w-full bg-[#111]/80 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-xs outline-none text-slate-200 placeholder-slate-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      placeholder="alice@example.com"
                      className="w-full bg-[#111]/80 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-xs outline-none text-slate-200 placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    value={contactData.phone}
                    onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                    placeholder="+1 (555) 000-1234"
                    className="w-full bg-[#111]/80 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-xs outline-none text-slate-200 placeholder-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Your Message</label>
                  <textarea 
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    placeholder="Describe your inquiry or scheduling question..."
                    className="w-full bg-[#111]/80 border border-white/10 focus:border-blue-500/50 rounded-xl p-3 text-xs outline-none text-slate-200 placeholder-slate-600 transition-colors"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={sendingContact}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sendingContact ? 'Submitting...' : <span className="flex items-center gap-1.5">Send Message <Send className="h-3.5 w-3.5" /></span>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 bg-[#050505]/60 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">HS</div>
            <span className="font-extrabold text-white text-sm">HealthSync</span>
          </div>
          
          <p className="text-[10px] text-slate-505 font-medium">&copy; {new Date().getFullYear()} HealthSync Platform. All rights reserved.</p>
          
          <div className="flex gap-4 font-bold text-[10px] text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#departments" className="hover:text-white transition-colors">Specialities</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <Link to="/login" className="hover:text-white transition-colors">Console Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
