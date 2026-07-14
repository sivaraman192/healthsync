import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldAlert, Sparkles, Building, Globe, MessageSquare } from 'lucide-react';
import { useToast } from '../components/Toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Name, Email, and Message are required', 'error');
      return;
    }

    setSending(true);
    setTimeout(() => {
      showToast('Your inquiry has been logged successfully.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  const contactOptions = [
    {
      title: 'Enterprise Sales',
      desc: 'Discuss multi-branch license setups and custom API deployments.',
      email: 'sales@healthsync.com',
      phone: '1-800-SYNC-SALES',
      icon: Building
    },
    {
      title: 'Technical Support',
      desc: 'Get assistance with OAuth JWT configs or database synchronizers.',
      email: 'support@healthsync.com',
      phone: '1-800-SYNC-TECH',
      icon: ShieldAlert
    },
    {
      title: 'Hospital Onboarding',
      desc: 'Schedule demo appointments and training shift walkthroughs.',
      email: 'onboard@healthsync.com',
      phone: '1-800-SYNC-ONBOARD',
      icon: Sparkles
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 font-sans bg-[#050505] min-h-[85vh] text-slate-100 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {ToastComponent}
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider bg-red-950/40 border border-red-800/30 px-3.5 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white pt-2 tracking-tight">Connect with StackKraft Support</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">Discuss custom database migrators, API configurations, or request system setup assistance.</p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
        {contactOptions.map((opt, idx) => {
          const Icon = opt.icon;
          return (
            <div key={idx} className="bg-[#111111]/45 border border-slate-800/60 p-6 rounded-3xl flex flex-col justify-between gap-6 hover:border-slate-700/60 transition-all duration-350 shadow-lg">
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/20 text-red-405 p-3 rounded-2xl h-11 w-11 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">{opt.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{opt.desc}</p>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1 pt-3 border-t border-slate-900">
                <p className="truncate">Email: <span className="text-slate-200 font-semibold">{opt.email}</span></p>
                <p>Phone: <span className="text-slate-200 font-semibold">{opt.phone}</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Form and SVG Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Contact Form */}
        <div className="bg-[#111111]/45 border border-slate-800/60 p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <h3 className="text-lg font-black text-white mb-6">Contact Form</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@example.com"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-650 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your requirements or questions..."
                  rows="4"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500/55 rounded-xl text-xs outline-none text-slate-200 placeholder-slate-655 transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="bg-gradient-to-r from-red-655 to-rose-500 hover:from-red-500 hover:to-rose-450 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-lg shadow-red-500/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                {sending ? 'Sending...' : 'Send Message'} <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Info & Map Mock */}
        <div className="space-y-6">
          {/* Office / Hours Card */}
          <div className="bg-[#111111]/45 border border-slate-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-white">StackKraft Headquarters</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span>100 Health Avenue, Suite 250, New York, NY 10001</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-red-500 shrink-0" />
                <span>Business Hours: Mon - Fri (8:00 AM - 6:00 PM EST)</span>
              </p>
            </div>
          </div>

          {/* Map Mock SVG */}
          <div className="bg-[#111111]/45 border border-slate-800/60 rounded-3xl p-6 shadow-xl h-64 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              {/* Fake Map Grid Grid */}
              <svg width="100%" height="100%">
                <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ef4444" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
              </svg>
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">Map Telemetry</p>
                <h4 className="text-xs font-bold text-white mt-1">Satellite Triage Ratios</h4>
              </div>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wide bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-full">
                Locked
              </span>
            </div>

            <div className="relative z-10 flex justify-center items-center h-28">
              <div className="h-10 w-10 rounded-full bg-red-550/20 border border-red-500 flex items-center justify-center animate-ping pointer-events-none absolute" />
              <div className="h-8 w-8 rounded-full bg-red-600 border border-red-500 flex items-center justify-center font-bold text-white text-xs relative z-10 shadow-lg shadow-red-500/20">
                <Building className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="relative z-10 text-[9px] text-slate-500 font-mono text-center">
              Lat: 40.7128° N, Lon: 74.0060° W • StackKraft Hub NY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
