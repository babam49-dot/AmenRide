import React, { useState } from 'react';
import { CreditCard, X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TelebirrPaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  amountETB: number;
  onPaymentSuccess: (refCode: string) => void;
}> = ({ isOpen, onClose, amountETB = 25, onPaymentSuccess }) => {
  const { language } = useLanguage();
  const [refCode, setRefCode] = useState('');
  const [verified, setVerified] = useState(false);

  if (!isOpen) return null;

  const handleVerify = () => {
    if (refCode.trim().length >= 6) {
      setVerified(true);
      setTimeout(() => {
        onPaymentSuccess(refCode);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-card-shadow overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-sm">
              📱
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Telebirr Direct Gateway</h3>
              <p className="text-xs text-zinc-400">Ethio Telecom Payment 🇪🇹</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Payment Amount</span>
            <p className="text-3xl font-extrabold text-amber-400">{amountETB} ETB</p>
            <p className="text-[11px] text-zinc-500">Merchant Code: 882049 (AMEN Ride)</p>
          </div>

          {!verified ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-300 uppercase">
                {language === 'EN' ? 'Enter Telebirr Transfer Ref Code' : 'የቴሌብር የክፍያ ማረጋገጫ ቁጥር ያስገቡ'}
              </label>
              <input
                type="text"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                placeholder="e.g. TXN-981240"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />

              <button
                onClick={handleVerify}
                disabled={refCode.trim().length < 6}
                className="w-full py-3.5 rounded-2xl bg-amber-500 disabled:opacity-50 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm shadow-amber-glow transition-all active-press flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Telebirr Transfer</span>
              </button>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-extrabold text-white">Payment Verified!</h4>
              <p className="text-xs text-zinc-400">Reference #{refCode} confirmed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
