import { ENVS, SIZES, TRAITS } from '../data/constants';
import { pick } from './calculations';

export const spawnFish = (env, rod, rarityUpgrade) => {
  const isBoss = Math.random() < (rod === 'master' ? 0.08 : 0.03);
  
  // viewport dims
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  // center point
  const centerX = vw * 0.5;
  const centerY = vh * 0.5;
  
  // spawn area 
  const spawnWidth = vw * 0.5;
  const spawnHeight = vh * 0.4;
  
  if (isBoss) {
    return [{
      id: `b${Date.now()}`,
      color: '#1a1a2e',
      name: ENVS[env].boss,
      r: 60,
      size: 'Boss',
      trait: 'normal',
      rarity: 5,
      sx: centerX,
      sy: centerY,
      ax: spawnWidth * 0.15,
      ay: spawnHeight * 0.2,
      spd: 0.2,
      ph: 0,
      env,
      boss: true
    }];
  }

  return ENVS[env].colors.map(([hex, name, rarity], i) => {
    const sz = pick(SIZES, rarityUpgrade);
    const tr = pick(TRAITS, rarityUpgrade);
    
    return {
      id: `${env}${i}${Date.now()}`,
      color: hex,
      name,
      r: sz.r,
      size: sz.n,
      trait: tr.n,
      rarity,
      sx: centerX + (Math.random() - 0.5) * spawnWidth,
      sy: centerY + (Math.random() - 0.5) * spawnHeight,
      ax: spawnWidth * 0.08,
      ay: spawnHeight * 0.1,
      spd: 0.3 + Math.random() * 0.3,
      ph: Math.random() * 6,
      env,
      boss: false
    };
  });
};