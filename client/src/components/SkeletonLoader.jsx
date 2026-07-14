import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-full" />
        <div className="space-y-2">
          {items.map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl w-full flex items-center justify-between px-4">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-4 bg-white/10 rounded w-1/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[24px] space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-8 w-8 bg-white/10 rounded-xl" />
            <div className="h-4 bg-white/10 rounded w-1/4" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
