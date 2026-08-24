import React, { useState, useEffect } from 'react';
import { Radio, Compass, Navigation } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto sm:max-w-5xl px-4 my-3">
      <div className="relative overflow-hidden rounded-3xl bg-gray-100 border border-gray-200 h-64 p-4 shadow-sm">
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-2 text-xs shadow-sm">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="font-extrabold text-gray-900">Bahir Dar Live GPS Canvas</span>
        </div>

        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Simulated Road Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -rotate-6" />
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300 rotate-12" />
          <div className="absolute bottom-4 right-4 text-gray-500 text-xs font-bold flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg">
            <Compass className="w-4 h-4 text-blue-500" />
            Lake Tana Shore 🌊
          </div>
        </div>

        {/* Live Driver Moving Markers */}
        {drivers.map((drv) => (
          <div
            key={drv.id}
            style={{ top: drv.top, left: drv.left }}
            className="absolute z-20 transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-2xl bg-red-100 border border-red-300 text-[#FF2E2E] flex items-center justify-center text-sm font-bold shadow-sm animate-pulse">
                🛺
              </div>
              <div className="absolute top-10 whitespace-nowrap bg-white text-[10px] font-extrabold text-gray-900 px-2 py-0.5 rounded-md border border-gray-200 shadow-md">
                {drv.name} ({drv.status})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
