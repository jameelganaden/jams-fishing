import React from 'react';
import { UPGRADES } from '../../data/constants';

const Upgrades = ({ pts, upgrades, onClose, buyUpgrade }) => {
  return (
    <div className="absolute inset-0 bg-purple-900 z-30 overflow-auto p-3 text-white">
      <div className="flex justify-between mb-2">
        <span className="font-bold">⬆️ Upgrades</span>
        <button onPointerDown={onClose} className="bg-purple-600 px-2 rounded text-xs">X</button>
      </div>
      
      <p className="text-yellow-400 mb-2">💰{pts}</p>
      
      {UPGRADES.map(u => (
        <div key={u.id} className="bg-purple-800 p-2 rounded mb-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-purple-300">{u.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-xs">Lv {upgrades[u.id]}/{u.max}</p>
              {upgrades[u.id] < u.max ? (
                <button
                  onPointerDown={() => buyUpgrade(u.id)}
                  className={`px-2 rounded text-xs mt-1 ${
                    pts >= u.cost(upgrades[u.id]) ? 'bg-yellow-500 text-black' : 'bg-gray-600'
                  }`}
                >
                  {u.cost(upgrades[u.id])}
                </button>
              ) : (
                <span className="text-green-400 text-xs">MAX</span>
              )}
            </div>
          </div>
          <div className="bg-purple-950 rounded-full h-2 mt-2">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${(upgrades[u.id] / u.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Upgrades;