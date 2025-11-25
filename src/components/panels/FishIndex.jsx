import React from 'react';

const FishIndex = ({ idx, expanded, setExpanded, onClose }) => {
  return (
    <div className="absolute inset-0 bg-cyan-100 z-30 overflow-auto p-4">
      <div className="flex justify-between mb-3">
        <span className="font-bold text-lg">📖 Index ({Object.keys(idx).length})</span>
        <button onPointerDown={onClose} className="bg-cyan-600 text-white px-3 py-1 rounded text-sm">X</button>
      </div>
      
      {Object.entries(idx).map(([k, f]) => (
        <div key={k} className="bg-white rounded p-3 mb-2">
          <div className="flex items-center gap-3" onPointerDown={() => setExpanded(expanded === k ? null : k)}>
            <div className="w-6 h-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: f.color }} />
            <span className="flex-1 text-base font-medium">{f.name}</span>
            <span className="text-sm text-gray-400">R{f.rarity}</span>
            <span className="text-lg">{expanded === k ? '▲' : '▼'}</span>
          </div>
          {expanded === k && (
            <div className="mt-3 pt-3 border-t text-sm text-gray-600 pl-9">
              <p><span className="font-medium">Sizes:</span> {f.sizes.join(', ')}</p>
              <p><span className="font-medium">Traits:</span> {f.traits.join(', ')}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FishIndex;