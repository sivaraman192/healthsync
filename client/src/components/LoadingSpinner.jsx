import React from 'react';
import { Activity } from 'lucide-react';

const LoadingSpinner = ({ label = 'Syncing telemetry database...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <Activity className="h-4.5 w-4.5 text-blue-500 absolute animate-pulse" />
      </div>
      <p className="text-xs text-slate-500 font-bold tracking-tight">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
