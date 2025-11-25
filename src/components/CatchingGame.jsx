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
  
  const W = 320;
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

  const tap = useCallback(() => {
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
        const nz = { x: Math.random() * (W - 65), w: Math.max(45, 60 - nh * 3) };
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
        tap();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [tap]);

  const touchesLeft = zone.x <= 2;
  const touchesRight = zone.x + zone.w >= W - 2;
  const borderRadius = touchesLeft && touchesRight 
    ? '9999px' 
    : touchesLeft 
    ? '9999px 0 0 9999px' 
    : touchesRight 
    ? '0 9999px 9999px 0' 
    : '0';

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20" onPointerDown={tap}>
      <div className="bg-white rounded-2xl p-6 text-center shadow-2xl" onPointerDown={tap}>
        <p className="font-bold text-xl mb-1">{f.boss ? `👑 ${f.name}` : f.name}</p>
        <p className="text-sm text-gray-500 mb-3">{f.size} • {f.trait} • R{f.rarity}</p>
        <p className="text-gray-600 text-lg my-3 font-medium">{msg}</p>
        <div className="flex justify-center gap-3 mb-4">
          <div className="flex gap-1">
            {Array(need).fill(0).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full ${i < hits ? 'bg-green-500' : 'bg-gray-300'}`} />
            ))}
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-4 h-4 rounded-full ${i < miss ? 'bg-red-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
        <div className="relative h-12 bg-gray-300 rounded-full mx-auto shadow-inner overflow-hidden" style={{ width: W }}>
          <div 
            className="absolute h-full bg-green-400" 
            style={{ 
              left: zone.x, 
              width: zone.w,
              borderRadius: borderRadius
            }} 
          />
          <div className="absolute top-0 w-2 h-full bg-black rounded-full" style={{ left: pos }} />
        </div>
        <p className="mt-3 text-sm text-gray-400">Tap anywhere or press Space</p>
      </div>
    </div>
  );
};

export default CatchingGame;