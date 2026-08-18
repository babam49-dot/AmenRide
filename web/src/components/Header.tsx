import React from 'react';
import { Search, Globe, Shield, Car, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';
import { Role } from '../types';

export const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { role, setRole, setIsSearchOpen } = useRole();

  const roleConfig: { id: Role; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'rider', labelKey: 'roleRider', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'driver', labelKey: 'roleDriver', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'admin', labelKey: 'roleAdmin', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-amber-glow font-extrabold text-black text-lg tracking-wider">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                {t('amenLogoText')}
              </span>
              <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                BAHIR DAR
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Center: Dynamic Role Switcher Pills */}
        <div className="flex items-center bg-zinc-900/90 p-1 rounded-full border border-zinc-800/90 shadow-inner">
          {roleConfig.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active-press ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {r.icon}
                <span>{t(r.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Language Switcher & Search Trigger */}
        <div className="flex items-center gap-2">
          {/* Language Selection Pill ("EN / AM") */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all active-press"
            title="Toggle Language / ቋንቋ ይቀይሩ"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className={language === 'EN' ? 'text-amber-400 font-bold' : 'text-zinc-400'}>EN</span>
            <span className="text-zinc-600">/</span>
            <span className={language === 'AM' ? 'text-amber-400 font-bold' : 'text-zinc-400'}>AM</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-all active-press"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
