import React, { useState } from 'react';

interface PayoutRequest {
  id: string;
  driverName: string;
  amountETB: number;
  provider: 'Telebirr' | 'CBE Birr';
  account: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const DriverPayoutsApprovalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState<PayoutRequest[]>([
    { id: 'POUT-101', driverName: 'Amanuel Bekele', amountETB: 1450, provider: 'Telebirr', account: '+251911000001', requestedAt: '10 mins ago', status: 'PENDING' },
    { id: 'POUT-102', driverName: 'Meron Tadesse', amountETB: 2100, provider: 'CBE Birr', account: '1000123456789', requestedAt: '45 mins ago', status: 'PENDING' },
    { id: 'POUT-103', driverName: 'Tewodros Kassaye', amountETB: 950, provider: 'Telebirr', account: '+251911000002', requestedAt: '2 hours ago', status: 'APPROVED' },
  ]);

  if (!isOpen) return null;

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Driver Earnings Payout Dispatch</h3>
            <p className="text-xs text-neutral-400">Review & approve Telebirr / CBE electronic transfers</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {requests.map((r) => (
            <div key={r.id} className="bg-neutral-800/60 border border-neutral-700/50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{r.driverName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">{r.provider}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Account: {r.account} • {r.requestedAt}</p>
                <p className="text-sm font-extrabold text-amber-400 mt-0.5">{r.amountETB.toFixed(2)} ETB</p>
              </div>

              {r.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(r.id, 'REJECTED')}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(r.id, 'APPROVED')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-extrabold transition shadow-lg shadow-emerald-500/20"
                  >
                    Approve Transfer
                  </button>
                </div>
              ) : (
                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${r.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {r.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
