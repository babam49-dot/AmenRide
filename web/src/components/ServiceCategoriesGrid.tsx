import React from 'react';
import { Car, Clock, Package, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCategory } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'instant-bajaj',
    title: 'Instant Ride',
    titleAm: 'ፈጣን ባጃጅ',
    subtext: 'Nearest available Bajaj in Bahir Dar',
    subtextAm: 'በአቅራቢያ የሚገኝ ባጃጅ',
    icon: 'bajaj',
    badge: 'Popular',
    badgeAm: 'ተወዳጅ',
    priceRange: '15 - 25 ETB',
    estTime: '3 min away',
    available: true,
  },
  {
    id: 'scheduled-bajaj',
    title: 'Scheduled Bajaj',
    titleAm: 'ቀጠሮ ባጃጅ',
    subtext: 'Reserve Bajaj for specific time today',
    subtextAm: 'ለቀጠሮ ሰዓት ለማስያዝ',
    icon: 'calendar',
    badge: 'Best Fare',
    badgeAm: 'ተመጣጣኝ',
    priceRange: '20 - 35 ETB',
    estTime: 'Reserved',
    available: true,
  },
  {
    id: 'express-delivery',
    title: 'Express Delivery',
    titleAm: 'ፈጣን መልእክት',
    subtext: 'Package & document dispatch across town',
    subtextAm: 'ዕቃ እና ደብዳቤ በፈጣን ለማድረስ',
    icon: 'package',
    badge: 'Fastest',
    badgeAm: 'በጣም ፈጣን',
    priceRange: '30 - 50 ETB',
    estTime: '5 min pickup',
    available: true,
  },
  {
    id: 'executive-car',
    title: 'Executive Comfort',
    titleAm: 'ቪአይፒ መኪና',
    subtext: 'Air-conditioned premium car ride',
    subtextAm: 'በምቾት መኪና ለመጓዝ',
    icon: 'car',
    badge: 'VIP Comfort',
    badgeAm: 'ምቹ መኪና',
    priceRange: '80 - 120 ETB',
    estTime: '6 min away',
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
  const { language, t } = useLanguage();

  const getServiceIcon = (icon: string) => {
    switch (icon) {
      case 'bajaj':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            🛺
          </div>
        );
      case 'calendar':
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
            📅
          </div>
        );
      case 'package':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            📦
          </div>
        );
      case 'car':
        return (
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
            🚘
          </div>
        );
      default:
        return <Car className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4">
      {/* Header Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            {t('servicesTitle')}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {language === 'EN' ? 'Select a ride option tailored for Bahir Dar' : 'ለባህር ዳር ጉዞ የተዘጋጁ አማራጮች'}
          </p>
        </div>
      </div>

      {/* Grid Layout of Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceCategories.map((service) => {
          const isSelected = selectedServiceId === service.id;
          const title = language === 'EN' ? service.title : service.titleAm;
          const sub = language === 'EN' ? service.subtext : service.subtextAm;
          const badge = language === 'EN' ? service.badge : service.badgeAm;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`relative p-5 rounded-3xl cursor-pointer border transition-all duration-200 active:scale-95 hover:scale-[1.02] ${
                isSelected
                  ? 'bg-zinc-900 border-amber-500/80 shadow-amber-glow ring-1 ring-amber-500/50'
                  : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {/* Badge Tag */}
              {badge && (
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      service.id === 'instant-bajaj'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : service.id === 'express-delivery'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : service.id === 'executive-car'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}
                  >
                    {badge}
                  </span>
                </div>
              )}

              {/* Service Icon */}
              <div className="mb-4">{getServiceIcon(service.icon)}</div>

              {/* Title & Description */}
              <h3 className="text-base font-extrabold text-white mb-1">{title}</h3>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{sub}</p>

              {/* Footer: Price & Time */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 font-medium">
                    {language === 'EN' ? 'Estimated' : 'ዋጋ'}
                  </p>
                  <p className="text-sm font-extrabold text-amber-400">{service.priceRange}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold bg-zinc-800/80 px-2.5 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{service.estTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
