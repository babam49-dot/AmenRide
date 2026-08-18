import React, { useState } from 'react';
import { Shield, Users, DollarSign, Activity, Radio, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AdminView: React.FC = () => {
  const { t } = useLanguage();

  const [drivers, setDrivers] = useState([
    { id: 'DRV-101', name: 'Tewodros Kassahun', plate: 'ETB-32049', vehicle: 'Bajaj TVS', status: 'Online', trips: 18, location: 'Kebele 04' },
    { id: 'DRV-102', name: 'Abebe Bikila', plate: 'ETB-48102', vehicle: 'Bajaj Bajaj RE', status: 'Online', trips: 14, location: 'Lake Tana Shore' },
    { id: 'DRV-103', name: 'Mulugeta Tesfaye', plate: 'ETB-91204', vehicle: 'Comfort Car', status: 'Offline', trips: 9, location: 'BDU Peda' },
    { id: 'DRV-104', name: 'Solomon Demisse', plate: 'ETB-11029', vehicle: 'Bajaj TVS', status: 'Online', trips: 22, location: 'Airport Road' },
  ]);

  const toggleDriverStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'Online' ? 'Offline' : 'Online' } : d))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4 space-y-6 pb-24 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {t('adminPortal')}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Bahir Dar Fleet Control Center</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>LIVE DISPATCH</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-400">{t('totalTrips')}</span>
          <p className="text-2xl font-extrabold text-white mt-1">1,240</p>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">+12% this week</p>
        </div>
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-400">{t('activeFleet')}</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">42 Online</p>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">Bahir Dar City</p>
        </div>
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-400">{t('totalRevenue')}</span>
          <p className="text-2xl font-extrabold text-white mt-1">32,450 ETB</p>
          <p className="text-xs text-amber-400 mt-1 font-semibold">Telebirr & CBE Birr</p>
        </div>
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-400">{t('systemStatus')}</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">99.9% Uptime</p>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">Server Nominal</p>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
        <h3 className="text-base font-extrabold text-white mb-4">Active Drivers List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="py-3 px-3">Driver ID</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Plate</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {drivers.map((drv) => (
                <tr key={drv.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-zinc-400">{drv.id}</td>
                  <td className="py-3.5 px-3 font-extrabold text-white">{drv.name}</td>
                  <td className="py-3.5 px-3 font-mono text-amber-400">{drv.plate}</td>
                  <td className="py-3.5 px-3 text-zinc-300">{drv.vehicle}</td>
                  <td className="py-3.5 px-3 text-zinc-400">{drv.location}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        drv.status === 'Online'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {drv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => toggleDriverStatus(drv.id)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-all text-xs"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
