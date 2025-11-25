import React from 'react';

const Fish = ({ f, time }) => {
  const x = f.sx + Math.sin(time * f.spd + f.ph) * f.ax;
  const y = f.sy + Math.cos(time * f.spd * 0.7 + f.ph) * f.ay;
  
  // Calculate direction based on velocity
  const prevX = f.sx + Math.sin((time - 0.1) * f.spd + f.ph) * f.ax;
  const facingLeft = x < prevX;
  
  const op = f.trait === 'transparent' ? 0.4 : 1;
  const flt = f.trait === 'shiny' 
    ? `drop-shadow(0 0 4px ${f.color})` 
    : f.trait === 'glowing' 
    ? 'drop-shadow(0 0 8px #fff)' 
    : f.boss 
    ? 'drop-shadow(0 0 15px gold)' 
    : '';

  return (
    <g style={{ filter: flt }} transform={facingLeft ? `scale(-1, 1) translate(${-2 * x}, 0)` : ''}>
      {f.trait === 'rainbow' && (
        <defs>
          <linearGradient id={`rb${f.id}`}>
            <stop offset="0%" stopColor="#f00">
              <animate attributeName="stop-color" values="#f00;#0f0;#00f;#f00" dur="1s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#00f">
              <animate attributeName="stop-color" values="#00f;#f00;#0f0;#00f" dur="1s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      )}
      <ellipse cx={x} cy={y} rx={f.r} ry={f.r * 0.6} fill={f.trait === 'rainbow' ? `url(#rb${f.id})` : f.color} opacity={op} />
      <polygon points={`${x - f.r * 0.9},${y} ${x - f.r * 1.3},${y - f.r * 0.4} ${x - f.r * 1.3},${y + f.r * 0.4}`} fill={f.trait === 'rainbow' ? `url(#rb${f.id})` : f.color} opacity={op} />
      <circle cx={x + f.r * 0.4} cy={y - f.r * 0.1} r={f.r * 0.1} fill="#fff" opacity={op} />
      <circle cx={x + f.r * 0.4} cy={y - f.r * 0.1} r={f.r * 0.05} fill="#000" opacity={op} />
      {f.boss && <text x={x} y={y - f.r - 5} textAnchor="middle" fill="gold" fontSize="9">👑</text>}
    </g>
  );
};

export default Fish;