import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Clock, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SearchDestinationBarProps {
  onOpenBooking: () => void;
  selectedDestination?: string;
}

export const SearchDestinationBar: React.FC<SearchDestinationBarProps> = ({
  onOpenBooking,
  selectedDestination,
}) => {
  const { language, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPickupMode, setSelectedPickupMode] = useState<string>('pickupNow');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pickupOptions = [
    { id: 'pickupNow', labelKey: 'pickupNow', icon: <Clock className="w-4 h-4 text-emerald-400" /> },
    { id: 'scheduleLater', labelKey: 'scheduleLater', icon: <Calendar className="w-4 h-4 text-amber-400" /> },
    { id: 'customTime', labelKey: 'customTime', icon: <Sparkles className="w-4 h-4 text-blue-400" /> },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = pickupOptions.find((opt) => opt.id === selectedPickupMode) || pickupOptions[0];

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      {/* Search & Destination Pill Container */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between bg-zinc-900/90 border border-zinc-800 rounded-full p-2 pl-5 shadow-card-shadow backdrop-blur-md gap-2 hover:border-amber-500/40 transition-all duration-300 group">
        {/* Left Interactive Trigger: "Where to?" */}
        <button
          onClick={onOpenBooking}
          className="w-full flex items-center gap-3.5 text-left py-2 px-1 focus:outline-none flex-1 active-press"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition-colors shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {t('whereTo')}
            </p>
            <p className="text-sm font-bold text-zinc-100 truncate">
              {selectedDestination || t('searchDestination')}
            </p>
          </div>
        </button>

        {/* Right Dropdown Menu Trigger: "Pickup now" */}
        <div className="relative shrink-0 w-full sm:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 rounded-full bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-bold text-zinc-200 transition-all active-press"
          >
            <div className="flex items-center gap-2">
              {activeOption.icon}
              <span>{t(activeOption.labelKey)}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          {/* Dropdown Options Box */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-card-shadow p-2 z-50 animate-fadeIn">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5 border-b border-zinc-800 mb-1">
                {language === 'EN' ? 'Pickup Timing' : 'የመነሻ ሰዓት'}
              </div>
              {pickupOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedPickupMode(opt.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    selectedPickupMode === opt.id
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {opt.icon}
                  <span>{t(opt.labelKey)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
