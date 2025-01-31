import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ message = "" , duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transform transition-all duration-300 ease-in-out animate-bounce">
      <CheckCircle2 size={24} />
      <span className="font-semibold text-lg">{message}</span>
    </div>
  </div>
  );
};

export default Toast;