import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Award, 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  FileText, 
  Upload, 
  CheckCircle, 
  Activity, 
  Stethoscope, 
  Eye, 
  Check, 
  Briefcase,
  BookOpen,
  Camera,
  Coffee,
  Car
} from 'lucide-react';

const HospitalWebsite = () => {
  // Navigation active state
  const [activeTab, setActiveTab] = useState('Home');


  // Doctor Detail View state
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Appointment Form state
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    department: 'Cardiology',
    doctor: '',
    date: '',
    time: '',
    symptoms: '',
    report: null
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const departments = [
    { name: 'Cardiology', desc: 'Comprehensive heart care, angiography, and pacemakers.', icon: Heart, color: 'text-red-650 bg-red-50' },
    { name: 'Neurology', desc: 'Expert care for brain, spine, and neurological disorders.', icon: Activity, color: 'text-blue-650 bg-blue-50' },
    { name: 'Orthopedics', desc: 'Bone, joint replacements, trauma care, and rehabilitation.', icon: Stethoscope, color: 'text-emerald-650 bg-emerald-50' },
    { name: 'Pediatrics', desc: 'Compassionate pediatric healthcare and immunizations.', icon: Users, color: 'text-amber-650 bg-amber-50' },
    { name: 'Dermatology', desc: 'Advanced skincare, therapies, and clinical treatments.', icon: Sparkles, color: 'text-pink-650 bg-pink-50' },
    { name: 'ENT Specialist', desc: 'Ear, nose, throat diagnostics and microscopic surgeries.', icon: Eye, color: 'text-purple-650 bg-purple-50' },
    { name: 'General Medicine', desc: 'Comprehensive health consults, chronic disease care, and diagnostics.', icon: Stethoscope, color: 'text-teal-650 bg-teal-50' },
    { name: 'Urology', desc: 'State-of-the-art kidney, bladder, and urinary tract treatments.', icon: Briefcase, color: 'text-cyan-650 bg-cyan-50' },
    { name: 'Oncology', desc: 'Advanced cancer screening, chemotherapy, and surgical care.', icon: ShieldCheck, color: 'text-rose-650 bg-rose-50' },
    { name: 'Emergency Medicine', desc: '24/7 trauma care, immediate life support, and stabilization.', icon: Phone, color: 'text-red-700 bg-red-100' }
  ];

  const doctorsList = [
    {
      id: 1,
      name: 'Dr. Adrian Sterling',
      qualification: 'MBBS, MD (Cardiology), FACC',
      experience: '18 Years',
      specialization: 'Cardiology',
      languages: 'English, Spanish',
      fees: '₹1,500',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      bio: 'Dr. Adrian Sterling is a pioneer in interventional cardiology with over 5,000 successful coronary angioplasties.',
      education: 'Johns Hopkins School of Medicine',
      awards: 'Best Cardiologist Award 2024, National Health Roster'
    },
    {
      id: 2,
      name: 'Dr. Sarah Jenkins',
      qualification: 'MBBS, MS (Neurology), PhD',
      experience: '15 Years',
      specialization: 'Neurology',
      languages: 'English, French',
      fees: '₹1,800',
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600',
      bio: 'Dr. Sarah Jenkins specializes in complex neurosurgeries, spine adjustments, and neuropathic diagnostic grids.',
      education: 'Harvard Medical School',
      awards: 'Distinguished Neuro Scientist Fellowship 2023'
    },
    {
      id: 3,
      name: 'Dr. Rajesh Koothrapali',
      qualification: 'MBBS, MS (Orthopedics)',
      experience: '14 Years',
      specialization: 'Orthopedics',
      languages: 'English, Hindi, Telugu',
      fees: '₹1,200',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
      bio: 'Dr. Rajesh Koothrapali is an expert in joint replacement, arthroscopy, and minimally invasive bone adjustments.',
      education: 'All India Institute of Medical Sciences (AIIMS)',
      awards: 'Excellence in Arthroscopy Research 2022'
    },
    {
      id: 4,
      name: 'Dr. Emily Watson',
      qualification: 'MBBS, MD (Pediatrics)',
      experience: '12 Years',
      specialization: 'Pediatrics',
      languages: 'English, German',
      fees: '₹1,000',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
      bio: 'Dr. Emily Watson provides clinical pediatric care, neonatal support, and comprehensive developmental tracking.',
      education: 'University of Edinburgh Medical School',
      awards: 'Child Healthcare Pioneer Award 2024'
    }
  ];

  const healthPackages = [
    { name: 'Executive Health Checkup', price: '₹4,999', details: ['Complete Blood Count', 'Lipid Profile', 'ECG & Chest X-Ray', 'Kidney Function Test', 'Physician Consultation'] },
    { name: 'Heart Health Package', price: '₹7,499', details: ['Cardiac Lipid Profile', 'ECHO & TMT', 'HbA1c & Diabetes Scan', 'Cardiologist Consult', 'Diet Counseling'] },
    { name: 'Women Wellness Scan', price: '₹5,999', details: ['Thyroid Profile', 'Mammogram / Ultrasound', 'Pap Smear', 'Gynaecology Consult', 'Bone Density Check'] },
    { name: 'Senior Citizen Package', price: '₹3,499', details: ['Blood Sugar Profile', 'Urine Routine Scan', 'Joint Health Consultation', 'Geriatric Specialist Review', 'ECG Monitor'] }
  ];

  const facilities = [
    { name: 'Advanced ICU Units', desc: 'Continuous hemodynamic monitoring and advanced ventilator systems.', icon: ShieldCheck },
    { name: 'Modular OTs', desc: 'Class 100 laminar flow systems ensuring 99.9% sterile environment.', icon: Activity },
    { name: 'High-Field MRI', desc: 'Low-noise detailed brain, joint, and spinal cord scanners.', icon: Stethoscope },
    { name: '24x7 Digital Laboratory', desc: 'Fully automated diagnostic pipelines with fast digital result logs.', icon: Clock },
    { name: 'Cozy Cafeteria', desc: 'Fresh healthy meals prepared daily under strict clinical supervision.', icon: Coffee },
    { name: 'Dedicated Valet Parking', desc: 'Ample space and swift drop points next to the emergency desk.', icon: Car }
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
    } else {
      setBookingConfirmed(true);
    }
  };

  const handleResetBooking = () => {
    setBookingData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      department: 'Cardiology',
      doctor: '',
      date: '',
      time: '',
      symptoms: '',
      report: null
    });
    setBookingStep(1);
    setBookingConfirmed(false);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen relative font-sans selection:bg-red-500 selection:text-white pt-[116px]">
      {/* Top emergency announcement bar */}
      <div className="bg-red-600 text-white py-2 px-6 flex justify-between items-center text-xs font-bold z-[100000] fixed top-0 left-0 w-full h-[36px]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
          <span>24/7 Trauma Emergency Line: +91 99999 11111</span>
        </div>
        <div className="hidden sm:flex gap-4">
          <span>Ambulance Dispatch: +91 99999 22222</span>
          <span>|</span>
          <span>Quality Certified Hospital</span>
        </div>
      </div>

      {/* Fixed Premium Navbar */}
      <header className="fixed top-[36px] left-0 right-0 w-full z-[99999] border-b bg-white border-slate-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          {/* Hospital Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-550/15">
              <Heart className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">APEX</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Hospital & Research</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-600">
            {['Home', 'Departments', 'Doctors', 'Health Packages', 'Facilities', 'Gallery', 'Contact'].map((tab) => (
              <a 
                key={tab} 
                href={`#${tab.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveTab(tab)}
                className={`hover:text-red-600 transition-colors uppercase tracking-wider ${
                  activeTab === tab ? 'text-red-600 border-b-2 border-red-600 pb-1' : ''
                }`}
              >
                {tab}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:+919999911111" 
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-650 border border-red-100 font-extrabold text-xs transition-colors hover:bg-red-100"
            >
              <Phone className="h-3.5 w-3.5" /> Emergency SOS
            </a>
            <a 
              href="#appointment-booking" 
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-550 text-white font-extrabold text-xs shadow-lg shadow-red-500/10 transition-all cursor-pointer"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-white py-16 md:py-24 border-b border-slate-100 overflow-hidden">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 w-[45%] h-full bg-slate-50 rounded-l-[100px] -z-10 hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Grid */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-650 px-3.5 py-1 rounded-full text-xs font-bold">
              <Award className="h-4 w-4" /> Accredited Medical Center
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Advanced Healthcare <span className="text-red-600 block">With Compassion.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Apex Hospital delivers world-class clinical care, pioneering treatments, and personalized care paradigms. Explore specialized clinical disciplines led by certified resident physicians.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#appointment-booking" 
                className="bg-red-600 hover:bg-red-550 text-white font-black py-3.5 px-7 rounded-xl text-xs shadow-lg shadow-red-500/10 transition-all flex items-center gap-2 group cursor-pointer"
              >
                Book Appointment <Calendar className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a 
                href="#doctors" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-7 rounded-xl text-xs transition-colors"
              >
                Find Doctors
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div>
                <p className="text-2xl font-black text-slate-900">500+</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Certified Beds</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">100+</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Expert Physicians</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">250k+</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Happy Patients</p>
              </div>
            </div>
          </div>

          {/* Right Image/Floaters Stack */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md relative">
              {/* Main Image Grid */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800" 
                  alt="Apex Medical Ward" 
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating emergency active card */}
              <div className="absolute -left-6 bottom-8 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">24/7 Ambulance</p>
                  <p className="text-[10px] text-slate-500 font-bold">Fast Dispatch Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Statistics Ratios */}
      <section className="py-12 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">100+</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Super Doctors</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">250,000+</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Intake Cases</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">45+</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Clinic Specialties</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">24/7</p>
            <p className="text-[10px] text-slate-505 font-bold uppercase tracking-wider mt-1">Critical Care</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">40+</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Years Legacy</p>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Clinical Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-2 leading-none">Departments of Excellence</h2>
            <p className="text-slate-500 text-sm">Access targeted diagnostics and specialized treatment regimes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    <div className={`h-11 w-11 rounded-xl ${dept.color} flex items-center justify-center shrink-0 mb-4 transition-transform group-hover:scale-110`}>
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mb-2">{dept.name}</h3>
                    <p className="text-slate-550 text-[11px] leading-relaxed">{dept.desc}</p>
                  </div>
                  <a 
                    href="#appointment-booking" 
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 mt-4 group-hover:text-red-500 transition-colors"
                  >
                    Consult Now <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors Profiles Listing */}
      <section id="doctors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Medical Faculty
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-2 leading-none">Consult Expert Physicians</h2>
            <p className="text-slate-500 text-sm">Schedule outpatient consultation slots with certified senior practitioners.</p>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {doctorsList.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-60 w-full overflow-hidden bg-slate-200">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {doc.specialization}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-sm text-slate-900">{doc.name}</h3>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-medium">{doc.qualification}</p>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>Exp: {doc.experience}</span>
                    <span>Langs: {doc.languages.split(',')[0]}</span>
                  </div>
                </div>
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSelectedDoctor(doc)}
                    className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-800 text-[10px] font-bold transition-all text-center"
                  >
                    View Faculty Profile
                  </button>
                  <a 
                    href="#appointment-booking" 
                    onClick={() => setBookingData({ ...bookingData, doctor: doc.name, department: doc.specialization })}
                    className="py-2.5 rounded-xl bg-red-600 hover:bg-red-550 text-white text-[10px] font-extrabold transition-all text-center"
                  >
                    Book Seat
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Doctor Profile Detail Panel (Modal style) */}
          {selectedDoctor && (
            <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative">
                <button 
                  onClick={() => setSelectedDoctor(null)}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-slate-650"
                >
                  ✕
                </button>
                <div className="flex flex-col md:flex-row gap-6 p-8">
                  <div className="w-full md:w-1/3 shrink-0 h-48 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="space-y-4 flex-grow">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-red-650 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase">{selectedDoctor.specialization}</span>
                      <h3 className="text-lg font-black text-slate-900">{selectedDoctor.name}</h3>
                      <p className="text-xs text-slate-500">{selectedDoctor.qualification}</p>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">{selectedDoctor.bio}</p>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-550 bg-slate-50 p-3 rounded-xl">
                      <div>Institution: <span className="text-slate-900 block mt-0.5">{selectedDoctor.education}</span></div>
                      <div>Special Awards: <span className="text-slate-900 block mt-0.5">{selectedDoctor.awards}</span></div>
                      <div>Consultation Fee: <span className="text-red-600 block mt-0.5">{selectedDoctor.fees}</span></div>
                      <div>Languages: <span className="text-slate-900 block mt-0.5">{selectedDoctor.languages}</span></div>
                    </div>

                    <div className="pt-2">
                      <a 
                        href="#appointment-booking" 
                        onClick={() => {
                          setBookingData({ ...bookingData, doctor: selectedDoctor.name, department: selectedDoctor.specialization });
                          setSelectedDoctor(null);
                        }}
                        className="w-full block text-center py-3 rounded-xl bg-red-600 hover:bg-red-550 text-white font-extrabold text-xs shadow-lg shadow-red-500/10"
                      >
                        Book Appointment Session
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Online Appointment Multi-Step Booking Form */}
      <section id="appointment-booking" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Outpatient Booking
            </span>
            <h2 className="text-3xl font-black text-slate-900 pt-2 leading-none">Schedule Doctor Session</h2>
            <p className="text-slate-500 text-sm">Enrol patient credentials and reserve clinical time ranges instantly.</p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${bookingStep >= 1 ? 'bg-red-600 text-white' : 'bg-slate-150 text-slate-500'}`}>1</span>
                <span className="text-xs font-bold text-slate-800">Patient Details</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-grow mx-4" />
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${bookingStep >= 2 ? 'bg-red-600 text-white' : 'bg-slate-150 text-slate-500'}`}>2</span>
                <span className="text-xs font-bold text-slate-800">Clinic Slot</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-grow mx-4" />
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${bookingStep >= 3 ? 'bg-red-600 text-white' : 'bg-slate-150 text-slate-500'}`}>3</span>
                <span className="text-xs font-bold text-slate-800">Clinical Logs</span>
              </div>
            </div>

            {bookingConfirmed ? (
              // Confirmation View
              <div className="text-center py-8 space-y-6">
                <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">Appointment Logged Successfully!</h3>
                  <p className="text-slate-500 text-xs max-w-md mx-auto">
                    A confirmation SMS and email have been dispatched to patient contacts. Please report to the reception desk 15 minutes before schedule.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl max-w-md mx-auto text-left space-y-2 text-xs font-semibold text-slate-600 border border-slate-100">
                  <p>Patient Name: <span className="text-slate-900 font-extrabold">{bookingData.name}</span></p>
                  <p>Department: <span className="text-slate-900 font-extrabold">{bookingData.department}</span></p>
                  <p>Assigned Doctor: <span className="text-slate-900 font-extrabold">{bookingData.doctor || 'Resident Physician'}</span></p>
                  <p>Date & Time: <span className="text-slate-900 font-extrabold">{bookingData.date} ({bookingData.time})</span></p>
                </div>

                <button 
                  onClick={handleResetBooking}
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              // Multi-step form content
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {bookingStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Patient Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe" 
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Age</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 35" 
                        value={bookingData.age}
                        onChange={(e) => setBookingData({ ...bookingData, age: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Gender</label>
                      <select 
                        value={bookingData.gender}
                        onChange={(e) => setBookingData({ ...bookingData, gender: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Phone Contact</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98765 43210" 
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="patient@hospital.com" 
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold" 
                      />
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Department</label>
                      <select 
                        value={bookingData.department}
                        onChange={(e) => setBookingData({ ...bookingData, department: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Oncology">Oncology</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Doctor</label>
                      <select 
                        value={bookingData.doctor}
                        onChange={(e) => setBookingData({ ...bookingData, doctor: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="">Select Doctor...</option>
                        {doctorsList.filter(d => d.specialization === bookingData.department).map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Preferred Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Preferred Time</label>
                      <select 
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold"
                      >
                        <option value="09:00 AM">09:00 AM - 12:00 PM</option>
                        <option value="02:00 PM">02:00 PM - 05:00 PM</option>
                        <option value="06:00 PM">06:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Describe Symptoms</label>
                      <textarea 
                        rows="3" 
                        placeholder="Please details primary complaints..."
                        value={bookingData.symptoms}
                        onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Attachment (Medical Report)</label>
                      <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <div className="text-center space-y-2 text-slate-400">
                          <Upload className="h-6 w-6 mx-auto" />
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-550">Click to upload report (PDF/JPG)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Nav Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  {bookingStep > 1 ? (
                    <button 
                      type="button"
                      onClick={() => setBookingStep(bookingStep - 1)}
                      className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}
                  <button 
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-red-650 hover:bg-red-550 text-white font-extrabold text-xs shadow-lg shadow-red-500/10"
                  >
                    {bookingStep === 3 ? 'Confirm Appointment' : 'Proceed'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Health Checkup Packages */}
      <section id="health-packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Preventative Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-2 leading-none">Diagnostic Health Packages</h2>
            <p className="text-slate-500 text-sm">Schedule proactive screening sessions to verify key physiological metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {healthPackages.map((pkg, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">{pkg.name}</h3>
                  <p className="text-2xl font-black text-red-600">{pkg.price}</p>
                  
                  <ul className="space-y-2 text-[10px] font-bold text-slate-550 border-t border-slate-200/60 pt-4">
                    {pkg.details.map((det, dIdx) => (
                      <li key={dIdx} className="flex gap-2 items-center">
                        <Check className="h-3.5 w-3.5 text-red-650 shrink-0" />
                        <span>{det}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="#appointment-booking" 
                  onClick={() => setBookingData({ ...bookingData, symptoms: `Interested in ${pkg.name}` })}
                  className="w-full text-center py-2.5 rounded-xl border border-red-105 hover:bg-red-50 text-red-650 font-extrabold text-[10px] mt-6 transition-colors block"
                >
                  Book Package
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Page */}
      <section id="facilities" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Hospital Utilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-2 leading-none">Apex Medical Infrastructure</h2>
            <p className="text-slate-500 text-sm">Advanced clinical hardware configurations ensuring patient comfort and diagnostics security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl flex items-start gap-4">
                  <div className="bg-red-50 text-red-600 p-2.5 rounded-xl shrink-0"><Icon className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{fac.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{fac.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery masonry */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Photo Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-2 leading-none">Apex Tour & Facilities</h2>
            <p className="text-slate-500 text-sm">Inspect modern hospital wards, operation theatres, and reception zones.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400" alt="Apex lobby" className="w-full h-full object-cover" />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400" alt="Apex lab" className="w-full h-full object-cover" />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400" alt="Apex doctor consulting" className="w-full h-full object-cover" />
            </div>
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400" alt="Apex nursery" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-wider bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
              Locate Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 pt-2 leading-none">Apex Contact Details</h2>
            <p className="text-slate-500 text-sm">Find physical building coordinates, dispatch hotlines, or write message logs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-red-50 text-red-600 p-2 rounded-xl shrink-0"><MapPin className="h-5 w-5" /></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Hospital Address</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">102 Apex Towers, Health Park Ring Road, New Delhi, India</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-red-50 text-red-600 p-2 rounded-xl shrink-0"><Phone className="h-5 w-5" /></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Emergency Desk</h4>
                  <p className="text-[10px] text-slate-500 mt-1">+91 99999 11111</p>
                  <p className="text-[10px] text-slate-500">+91 99999 22222</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-red-50 text-red-600 p-2 rounded-xl shrink-0"><Mail className="h-5 w-5" /></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Email Inquiries</h4>
                  <p className="text-[10px] text-slate-500 mt-1">reception@apexhospital.com</p>
                  <p className="text-[10px] text-slate-500">info@apexhospital.com</p>
                </div>
              </div>
            </div>

            {/* Map Mockup SVG */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-3xl relative overflow-hidden h-72 lg:h-auto">
              <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-100 rounded-2xl" preserveAspectRatio="none">
                <path d="M0,50 L300,50 M0,120 L300,120 M100,0 L100,200 M200,0 L200,200" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="150" cy="90" r="15" fill="#fca5a5" fillOpacity="0.4" />
                <circle cx="150" cy="90" r="5" fill="#dc2626" />
              </svg>
              <div className="absolute bottom-8 left-8 bg-slate-900 text-white font-extrabold text-[9px] px-3 py-1.5 rounded-xl uppercase tracking-wider">
                Apex Hospital Landmark
              </div>
            </div>

            {/* Quick Contact Message Form */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-3xl text-left space-y-4">
              <h4 className="font-black text-sm text-slate-900">Send Consultation Inquiry</h4>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Contact Number</label>
                <input type="tel" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" placeholder="+91 98765..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Message Description</label>
                <textarea rows="2" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" placeholder="I would like to consult..." />
              </div>
              <button 
                onClick={() => alert('Message logged successfully.')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-colors"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-slate-200 bg-white py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                <Heart className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">APEX HOSPITAL</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Providing world-class multi-speciality medical care, advanced diagnosis, and continuous critical care emergency solutions since 1985.
            </p>
            <div className="pt-2 text-xs font-bold text-slate-655 space-y-1">
              <p>Emergency Hotline: +91 99999 11111</p>
              <p>Ambulance Dispatch: +91 99999 22222</p>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#home" className="hover:text-red-600 transition-colors">Home</a></li>
              <li><a href="#departments" className="hover:text-red-600 transition-colors">Departments</a></li>
              <li><a href="#doctors" className="hover:text-red-600 transition-colors">Doctors Roster</a></li>
              <li><a href="#health-packages" className="hover:text-red-600 transition-colors">Health Packages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Key Departments</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#departments" className="hover:text-red-600 transition-colors">Cardiology</a></li>
              <li><a href="#departments" className="hover:text-red-600 transition-colors">Neurology</a></li>
              <li><a href="#departments" className="hover:text-red-600 transition-colors">Orthopedics</a></li>
              <li><a href="#departments" className="hover:text-red-600 transition-colors">Oncology</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">Legal & Privacy</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">NABH Certificate</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-12 pt-8 text-center text-[10px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Apex Multi Speciality Hospital. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HospitalWebsite;
