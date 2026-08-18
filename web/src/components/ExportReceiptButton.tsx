import React, { useState } from 'react';
import { Download, FileText, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ExportReceiptButton: React.FC<{
  tripId?: string;
  fareETB?: number;
}> = ({ tripId = 'TRIP-904', fareETB = 25 }) => {
  const { language } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-all active-press border border-zinc-700"
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">PDF Saved</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-amber-400" />
          <span>{downloading ? 'Generating PDF...' : 'Download Invoice PDF'}</span>
        </>
      )}
    </button>
  );
};
