import React, { useState, useEffect, useRef } from 'react';
import Fish from './components/Fish';
import CatchingGame from './components/CatchingGame';
import Inventory from './components/panels/Inventory';
import Aquarium from './components/panels/Aquarium';
import FishIndex from './components/panels/FishIndex';
import Achievements from './components/panels/Achievements';
import Shop from './components/panels/Shop';
import Upgrades from './components/panels/Upgrades';
import { ENVS, RODS, UPGRADES } from './data/constants';
import { spawnFish } from './utils/fishSpawner';
import { calcValue } from './utils/calculations';

const SAVE_KEY = 'fish-v3';

const LEVEL_TITLES = [
  { min: 1, max: 4, title: 'New Fisher' },
  { min: 5, max: 9, title: 'Amateur Fisher' },
  { min: 10, max: 19, title: 'Regular Fisher' },
  { min: 20, max: 29, title: 'Advanced Fisher' },
  { min: 30, max: 39, title: 'Expert Fisher' },
  { min: 40, max: 49, title: 'Master Fisher' },
  { min: 50, max: 59, title: 'Pro Fisher' },
  { min: 60, max: Infinity, title: 'Godly Fisher' }
];

const getLevelTitle = (level) => {
  const titleData = LEVEL_TITLES.find(t => level >= t.min && level <= t.max);
  return titleData?.title || 'Fisher';
};

const getExpForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

const calculateExp = (fish, isNew, rarity) => {
  let baseExp = fish.boss ? 100 : 20;
  if (isNew) baseExp *= 3;
  baseExp *= rarity;
  return Math.floor(baseExp);
};

