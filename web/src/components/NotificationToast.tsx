import React, { useEffect } from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';

export const NotificationToast: React.FC<{
  title: string;
  message: string;
  onClose: () => void;
}> = ({ title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-zinc-900 border border-amber-500/60 rounded-2xl shadow-amber-glow p-4 flex items-start gap-3 animate-fadeIn">
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-extrabold text-white">{title}</h4>
        <p className="text-[11px] text-zinc-400 mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
