import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught exception", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303] text-slate-200 font-sans p-6 select-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          
          <div className="bg-[#0f0f0f]/90 border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl max-w-md w-full relative z-10 backdrop-blur-2xl text-left space-y-6">
            <div className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <span className="text-[9px] text-red-500 font-extrabold uppercase tracking-widest bg-red-950/40 border border-red-800/30 px-3 py-1 rounded-full">
                Application Exception
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-4 tracking-tight">Something Went Wrong</h2>
              <p className="text-slate-400 text-xs mt-1">HealthSync encountered a critical rendering error.</p>
            </div>

            <div className="bg-slate-950 p-4 border border-white/5 rounded-xl text-left overflow-x-auto">
              <p className="text-[9px] text-red-500 font-black uppercase tracking-wider">Error Telemetry</p>
              <pre className="text-[10px] text-slate-450 mt-1 font-mono leading-relaxed truncate">
                {this.state.error?.toString() || 'Unknown React Runtime Error'}
              </pre>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-550 hover:to-cyan-405 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reload Application
              </button>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                className="px-5 py-3 border border-slate-800 hover:border-slate-700 text-slate-450 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Home className="h-3.5 w-3.5" /> Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
