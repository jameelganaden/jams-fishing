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
      sx: 180,
      sy: 180,
      ax: 40,
      ay: 25,
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
      sx: 50 + Math.random() * 280,
      sy: 130 + Math.random() * 160,
      ax: 20 + Math.random() * 25,
      ay: 15 + Math.random() * 20,
      spd: 0.3 + Math.random() * 0.3,
      ph: Math.random() * 6,
      env,
      boss: false
    };
  });
};