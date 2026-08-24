import React from 'react';
import { Home, Grid, History, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab } = useRole();

  const navItems = [
    { id: 'Home', labelKey: 'navHome', icon: <Home className="w-5 h-5" /> },
    { id: 'Services', labelKey: 'navServices', icon: <Grid className="w-5 h-5" /> },
    { id: 'Activity', labelKey: 'navActivity', icon: <History className="w-5 h-5" /> },
    { id: 'Account', labelKey: 'navAccount', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg px-4 py-2.5 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active-press ${
                isActive ? 'text-[#FF2E2E] font-extrabold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Active Tab Red Indicator dot */}
              {isActive && (
                <span className="absolute -top-2.5 w-8 h-1 rounded-full bg-[#FF2E2E] animate-fadeIn" />
              )}

              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>

              <span className="text-[11px] font-semibold mt-1 tracking-tight">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
