/**
 * Shared banner gradient presets — used by both Server and Client components.
 * Keep in sync with BANNER_PRESETS in components/student/CosmeticEffects.js
 */
export const BANNER_GRADIENTS = {
  'Banner Curcubeu': 'linear-gradient(90deg, #ef4444, #f59e0b, #fbbf24, #10b981, #3b82f6, #a855f7)',
  'Banner Galaxie':  'radial-gradient(ellipse at top, #581c87, #1e1b4b, #000000)',
  'Banner Aurora':   'linear-gradient(120deg, #10b981, #06b6d4, #8b5cf6, #ec4899)',
}

/**
 * Leaderboard effect presets — color+glow per equipped trophy cosmetic.
 * Keep in sync with LEADERBOARD_PRESETS in components/student/CosmeticEffects.js
 */
export const LEADERBOARD_EFFECT_PRESETS = {
  'Efect Top Aur':     { color: '#fbbf24', glow: '#fde68a', icon: '👑' },
  'Efect Top Phoenix': { color: '#ef4444', glow: '#fca5a5', icon: '🔥' },
}

/**
 * Returns inline style object for a small banner chip/swatch.
 * @param {string|null} bannerName
 * @returns {{ background: string } | null}
 */
export function getBannerStyle(bannerName) {
  if (!bannerName) return null
  return { background: BANNER_GRADIENTS[bannerName] || 'linear-gradient(90deg, #3b82f6, #a855f7)' }
}

/**
 * Returns preset for a leaderboard effect cosmetic name.
 * @param {string|null} name
 * @returns {{ color: string, glow: string, icon: string } | null}
 */
export function getLeaderboardEffectPreset(name) {
  if (!name) return null
  return LEADERBOARD_EFFECT_PRESETS[name] || { color: '#fbbf24', glow: '#fde68a', icon: '👑' }
}
