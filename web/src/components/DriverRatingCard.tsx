import React, { useState } from 'react';
import { Star, ThumbsUp, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DriverRatingCard: React.FC<{
  driverName?: string;
  onSubmitRating: (rating: number, tags: string[]) => void;
}> = ({ driverName = 'Tewodros Kassahun', onSubmitRating }) => {
  const { language } = useLanguage();
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const feedbackTags = [
    { en: 'Safe Driver', am: 'ጥሩ አሽከርካሪ' },
    { en: 'Fast Arrival', am: 'ፈጣን መምጣት' },
    { en: 'Clean Bajaj', am: 'ንጹህ ባጃጅ' },
    { en: 'Polite Service', am: 'ትሑት አስተናጋጅ' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmitRating(rating, selectedTags);
  };

  return (
    <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-card-shadow space-y-4 max-w-md mx-auto">
      {!submitted ? (
        <>
          <div className="text-center space-y-1">
            <h3 className="text-base font-extrabold text-white">
              {language === 'EN' ? `Rate Your Trip with ${driverName}` : `የ${driverName}ን አገልግሎት ይገምግሙ`}
            </h3>
            <p className="text-xs text-zinc-400">Bahir Dar Ride Rating</p>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform active-press hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400 shadow-amber-glow'
                      : 'text-zinc-700'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Amharic & English Feedback Tag Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {feedbackTags.map((tagObj, idx) => {
              const label = language === 'EN' ? tagObj.en : tagObj.am;
              const isSelected = selectedTags.includes(label);

              return (
                <button
                  key={idx}
                  onClick={() => toggleTag(label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active-press ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Submit Rating Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm shadow-amber-glow transition-all active-press flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'EN' ? 'Submit Rating' : 'ግምገማውን ላክ'}</span>
          </button>
        </>
      ) : (
        <div className="py-6 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="text-base font-extrabold text-white">
            {language === 'EN' ? 'Thank You for Rating!' : 'ስለ አስተያየትዎ እናመሰግናለን!'}
          </h4>
          <p className="text-xs text-zinc-400">Your feedback helps improve Bahir Dar ride quality.</p>
        </div>
      )}
    </div>
  );
};
