import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Headphones,
  MapPin,
  Settings,
  Bell,
  Gift,
  CreditCard,
  Bookmark,
  Shield,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AccountView: React.FC = () => {
  const { language } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-3xl my-4 px-4 space-y-4 pb-28 animate-fadeIn text-gray-900">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-2">
        <button className="p-2 rounded-full hover:bg-gray-200/80 transition">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* User Profile Header (Circular Photo, Verified Name, Phone) */}
      <div className="flex flex-col items-center text-center py-2 space-y-2">
        {/* Large Circular Avatar */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80"
              alt="TEWANAY ZEWUDU GETNET"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Full Name & Verified Badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase">
            TEWANAY ZEWUDU GETNET
          </h2>
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            ✓
          </div>
        </div>

        {/* Phone Number */}
        <p className="text-sm font-semibold text-gray-400 font-mono tracking-wide">
          +251924765475
        </p>
      </div>

      {/* 4 Circular Action Buttons Bar */}
      <div className="grid grid-cols-4 gap-3 py-3">
        {[
          { label: 'Orders', icon: <Clock className="w-5 h-5" /> },
          { label: 'Support', icon: <Headphones className="w-5 h-5" /> },
          { label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
          { label: 'Settings', icon: <Settings className="w-5 h-5" /> },
        ].map((btn, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EFEFF1] group-hover:bg-gray-200 text-gray-900 flex items-center justify-center shadow-sm">
              {btn.icon}
            </div>
            <span className="text-xs font-extrabold text-gray-800 tracking-tight">
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Card 1: Enable notifications */}
      <div className="bg-[#EFEFF1] rounded-3xl p-4 flex items-center justify-between hover:bg-gray-200/80 transition cursor-pointer shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="text-xl">🔔</div>
          <span className="text-base font-extrabold text-gray-900">Enable notifications</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Card 2: Discounts & Payment Methods */}
      <div className="bg-[#EFEFF1] rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl">🎁</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Discounts</h4>
              <p className="text-xs text-gray-400 font-medium">Enter promo code</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="border-t border-gray-300/60 pt-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl">💳</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Payment methods</h4>
              <p className="text-xs text-gray-400 font-medium">Cash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💵</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Card 3: Earn as a Driver (Dark Callout Box #1C1C1E) */}
      <div className="bg-[#1C1C1E] rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:bg-black transition shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-lg">
            ★
          </div>
          <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            Earn as a driver
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-red-500" />
      </div>

      {/* Card 4: Maps, Safety & Driver Score */}
      <div className="bg-[#EFEFF1] rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl">🔖</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Improve maps</h4>
              <p className="text-xs text-gray-400 font-medium">Add places, fix errors</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="border-t border-gray-300/60 pt-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl">🛡️</div>
            <h4 className="text-base font-extrabold text-gray-900">Safety</h4>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="border-t border-gray-300/60 pt-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl text-emerald-500">⭕</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Great! Few canceled rides</h4>
              <p className="text-xs text-gray-400 font-medium">This affects ride search speed</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Card 5: Information */}
      <div className="bg-[#EFEFF1] rounded-3xl p-4 flex items-center justify-between hover:bg-gray-200/80 transition cursor-pointer shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="text-xl">ℹ️</div>
          <span className="text-base font-extrabold text-gray-900">Information</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};
