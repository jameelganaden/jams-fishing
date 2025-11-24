import React from 'react';
import { ACHIEVEMENTS } from '../../data/constants';

const Achievements = ({ achs, onClose }) => {
  return (
    <div className="absolute inset-0 bg-slate-800 z-30 overflow-auto p-3 text-white">
      <div className="flex justify-between mb-2">
        <span className="font-bold">🏆 Achievements</span>
        <button onPointerDown={onClose} className="bg-slate-600 px-2 rounded text-xs">X</button>
      </div>
      
      {ACHIEVEMENTS.map(a => (
        <div
          key={a.id}
          className={`p-2 rounded mb-1 ${
            achs.includes(a.id) ? 'bg-yellow-500/30 border border-yellow-500' : 'bg-slate-700'
          }`}
        >
          <p className="font-medium">{achs.includes(a.id) ? '🏆' : '🔒'} {a.name}</p>
          <p className="text-xs text-slate-300">{a.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Achievements;