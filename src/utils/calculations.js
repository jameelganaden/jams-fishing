import { SIZES, TRAITS } from '../data/constants';

export const pick = (arr, rarityBonus = 0) => {
  const weights = arr.map(x => x.w * (x.w < 0.2 ? 1 + rarityBonus * 0.1 : 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * sum;
  let cumulative = 0;
  
  for (let i = 0; i < arr.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return arr[i];
  }
  return arr[0];
};

export const calcValue = (fish, valueLvl) => {
  const baseValue = fish.boss 
    ? 500 
    : (SIZES.find(s => s.n === fish.size)?.v || 10) * fish.rarity * (TRAITS.find(t => t.n === fish.trait)?.m || 1);
  
  return Math.floor(baseValue * (1 + valueLvl * 0.1));
};