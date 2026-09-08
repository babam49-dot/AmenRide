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
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AccountView: React.FC = () => {
  const { language } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAddresses, setShowAddresses] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Kebele 04, near Dib Anbessa, Bahir Dar' },
    { id: 2, label: 'Work', address: 'BDU Poly Campus Admin Bldg' },
    { id: 3, label: 'Resort', address: 'Kuriftu Resort Lake Tana' },
  ]);
  const [newAddr, setNewAddr] = useState('');

  const handleAddAddress = () => {
    if (newAddr.trim()) {
      setAddresses([...addresses, { id: Date.now(), label: 'Saved Place', address: newAddr.trim() }]);
      setNewAddr('');
    }
  };

  const handleRemoveAddress = (id: number) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full max-w-md mx-auto sm:max-w-3xl my-4 px-4 space-y-4 pb-28 animate-fadeIn text-gray-900">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-2">
        <button 
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-200/80 transition active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-500 border border-red-500/20">
          AMEN RIDE ID 🇪🇹
        </span>
      </div>

      {/* User Profile Header (Circular Photo, Verified Name, Phone) */}
      <div className="flex flex-col items-center text-center py-2 space-y-2">
        {/* Large Circular Avatar */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200 ring-4 ring-red-500/20 transition-all group-hover:scale-105">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80"
              alt="TEWANAY ZEWUDU GETNET"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-md animate-bounce">
            ✓
          </div>
        </div>

        {/* Full Name & Verified Badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase">
            TEWANAY ZEWUDU GETNET
          </h2>
          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            ✓
          </div>
        </div>

        {/* Phone Number */}
        <p className="text-sm font-semibold text-gray-500 font-mono tracking-wide">
          +251 924 765 475
        </p>
      </div>

      {/* 4 Circular Action Buttons Bar */}
      <div className="grid grid-cols-4 gap-3 py-3">
        {[
          { label: 'Orders', icon: <Clock className="w-5 h-5" />, onClick: () => {} },
          { label: 'Support', icon: <Headphones className="w-5 h-5" />, onClick: () => {} },
          { label: 'Addresses', icon: <MapPin className="w-5 h-5 text-red-500" />, onClick: () => setShowAddresses(!showAddresses) },
          { label: 'Settings', icon: <Settings className="w-5 h-5" />, onClick: () => {} },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EFEFF1] group-hover:bg-gray-200 text-gray-900 flex items-center justify-center shadow-sm border border-gray-200/50">
              {btn.icon}
            </div>
            <span className="text-xs font-extrabold text-gray-800 tracking-tight">
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Saved Addresses Drawer */}
      {showAddresses && (
        <div className="bg-[#EFEFF1] rounded-3xl p-5 space-y-3 animate-fadeIn border border-red-500/20 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> Saved Locations
            </h4>
            <span className="text-xs font-semibold text-gray-500">{addresses.length} saved</span>
          </div>

          <div className="space-y-2">
            {addresses.map((item) => (
              <div key={item.id} className="p-3 bg-white rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-extrabold text-red-500 uppercase">{item.label}</span>
                  <p className="text-xs text-gray-700 font-medium">{item.address}</p>
                </div>
                <button
                  onClick={() => handleRemoveAddress(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newAddr}
              onChange={(e) => setNewAddr(e.target.value)}
              placeholder="Add new address (e.g. Airport Rd)"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 font-medium text-gray-900 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleAddAddress}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-xs hover:bg-red-600 active:scale-95 transition-all shadow-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Card 1: Enable notifications */}
      <div 
        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        className="bg-[#EFEFF1] rounded-3xl p-4 flex items-center justify-between hover:bg-gray-200/80 transition cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-3.5">
          <div className="text-xl">🔔</div>
          <span className="text-base font-extrabold text-gray-900">Push Notifications</span>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      </div>

      {/* Card 2: Discounts & Payment Methods */}
      <div className="bg-[#EFEFF1] rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl">🎁</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Discounts & Promos</h4>
              <p className="text-xs text-emerald-600 font-bold">ETHIO2026 Applied (20% OFF)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="border-t border-gray-300/60 pt-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl">💳</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Payment methods</h4>
              <p className="text-xs text-gray-500 font-medium">Telebirr & Cash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Telebirr 📱</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Card 3: Earn as a Driver (Dark Callout Box #1C1C1E) */}
      <div className="bg-[#1C1C1E] rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:bg-black transition shadow-md group">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black flex items-center justify-center font-black text-lg shadow-md group-hover:scale-110 transition-transform">
            ★
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold text-white tracking-tight block">
              Earn as a Driver in Bahir Dar
            </span>
            <span className="text-xs text-zinc-400">Keep up to 90% of trip fares</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
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
            <h4 className="text-base font-extrabold text-gray-900">Safety Center & SOS</h4>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="border-t border-gray-300/60 pt-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-3.5">
            <div className="text-xl text-emerald-500">⭕</div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Great! 5.0★ Rider Score</h4>
              <p className="text-xs text-gray-500 font-medium">Fast driver dispatch priority</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

