import React, { useState } from 'react';

interface SurgeZone {
  id: number;
  name: string;
  radiusKm: number;
  multiplier: number;
}

export const SurgeZoneManager: React.FC = () => {
  const [zones, setZones] = useState<SurgeZone[]>([
    { id: 1, name: 'Felege Hiwot Referral Hospital', radiusKm: 2.0, multiplier: 1.25 },
    { id: 2, name: 'Bahir Dar Airport Zone', radiusKm: 3.0, multiplier: 1.40 },
    { id: 3, name: 'BDU Peda Campus Hub', radiusKm: 1.5, multiplier: 1.15 },
    { id: 4, name: 'Lake Tana Resort Strip', radiusKm: 2.5, multiplier: 1.30 },
  ]);

  const updateMultiplier = (id: number, val: number) => {
    setZones(zones.map(z => z.id === id ? { ...z, multiplier: Math.max(1.0, Math.round(val * 100) / 100) } : z));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Bahir Dar Demand Surge Zone Pricing</h3>
          <p className="text-xs text-neutral-400">Dynamic surge multipliers based on live rider demand</p>
        </div>
        <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold px-3 py-1 rounded-lg">
          🔥 Heatmap Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((z) => (
          <div key={z.id} className="bg-neutral-800/40 border border-neutral-700/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-sm">{z.name}</span>
              <p className="text-xs text-neutral-400 mt-0.5">Radius: {z.radiusKm} km</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-extrabold text-orange-400">{z.multiplier}x Fare</span>
              <div className="flex gap-2">
                <button
                  onClick={() => updateMultiplier(z.id, z.multiplier - 0.1)}
                  className="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-sm flex items-center justify-center"
                >
                  -
                </button>
                <button
                  onClick={() => updateMultiplier(z.id, z.multiplier + 0.1)}
                  className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
