import React, { useState } from 'react';

interface EmergencyLog {
  id: string;
  riderName: string;
  phone: string;
  location: string;
  dispatchTarget: string;
  timestamp: string;
  status: 'DISPATCHED' | 'RESOLVED';
}

export const EmergencyLogsTable: React.FC = () => {
  const [logs, setLogs] = useState<EmergencyLog[]>([
    { id: 'SOS-901', riderName: 'Tewodros Zewudu', phone: '+251912345678', location: 'Felege Hiwot Hospital (11.6080, 37.3699)', dispatchTarget: 'Felege Hiwot Police Station', timestamp: '15 mins ago', status: 'DISPATCHED' },
    { id: 'SOS-902', riderName: 'Bethlehem Tsegaye', phone: '+251911998877', location: 'Grand Resort Hotel (11.5936, 37.3950)', dispatchTarget: 'Bahir Dar Central Police (991)', timestamp: '3 hours ago', status: 'RESOLVED' },
  ]);

  const toggleResolved = (id: string) => {
    setLogs(logs.map(l => l.id === id ? { ...l, status: l.status === 'DISPATCHED' ? 'RESOLVED' : 'DISPATCHED' } : l));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🚨 Emergency SOS Dispatch Logs
          </h3>
          <p className="text-xs text-neutral-400">Live GPS security alerts sent to Bahir Dar police lines</p>
        </div>
        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded-lg">
          Live Dispatch
        </span>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-rose-400 text-xs">{log.id}</span>
                <span className="font-bold text-white text-sm">{log.riderName}</span>
                <span className="text-xs text-neutral-400">({log.phone})</span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">Location: {log.location}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Dispatched to: {log.dispatchTarget} • {log.timestamp}</p>
            </div>

            <button
              onClick={() => toggleResolved(log.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                log.status === 'RESOLVED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500 hover:bg-rose-600 text-white font-extrabold shadow-lg shadow-rose-500/20'
              }`}
            >
              {log.status === 'RESOLVED' ? 'RESOLVED' : 'MARK RESOLVED'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
