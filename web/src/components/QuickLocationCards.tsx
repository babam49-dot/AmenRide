import React from 'react';
import { MapPin, Hospital, Hotel, GraduationCap, Plane, Mountain, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LocationItem } from '../types';

export const bahirDarLocations: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'Felege Hiwot Hospital',
    nameAm: 'ፌለገ ሕይወት ሆስፒታል',
    subtext: 'Kebele 04 • Emergency Care',
    subtextAm: 'ቀበሌ 04 • ድንገተኛ ሕክምና',
    category: 'hospital',
    distance: '1.2 km',
    estTime: '4 min',
    lat: 11.5932,
    lng: 37.3871,
  },
  {
    id: 'loc-2',
    name: 'Grand Resort Hotel',
    nameAm: 'ግራንድ ሪዞርት ሆቴል',
    subtext: 'Lake Tana Shore',
    subtextAm: 'የጣና ሐይቅ ዳርቻ',
    category: 'hotel',
    distance: '2.5 km',
    estTime: '7 min',
    lat: 11.601,
    lng: 37.389,
  },
  {
    id: 'loc-3',
    name: 'BDU Peda Campus',
    nameAm: 'ባህር ዳር ዩኒቨርሲቲ ፔዳ',
    subtext: 'Main Gate • Gate 1',
    subtextAm: 'ዋና በር • በር 1',
    category: 'university',
    distance: '3.1 km',
    estTime: '8 min',
    lat: 11.585,
    lng: 37.395,
  },
  {
    id: 'loc-4',
    name: 'Belay Zeleke Airport',
    nameAm: 'በላይ ዘለቀ አየር መንገድ',
    subtext: 'Terminal Departure',
    subtextAm: 'የመንገደኞች ተርሚናል',
    category: 'airport',
    distance: '8.4 km',
    estTime: '15 min',
    lat: 11.608,
    lng: 37.321,
  },
  {
    id: 'loc-5',
    name: 'Bezawit Palace Viewpoint',
    nameAm: 'በዛዊት ቤተ መንግሥት',
    subtext: 'Abay River Exit View',
    subtextAm: 'የዓባይ መውጫ ተመልካች',
    category: 'landmark',
    distance: '6.0 km',
    estTime: '12 min',
    lat: 11.615,
    lng: 37.412,
  },
  {
    id: 'loc-6',
    name: 'Kebele 11 Market',
    nameAm: 'ቀበሌ 11 ገበያ ማዕከል',
    subtext: 'City Commercial Center',
    subtextAm: 'የከተማው የገበያ ማዕከል',
    category: 'market',
    distance: '1.8 km',
    estTime: '5 min',
    lat: 11.597,
    lng: 37.382,
  },
];

interface QuickLocationCardsProps {
  onSelectLocation: (loc: LocationItem) => void;
}

export const QuickLocationCards: React.FC<QuickLocationCardsProps> = ({ onSelectLocation }) => {
  const { language, t } = useLanguage();

  const getCategoryIcon = (cat: LocationItem['category']) => {
    switch (cat) {
      case 'hospital':
        return <Hospital className="w-4 h-4 text-red-400" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-amber-400" />;
      case 'university':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'airport':
        return <Plane className="w-4 h-4 text-emerald-400" />;
      case 'landmark':
        return <Mountain className="w-4 h-4 text-purple-400" />;
      case 'market':
        return <ShoppingBag className="w-4 h-4 text-orange-400" />;
      default:
        return <MapPin className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-zinc-300 tracking-wide uppercase flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          {t('quickDestinations')}
        </h3>
        <span className="text-[11px] font-semibold text-zinc-500">Bahir Dar 🇪🇹</span>
      </div>

      {/* Horizontal Scroll Chip Container */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4">
        {bahirDarLocations.map((loc) => {
          const name = language === 'EN' ? loc.name : loc.nameAm;
          const sub = language === 'EN' ? loc.subtext : loc.subtextAm;

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className="flex items-center gap-3 px-4 py-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/90 hover:border-amber-500/40 rounded-2xl shrink-0 transition-all duration-200 active-press shadow-card-shadow group text-left max-w-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-800 group-hover:bg-amber-500/15 flex items-center justify-center shrink-0 transition-colors">
                {getCategoryIcon(loc.category)}
              </div>

              <div className="truncate">
                <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                  {name}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{sub}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {loc.estTime}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold">{loc.distance}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
