import React from 'react';
import { Menu, MapPin, ChevronRight, Globe, Shield, Car, UserCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-md mx-auto sm:max-w-5xl flex items-center justify-between gap-3">
        {/* Left: Yango-style Red Brand Logo & Location Picker */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black italic text-2xl tracking-tighter text-[#FF2E2E] font-['Plus_Jakarta_Sans'] uppercase">
              AMEN
            </span>
            <span className="text-[10px] font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-red-100 text-[#FF2E2E] border border-red-200">
              BAHIR DAR
            </span>
          </div>

          {/* Active Location Dropdown Selector */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-gray-800 hover:text-[#FF2E2E] mt-0.5 transition"
          >
            <MapPin className="w-3 h-3 text-[#FF2E2E] shrink-0" />
            <span className="truncate max-w-[180px]">Felege Hiwot Square</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* Center: Dynamic Role Switcher Pills */}
        <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
          {roleConfig.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF2E2E] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {r.icon}
                <span>{t(r.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Language Switcher & Hamburger Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-bold text-gray-700 transition"
            title="Toggle Language / ቋንቋ ይቀይሩ"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF2E2E]" />
            <span className={language === 'EN' ? 'text-[#FF2E2E] font-extrabold' : 'text-gray-400'}>EN</span>
            <span className="text-gray-300">/</span>
            <span className={language === 'AM' ? 'text-[#FF2E2E] font-extrabold' : 'text-gray-400'}>AM</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 hover:text-[#FF2E2E] transition"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>
    </header>
  );
};
