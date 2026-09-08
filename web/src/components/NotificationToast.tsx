import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export const NotificationToast: React.FC<{
  title: string;
  message: string;
  type?: ToastType;
  durationMs?: number;
  onClose: () => void;
}> = ({ title, message, type = 'info', durationMs = 4000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onClose]);

  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-glow',
      barBg: 'bg-emerald-400',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/40 shadow-amber-glow',
      barBg: 'bg-amber-400',
    },
    error: {
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
      bg: 'bg-red-500/10 border-red-500/40 shadow-red-glow',
      barBg: 'bg-red-500',
    },
    info: {
      icon: <Bell className="w-4 h-4 text-red-500" />,
      bg: 'bg-zinc-900 border-red-500/40 shadow-card-shadow',
      barBg: 'bg-red-500',
    },
  };

  const currentConfig = typeConfig[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-zinc-900 border rounded-2xl p-4 flex flex-col gap-2 animate-fadeIn ${currentConfig.bg} transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-zinc-950/80 flex items-center justify-center shrink-0 border border-zinc-800">
          {currentConfig.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">{title}</h4>
          <p className="text-[11px] text-zinc-300 mt-0.5 font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ${currentConfig.barBg}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

