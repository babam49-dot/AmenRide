import React from 'react';
import { History, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ActivityView: React.FC = () => {
  const { language } = useLanguage();

  const pastTrips = [
    {
      id: 'TRIP-904',
      date: 'Today, 2:15 PM',
      pickup: 'Kebele 04 Market',
      dest: 'Grand Resort Hotel',
      fare: '25 ETB',
      driver: 'Tewodros K.',
      status: 'Completed',
    },
    {
      id: 'TRIP-882',
      date: 'Yesterday, 6:40 PM',
      pickup: 'BDU Peda Gate 1',
      dest: 'Felege Hiwot Hospital',
      fare: '20 ETB',
      driver: 'Abebe B.',
      status: 'Completed',
    },
    {
      id: 'TRIP-741',
      date: '16 Aug 2026',
      pickup: 'Belay Zeleke Airport',
      dest: 'Lake Tana Shore',
      fare: '95 ETB',
      driver: 'Solomon D.',
      status: 'Completed',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4 space-y-6 pb-24 animate-fadeIn">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {language === 'EN' ? 'Recent Trip Activity' : 'የቅርብ ጊዜ የጉዞ ታሪክ'}
            </h2>
            <p className="text-xs text-zinc-400">Bahir Dar, Ethiopia 🇪🇹</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {pastTrips.map((trip) => (
          <div
            key={trip.id}
            className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    {trip.pickup} ➔ {trip.dest}
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{trip.date} • Driver: {trip.driver}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="text-base font-extrabold text-amber-400">{trip.fare}</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
