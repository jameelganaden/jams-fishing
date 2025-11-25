import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SIZES } from '../data/constants';

const CatchingGame = ({ f, onWin, onLose, spdLvl }) => {
  const posRef = useRef(0);
  const zoneRef = useRef({ x: 100, w: 45 });
  const doneRef = useRef(false);
  
  const [pos, setPos] = useState(0);
  const [zone, setZone] = useState({ x: 100, w: 45 });
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);
  const [msg, setMsg] = useState('Tap in green!');
  const [perfect, setPerfect] = useState(true);
  
  const W = 260;
  const need = f.boss ? 5 : 3;
  const spd = (f.boss ? 5.5 : 3.5 + SIZES.findIndex(s => s.n === f.size) * 0.5) * (1 - spdLvl * 0.08);

  useEffect(() => {
    let d = 1;
    let p = 0;
    const i = setInterval(() => {
      if (doneRef.current) return;
      p += d * spd;
      if (p >= W || p <= 0) {
        d *= -1;
        p = Math.max(0, Math.min(W, p));
      }
      posRef.current = p;
      setPos(p);
    }, 16);
    return () => clearInterval(i);
  }, [spd]);

  const tap = useCallback((e) => {
    e.stopPropagation();
    if (doneRef.current) return;
    const inZ = posRef.current >= zoneRef.current.x && posRef.current <= zoneRef.current.x + zoneRef.current.w;
    
    if (inZ) {
      const nh = hits + 1;
      setHits(nh);
      if (nh >= need) {
        doneRef.current = true;
        setMsg('Caught!');
        setTimeout(() => onWin(perfect), 150);
      } else {
        const nz = { x: Math.random() * (W - 55), w: Math.max(35, 50 - nh * 3) };
        zoneRef.current = nz;
        setZone(nz);
        setMsg(`${need - nh} more!`);
      }
    } else {
      setPerfect(false);
      const nm = miss + 1;
      setMiss(nm);
      if (nm >= 3) {
        doneRef.current = true;
        setMsg('Escaped!');
        setTimeout(onLose, 150);
      } else {
        setMsg(`Miss! ${3 - nm} left`);
      }
    }
  }, [hits, miss, need, onWin, onLose, perfect]);

  useEffect(() => {
    const h = e => {
      if (e.code === 'Space') {
        e.preventDefault();
        tap(e);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [tap]);

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20" onPointerDown={tap}>
      <div className="bg-white rounded-xl p-4 text-center">
        <p className="font-bold">{f.boss ? `👑 ${f.name}` : f.name}</p>
        <p className="text-xs text-gray-500">{f.size} • {f.trait} • R{f.rarity}</p>
        <p className="text-gray-600 text-sm my-2">{msg}</p>
        <div className="flex justify-center gap-2 mb-2">
          <div className="flex gap-0.5">
            {Array(need).fill(0).map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < hits ? 'bg-green-500' : 'bg-gray-300'}`} />
            ))}
          </div>
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < miss ? 'bg-red-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
        <div className="relative h-8 bg-gray-300 rounded-full mx-auto" style={{ width: W }}>
          <div className="absolute h-full bg-green-400 rounded" style={{ left: zone.x, width: zone.w }} />
          <div className="absolute top-0 w-1 h-full bg-black" style={{ left: pos }} />
        </div>
      </div>
    </div>
  );
};

export default CatchingGame;