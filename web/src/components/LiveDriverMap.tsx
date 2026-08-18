import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Radio, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LiveDriverMap: React.FC = () => {
  const { language } = useLanguage();
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Tewodros K.', top: '35%', left: '42%', status: 'Available' },
    { id: 2, name: 'Abebe B.', top: '55%', left: '68%', status: 'In Trip' },
    { id: 3, name: 'Solomon D.', top: '70%', left: '30%', status: 'Available' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers((prev) =>
        prev.map((d) => ({
          ...d,
          top: `${Math.min(80, Math.max(20, parseFloat(d.top) + (Math.random() * 4 - 2)))}%`,
          left: `${Math.min(80, Math.max(20, parseFloat(d.left) + (Math.random() * 4 - 2)))}%`,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 h-80 p-4 shadow-card-shadow">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2 text-xs">
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="font-extrabold text-white">Bahir Dar City Map Canvas</span>
      </div>

      {/* Map Dark Grid Pattern */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Simulated Road Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800/80 -rotate-6" />
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-zinc-800/80 rotate-12" />
        <div className="absolute bottom-6 right-6 text-zinc-700 text-xs font-bold flex items-center gap-1">
          <Compass className="w-4 h-4" />
          Lake Tana Shore 🌊
        </div>
      </div>

      {/* Driver Moving Markers */}
      {drivers.map((drv) => (
        <div
          key={drv.id}
          style={{ top: drv.top, left: drv.left }}
          className="absolute z-20 transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center text-sm font-bold shadow-amber-glow animate-pulse">
              🛺
            </div>
            <div className="absolute top-10 whitespace-nowrap bg-zinc-900 text-[10px] font-extrabold text-white px-2 py-0.5 rounded-md border border-zinc-800 shadow-md">
              {drv.name} ({drv.status})
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
