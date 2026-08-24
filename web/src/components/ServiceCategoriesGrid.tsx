import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCategory } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cargo',
    title: 'Cargo',
    titleAm: 'ካርጎ / ዕቃ ጫኝ',
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
    titleAm: 'ትራንስፖርት / አውቶቡስ',
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
    titleAm: 'ደሊቨሪ / ፈጣን መልእክት',
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
    titleAm: 'ታክሲ / ጉዞ',
    subtext: 'Instant Bajaj & Car pickup',
    subtextAm: 'በአቅራቢያ የሚገኝ ታክሲ',
    icon: 'car',
    badge: 'from 3 min',
    badgeAm: 'ከ 3 ደቂቃ',
    priceRange: '20 - 45 ETB',
    estTime: 'from 3 min',
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

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-5xl my-4 px-4">
      {/* 2x2 Yango-style Card Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {serviceCategories.map((service) => {
          const isSelected = selectedServiceId === service.id;
          const title = language === 'EN' ? service.title : service.titleAm;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`relative bg-gray-100/90 hover:bg-gray-200/80 rounded-3xl p-4 sm:p-5 cursor-pointer border-2 transition-all duration-200 active:scale-95 flex flex-col justify-between h-36 sm:h-44 shadow-sm overflow-hidden ${
                isSelected ? 'border-[#FF2E2E] bg-red-50/40 ring-2 ring-red-500/20' : 'border-transparent'
              }`}
            >
              {/* Graphic Icon Display */}
              <div className="flex items-center justify-center flex-1 my-1">
                {service.id === 'cargo' && (
                  <div className="text-4xl sm:text-5xl filter drop-shadow-md">🚚</div>
                )}
                {service.id === 'transport' && (
                  <div className="text-4xl sm:text-5xl filter drop-shadow-md">🚌</div>
                )}
                {service.id === 'delivery' && (
                  <div className="text-4xl sm:text-5xl filter drop-shadow-md">🏍️</div>
                )}
                {service.id === 'instant-bajaj' && (
                  <div className="text-4xl sm:text-5xl filter drop-shadow-md">🚘</div>
                )}
              </div>

              {/* Title Label & Sub-badge */}
              <div className="text-center">
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                  {title}
                  {service.badge && (
                    <span className="text-[11px] font-normal text-gray-500 ml-1">
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
