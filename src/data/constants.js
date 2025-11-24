export const ENVS = {
  ocean: { 
    name: 'Ocean', 
    bg: 'from-sky-400 via-blue-500 to-blue-800', 
    boss: 'Leviathan', 
    colors: [
      ['#1E90FF', 'Marlin Blue', 1],
      ['#00CED1', 'Tropical Teal', 1],
      ['#FF6347', 'Coral', 2],
      ['#FFD700', 'Sunfish Gold', 2],
      ['#E0FFFF', 'Pearl', 3],
      ['#4169E1', 'Deep Royal', 3]
    ], 
    cost: 0 
  },
  lake: { 
    name: 'Lake', 
    bg: 'from-emerald-400 via-teal-500 to-teal-700', 
    boss: 'Ancient Bass', 
    colors: [
      ['#228B22', 'Bass Green', 1],
      ['#DAA520', 'Walleye Gold', 1],
      ['#BC8F8F', 'Trout Rose', 2],
      ['#708090', 'Pike Silver', 2],
      ['#F4A460', 'Perch Orange', 3],
      ['#8FBC8F', 'Lily Pad', 3]
    ], 
    cost: 500 
  },
  swamp: { 
    name: 'Swamp', 
    bg: 'from-yellow-600 via-green-700 to-green-900', 
    boss: 'Swamp King', 
    colors: [
      ['#556B2F', 'Murky Olive', 1],
      ['#8B4513', 'Mudfish Brown', 1],
      ['#9ACD32', 'Algae', 2],
      ['#2F4F4F', 'Shadow', 2],
      ['#BDB76B', 'Swamp Gold', 3],
      ['#6B8E23', 'Moss', 3]
    ], 
    cost: 1500 
  },
  river: { 
    name: 'River', 
    bg: 'from-cyan-400 via-blue-400 to-slate-600', 
    boss: 'River Titan', 
    colors: [
      ['#FA8072', 'Salmon', 1],
      ['#B0C4DE', 'Steelhead', 1],
      ['#CD853F', 'Bronze', 2],
      ['#87CEEB', 'Rapids Blue', 2],
      ['#DEB887', 'Riverbed', 3],
      ['#5F9EA0', 'Current Teal', 3]
    ], 
    cost: 3000 
  }
};

export const SIZES = [
  { n: 'Tiny', r: 12, v: 5, w: 0.35 },
  { n: 'Small', r: 18, v: 10, w: 0.3 },
  { n: 'Medium', r: 25, v: 20, w: 0.2 },
  { n: 'Large', r: 35, v: 40, w: 0.1 },
  { n: 'Giant', r: 45, v: 80, w: 0.04 },
  { n: 'Legendary', r: 55, v: 200, w: 0.01 }
];

export const TRAITS = [
  { n: 'normal', m: 1, w: 0.5 },
  { n: 'transparent', m: 1.3, w: 0.2 },
  { n: 'shiny', m: 1.8, w: 0.15 },
  { n: 'rainbow', m: 3, w: 0.1 },
  { n: 'glowing', m: 2.5, w: 0.05 }
];

export const RODS = [
  { id: 'basic', name: 'Basic Rod', cost: 0 },
  { id: 'silver', name: 'Silver Rod', cost: 800 },
  { id: 'gold', name: 'Gold Rod', cost: 2000 },
  { id: 'master', name: 'Master Rod', cost: 5000 }
];

export const UPGRADES = [
  { id: 'speed', name: 'Line Slow', desc: 'Slower line', max: 5, cost: i => 200 * (i + 1) },
  { id: 'rarity', name: 'Lucky Catch', desc: 'Better rarity', max: 5, cost: i => 300 * (i + 1) },
  { id: 'bite', name: 'Quick Bite', desc: 'Faster bites', max: 5, cost: i => 250 * (i + 1) },
  { id: 'value', name: 'Haggler', desc: '+10% value', max: 10, cost: i => 150 * (i + 1) }
];

export const ACHIEVEMENTS = [
  { id: 'first', name: 'First Catch', desc: 'Catch 1 fish' },
  { id: 'ten', name: 'Collector', desc: 'Catch 10 fish' },
  { id: 'boss', name: 'Boss Slayer', desc: 'Catch a boss fish' },
  { id: 'rainbow', name: 'Rainbow Chaser', desc: 'Catch a rainbow fish' },
];