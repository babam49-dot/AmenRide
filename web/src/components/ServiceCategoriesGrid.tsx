import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCategory } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cargo',
    title: 'Cargo',
    titleAm: 'ካርጎ',
    subtext: 'Large goods & furniture delivery',
    subtextAm: 'ትላልቅ ዕቃዎችን ለማጓጓዝ',
    icon: 'truck',
    badge: '',
    badgeAm: '',
    priceRange: '120 - 250 ETB',
    estTime: '7 min away',
    available: true,
  },
  {
    id: 'transport',
    title: 'Transport',
    titleAm: 'ትራንስፖርት',
    subtext: 'City & Intercity bus transport',
    subtextAm: 'የከተማ እና የክፍለ ሀገር አውቶቡስ',
    icon: 'bus',
    badge: '',
    badgeAm: '',
    priceRange: '15 - 35 ETB',
    estTime: 'Schedule',
    available: true,
  },
  {
    id: 'delivery',
    title: 'Delivery',
    titleAm: 'ደሊቨሪ',
    subtext: 'Motorcycle package & food delivery',
    subtextAm: 'በሞተር ሳይክል ፈጣን መልእክት',
    icon: 'boda',
    badge: '',
    badgeAm: '',
    priceRange: '30 - 50 ETB',
    estTime: '4 min pickup',
    available: true,
  },
  {
    id: 'instant-bajaj',
    title: 'Rides',
    titleAm: 'ጉዞ',
    subtext: 'Instant Bajaj & Car pickup',
    subtextAm: 'በአቅራቢያ የሚገኝ ታክሲ',
    icon: 'car',
    badge: 'from 4 min',
    badgeAm: 'ከ 4 ደቂቃ',
    priceRange: '20 - 45 ETB',
    estTime: 'from 4 min',
    available: true,
  },
];

interface ServiceCategoriesGridProps {
  onSelectService: (service: ServiceCategory) => void;
  selectedServiceId?: string;
}

export const ServiceCategoriesGrid: React.FC<ServiceCategoriesGridProps> = ({
  onSelectService,
  selectedServiceId = 'instant-bajaj',
}) => {
  const { language } = useLanguage();

  const topRowServices = serviceCategories.slice(0, 2);
  const bottomRowServices = serviceCategories.slice(2, 4);

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-5xl my-4 px-4 space-y-3">
      {/* Top Row: Cargo & Transport (Horizontal Rounded Rectangles) */}
      <div className="grid grid-cols-2 gap-3">
        {topRowServices.map((service) => {
          const isSelected = selectedServiceId === service.id;
          const title = language === 'EN' ? service.title : service.titleAm;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`relative bg-[#EFEFF1] hover:bg-gray-200/90 rounded-2xl p-3 cursor-pointer border-2 transition-all duration-200 active:scale-95 flex flex-col items-center justify-between h-28 sm:h-32 shadow-sm overflow-hidden ${
                isSelected ? 'border-[#FF2E2E] bg-red-50/40 ring-2 ring-red-500/20' : 'border-transparent'
              }`}
            >
              {/* Graphic Icon */}
              <div className="flex-1 flex items-center justify-center">
                {service.id === 'cargo' && (
                  <div className="text-4xl sm:text-5xl filter drop-shadow-sm">🚚</div>
                )}
                {service.id === 'transport' && (
                  <div className="text-4xl sm:text-5xl filter drop-shadow-sm">🚌</div>
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 text-center">
                {title}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Bottom Row: Delivery & Rides (PERFECT SQUARE CARDS 1:1 Aspect Ratio) */}
      <div className="grid grid-cols-2 gap-3">
        {bottomRowServices.map((service) => {
          const isSelected = selectedServiceId === service.id;
          const title = language === 'EN' ? service.title : service.titleAm;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`relative bg-[#EFEFF1] hover:bg-gray-200/90 rounded-3xl p-4 cursor-pointer border-2 transition-all duration-200 active:scale-95 flex flex-col justify-between aspect-square shadow-sm overflow-hidden ${
                isSelected ? 'border-[#FF2E2E] bg-red-50/40 ring-2 ring-red-500/20' : 'border-transparent'
              }`}
            >
              {/* Square Graphic Vehicle Showcase Container */}
              <div className="flex-1 flex items-center justify-center relative">
                {service.id === 'delivery' && (
                  <div className="text-6xl sm:text-7xl filter drop-shadow-md transform hover:scale-105 transition-transform">
                    🏍️
                  </div>
                )}
                {service.id === 'instant-bajaj' && (
                  <div className="text-6xl sm:text-7xl filter drop-shadow-md transform hover:scale-105 transition-transform">
                    🚘
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="text-center pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                  {title}
                  {service.badge && (
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      • {service.badge}
                    </span>
                  )}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
