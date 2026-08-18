import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Navigation, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroPromoCardProps {
  onBookRide: () => void;
}

export const HeroPromoCard: React.FC<HeroPromoCardProps> = ({ onBookRide }) => {
  const { language, t } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-card-shadow">
        {/* Background Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Description, CTA */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bahir Dar Ride Hailing 🇪🇹</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t('promoTitle')}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed font-normal">
              {t('promoDesc')}
            </p>

            {/* Features Bullet Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold bg-zinc-800/80 px-3 py-1.5 rounded-full border border-zinc-700/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'EN' ? 'Verified Local Drivers' : 'የተረጋገጡ አሽከርካሪዎች'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold bg-zinc-800/80 px-3 py-1.5 rounded-full border border-zinc-700/60">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>{language === 'EN' ? 'Telebirr & CBE Birr' : 'ቴሌብር እና ሲቢኢ ብር'}</span>
              </div>
            </div>

            {/* High Visibility Accent CTA Button */}
            <div className="pt-4">
              <button
                onClick={onBookRide}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-base shadow-amber-glow transition-all duration-200 active-press hover:scale-[1.02]"
              >
                <span>{t('bookRide')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-200">
                    {language === 'EN' ? 'Active Drivers Nearby' : 'በአቅራቢያ ያሉ ባጃጆች'}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-amber-400">14 Online</span>
              </div>

              {/* Mock Map Preview Landmark */}
              <div className="h-28 rounded-xl bg-zinc-950 border border-zinc-800/80 p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Lake Tana Shore
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    ~3 min ETA
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">Felege Hiwot ➔ Grand Resort</span>
                  <span className="font-extrabold text-emerald-400">20 ETB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
