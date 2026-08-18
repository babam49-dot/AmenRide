import React, { useState } from 'react';
import { Calculator, X, Sparkles, MapPin, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FareCalculatorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [distanceKm, setDistanceKm] = useState<number>(3.5);
  const [vehicleType, setVehicleType] = useState<'bajaj' | 'car'>('bajaj');
  const [isPeakHour, setIsPeakHour] = useState<boolean>(false);

  if (!isOpen) return null;

  const baseRate = vehicleType === 'bajaj' ? 15 : 60;
  const perKmRate = vehicleType === 'bajaj' ? 4 : 15;
  const surgeMultiplier = isPeakHour ? 1.3 : 1.0;

  const totalFare = Math.round((baseRate + distanceKm * perKmRate) * surgeMultiplier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-card-shadow overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'EN' ? 'Bahir Dar Fare Estimator' : 'የባህር ዳር የጉዞ ዋጋ መገመቻ'}
              </h3>
              <p className="text-xs text-zinc-400">Distance & Surge Calculator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Distance Input Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-zinc-400">Trip Distance:</span>
              <span className="text-amber-400">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Vehicle Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setVehicleType('bajaj')}
              className={`p-3 rounded-2xl border text-xs font-extrabold transition-all active-press ${
                vehicleType === 'bajaj'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              🛺 Bajaj Ride
            </button>
            <button
              onClick={() => setVehicleType('car')}
              className={`p-3 rounded-2xl border text-xs font-extrabold transition-all active-press ${
                vehicleType === 'car'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              🚘 Executive Car
            </button>
          </div>

          {/* Peak Hour Toggle */}
          <button
            onClick={() => setIsPeakHour(!isPeakHour)}
            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all active-press ${
              isPeakHour
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Peak Traffic Hours (1.3x Surge)
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/30">
              {isPeakHour ? 'ACTIVE' : 'OFF'}
            </span>
          </button>

          {/* Calculated Output Box */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Estimated Total Fare</span>
            <p className="text-3xl font-extrabold text-amber-400">{totalFare} ETB</p>
            <p className="text-[11px] text-zinc-500">Includes base fare + distance charge</p>
          </div>
        </div>
      </div>
    </div>
  );
};
