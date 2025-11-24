import { ENVS, SIZES, TRAITS } from '../data/constants';
import { pick } from './calculations';

export const spawnFish = (env, rod, rarityUpgrade) => {
  const isBoss = Math.random() < (rod === 'master' ? 0.08 : 0.03);
  
  if (isBoss) {
    return [{
      id: `b${Date.now()}`,
      color: '#1a1a2e',
      name: ENVS[env].boss,
      r: 60,
      size: 'Boss',
      trait: 'normal',
      rarity: 5,
      sx: window.innerWidth / 2,
      sy: window.innerHeight / 2,
      ax: Math.min(100, window.innerWidth * 0.15),
      ay: Math.min(80, window.innerHeight * 0.15),
      spd: 0.2,
      ph: 0,
      env,
      boss: true
    }];
  }

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const rangeX = Math.min(300, window.innerWidth * 0.4);
  const rangeY = Math.min(200, window.innerHeight * 0.3);

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
      sx: centerX - rangeX / 2 + Math.random() * rangeX,
      sy: centerY - rangeY / 2 + Math.random() * rangeY,
      ax: 20 + Math.random() * 25,
      ay: 15 + Math.random() * 20,
      spd: 0.3 + Math.random() * 0.3,
      ph: Math.random() * 6,
      env,
      boss: false
    };
  });
};