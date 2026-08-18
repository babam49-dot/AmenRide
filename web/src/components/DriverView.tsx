import React, { useState, useEffect } from 'react';
import { Power, DollarSign, Navigation, Star, CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DriverView: React.FC = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(15);
  const [hasRequest, setHasRequest] = useState<boolean>(true);
  const [accepted, setAccepted] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOnline && hasRequest && !accepted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setHasRequest(false);
    }
    return () => clearInterval(timer);
  }, [isOnline, hasRequest, accepted, countdown]);

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4 space-y-6 pb-24 animate-fadeIn">
      {/* Header Banner & Status Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-card-shadow gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {t('driverPortal')}
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
              BAHIR DAR FLEET
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Tewodros Kassahun (ETB-32049)
          </h2>
          <p className="text-xs text-zinc-400">Bajaj Model: TVS King Deluxe • Blue & White</p>
        </div>

        {/* Online / Offline Status Toggle Button */}
        <button
          onClick={() => {
            setIsOnline(!isOnline);
            setHasRequest(true);
            setCountdown(15);
            setAccepted(false);
          }}
          className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 active-press ${
            isOnline
              ? 'bg-emerald-500 text-zinc-950 shadow-emerald-glow'
              : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
          }`}
        >
          <Power className="w-5 h-5" />
          <span>{isOnline ? t('onlineStatus') : t('offlineStatus')}</span>
        </button>
      </div>

      {/* Driver Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400">{t('todayEarnings')}</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">4,850 ETB</p>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">+18% vs yesterday</p>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400">{t('completedTrips')}</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">18 Trips</p>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">Bahir Dar City</p>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400">{t('driverRating')}</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">4.95 ⭐</p>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">142 total reviews</p>
        </div>
      </div>

      {/* Incoming Trip Request Alert Box */}
      {isOnline && hasRequest && (
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border-2 border-amber-500/80 shadow-amber-glow">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="text-xs font-extrabold text-amber-400 tracking-wider">
                {t('incomingRequest')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/40">
              <Clock className="w-3.5 h-3.5" />
              <span>{countdown}s remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Pickup:</span>
                <span className="font-extrabold text-white">Felege Hiwot Hospital Gate</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-zinc-400">Dropoff:</span>
                <span className="font-extrabold text-white">Grand Resort Hotel Shore</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">Est. Trip Fare</span>
                <p className="text-2xl font-extrabold text-amber-400">35 ETB</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400">Distance</span>
                <p className="text-sm font-extrabold text-white">2.5 km (6 min)</p>
              </div>
            </div>
          </div>

          {!accepted ? (
            <div className="flex gap-3">
              <button
                onClick={() => setAccepted(true)}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm shadow-emerald-glow transition-all flex items-center justify-center gap-2 active-press"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{t('acceptRide')}</span>
              </button>
              <button
                onClick={() => setHasRequest(false)}
                className="px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-extrabold text-sm transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                <span>{t('declineRide')}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-extrabold text-center flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Trip Accepted! Navigation active to Felege Hiwot Hospital.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
