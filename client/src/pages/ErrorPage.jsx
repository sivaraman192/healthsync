import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, FileSearch, HelpCircle, Lock, RefreshCw, Home } from 'lucide-react';

const ErrorPage = ({ code = 404 }) => {
  const navigate = useNavigate();

  const configs = {
    401: {
      title: 'Session Unauthorized',
      subtitle: 'Please authenticate to access this medical ward.',
      desc: 'You do not have a valid token session or your credentials expired.',
      icon: Lock,
      action: () => navigate('/login'),
      actionLabel: 'Sign In'
    },
    403: {
      title: 'Console Access Forbidden',
      subtitle: 'Restricted area. Authority level insufficient.',
      desc: 'Your account role is not cleared to inspect this routing path.',
      icon: ShieldAlert,
      action: () => navigate('/'),
      actionLabel: 'Back to Safety'
    },
    404: {
      title: 'Department Not Found',
      subtitle: 'The clinical wing or routing path does not exist.',
      desc: 'We searched the HealthSync registry but found no records for this path.',
      icon: FileSearch,
      action: () => navigate('/'),
      actionLabel: 'Return Home'
    },
    500: {
      title: 'Critical Database Crash',
      subtitle: 'HealthSync backend services threw an unhandled exception.',
      desc: 'The MySQL telemetry is active but the transaction encountered a lock error.',
      icon: HelpCircle,
      action: () => window.location.reload(),
      actionLabel: 'Re-sync Telemetry'
    }
  };

  const config = configs[code] || configs[404];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] text-slate-200 font-sans p-6 select-none">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="bg-[#0f0f0f]/90 border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl max-w-md w-full relative z-10 backdrop-blur-2xl text-left space-y-6">
        <div className="text-center">
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-350 mx-auto mb-4">
            <Icon className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-[9px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-950/40 border border-blue-900/30 px-3.5 py-1 rounded-full">
            Response Status: {code}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-4 tracking-tight">{config.title}</h2>
          <p className="text-slate-400 text-xs mt-1">{config.subtitle}</p>
        </div>

        <p className="text-slate-500 text-[11px] leading-relaxed text-center">
          {config.desc}
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={config.action}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {config.actionLabel}
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-3 border border-slate-800 hover:border-slate-700 text-slate-450 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
