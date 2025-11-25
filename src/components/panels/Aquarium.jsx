import React from 'react';
import Fish from '../Fish';

const Aquarium = ({ aquarium, inv, time, onClose, addToAquarium, removeFromAquarium }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-blue-600 z-30 overflow-auto p-4">
      <div className="flex justify-between mb-3">
        <span className="font-bold text-white text-lg">🐠 Aquarium ({aquarium.length}/10)</span>
        <button onPointerDown={onClose} className="bg-blue-800 text-white px-3 py-1 rounded text-sm">X</button>
      </div>
      
      <div className="bg-blue-800/30 rounded-lg h-48 md:h-80 relative mb-3">
        <svg className="w-full h-full">
          {aquarium.map(f => <Fish key={f.id} f={f} time={time} />)}
        </svg>
      </div>
      
      <p className="text-white text-sm mb-2">Add (unfavorited):</p>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-3">
        {inv.filter(f => !f.fav).slice(0, 20).map(f => (
          <div key={f.id} className="bg-white/80 rounded p-1.5" onPointerDown={() => addToAquarium(f.id)}>
            <svg width="28" height="22">
              <Fish f={{ ...f, sx: 14, sy: 11, ax: 0, ay: 0, spd: 0, r: 8 }} time={0} />
            </svg>
          </div>
        ))}
      </div>
      
      <p className="text-white text-sm mb-2">Remove:</p>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {aquarium.map(f => (
          <div key={f.id} className="bg-red-400/80 rounded p-1.5" onPointerDown={() => removeFromAquarium(f.id)}>
            <svg width="28" height="22">
              <Fish f={{ ...f, sx: 14, sy: 11, ax: 0, ay: 0, spd: 0, r: 8 }} time={0} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aquarium;