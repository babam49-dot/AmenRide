import React, { useState } from 'react';

interface Promo {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscountETB: number;
  isActive: boolean;
}

export const PromoManagementTab: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([
    { id: '1', code: 'AMENBAHIR', discountPercent: 20, maxDiscountETB: 50, isActive: true },
    { id: '2', code: 'TANA50', discountPercent: 50, maxDiscountETB: 100, isActive: true },
    { id: '3', code: 'WELCOME10', discountPercent: 10, maxDiscountETB: 30, isActive: false },
  ]);

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('15');
  const [newCap, setNewCap] = useState('40');

  const toggleStatus = (id: string) => {
    setPromos(promos.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const promo: Promo = {
      id: String(Date.now()),
      code: newCode.toUpperCase().trim(),
      discountPercent: Number(newDiscount),
      maxDiscountETB: Number(newCap),
      isActive: true
    };
    setPromos([promo, ...promos]);
    setNewCode('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Create New Promo Campaign</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Promo Code (e.g. FESTIVAL20)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
          />
          <input
            type="number"
            placeholder="Discount %"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
          />
          <input
            type="number"
            placeholder="Max Discount (ETB)"
            value={newCap}
            onChange={(e) => setNewCap(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl px-4 py-2.5 text-sm transition"
          >
            Create Promo Code
          </button>
        </form>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Active Discount Codes</h3>
        <div className="divide-y divide-neutral-800">
          {promos.map((p) => (
            <div key={p.id} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg text-sm mr-3">
                  {p.code}
                </span>
                <span className="text-sm text-neutral-300">
                  {p.discountPercent}% Off (Max {p.maxDiscountETB} ETB)
                </span>
              </div>
              <button
                onClick={() => toggleStatus(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  p.isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
              >
                {p.isActive ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
