import React, { useState, useEffect } from 'react';

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'error' ? 'bg-red-500' : 'bg-teal-600';

  return (
    <div className={`fixed bottom-5 right-5 text-white py-3 px-6 rounded-lg shadow-lg z-50 flex items-center justify-between min-w-[250px] transition-all duration-300 ${bgClass}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
};
