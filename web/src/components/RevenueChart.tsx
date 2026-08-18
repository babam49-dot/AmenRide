import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RevenueChart: React.FC = () => {
  const { language } = useLanguage();

  const weeklyData = [
    { day: 'Mon', am: 'ሰኞ', amount: 620, height: '45%' },
    { day: 'Tue', am: 'ማክሰኞ', amount: 840, height: '65%' },
    { day: 'Wed', am: 'ረቡዕ', amount: 550, height: '40%' },
    { day: 'Thu', am: 'ሐሙስ', amount: 920, height: '75%' },
    { day: 'Fri', am: 'አርብ', amount: 1200, height: '95%' },
    { day: 'Sat', am: 'ቅዳሜ', amount: 1100, height: '85%' },
    { day: 'Sun', am: 'እሁድ', amount: 980, height: '80%' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            {language === 'EN' ? 'Weekly Earnings Breakdown' : 'ሳምንታዊ የገቢ ገበታ'}
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">6,210 ETB</h3>
        </div>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full font-bold">
          Mon – Sun
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-zinc-800">
        {weeklyData.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[10px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.amount}
            </span>
            <div className="w-full bg-zinc-800 rounded-t-xl overflow-hidden h-32 flex items-end">
              <div
                style={{ height: item.height }}
                className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300"
              />
            </div>
            <span className="text-xs font-extrabold text-zinc-400 group-hover:text-white">
              {language === 'EN' ? item.day : item.am}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
