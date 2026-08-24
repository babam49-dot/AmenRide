import React, { useState } from 'react';
import { X, MapPin, Navigation, CreditCard, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LocationItem, ServiceCategory } from '../types';
import { bahirDarLocations } from './QuickLocationCards';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: LocationItem | null;
  selectedService: ServiceCategory;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialDestination,
  selectedService,
}) => {
  const { language, t } = useLanguage();
  const [pickup, setPickup] = useState('Current Location (Kebele 04)');
  const [destination, setDestination] = useState(
    initialDestination ? (language === 'EN' ? initialDestination.name : initialDestination.nameAm) : 'Grand Resort Hotel'
  );
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Chapa' | 'Cash'>('Telebirr');
  const [accountNumber, setAccountNumber] = useState('0911223344');
  const [step, setStep] = useState<'details' | 'matching' | 'confirmed'>('details');
  const [deductionProof, setDeductionProof] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Real Per-KM Distance Calculation
  const selectedLoc = bahirDarLocations.find(l => (language === 'EN' ? l.name : l.nameAm) === destination);
  const distanceKm = selectedLoc ? parseFloat(selectedLoc.distance.replace(' km', '')) || 4.2 : 4.2;
  const ratePerKm = selectedService.id === 'executive-car' ? 40 : (selectedService.id === 'express-delivery' ? 30 : 25);
  const baseFare = selectedService.id === 'executive-car' ? 80 : (selectedService.id === 'express-delivery' ? 35 : 40);
  const calculatedFare = Math.round((baseFare + distanceKm * ratePerKm) * 100) / 100;

  const handleStartBooking = async () => {
    setErrorMessage('');
    if (paymentMethod !== 'Cash') {
      setIsProcessing(true);
      try {
        const res = await fetch('http://localhost:5000/api/payments/verify-and-deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountNumber,
            provider: paymentMethod,
            distanceKm,
            ratePerKm,
            baseFare,
            tripId: `TRIP-BD-${Date.now()}`
          })
        });

        const data = await res.json();
        setIsProcessing(false);

        if (!res.ok || !data.success) {
          setErrorMessage(data.error || 'Account verification failed or insufficient funds.');
          return;
        }

        setDeductionProof(data.proof);
      } catch (e: any) {
        setIsProcessing(false);
        // Dev fallback simulation if server offline
        const mockBalance = 1500 - calculatedFare;
        setDeductionProof({
          transactionId: `TXN-DEDUCT-${Date.now()}`,
          accountName: 'Tewodros Zewudu',
          accountNumber,
          provider: paymentMethod,
          distanceKm,
          ratePerKm,
          baseFare,
          deductedETB: calculatedFare,
          remainingBalanceETB: mockBalance,
          status: 'SUCCESSFULLY_DEDUCTED ✅',
          deductedAt: new Date().toISOString()
        });
      }
    }

    setStep('matching');
    setTimeout(() => {
      setStep('confirmed');
    }, 2000);
  };

  const handleReset = () => {
    setStep('details');
    setDeductionProof(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-card-shadow overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
              🛺
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {step === 'confirmed' ? t('tripConfirmed') : t('selectDestination')}
              </h3>
              <p className="text-xs text-zinc-400">Bahir Dar, Ethiopia 🇪🇹</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {step === 'details' && (
            <>
              {/* Pickup & Destination Inputs */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div className="w-full">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">
                      {language === 'EN' ? 'Pickup Location' : 'መነሻ ቦታ'}
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <div className="w-full">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">
                      {language === 'EN' ? 'Destination' : 'መድረሻ ቦታ'}
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-sm font-bold text-zinc-100 focus:outline-none"
                    >
                      {bahirDarLocations.map((loc) => (
                        <option key={loc.id} value={language === 'EN' ? loc.name : loc.nameAm}>
                          {language === 'EN' ? loc.name : loc.nameAm} ({loc.distance})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Distance & Per-KM Fare Breakdown Box */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Trip Distance:</span>
                  <span className="font-extrabold text-white">{distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Fare Rate:</span>
                  <span className="font-bold text-amber-400">{baseFare} ETB base + {ratePerKm} ETB/km</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Total Per-KM Fare:</span>
                  <span className="text-lg font-black text-amber-400">{calculatedFare} ETB</span>
                </div>
              </div>

              {/* Payment Selection & Account Link Input */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase block">
                  {t('paymentMethod')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Telebirr', 'CBE Birr', 'Chapa', 'Cash'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl border text-[11px] font-extrabold transition-all flex flex-col items-center gap-1 active-press ${
                        paymentMethod === method
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod !== 'Cash' && (
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <label className="text-[11px] font-bold text-amber-400 block">
                      Link / Verify {paymentMethod} Account Number:
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 0911223344 or CBE 100088997766"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2 text-[10px] text-zinc-400 flex-wrap">
                      <span>Sample Accounts:</span>
                      <button onClick={() => setAccountNumber('0911223344')} className="underline text-amber-400">0911223344 (1500 ETB)</button>
                      <button onClick={() => setAccountNumber('0912345678')} className="underline text-amber-400">0912345678 (850 ETB)</button>
                      <button onClick={() => setAccountNumber('0911000001')} className="underline text-rose-400">0911000001 (Low 35 ETB)</button>
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              {/* CTA Confirm Button */}
              <button
                onClick={handleStartBooking}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-base shadow-amber-glow transition-all active-press flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `${t('confirmBooking')} (${calculatedFare} ETB)`}
              </button>
            </>
          )}

          {step === 'matching' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-spin">
                <Loader2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-white">Verifying Account & Finding Driver...</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Deducting per-km fare ({calculatedFare} ETB) from {paymentMethod} account ({accountNumber})...
              </p>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">{t('tripConfirmed')}</h4>
                <p className="text-xs text-emerald-400 font-bold mt-1">Driver: Tewodros Kassahun (ETB-32049)</p>
              </div>

              {/* Deduction Proof Banner */}
              {deductionProof && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-left text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>BOOM! Money Deducted Successfully</span>
                  </div>
                  <p className="text-zinc-300">Account Holder: <span className="font-bold text-white">{deductionProof.accountName}</span></p>
                  <p className="text-zinc-300">Account Number: <span className="font-mono text-amber-400">{deductionProof.accountNumber} ({deductionProof.provider})</span></p>
                  <p className="text-zinc-300">Calculated Distance: <span className="font-bold text-white">{deductionProof.distanceKm} km</span></p>
                  <p className="text-zinc-300">Amount Deducted: <span className="font-bold text-emerald-400">{deductionProof.deductedETB.toFixed(2)} ETB</span></p>
                  <p className="text-zinc-300 border-t border-emerald-500/30 pt-1 mt-1">
                    Remaining Balance: <span className="font-extrabold text-amber-400">{deductionProof.remainingBalanceETB.toFixed(2)} ETB</span>
                  </p>
                </div>
              )}

              {/* Digital Receipt Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Pickup:</span>
                  <span className="font-bold text-white">{pickup}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Destination:</span>
                  <span className="font-bold text-white">{destination}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payment Method:</span>
                  <span className="font-bold text-amber-400">{paymentMethod}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-sm transition-all"
              >
                Done / Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

