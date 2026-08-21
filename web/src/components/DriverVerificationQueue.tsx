import React, { useState } from 'react';

interface VerificationItem {
  id: string;
  driverName: string;
  phone: string;
  licenseNumber: string;
  vehiclePlate: string;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export const DriverVerificationQueue: React.FC = () => {
  const [queue, setQueue] = useState<VerificationItem[]>([
    { id: '1', driverName: 'Solomon Worku', phone: '+251911998877', licenseNumber: 'BD-DL-554433', vehiclePlate: 'BD-8899-ET', submittedAt: '30 mins ago', status: 'PENDING' },
    { id: '2', driverName: 'Yared Getachew', phone: '+251912223344', licenseNumber: 'BD-DL-112233', vehiclePlate: 'BD-4455-AA', submittedAt: '2 hours ago', status: 'PENDING' },
  ]);

  const handleVerify = (id: string, status: 'VERIFIED' | 'REJECTED') => {
    setQueue(queue.map(item => item.id === id ? { ...item, status } : item));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Driver Partner Document Verification</h3>
          <p className="text-xs text-neutral-400">Review driving licenses and Bahir Dar municipal permits</p>
        </div>
        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold px-3 py-1 rounded-lg">
          📋 Compliance Center
        </span>
      </div>

      <div className="space-y-3">
        {queue.map((item) => (
          <div key={item.id} className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{item.driverName}</span>
                <span className="text-xs text-neutral-400">({item.phone})</span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                License: <span className="font-mono text-amber-400">{item.licenseNumber}</span> • Plate: <span className="font-mono text-teal-400">{item.vehiclePlate}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Submitted {item.submittedAt}</p>
            </div>

            {item.status === 'PENDING' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(item.id, 'REJECTED')}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleVerify(item.id, 'VERIFIED')}
                  className="bg-teal-500 hover:bg-teal-400 text-black px-4 py-1.5 rounded-lg text-xs font-extrabold transition"
                >
                  Approve Driver
                </button>
              </div>
            ) : (
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${item.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
