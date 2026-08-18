import React, { useState } from 'react';
import { Search, X, MapPin, Navigation, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';

export const SearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (locName: string) => void;
}> = ({ isOpen, onClose, onSelectLocation }) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const sampleLandmarks = [
    { name: 'Felege Hiwot Hospital', nameAm: 'ፌለገ ሕይወት ሆስፒታል', area: 'Kebele 04', dist: '1.2 km' },
    { name: 'Grand Resort Hotel', nameAm: 'ግራንድ ሪዞርት ሆቴል', area: 'Lake Tana Shore', dist: '2.5 km' },
    { name: 'BDU Peda Campus', nameAm: 'ባህር ዳር ዩኒቨርሲቲ ፔዳ', area: 'Main Gate', dist: '3.1 km' },
    { name: 'Belay Zeleke Airport', nameAm: 'በላይ ዘለቀ አየር መንገድ', area: 'Airport Road', dist: '8.4 km' },
    { name: 'Bezawit Palace Viewpoint', nameAm: 'በዛዊት ቤተ መንግሥት', area: 'Abay River Exit', dist: '6.0 km' },
  ];

  const filtered = sampleLandmarks.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.nameAm.includes(query) ||
      item.area.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-card-shadow overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/90">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            autoFocus
            className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
          >
            Esc
          </button>
        </div>

        {/* Recent & Suggested Locations */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-zinc-500 uppercase flex items-center justify-between">
            <span>{language === 'EN' ? 'Popular Destinations' : 'ታዋቂ መድረሻዎች'}</span>
            <Clock className="w-3.5 h-3.5" />
          </div>

          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectLocation(language === 'EN' ? item.name : item.nameAm);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/70 border border-transparent hover:border-zinc-800 transition-all text-left group active-press"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-amber-500/20 group-hover:text-amber-400 text-zinc-400 flex items-center justify-center transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">
                    {language === 'EN' ? item.name : item.nameAm}
                  </p>
                  <p className="text-xs text-zinc-400">{item.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-300 font-medium">
                <Navigation className="w-3.5 h-3.5" />
                <span>{item.dist}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
