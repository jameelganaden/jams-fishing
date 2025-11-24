import React from 'react';
import Fish from '../Fish';
import { calcValue } from '../../utils/calculations';

const Inventory = ({ inv, sellMode, setSellMode, onClose, toggleFav, sellFish, sellAll, upgrades }) => {
  return (
    <div className="absolute inset-0 bg-amber-100 z-30 overflow-auto p-3">
      <div className="flex justify-between mb-2">
        <span className="font-bold">🎒 Inventory</span>
        <div>
          <button
            onPointerDown={() => setSellMode(!sellMode)}
            className={`px-2 rounded text-xs mr-1 ${sellMode ? 'bg-red-500 text-white' : 'bg-amber-300'}`}
          >
            {sellMode ? 'Done' : 'Sell'}
          </button>
          <button onPointerDown={onClose} className="bg-amber-600 text-white px-2 rounded text-xs">
            X
          </button>
        </div>
      </div>
      
      {sellMode && (
        <button
          onPointerDown={sellAll}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs mb-2 w-full"
        >
          Sell All ({inv.filter(f => !f.fav).length})
        </button>
      )}
      
      <div className="grid grid-cols-4 gap-1">
        {inv.map(f => (
          <div
            key={f.id}
            className={`bg-white rounded p-1 text-center relative ${f.fav ? 'ring-2 ring-yellow-400' : ''}`}
            onPointerDown={() => {
              if (sellMode) {
                if (!f.fav) sellFish(f.id);
              } else {
                toggleFav(f.id);
              }
            }}
          >
            <svg width="32" height="24">
              <Fish f={{ ...f, sx: 16, sy: 12, ax: 0, ay: 0, spd: 0, r: 9 }} time={0} />
            </svg>
            <p className="text-xs truncate">{f.size[0]}</p>
            <p className="text-xs text-gray-400">💰{calcValue(f, upgrades.value)}</p>
            {f.fav && <span className="absolute top-0 right-0 text-xs">⭐</span>}
          </div>
        ))}
      </div>
      
      {!inv.length && <p className="text-center mt-4 text-amber-700">Empty!</p>}
    </div>
  );
};

export default Inventory;