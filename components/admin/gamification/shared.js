// Shared design tokens and helpers for gamification admin UI
import { CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/solid'

export const RARITY_STYLES = {
  COMMON:    { label: 'Common',    grad: 'from-slate-400 to-slate-600',     ring: 'ring-slate-300',    text: 'text-slate-700',  glow: '' },
  RARE:      { label: 'Rare',      grad: 'from-sky-400 to-blue-600',        ring: 'ring-sky-400',      text: 'text-sky-700',    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.4)]' },
  EPIC:      { label: 'Epic',      grad: 'from-fuchsia-500 to-purple-700',  ring: 'ring-fuchsia-400',  text: 'text-fuchsia-700',glow: 'shadow-[0_0_25px_rgba(217,70,239,0.5)]' },
  LEGENDARY: { label: 'Legendary', grad: 'from-amber-400 to-orange-600',    ring: 'ring-amber-400',    text: 'text-amber-700',  glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]' },
  MYTHIC:    { label: 'Mythic',    grad: 'from-rose-500 via-fuchsia-500 to-violet-600', ring: 'ring-rose-400', text: 'text-rose-700', glow: 'shadow-[0_0_35px_rgba(244,63,94,0.7)] animate-pulse' },
}

export const COSMETIC_TYPES = [
  { value: 'THEME',               label: 'Theme' },
  { value: 'PROFILE_BANNER',      label: 'Profile Banner' },
  { value: 'USERNAME_COLOR',      label: 'Username Color' },
  { value: 'ANIMATED_FRAME',      label: 'Animated Frame' },
  { value: 'LEADERBOARD_EFFECT',  label: 'Leaderboard Effect' },
  { value: 'ENTRY_EFFECT',        label: 'Entry Effect' },
  { value: 'CODING_AURA',         label: 'Coding Aura' },
  { value: 'TITLE',               label: 'Title' },
  { value: 'PET',                 label: 'Pet' },
  { value: 'RARE_COSMETIC',       label: 'Rare Cosmetic' },
  { value: 'ANIMATED_BACKGROUND', label: 'Animated Background' },
  { value: 'PARTICLE_EFFECT',     label: 'Particle Effect' },
]

export const CHEST_TIERS = [
  { value: 'COMMON',    label: 'Common Chest',    grad: 'from-slate-500 to-slate-700' },
  { value: 'RARE',      label: 'Rare Chest',      grad: 'from-sky-500 to-blue-700' },
  { value: 'EPIC',      label: 'Epic Chest',      grad: 'from-fuchsia-500 to-purple-700' },
  { value: 'LEGENDARY', label: 'Legendary Chest', grad: 'from-amber-500 to-orange-700' },
]

export const LEADERBOARD_TYPES = [
  { value: 'XP',     label: 'XP',     icon: '⚡' },
  { value: 'CODING', label: 'Coding', icon: '💻' },
  { value: 'GEMS',   label: 'Gems',   icon: '💎' },
  { value: 'COINS',  label: 'Coins',  icon: '🪙' },
]

export function CoinIcon({ className = 'w-4 h-4 text-amber-500' }) {
  return <CurrencyDollarIcon className={className} />
}
export function GemIcon({ className = 'w-4 h-4 text-cyan-500' }) {
  return <SparklesIcon className={className} />
}

export function CurrencyBadge({ currency, amount }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
      currency === 'GEMS' ? 'bg-cyan-100 text-cyan-700' : 'bg-amber-100 text-amber-700'
    }`}>
      {currency === 'GEMS' ? '💎' : '🪙'} {amount}
    </span>
  )
}

export function RarityBadge({ rarity }) {
  const r = RARITY_STYLES[rarity] || RARITY_STYLES.COMMON
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-r ${r.grad}`}>
      {r.label}
    </span>
  )
}
