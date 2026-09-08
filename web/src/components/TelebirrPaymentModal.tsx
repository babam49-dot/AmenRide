import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, Copy, Check, Sparkles, Smartphone } from 'lucide-react';
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
  const [qrZoomed, setQrZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleCopyMerchant = () => {
    navigator.clipboard.writeText('882049');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (refCode.trim().length >= 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setVerified(true);
        setTimeout(() => {
          onPaymentSuccess(refCode);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  const handleQuickFill = (sampleCode: string) => {
    setRefCode(sampleCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-card-shadow overflow-hidden transition-all duration-300">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-sm">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Telebirr Direct</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ethio Telecom 🇪🇹
                </span>
              </div>
              <p className="text-xs text-zinc-400">Instant Mobile Wallet Payment</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Amount Card */}
          <div className="relative p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-center space-y-2 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              {language === 'EN' ? 'Total Payment Amount' : 'ጠቅላላ የክፍያ መጠን'}
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl font-black text-emerald-400 tracking-tight">{amountETB.toLocaleString()}</span>
              <span className="text-sm font-bold text-emerald-500/90">ETB</span>
            </div>

            {/* Merchant Code with copy */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs">
              <span className="text-zinc-500">Merchant Code:</span>
              <code className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono font-bold text-white">882049</code>
              <button 
                onClick={handleCopyMerchant}
                className="p-1 text-zinc-400 hover:text-emerald-400 transition-colors"
                title="Copy merchant code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!verified ? (
            <div className="space-y-4">
              {/* QR Code Zoomable Box */}
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setQrZoomed(!qrZoomed)}
                    className="w-12 h-12 bg-white rounded-xl p-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-md"
                  >
                    <QrCode className="w-10 h-10 text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Scan QR with Telebirr App</p>
                    <p className="text-[11px] text-zinc-400">Click QR box to {qrZoomed ? 'shrink' : 'zoom'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setQrZoomed(!qrZoomed)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                >
                  {qrZoomed ? 'Shrink' : 'Zoom QR'}
                </button>
              </div>

              {qrZoomed && (
                <div className="p-6 bg-white rounded-2xl flex flex-col items-center justify-center gap-2 animate-fadeIn shadow-2xl">
                  <QrCode className="w-48 h-48 text-zinc-900" />
                  <span className="text-xs font-extrabold text-zinc-800">Scan to Pay {amountETB} ETB to AMEN Ride</span>
                </div>
              )}

              {/* Ref Code Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                    {language === 'EN' ? 'Enter Telebirr Ref Code' : 'የቴሌብር ማረጋገጫ ቁጥር ያስገቡ'}
                  </label>
                  <button 
                    onClick={() => handleQuickFill(`TXN-${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Fill Demo
                  </button>
                </div>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TXN-981240"
                  className="w-full px-4 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Verify Action Button */}
              <button
                onClick={handleVerify}
                disabled={refCode.trim().length < 6 || isVerifying}
                className="w-full py-4 rounded-2xl bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm shadow-emerald-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{language === 'EN' ? 'Confirm Telebirr Payment' : 'ክፍያውን አረጋግጥ'}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h4 className="text-xl font-extrabold text-white">Payment Verified!</h4>
              <p className="text-xs text-zinc-400">Reference #{refCode} confirmed successfully.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

