import React from 'react';
import { ENVS, RODS } from '../../data/constants';

const Shop = ({ pts, unlocked, rods, rod, onClose, buyEnv, buyRod, setRod, resetProgress }) => {
  return (
    <div className="absolute inset-0 bg-indigo-900 z-30 overflow-auto p-3 text-white">
      <div className="flex justify-between mb-2">
        <span className="font-bold">🏪 Shop</span>
        <button onPointerDown={onClose} className="bg-indigo-600 px-2 rounded text-xs">X</button>
      </div>
      
      <p className="text-yellow-400 mb-2">💰{pts}</p>
      <button onPointerDown={resetProgress} className="text-red-400 text-xs underline mb-2">Reset</button>
      
      <p className="text-xs text-indigo-300 mb-1">Areas</p>
      {Object.entries(ENVS).map(([k, v]) => (
        <div key={k} className={`p-2 rounded mb-1 flex justify-between ${unlocked.includes(k) ? 'bg-green-600/30' : 'bg-indigo-800'}`}>
          <span>{v.name}</span>
          {unlocked.includes(k) ? (
            <span className="text-green-400">✓</span>
          ) : (
            <button
              onPointerDown={() => buyEnv(k)}
              className={`px-2 rounded text-xs ${pts >= v.cost ? 'bg-yellow-500 text-black' : 'bg-gray-600'}`}
            >
              {v.cost}
            </button>
          )}
        </div>
      ))}
      
      <p className="text-xs text-indigo-300 mb-1 mt-2">Rods</p>
      {RODS.map(r => (
        <div key={r.id} className={`p-2 rounded mb-1 flex justify-between ${rods.includes(r.id) ? 'bg-green-600/30' : 'bg-indigo-800'}`}>
          <span>{r.name}</span>
          {rods.includes(r.id) ? (
            <button
              onPointerDown={() => setRod(r.id)}
              className={`px-2 rounded text-xs ${rod === r.id ? 'bg-green-500' : 'bg-indigo-600'}`}
            >
              {rod === r.id ? 'Equipped' : 'Equip'}
            </button>
          ) : (
            <button
              onPointerDown={() => buyRod(r.id)}
              className={`px-2 rounded text-xs ${pts >= r.cost ? 'bg-yellow-500 text-black' : 'bg-gray-600'}`}
            >
              {r.cost}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Shop;