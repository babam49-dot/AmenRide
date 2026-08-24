import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface HeroPromoCardProps {
  onBookRide: () => void;
}

export const HeroPromoCard: React.FC<HeroPromoCardProps> = ({ onBookRide }) => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-5xl my-4 px-4">
      {/* Yango-style red promo banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, #FF2E2E 0%, #CC0000 60%, #B50000 100%)',
        }}
        onClick={onBookRide}
      >
        {/* Decorative diagonal pattern blocks (top-right) */}
        <div className="absolute top-0 right-0 w-40 h-full overflow-hidden opacity-80 pointer-events-none">
          {/* Yellow block */}
          <div
            className="absolute"
            style={{
              width: 60,
              height: 140,
              background: '#FFCC00',
              top: -10,
              right: 40,
              transform: 'skewX(-10deg)',
              borderRadius: 4,
              opacity: 0.9,
            }}
          />
          {/* Green block */}
          <div
            className="absolute"
            style={{
              width: 35,
              height: 120,
              background: '#1A8C1A',
              top: 0,
              right: 10,
              transform: 'skewX(-8deg)',
              borderRadius: 4,
              opacity: 0.85,
            }}
          />
          {/* White thin slash */}
          <div
            className="absolute"
            style={{
              width: 14,
              height: 100,
              background: 'rgba(255,255,255,0.6)',
              top: 20,
              right: 78,
              transform: 'skewX(-10deg)',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[200px] sm:max-w-xs">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase tracking-tight">
            {language === 'EN' ? 'TRY DELIVERY ON AMEN' : 'ደሊቨሪ AMEN ላይ ሞክር'}
          </h2>
          <p className="text-sm text-white/80 font-semibold mt-1.5">
            {language === 'EN'
              ? 'Use 20% discount for your first 6 orders'
              : 'ለመጀመሪያ 6 ትዕዛዝ 20% ቅናሽ'}
          </p>
          <button
            className="mt-4 inline-flex items-center gap-2 bg-white text-[#FF2E2E] font-black text-sm px-5 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-md"
            onClick={e => { e.stopPropagation(); onBookRide(); }}
          >
            {language === 'EN' ? 'Book Now' : 'አሁን ይያዙ'}
          </button>
        </div>
      </div>
    </div>
  );
};
