/**
 * Shared level system utilities — used by both server and client components.
 * PALETTES and ICONS define a unique visual identity per level index.
 */

import {
  SparklesIcon, MagnifyingGlassIcon, WrenchScrewdriverIcon,
  BoltIcon, RocketLaunchIcon, FireIcon, StarIcon, ShieldCheckIcon,
  AcademicCapIcon, GlobeAltIcon, BeakerIcon,
} from '@heroicons/react/24/outline'
import {
  SparklesIcon as SparklesSolid, MagnifyingGlassIcon as MagnifyingGlassSolid,
  WrenchScrewdriverIcon as WrenchSolid, BoltIcon as BoltSolid,
  RocketLaunchIcon as RocketSolid, FireIcon as FireSolid,
  StarIcon as StarSolid, ShieldCheckIcon as ShieldSolid,
  AcademicCapIcon as AcademicSolid, GlobeAltIcon as GlobeSolid,
  BeakerIcon as BeakerSolid,
} from '@heroicons/react/24/solid'

export const PALETTES = [
  { color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   bar: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-700 border-slate-300' },
  { color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    bar: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700 border-blue-300' },
  { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   bar: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 border-amber-300' },
  { color: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200',  bar: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-700 border-purple-300' },
  { color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',    bar: 'bg-rose-500',    badge: 'bg-rose-100 text-rose-700 border-rose-300' },
  { color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', bar: 'bg-fuchsia-500', badge: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300' },
  { color: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    bar: 'bg-cyan-500',    badge: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
  { color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200',  bar: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  { color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  bar: 'bg-indigo-500',  badge: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
]

export const ICONS = [
  { O: SparklesIcon,          S: SparklesSolid },
  { O: MagnifyingGlassIcon,   S: MagnifyingGlassSolid },
  { O: WrenchScrewdriverIcon, S: WrenchSolid },
  { O: BoltIcon,              S: BoltSolid },
  { O: RocketLaunchIcon,      S: RocketSolid },
  { O: FireIcon,              S: FireSolid },
  { O: StarIcon,              S: StarSolid },
  { O: ShieldCheckIcon,       S: ShieldSolid },
  { O: AcademicCapIcon,       S: AcademicSolid },
  { O: GlobeAltIcon,          S: GlobeSolid },
  { O: BeakerIcon,            S: BeakerSolid },
]

/**
 * Build the levels array from DB settings.
 * @param {number[]} curve  - XP thresholds per level (e.g. [0, 100, 300, ...])
 * @param {string[]} names  - Level names (e.g. ['Novice', 'Explorator', ...])
 * @returns {{ min, num, name, Icon, IconSolid, color, bg, border, bar, badge }[]}
 */
export function buildLevels(curve, names) {
  return curve.map((min, i) => {
    const palette = PALETTES[i % PALETTES.length]
    const ic = ICONS[i % ICONS.length]
    return {
      min, num: i + 1,
      name: names[i] || `Nivel ${i + 1}`,
      Icon: ic.O, IconSolid: ic.S,
      ...palette,
    }
  })
}

/**
 * Get the current level for a given XP value.
 */
export function getLevel(LEVELS, xp) {
  return [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0]
}

/** Default 10-level curve used when DB settings are unavailable (client-side fallback) */
export const DEFAULT_LEVEL_CURVE  = [0, 100, 300, 700, 1500, 3000, 6000, 12000, 25000, 50000]
export const DEFAULT_LEVEL_NAMES  = ['Novice', 'Explorator', 'Practicant', 'Expert', 'Master', 'Legend', 'Mythic', 'Titan', 'Sage', 'Immortal']
