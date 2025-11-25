import React from 'react';
import Fish from '../Fish';
import { calcValue } from '../../utils/calculations';

const Inventory = ({ inv, sellMode, setSellMode, onClose, toggleFav, sellFish, sellAll, upgrades }) => {
  return (
    <div className="absolute inset-0 bg-amber-100 z-30 overflow-auto p-4">
      <div className="flex justify-between mb-3">
        <span className="font-bold text-lg">🎒 Inventory</span>
        <div>
          <button
            onPointerDown={() => setSellMode(!sellMode)}
            className={`px-3 py-1 rounded text-sm mr-2 ${sellMode ? 'bg-red-500 text-white' : 'bg-amber-300'}`}
          >
            {sellMode ? 'Done' : 'Sell'}
          </button>
          <button onPointerDown={onClose} className="bg-amber-600 text-white px-3 py-1 rounded text-sm">
            X
          </button>
        </div>
      </div>
      
      {sellMode && (
        <button
          onPointerDown={sellAll}
          className="bg-red-500 text-white px-3 py-2 rounded text-sm mb-3 w-full"
        >
          Sell All ({inv.filter(f => !f.fav).length})
        </button>
      )}
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {inv.map(f => (
          <div
            key={f.id}
            className={`bg-white rounded p-2 text-center relative ${f.fav ? 'ring-2 ring-yellow-400' : ''}`}
            onPointerDown={() => {
              if (sellMode) {
                if (!f.fav) sellFish(f.id);
              } else {
                toggleFav(f.id);
              }
            }}
          >
            <svg width="48" height="36" className="mx-auto">
              <Fish f={{ ...f, sx: 24, sy: 18, ax: 0, ay: 0, spd: 0, r: 12 }} time={0} />
            </svg>
            <p className="text-sm truncate font-medium">{f.size[0]}</p>
            <p className="text-sm text-gray-400">💰{calcValue(f, upgrades.value)}</p>
            {f.fav && <span className="absolute top-1 right-1 text-base">⭐</span>}
          </div>
        ))}
      </div>
      
      {!inv.length && <p className="text-center mt-8 text-amber-700 text-lg">Empty!</p>}
    </div>
  );
};

export default Inventory;