import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, HeartHandshake, Award, Clock, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
            <span>24/7 Premium Care Portal</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Connecting Patients with <span className="text-teal-600">Trustworthy Doctors</span>.
          </h1>
          <p className="text-lg text-slate-600">
            HealthSync simplifies medical appointment booking, communication, and prescription management in one sleek and easy-to-use application.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition flex items-center gap-2 group">
              Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/login" className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-lg shadow-sm transition">
              Portal Login
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full flex justify-center relative">
          <div className="w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-3xl shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition duration-500 overflow-hidden">
            <div className="text-center text-white p-8">
              <span className="text-8xl">🏥</span>
              <h3 className="text-2xl font-bold mt-4">HealthSync System</h3>
              <p className="text-sm opacity-90 mt-2">Next generation clinic workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Roles Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Select Your Portal</h2>
            <p className="text-lg text-slate-500 mt-2">Log in or sign up to access specific tools and dashboards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Card */}
            <div className="border border-slate-100 p-8 rounded-2xl bg-slate-50 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-xl mb-6 shadow-sm">P</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Patients Portal</h3>
              <p className="text-slate-600 mb-6 text-sm">Register, explore available doctors, select preferred timings, schedule appointments, and access your prescriptions.</p>
              <Link to="/login?role=PATIENT" className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-1 group">
                Enter Patient Portal <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Doctor Card */}
            <div className="border border-slate-100 p-8 rounded-2xl bg-slate-50 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl mb-6 shadow-sm">D</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Doctors Portal</h3>
              <p className="text-slate-600 mb-6 text-sm">Log in to view clinical appointments, approve schedules, record prescription notes, and view list of historical consultations.</p>
              <Link to="/login?role=DOCTOR" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 group">
                Enter Doctor Portal <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="border border-slate-100 p-8 rounded-2xl bg-slate-50 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xl mb-6 shadow-sm">A</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Dashboard</h3>
              <p className="text-slate-600 mb-6 text-sm">Manage roster of verified medical specialists, monitor clinical schedules, track status indicators, and view hospital KPIs.</p>
              <Link to="/login?role=ADMIN" className="text-slate-800 hover:text-slate-950 font-semibold text-sm flex items-center gap-1 group">
                Enter Admin Console <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why HealthSync?</h2>
            <p className="text-slate-600">We aim to elevate medical workflows by removing booking delays and establishing direct, secure linkages between health providers and their patients.</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-teal-100 p-3 rounded-lg text-teal-700 h-11 w-11 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Certified Specialists</h4>
                  <p className="text-sm text-slate-600">Access verified professionals with robust medical credentials and experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-teal-100 p-3 rounded-lg text-teal-700 h-11 w-11 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Instant Schedule</h4>
                  <p className="text-sm text-slate-600">Book within seconds directly onto the doctors available calendar days.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-teal-100 p-3 rounded-lg text-teal-700 h-11 w-11 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Secured with JWT</h4>
                  <p className="text-sm text-slate-600">Role-based token encryption guards user and clinical medical data integrity.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-6">
            <HeartHandshake className="h-20 w-20 text-teal-600 animate-bounce" />
            <h3 className="text-2xl font-bold text-slate-800">Your Health, Synchronized</h3>
            <p className="text-slate-600 max-w-sm text-sm">Experience modern patient care delivery with automated real-time booking controls.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
