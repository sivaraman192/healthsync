import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../components/Toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
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
      showToast('Your inquiry has been sent. We will get back to you shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {ToastComponent}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-slate-500 mt-2 text-base">Have inquiries about your account, booking slots, or scheduling? Send us a message.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-teal-700 text-white rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Contact Information</h3>
            <p className="text-teal-100 text-sm">Reach out to our support and clinic administration staff during regular hospital hours.</p>

            <div className="space-y-4 pt-4 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-300" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-teal-300" />
                <span>support@healthsync.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-teal-300" />
                <span>100 Health Avenue, Suite 250, NY 10001</span>
              </div>
            </div>
          </div>

          <div className="border-t border-teal-600 pt-6 mt-8 text-xs text-teal-200">
            <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
            <p>Sat: 9:00 AM - 2:00 PM</p>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Send an Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your details here..."
                rows="5"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg text-sm shadow transition flex items-center gap-2"
            >
              {sending ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
