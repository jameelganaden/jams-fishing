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

  const win = () => {
    const f = { ...hooked, id: `c${Date.now()}`, fav: false };
    setInv(p => [...p, f]);
    const key = `${f.env}-${f.name}`;
    setIdx(p => {
      const prev = p[key] || { ...f, sizes: [], traits: [] };
      return { ...p, [key]: { ...prev, sizes: [...new Set([...prev.sizes, f.size])], traits: [...new Set([...prev.traits, f.trait])] }};
    });
    setStreak(s => s + 1);
    if (!achs.includes('first')) setAchs(a => [...a, 'first']);
    if (inv.length + 1 >= 10 && !achs.includes('ten')) setAchs(a => [...a, 'ten']);
    if (f.boss && !achs.includes('boss')) setAchs(a => [...a, 'boss']);
    if (f.trait === 'rainbow' && !achs.includes('rainbow')) setAchs(a => [...a, 'rainbow']);
    setMsg('Caught!');
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
      
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        <button onPointerDown={() => setPanel('inv')} className="bg-amber-700 text-white px-3 py-2 rounded text-sm md:text-base">🎒{inv.length}</button>
        <button onPointerDown={() => setPanel('idx')} className="bg-cyan-700 text-white px-3 py-2 rounded text-sm md:text-base">📖</button>
        <button onPointerDown={() => setPanel('aqua')} className="bg-blue-600 text-white px-3 py-2 rounded text-sm md:text-base">🐠{aquarium.length}</button>
        <button onPointerDown={() => setPanel('ach')} className="bg-yellow-600 text-white px-3 py-2 rounded text-sm md:text-base">🏆</button>
        <button onPointerDown={() => setPanel('shop')} className="bg-indigo-600 text-white px-3 py-2 rounded text-sm md:text-base">🏪</button>
        <button onPointerDown={() => setPanel('upg')} className="bg-purple-600 text-white px-3 py-2 rounded text-sm md:text-base">⬆️</button>
      </div>
      
      <div className="absolute top-2 right-2 z-10 text-right">
        <p className="text-yellow-300 font-bold drop-shadow text-base md:text-lg">💰{pts}</p>
        <p className="text-white text-sm md:text-base">{rodData?.name}</p>
        {streak > 1 && <p className="text-orange-300 text-sm md:text-base">🔥{streak}</p>}
      </div>
      
      <select value={env} onChange={e => unlocked.includes(e.target.value) && setEnv(e.target.value)} className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-3 py-2 rounded text-sm md:text-base">
        {Object.entries(ENVS).map(([k, v]) => <option key={k} value={k} disabled={!unlocked.includes(k)}>{v.name}{!unlocked.includes(k) ? '🔒' : ''}</option>)}
      </select>
      
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white mb-2 drop-shadow text-base md:text-lg">{msg}</p>
        {mode === 'idle' && <button onPointerDown={cast} className="bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-xl">🎣 Cast</button>}
        {mode === 'wait' && <button onPointerDown={() => { clearTimeout(waitRef.current); setMode('idle'); setMsg('Cancelled'); }} className="bg-red-600 text-white px-5 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base">Cancel</button>}
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