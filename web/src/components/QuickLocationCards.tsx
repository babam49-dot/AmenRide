import React from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LocationItem } from '../types';

export const bahirDarLocations: LocationItem[] = [
  {
    id: 'loc-1',
    name: 'BDU 5 Kilo Peda Campus',
    nameAm: 'ባህር ዳር ዩኒቨርሲቲ 5 ኪሎ',
    subtext: 'Bahir Dar, Arada, Kebele 11',
    subtextAm: 'ባህር ዳር፣ አራዳ፣ ቀበሌ 11',
    category: 'university',
    distance: '1.2 km',
    estTime: '4 min',
    lat: 11.585,
    lng: 37.395,
  },
  {
    id: 'loc-2',
    name: 'Felege Hiwot Referral Hospital',
    nameAm: 'ፌለገ ሕይወት ሪፈራል ሆስፒታል',
    subtext: 'Bahir Dar, Kebele 04',
    subtextAm: 'ባህር ዳር፣ ቀበሌ 04',
    category: 'landmark',
    distance: '2.5 km',
    estTime: '7 min',
    lat: 11.5932,
    lng: 37.3871,
  },
  {
    id: 'loc-3',
    name: 'Atenatera Taxi Station',
    nameAm: 'አጠናተራ ታክሲ ተርሚናል',
    subtext: 'Bahir Dar, Main Bus Station, Kebele 01',
    subtextAm: 'ባህር ዳር፣ ዋና አውቶቡስ ተርሚናል',
    category: 'landmark',
    distance: '3.1 km',
    estTime: '8 min',
    lat: 11.597,
    lng: 37.382,
  },
  {
    id: 'loc-4',
    name: 'Grand Resort Hotel',
    nameAm: 'ግራንድ ሪዞርት ሆቴል',
    subtext: 'Bahir Dar, Lake Tana Shore, Kebele 03',
    subtextAm: 'ባህር ዳር፣ ጣና ሐይቅ ዳርቻ',
    category: 'landmark',
    distance: '4.5 km',
    estTime: '10 min',
    lat: 11.601,
    lng: 37.389,
  },
];

interface QuickLocationCardsProps {
  onSelectLocation: (loc: LocationItem) => void;
}

export const QuickLocationCards: React.FC<QuickLocationCardsProps> = ({ onSelectLocation }) => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-5xl my-4 px-4">
      {/* Vertical Suggested Destinations List */}
      <div className="space-y-1 bg-white rounded-3xl p-2 shadow-sm border border-gray-100 divide-y divide-gray-100">
        {bahirDarLocations.map((loc) => {
          const name = language === 'EN' ? loc.name : loc.nameAm;
          const sub = language === 'EN' ? loc.subtext : loc.subtextAm;

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className="w-full flex items-center gap-3.5 p-3.5 hover:bg-gray-50/80 transition-colors text-left group active:scale-[0.99]"
            >
              {/* Gray Circular Icon Badge */}
              <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-600 group-hover:bg-[#FF2E2E]/10 group-hover:text-[#FF2E2E] flex items-center justify-center shrink-0 transition-colors">
                {loc.category === 'university' ? (
                  <GraduationCap className="w-6 h-6" />
                ) : (
                  <MapPin className="w-6 h-6" />
                )}
              </div>

              {/* Destination Details */}
              <div className="truncate flex-1">
                <h4 className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-[#FF2E2E] transition-colors truncate">
                  {name}
                </h4>
                <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">
                  {sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
