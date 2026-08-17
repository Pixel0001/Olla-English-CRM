// Shared level system — must match web /learn/[token]/page.js LEVELS
export const LEVELS = [
  { min: 0,    max: 99,       num: 1, name: 'Novice',     color: '#94a3b8', bar: '#94a3b8' },
  { min: 100,  max: 299,      num: 2, name: 'Explorator', color: '#3b82f6', bar: '#60a5fa' },
  { min: 300,  max: 699,      num: 3, name: 'Practicant', color: '#10b981', bar: '#34d399' },
  { min: 700,  max: 1499,     num: 4, name: 'Expert',     color: '#f59e0b', bar: '#fbbf24' },
  { min: 1500, max: 2999,     num: 5, name: 'Master',     color: '#a855f7', bar: '#c084fc' },
  { min: 3000, max: Infinity, num: 6, name: 'Legend',     color: '#f43f5e', bar: '#fb7185' },
];

export function getLevel(xp) {
  return [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0];
}

export function getNextLevel(level) {
  return LEVELS[level.num] ?? null;
}
