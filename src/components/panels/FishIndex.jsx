import React from 'react';
import { ENVS } from '../../data/constants';

const FishIndex = ({ idx, onClose }) => {
  // calculate completion per env
  const getEnvCompletion = (envKey) => {
    const envData = ENVS[envKey];
    const totalFish = envData.colors.length + 1; // +1 for boss
    const discoveredFish = Object.keys(idx).filter(key => key.startsWith(`${envKey}-`)).length;
    return { discovered: discoveredFish, total: totalFish, percentage: Math.round((discoveredFish / totalFish) * 100) };
  };

  // calculate total completion
  const getTotalCompletion = () => {
    let totalDiscovered = 0;
    let totalFish = 0;
    
    Object.keys(ENVS).forEach(envKey => {
      const comp = getEnvCompletion(envKey);
      totalDiscovered += comp.discovered;
      totalFish += comp.total;
    });
    
    return { discovered: totalDiscovered, total: totalFish, percentage: Math.round((totalDiscovered / totalFish) * 100) };
  };

  const totalComp = getTotalCompletion();

  return (
    <div className="absolute inset-0 bg-cyan-100 z-30 overflow-auto p-3">
      <div className="flex justify-between mb-2">
        <span className="font-bold">📖 Fish Index</span>
        <button onPointerDown={onClose} className="bg-cyan-600 text-white px-2 rounded text-xs">X</button>
      </div>
      
      <div className="bg-white rounded-lg p-3 mb-3 shadow">
        <p className="font-bold text-cyan-800">Total Completion</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-cyan-600 h-full rounded-full transition-all" style={{ width: `${totalComp.percentage}%` }} />
          </div>
          <span className="text-sm font-bold">{totalComp.percentage}%</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{totalComp.discovered}/{totalComp.total} discovered</p>
      </div>

      {Object.entries(ENVS).map(([envKey, envData]) => {
        const comp = getEnvCompletion(envKey);
        const allFish = [...envData.colors.map(([hex, name, rarity]) => ({ name, color: hex, rarity, boss: false })), { name: envData.boss, color: '#1a1a2e', rarity: 5, boss: true }];
        
        return (
          <div key={envKey} className="bg-white rounded-lg p-3 mb-2 shadow">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold capitalize">{envData.name}</p>
              <span className="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded">{comp.percentage}%</span>
            </div>
            
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-cyan-600 h-full rounded-full transition-all" style={{ width: `${comp.percentage}%` }} />
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{comp.discovered}/{comp.total} discovered</p>
            
            <div className="grid grid-cols-3 gap-1">
              {allFish.map((fish, i) => {
                const fishKey = `${envKey}-${fish.name}`;
                const discovered = idx[fishKey];
                
                return (
                  <div key={i} className={`rounded p-2 text-center ${discovered ? 'bg-cyan-50' : 'bg-gray-100'}`}>
                    {discovered ? (
                      <>
                        <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: fish.color }} />
                        <p className="text-xs font-medium truncate">{fish.name}</p>
                        <p className="text-xs text-gray-500">R{fish.rarity}</p>
                        {fish.boss && <p className="text-xs">👑</p>}
                        <p className="text-xs text-gray-400 mt-1">Sizes: {discovered.sizes?.length || 0}</p>
                        <p className="text-xs text-gray-400">Traits: {discovered.traits?.length || 0}</p>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full mx-auto mb-1 bg-gray-300" />
                        <p className="text-xs text-gray-400">UNDISCOVERED</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FishIndex;