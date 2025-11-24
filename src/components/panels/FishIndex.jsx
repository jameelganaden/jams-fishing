import React from 'react';

const FishIndex = ({ idx, expanded, setExpanded, onClose }) => {
  return (
    <div className="absolute inset-0 bg-cyan-100 z-30 overflow-auto p-3">
      <div className="flex justify-between mb-2">
        <span className="font-bold">📖 Index ({Object.keys(idx).length})</span>
        <button onPointerDown={onClose} className="bg-cyan-600 text-white px-2 rounded text-xs">X</button>
      </div>
      
      {Object.entries(idx).map(([k, f]) => (
        <div key={k} className="bg-white rounded p-2 mb-1">
          <div className="flex items-center gap-2" onPointerDown={() => setExpanded(expanded === k ? null : k)}>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: f.color }} />
            <span className="flex-1 text-sm font-medium">{f.name}</span>
            <span className="text-xs text-gray-400">R{f.rarity}</span>
            <span>{expanded === k ? '▲' : '▼'}</span>
          </div>
          {expanded === k && (
            <div className="mt-2 pt-2 border-t text-xs text-gray-600 pl-6">
              <p>Sizes: {f.sizes.join(', ')}</p>
              <p>Traits: {f.traits.join(', ')}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FishIndex;