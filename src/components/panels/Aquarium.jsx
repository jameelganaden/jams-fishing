import React from 'react';
import Fish from '../Fish';

const Aquarium = ({ aquarium, inv, time, onClose, addToAquarium, removeFromAquarium }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-blue-600 z-30 overflow-auto p-3">
      <div className="flex justify-between mb-2">
        <span className="font-bold text-white">🐠 Aquarium ({aquarium.length}/10)</span>
        <button onPointerDown={onClose} className="bg-blue-800 text-white px-2 rounded text-xs">X</button>
      </div>
      
      <div className="bg-blue-800/30 rounded-lg h-40 relative mb-2">
        <svg className="w-full h-full">
          {aquarium.map(f => <Fish key={f.id} f={f} time={time} />)}
        </svg>
      </div>
      
      <p className="text-white text-xs mb-1">Add (unfavorited):</p>
      <div className="grid grid-cols-6 gap-1 mb-2">
        {inv.filter(f => !f.fav).slice(0, 12).map(f => (
          <div key={f.id} className="bg-white/80 rounded p-1" onPointerDown={() => addToAquarium(f.id)}>
            <svg width="20" height="16">
              <Fish f={{ ...f, sx: 10, sy: 8, ax: 0, ay: 0, spd: 0, r: 6 }} time={0} />
            </svg>
          </div>
        ))}
      </div>
      
      <p className="text-white text-xs mb-1">Remove:</p>
      <div className="grid grid-cols-6 gap-1">
        {aquarium.map(f => (
          <div key={f.id} className="bg-red-400/80 rounded p-1" onPointerDown={() => removeFromAquarium(f.id)}>
            <svg width="20" height="16">
              <Fish f={{ ...f, sx: 10, sy: 8, ax: 0, ay: 0, spd: 0, r: 6 }} time={0} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aquarium;