function App() {
  const [env, setEnv] = useState('ocean');
  const [fish, setFish] = useState([]);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState('idle');
  const [hooked, setHooked] = useState(null);
  const [inv, setInv] = useState([]);
  const [idx, setIdx] = useState({});
  const [pts, setPts] = useState(0);
  const [unlocked, setUnlocked] = useState(['ocean']);
  const [rods, setRods] = useState(['basic']);
  const [rod, setRod] = useState('basic');
  const [achs, setAchs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [panel, setPanel] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [msg, setMsg] = useState('Cast your line!');
  const [aquarium, setAquarium] = useState([]);
  const [upgrades, setUpgrades] = useState({ speed: 0, rarity: 0, bite: 0, value: 0 });
  const [loaded, setLoaded] = useState(false);
  const [sellMode, setSellMode] = useState(false);
  const waitRef = useRef();
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(SAVE_KEY);
        if (res?.value) {
          const d = JSON.parse(res.value);
          setInv(d.inv || []);
          setIdx(d.idx || {});
          setPts(d.pts || 0);
          setUnlocked(d.unlocked || ['ocean']);
          setRods(d.rods || ['basic']);
          setRod(d.rod || 'basic');
          setAchs(d.achs || []);
          setAquarium(d.aquarium || []);
          setUpgrades(d.upgrades || { speed: 0, rarity: 0, bite: 0, value: 0 });
          if (d.env) setEnv(d.env);
          setMsg('Loaded!');
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(SAVE_KEY, JSON.stringify({ inv, idx, pts, unlocked, rods, rod, achs, env, aquarium, upgrades }));
      } catch (e) {}
    })();
  }, [inv, idx, pts, unlocked, rods, rod, achs, env, aquarium, upgrades, loaded]);

  useEffect(() => {
    setFish(spawnFish(env, rod, upgrades.rarity));
  }, [env, rod, upgrades.rarity]);

  useEffect(() => {
    const i = setInterval(() => setTime(t => t + 0.016), 16);
    return () => clearInterval(i);
  }, []);

  const cast = () => {
    if (mode !== 'idle') return;
    setMode('cast');
    setMsg('Casting...');
    const mult = 1 - upgrades.bite * 0.1;
    setTimeout(() => {
      setMode('wait');
      setMsg('Waiting...');
      waitRef.current = setTimeout(() => {
        const f = fish[Math.floor(Math.random() * fish.length)];
        setHooked(f);
        setMode('catch');
        setMsg(f.boss ? `👑 ${f.name}!` : f.name);
      }, Math.max(500, (1500 + Math.random() * 3000) * mult));
    }, 300);
  };

  useEffect(() => {
  (async () => {
    try {
      const res = await window.storage.get(SAVE_KEY);
      if (res?.value) {
        const d = JSON.parse(res.value);
        setInv(d.inv || []);
        setIdx(d.idx || {});
        setPts(d.pts || 0);
        setUnlocked(d.unlocked || ['ocean']);
        setRods(d.rods || ['basic']);
        setRod(d.rod || 'basic');
        setAchs(d.achs || []);
        setAquarium(d.aquarium || []);
        setUpgrades(d.upgrades || { speed: 0, rarity: 0, bite: 0, value: 0 });
        setLevel(d.level || 1);
        setExp(d.exp || 0);
        if (d.env) setEnv(d.env);
        setMsg('Loaded!');
      }
    } catch (e) {}
    setLoaded(true);
  })();
}, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(SAVE_KEY, JSON.stringify({ inv, idx, pts, unlocked, rods, rod, achs, env, aquarium, upgrades, level, exp }));
      } catch (e) {}
    })();
  }, [inv, idx, pts, unlocked, rods, rod, achs, env, aquarium, upgrades, loaded, level, exp]);

  const win = () => {
    const f = { ...hooked, id: `c${Date.now()}`, fav: false };
    setInv(p => [...p, f]);
    
    const key = `${f.env}-${f.name}`;
    const isNew = !idx[key];
    
    setIdx(p => {
      const prev = p[key] || { ...f, sizes: [], traits: [] };
      return { ...p, [key]: { ...prev, sizes: [...new Set([...prev.sizes, f.size])], traits: [...new Set([...prev.traits, f.trait])] }};
    });
    
    const earnedExp = calculateExp(f, isNew, f.rarity || 1);
    const newExp = exp + earnedExp;
    const expNeeded = getExpForLevel(level);
    
    if (newExp >= expNeeded) {
      const goldReward = Math.floor(100 * Math.pow(1.2, level - 1));
      setPts(p => p + goldReward);
      setLevel(l => l + 1);
      setExp(newExp - expNeeded);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      setMsg(`Level Up! +${goldReward} gold!`);
    } else {
      setExp(newExp);
      setMsg(`Caught! +${earnedExp} EXP`);
    }
    
    setStreak(s => s + 1);
    if (!achs.includes('first')) setAchs(a => [...a, 'first']);
    if (inv.length + 1 >= 10 && !achs.includes('ten')) setAchs(a => [...a, 'ten']);
    if (f.boss && !achs.includes('boss')) setAchs(a => [...a, 'boss']);
    if (f.trait === 'rainbow' && !achs.includes('rainbow')) setAchs(a => [...a, 'rainbow']);
    
    setHooked(null);
    setMode('idle');
    setFish(spawnFish(env, rod, upgrades.rarity));
  };

  const lose = () => {
    setStreak(0);
    setMsg('Got away!');
    setHooked(null);
    setMode('idle');
    setFish(spawnFish(env, rod, upgrades.rarity));
  };

  const toggleFav = id => setInv(p => p.map(f => f.id === id ? { ...f, fav: !f.fav } : f));
  
  const sellFish = id => {
    const f = inv.find(x => x.id === id);
    if (f && !f.fav) {
      setPts(p => p + calcValue(f, upgrades.value));
      setInv(p => p.filter(x => x.id !== id));
    }
  };
  
  const sellAll = () => {
    const toSell = inv.filter(f => !f.fav);
    const total = toSell.reduce((s, f) => s + calcValue(f, upgrades.value), 0);
    setPts(p => p + total);
    setInv(p => p.filter(f => f.fav));
    setMsg(`Sold ${toSell.length} for ${total}!`);
  };
  
  const addToAquarium = id => {
    if (aquarium.length >= 10) return;
    const f = inv.find(x => x.id === id);
    if (f && !f.fav) {
      const aquariumEl = document.querySelector('.bg-blue-800\\/30');
      const width = aquariumEl ? aquariumEl.offsetWidth : 400;
      const height = aquariumEl ? aquariumEl.offsetHeight : 160;
    
    setAquarium(p => [...p, { 
      ...f, 
      sx: width / 2 - width * 0.3 + Math.random() * width * 0.6,
      sy: height / 2 - height * 0.3 + Math.random() * height * 0.6,
      ax: 20 + Math.random() * 30, 
      ay: 15 + Math.random() * 25, 
      spd: 0.2 + Math.random() * 0.3, 
      ph: Math.random() * 6 
    }]);
    setInv(p => p.filter(x => x.id !== id));
    }
  };
  
  const removeFromAquarium = id => {
    const f = aquarium.find(x => x.id === id);
    if (f) {
      setInv(p => [...p, { ...f, fav: false }]);
      setAquarium(p => p.filter(x => x.id !== id));
    }
  };
  
  const buyUpgrade = id => {
    const u = UPGRADES.find(x => x.id === id);
    if (u && upgrades[id] < u.max && pts >= u.cost(upgrades[id])) {
      setPts(p => p - u.cost(upgrades[id]));
      setUpgrades(p => ({ ...p, [id]: p[id] + 1 }));
    }
  };
  
  const buyEnv = k => {
    if (pts >= ENVS[k].cost && !unlocked.includes(k)) {
      setPts(p => p - ENVS[k].cost);
      setUnlocked(u => [...u, k]);
    }
  };
  
  const buyRod = k => {
    const r = RODS.find(x => x.id === k);
    if (pts >= r.cost && !rods.includes(k)) {
      setPts(p => p - r.cost);
      setRods(r => [...r, k]);
    }
  };
  
  const resetProgress = async () => {
    if (window.confirm('Reset all progress?')) {
      try {
        await window.storage.delete(SAVE_KEY);
      } catch (e) {}
      setInv([]);
      setIdx({});
      setPts(0);
      setUnlocked(['ocean']);
      setRods(['basic']);
      setRod('basic');
      setAchs([]);
      setAquarium([]);
      setUpgrades({ speed: 0, rarity: 0, bite: 0, value: 0 });
      setLevel(1);
      setExp(0);
      setEnv('ocean');
      setMsg('Reset complete!');
    }
  };

  const envData = ENVS[env];
  const rodData = RODS.find(r => r.id === rod);

  return (
    <div className={`relative w-full h-screen bg-gradient-to-b ${envData.bg} overflow-hidden`}>
      <svg className="absolute inset-0 w-full h-full">
        {fish.map(f => <Fish key={f.id} f={f} time={time} />)}
      </svg>
      
      {/* Existing UI buttons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <button onPointerDown={() => setPanel('inv')} className="bg-amber-700 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-lg">🎒 {inv.length}</button>
        <button onPointerDown={() => setPanel('idx')} className="bg-cyan-700 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-lg">📖</button>
        <button onPointerDown={() => setPanel('aqua')} className="bg-blue-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-lg">🐠 {aquarium.length}</button>
        <button onPointerDown={() => setPanel('ach')} className="bg-yellow-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-lg">🏆</button>
        <button onPointerDown={() => setPanel('shop')} className="bg-indigo-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-lg">🏪</button>
        <button onPointerDown={() => setPanel('upg')} className="bg-purple-600 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-lg">⬆️</button>
      </div>
      
      <div className="absolute top-4 right-4 z-10 text-right">
        <p className="text-yellow-300 font-bold drop-shadow-lg text-2xl">💰 {pts}</p>
        <p className="text-white text-xl font-medium drop-shadow-lg">{rodData?.name}</p>
        {streak > 1 && <p className="text-orange-300 text-xl font-medium drop-shadow-lg">🔥 {streak}</p>}
      </div>
      
      <select value={env} onChange={e => unlocked.includes(e.target.value) && setEnv(e.target.value)} className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-3 rounded-lg text-lg font-medium shadow-lg">
        {Object.entries(ENVS).map(([k, v]) => <option key={k} value={k} disabled={!unlocked.includes(k)}>{v.name}{!unlocked.includes(k) ? ' 🔒' : ''}</option>)}
      </select>
      
      {/* EXP Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="text-center mb-1">
          <p className="text-white font-bold text-lg drop-shadow-lg">
            Lv. {level} {getLevelTitle(level)} - {exp}/{getExpForLevel(level)} EXP
          </p>
        </div>
        <div className="w-full h-6 bg-gray-800/80">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-300"
            style={{ width: `${(exp / getExpForLevel(level)) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white mb-3 drop-shadow-lg text-xl font-medium">{msg}</p>
        {mode === 'idle' && <button onPointerDown={cast} className="bg-green-600 text-white px-10 py-5 rounded-full font-bold text-2xl shadow-xl hover:bg-green-700">🎣 Cast</button>}
        {mode === 'wait' && <button onPointerDown={() => { clearTimeout(waitRef.current); setMode('idle'); setMsg('Cancelled'); }} className="bg-red-600 text-white px-8 py-4 rounded-full text-xl font-medium shadow-lg">Cancel</button>}
      </div>
      
      {mode === 'catch' && hooked && <CatchingGame f={hooked} onWin={win} onLose={lose} spdLvl={upgrades.speed} />}
      {panel === 'inv' && <Inventory inv={inv} sellMode={sellMode} setSellMode={setSellMode} onClose={() => setPanel(null)} toggleFav={toggleFav} sellFish={sellFish} sellAll={sellAll} upgrades={upgrades} />}
      {panel === 'aqua' && <Aquarium aquarium={aquarium} inv={inv} time={time} onClose={() => setPanel(null)} addToAquarium={addToAquarium} removeFromAquarium={removeFromAquarium} />}
      {panel === 'idx' && <FishIndex idx={idx} expanded={expanded} setExpanded={setExpanded} onClose={() => setPanel(null)} />}
      {panel === 'ach' && <Achievements achs={achs} onClose={() => setPanel(null)} />}
      {panel === 'shop' && <Shop pts={pts} unlocked={unlocked} rods={rods} rod={rod} onClose={() => setPanel(null)} buyEnv={buyEnv} buyRod={buyRod} setRod={setRod} resetProgress={resetProgress} />}
      {panel === 'upg' && <Upgrades pts={pts} upgrades={upgrades} onClose={() => setPanel(null)} buyUpgrade={buyUpgrade} />}
    </div>
  );
}

export default App;