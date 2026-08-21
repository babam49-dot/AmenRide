import React from 'react';

interface SavedPlace {
  id: string;
  label: string;
  name: string;
  address: string;
  icon: string;
}

export const SavedPlacesWidget: React.FC<{ onSelect: (place: SavedPlace) => void }> = ({ onSelect }) => {
  const places: SavedPlace[] = [
    { id: '1', label: 'Home', name: 'Kebele 11 Residence', address: 'Near BDU Poly Campus, Bahir Dar', icon: '🏠' },
    { id: '2', label: 'Work', name: 'Commercial Bank Building', address: 'Kebele 03 Main St, Bahir Dar', icon: '💼' },
    { id: '3', label: 'University', name: 'Bahir Dar Institute of Technology (BiT)', address: 'BiT Campus, Bahir Dar', icon: '🎓' },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
      <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center gap-2">
        📍 Saved Places
      </h3>

      <div className="space-y-2">
        {places.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full text-left bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-700/40 hover:border-amber-500/50 rounded-xl p-3 flex items-center gap-3 transition group"
          >
            <span className="text-xl bg-neutral-700/50 p-2 rounded-lg">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-amber-400 block">{p.label}</span>
              <p className="text-sm font-bold text-white truncate">{p.name}</p>
              <p className="text-xs text-neutral-400 truncate">{p.address}</p>
            </div>
            <span className="text-neutral-500 group-hover:text-amber-400 font-bold text-sm">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};
