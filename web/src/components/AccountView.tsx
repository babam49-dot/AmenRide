import React from 'react';
import { User, Shield, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AccountView: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4 space-y-6 pb-24 animate-fadeIn">
      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-black flex items-center justify-center font-extrabold text-2xl shadow-amber-glow">
          AM
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Amen Rider</h2>
          <p className="text-xs text-zinc-400">+251 91 800 1234 • Bahir Dar, Ethiopia</p>
          <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
            Gold Member
          </span>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-1">
        {[
          { icon: <CreditCard className="w-4 h-4 text-emerald-400" />, title: 'Payment Methods (Telebirr / CBE)', desc: 'Default: Telebirr Linked' },
          { icon: <Shield className="w-4 h-4 text-amber-400" />, title: 'Safety & Emergency SOS', desc: 'Direct Bahir Dar Police Dispatch' },
          { icon: <Bell className="w-4 h-4 text-blue-400" />, title: 'Notifications & Alerts', desc: 'Trip updates and promo offers' },
          { icon: <HelpCircle className="w-4 h-4 text-purple-400" />, title: 'Help & Support Center', desc: '24/7 Bahir Dar Customer Line' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-800/80 transition-all text-left group active-press"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-400">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
