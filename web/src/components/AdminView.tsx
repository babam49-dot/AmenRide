import React, { useState } from 'react';
import { Shield, Users, DollarSign, Activity, Radio, CheckCircle, XCircle, Search, Flame, Zap, Sliders, MapPin, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AdminView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'fleet' | 'surge' | 'analytics'>('fleet');
  const [searchQuery, setSearchQuery] = useState('');

  const [drivers, setDrivers] = useState([
    { id: 'DRV-101', name: 'Tewodros Kassahun', plate: 'ETB-32049', vehicle: 'Bajaj TVS', status: 'Online', trips: 18, location: 'Kebele 04' },
    { id: 'DRV-102', name: 'Abebe Bikila', plate: 'ETB-48102', vehicle: 'Bajaj RE', status: 'Online', trips: 14, location: 'Lake Tana Shore' },
    { id: 'DRV-103', name: 'Mulugeta Tesfaye', plate: 'ETB-91204', vehicle: 'Comfort Car', status: 'Offline', trips: 9, location: 'BDU Peda' },
    { id: 'DRV-104', name: 'Solomon Demisse', plate: 'ETB-11029', vehicle: 'Bajaj TVS', status: 'Online', trips: 22, location: 'Airport Road' },
    { id: 'DRV-105', name: 'Almaz Ayana', plate: 'ETB-77210', vehicle: 'Comfort Car', status: 'Online', trips: 31, location: 'Poly Campus' },
  ]);

  const [surgeZones, setSurgeZones] = useState([
    { id: 'z1', zone: 'BDU Poly Campus & Kebele 04', multiplier: 1.5, demand: 'High', activeDrivers: 12 },
    { id: 'z2', zone: 'Bahir Dar Airport (BJR)', multiplier: 1.8, demand: 'Very High', activeDrivers: 6 },
    { id: 'z3', zone: 'Lake Tana Port & Dib Anbessa', multiplier: 1.2, demand: 'Moderate', activeDrivers: 15 },
    { id: 'z4', zone: 'Kebele 14 & Abay Bridge', multiplier: 1.0, demand: 'Normal', activeDrivers: 9 },
  ]);

  const toggleDriverStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'Online' ? 'Offline' : 'Online' } : d))
    );
  };

  const updateSurge = (id: string, delta: number) => {
    setSurgeZones((prev) =>
      prev.map((z) =>
        z.id === id ? { ...z, multiplier: Math.max(1.0, parseFloat((z.multiplier + delta).toFixed(1))) } : z
      )
    );
  };

  const filteredDrivers = drivers.filter(
    (d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.plate.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto my-6 px-4 space-y-6 pb-24 animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-card-shadow gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider">
              {t('adminPortal')}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Bahir Dar Fleet Control Center 🇪🇹</h2>
          <p className="text-xs text-zinc-400">Real-time dispatch, active driver tracking & surge management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>LIVE DISPATCH</span>
          </div>
          <button 
            onClick={() => {}} 
            className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800/80 transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">{t('totalTrips')}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">1,240</p>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">+12% this week</p>
        </div>
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800/80 transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">{t('activeFleet')}</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">42 Online</p>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">Bahir Dar City Center</p>
        </div>
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800/80 transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">{t('totalRevenue')}</span>
            <DollarSign className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black text-white mt-2">32,450 ETB</p>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">Telebirr & CBE Birr</p>
        </div>
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800/80 transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Peak Surge Zone</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-400 mt-2">1.8x Airport</p>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">Dynamic pricing active</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 w-fit">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'fleet' ? 'bg-red-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Active Fleet ({drivers.length})
        </button>
        <button
          onClick={() => setActiveTab('surge')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            activeTab === 'surge' ? 'bg-red-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Surge Zone Controls
        </button>
      </div>

      {/* TAB 1: FLEET TABLE */}
      {activeTab === 'fleet' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-white">Driver Dispatch Roster</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter name, plate, kebele..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Driver ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Plate</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Location Zone</th>
                  <th className="py-3 px-3">Trips Today</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredDrivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-zinc-400">{drv.id}</td>
                    <td className="py-3.5 px-3 font-extrabold text-white">{drv.name}</td>
                    <td className="py-3.5 px-3 font-mono text-amber-400">{drv.plate}</td>
                    <td className="py-3.5 px-3 text-zinc-300">{drv.vehicle}</td>
                    <td className="py-3.5 px-3 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {drv.location}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">{drv.trips}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase ${
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
                        {drv.status === 'Online' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SURGE ZONES */}
      {activeTab === 'surge' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Dynamic Surge Multipliers
              </h3>
              <p className="text-xs text-zinc-400">Adjust peak pricing rates across Bahir Dar sectors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {surgeZones.map((z) => (
              <div key={z.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white">{z.zone}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    z.demand === 'Very High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    z.demand === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {z.demand} Demand
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-zinc-400">Current Multiplier</span>
                    <p className="text-2xl font-black text-amber-400">{z.multiplier.toFixed(1)}x</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSurge(z.id, -0.1)}
                      className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 active:scale-95"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateSurge(z.id, 0.1)}
                      className="w-8 h-8 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400 active:scale-95 shadow-red-glow"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

