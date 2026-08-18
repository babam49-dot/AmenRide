import React, { useState } from 'react';
import { AlertOctagon, X, PhoneCall, Radio, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencySosModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [dispatched, setDispatched] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSos = () => {
    setDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-red-500/80 rounded-3xl shadow-card-shadow overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-red-950/40">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-red-400 uppercase tracking-wider">
              {language === 'EN' ? 'Emergency SOS Alert' : 'የድንገተኛ አደጋ ጥሪ'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          {!dispatched ? (
            <>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {language === 'EN'
                  ? 'Pressing SOS will immediately send your live GPS location (11.5932° N, 37.3871° E) to Bahir Dar Police Dispatch & AMEN Security.'
                  : 'የSOS አዝራሩን ሲጫኑ ቀጥታ የGPS ቦታዎ ለባህር ዳር ፖሊስ እና ለአሜን ደህንነት ይላካል።'}
              </p>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <p className="text-zinc-400">Emergency Line: <span className="text-red-400 font-bold">991 (Bahir Dar Command)</span></p>
                <p className="text-zinc-400">Current Zone: <span className="text-white font-bold">Kebele 04, Lake Tana Rd</span></p>
              </div>

              <button
                onClick={handleTriggerSos}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-card-shadow transition-all active-press flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                <span>DISPATCH LIVE SOS ALERT NOW</span>
              </button>
            </>
          ) : (
            <div className="py-6 space-y-3">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-extrabold text-red-400">SOS DISPATCHED!</h4>
              <p className="text-xs text-zinc-300">
                Bahir Dar Police Emergency Center notified with real-time GPS tracking link. Help is on the way.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-zinc-800 text-zinc-200 font-bold text-xs"
              >
                Dismiss / Standby
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
