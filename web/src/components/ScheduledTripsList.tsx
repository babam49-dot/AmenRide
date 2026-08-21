import React, { useState } from 'react';

interface ScheduledTrip {
  id: string;
  pickup: string;
  dropoff: string;
  scheduledTime: string;
  fareEstimateETB: number;
}

export const ScheduledTripsList: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduledTrip[]>([
    { id: 'SCH-1', pickup: 'Felege Hiwot Hospital', dropoff: 'Bahir Dar Airport', scheduledTime: 'Tomorrow at 08:30 AM', fareEstimateETB: 210 },
    { id: 'SCH-2', pickup: 'Kebele 11 Residence', dropoff: 'Lake Tana Resort', scheduledTime: 'In 2 Days at 04:00 PM', fareEstimateETB: 150 },
  ]);

  const handleCancel = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  if (schedules.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          📅 Scheduled Departures ({schedules.length})
        </h3>
      </div>

      <div className="space-y-3">
        {schedules.map((s) => (
          <div key={s.id} className="bg-neutral-800/60 border border-neutral-700/40 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-amber-400">{s.scheduledTime}</span>
              <p className="text-sm font-bold text-white mt-1">{s.pickup} ➔ {s.dropoff}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Estimated Fare: {s.fareEstimateETB} ETB</p>
            </div>
            <button
              onClick={() => handleCancel(s.id)}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
