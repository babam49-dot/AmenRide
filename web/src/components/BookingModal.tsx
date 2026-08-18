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
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Cash'>('Telebirr');
  const [step, setStep] = useState<'details' | 'matching' | 'confirmed'>('details');

  if (!isOpen) return null;

  // Calculate fare based on service type
  const baseFare = selectedService.id === 'executive-car' ? 80 : selectedService.id === 'express-delivery' ? 35 : 20;
  const calculatedFare = baseFare + 5;

  const handleStartBooking = () => {
    setStep('matching');
    setTimeout(() => {
      setStep('confirmed');
    }, 2500);
  };

  const handleReset = () => {
    setStep('details');
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

              {/* Service Selection Summary */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {language === 'EN' ? 'Selected Service' : 'የተመረጠ አገልግሎት'}
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    {language === 'EN' ? selectedService.title : selectedService.titleAm}
                  </h4>
                  <p className="text-xs text-zinc-400">{selectedService.estTime}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 font-medium">{t('estimatedFare')}</span>
                  <p className="text-lg font-extrabold text-amber-400">{calculatedFare} ETB</p>
                </div>
              </div>

              {/* Local Payment Selection */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase mb-2 block">
                  {t('paymentMethod')}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Telebirr', 'CBE Birr', 'Cash'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-2xl border text-xs font-extrabold transition-all flex flex-col items-center gap-1.5 active-press ${
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
              </div>

              {/* CTA Confirm Button */}
              <button
                onClick={handleStartBooking}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-base shadow-amber-glow transition-all active-press"
              >
                {t('confirmBooking')} ({calculatedFare} ETB)
              </button>
            </>
          )}

          {step === 'matching' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-spin">
                <Loader2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-white">{t('findingDriver')}</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {language === 'EN'
                  ? 'Connecting to nearest Bajaj driver around Kebele 04 & Lake Tana...'
                  : 'ከቅርብ ባጃጅ አሽከርካሪ ጋር በማገናኘት ላይ...'}
              </p>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">{t('tripConfirmed')}</h4>
                <p className="text-xs text-emerald-400 font-bold mt-1">Driver: Tewodros Kassahun (ETB-32049)</p>
              </div>

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
                  <span>Payment ({paymentMethod}):</span>
                  <span className="font-bold text-amber-400">{calculatedFare} ETB</span>
                </div>
                <div className="flex justify-between text-zinc-400 border-t border-zinc-800/80 pt-2">
                  <span>ETA Arrival:</span>
                  <span className="font-bold text-emerald-400">3 Minutes</span>
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
