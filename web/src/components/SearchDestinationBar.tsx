import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SearchDestinationBarProps {
  onOpenBooking: () => void;
  selectedDestination?: string;
}

export const SearchDestinationBar: React.FC<SearchDestinationBarProps> = ({
  onOpenBooking,
  selectedDestination,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-5xl my-4 px-4">
      {/* Yango-style Rounded Pill Search Bar */}
      <button
        onClick={onOpenBooking}
        className="w-full flex items-center justify-between bg-gray-100/90 hover:bg-gray-200/90 border border-gray-200/80 rounded-full px-5 py-3.5 shadow-sm transition-all duration-200 active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Vehicle Icon */}
          <div className="text-2xl shrink-0">
            🚘
          </div>
          {/* Main "Where to?" Label */}
          <div className="text-left truncate">
            <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight block">
              {selectedDestination || t('whereTo')}
            </span>
          </div>
        </div>

        {/* Right Action Chevron Circle */}
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-[#FF2E2E] transition-colors shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};
