import React, { useState } from 'react';
import { ArrowLeft, Navigation, MapPin, Bookmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PickupLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPickup: (locationName: string) => void;
}

export const PickupLocationPickerModal: React.FC<PickupLocationPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirmPickup,
}) => {
  const { language } = useLanguage();
  const [selectedAddress, setSelectedAddress] = useState('Ring Road, Felege Hiwot');
  const [savedBookmark, setSavedBookmark] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fadeIn select-none overflow-hidden">
      {/* Top Banner Hint Overlay */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-md border border-gray-200">
          <span className="text-sm font-extrabold text-gray-800 tracking-tight">
            Swipe to move map
          </span>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 bg-[#EBECE4] overflow-hidden">
        {/* Map Grid Roads Background Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94A3B8_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        {/* Simulated Road Paths */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 right-0 h-3 bg-white/90 shadow-sm -rotate-12 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Swaziland Ave</span>
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-4 bg-white shadow-sm rotate-6 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ring Rd</span>
          </div>
          <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-white/90 shadow-sm rotate-45" />

          {/* Map Landmarks */}
          <div className="absolute top-1/4 left-1/4 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs">🕌</span>
            <span className="text-[11px] font-bold text-gray-700">Sheh Ojele Mosque</span>
          </div>
          <div className="absolute top-1/3 right-1/4 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs">⛪</span>
            <span className="text-[11px] font-bold text-gray-700">Kidus Rufael Church</span>
          </div>
          <div className="absolute bottom-1/3 left-1/2 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 shadow-sm">
            <span className="text-xs">🛍️</span>
            <span className="text-[11px] font-bold text-blue-600">Felege Hiwot Square</span>
          </div>
        </div>

        {/* Map Center Red Marker Pin with Hailing Icon */}
        <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
          {/* Red Pin Badge */}
          <div className="w-12 h-12 rounded-2xl bg-[#FF2E2E] shadow-xl flex items-center justify-center text-white text-2xl font-bold border-2 border-white transform hover:scale-105 transition-transform">
            🙋‍♂️
          </div>
          {/* Black Pin Stem */}
          <div className="w-1 h-6 bg-black shadow-md rounded-b" />
          <div className="w-3 h-1.5 bg-black/40 rounded-full blur-[1px] -mt-0.5" />
        </div>

        {/* Floating Map Action Buttons (Bottom Left & Bottom Right) */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
          {/* Floating Back Button */}
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-white text-gray-900 shadow-lg border border-gray-200 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Floating GPS Recenter Button */}
          <button
            onClick={() => setSelectedAddress('Felege Hiwot Square, Bahir Dar')}
            className="w-14 h-14 rounded-full bg-white text-gray-900 shadow-lg border border-gray-200 flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-50"
            aria-label="GPS Recenter"
          >
            <Navigation className="w-6 h-6 text-black fill-black" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet Panel: WHERE FROM? */}
      <div className="relative z-30 bg-white rounded-t-3xl border-t border-gray-200 p-6 shadow-2xl space-y-4">
        {/* Section Title */}
        <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase">
          WHERE FROM?
        </h3>

        <div className="border-t border-gray-200 pt-3 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-black shrink-0 fill-black" />
          <div className="flex-1">
            <input
              type="text"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full text-lg font-bold text-gray-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons: Done & Bookmark */}
        <div className="flex items-center gap-3 pt-2">
          {/* Main Red Done Button */}
          <button
            onClick={() => {
              onConfirmPickup(selectedAddress);
              onClose();
            }}
            className="flex-1 py-4 rounded-2xl bg-[#FF2E2E] hover:bg-[#E50914] text-white font-extrabold text-lg shadow-md transition-all active:scale-[0.98]"
          >
            Done
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => setSavedBookmark(!savedBookmark)}
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all active:scale-95 ${
              savedBookmark
                ? 'bg-red-50 border-[#FF2E2E] text-[#FF2E2E]'
                : 'bg-[#EFEFF1] border-gray-200 text-gray-900 hover:bg-gray-200'
            }`}
            aria-label="Save Location"
          >
            <Bookmark className={`w-6 h-6 ${savedBookmark ? 'fill-[#FF2E2E]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
