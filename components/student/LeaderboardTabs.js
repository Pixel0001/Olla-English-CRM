'use client'

import { useState } from 'react'
import Link from 'next/link'
import CosmeticArt from '@/components/student/CosmeticArt'
import TitleBadge from '@/components/student/TitleBadge'
import { getBannerStyle, getLeaderboardEffectPreset } from '@/lib/banner-presets'
import {
  TrophyIcon, Bars3BottomLeftIcon, ChevronRightIcon,
  SparklesIcon, MagnifyingGlassIcon, WrenchScrewdriverIcon,
  BoltIcon, RocketLaunchIcon, FireIcon, StarIcon, CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { TrophyIcon as TrophySolid, FireIcon as FireSolid } from '@heroicons/react/24/solid'

const LEVELS = [
  { min: 0,    max: 99,       num: 1, name: 'Novice',     Icon: SparklesIcon,          color: 'text-slate-500',   bg: 'bg-slate-100',  bar: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-600 border-slate-200',       iconColor: 'text-slate-400'   },
  { min: 100,  max: 299,      num: 2, name: 'Explorator', Icon: MagnifyingGlassIcon,   color: 'text-blue-600',    bg: 'bg-blue-50',    bar: 'bg-blue-400',    badge: 'bg-blue-100 text-blue-700 border-blue-200',          iconColor: 'text-blue-400'    },
  { min: 300,  max: 699,      num: 3, name: 'Practicant', Icon: WrenchScrewdriverIcon, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', iconColor: 'text-emerald-400' },
  { min: 700,  max: 1499,     num: 4, name: 'Expert',     Icon: BoltIcon,              color: 'text-amber-600',   bg: 'bg-amber-50',   bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 border-amber-200',       iconColor: 'text-amber-400'   },
  { min: 1500, max: 2999,     num: 5, name: 'Master',     Icon: RocketLaunchIcon,      color: 'text-purple-600',  bg: 'bg-purple-50',  bar: 'bg-purple-400',  badge: 'bg-purple-100 text-purple-700 border-purple-200',    iconColor: 'text-purple-400'  },
  { min: 3000, max: Infinity, num: 6, name: 'Legend',     Icon: FireIcon,              color: 'text-rose-600',    bg: 'bg-rose-50',    bar: 'bg-rose-400',    badge: 'bg-rose-100 text-rose-700 border-rose-200',          iconColor: 'text-rose-400'    },
]

function getLevel(xp) {
  return [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0]
}

const RANK_BG    = ['bg-yellow-400', 'bg-slate-300',   'bg-amber-600'  ]
const RANK_RING  = ['ring-yellow-300','ring-slate-200', 'ring-amber-400']
const RANK_TEXT  = ['text-amber-900', 'text-slate-700', 'text-amber-100']
const RANK_COLOR = ['text-yellow-500','text-slate-400', 'text-amber-700']

function timeLeft(endsAt) {
  const ms = new Date(endsAt).getTime() - Date.now()
  if (ms <= 0) return 'Încheiat'
  const days  = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const mins  = Math.floor((ms % 3600000) / 60000)
  if (days > 0) return `${days}z ${hours}h rămase`
  if (hours > 0) return `${hours}h ${mins}m rămase`
  return `${mins}m rămase`
}

// ── Global ranked list ────────────────────────────────────────────────────────
function GlobalList({ ranked, me, token, theme }) {
  const tp = theme?.primary || null
  const ts = theme?.secondary || null
  const themeGrad = tp && ts
    ? `linear-gradient(135deg, ${tp} 0%, ${ts} 60%, ${tp} 100%)`
    : null

  const myTitle = (me.equipped || [])
    .find(e => e.type === 'TITLE')?.cosmetic?.name
    ?.replace(/^Titlu\s+[„"']?/, '').replace(/["„'"]$/, '') || null

  const myRank     = ranked.findIndex(s => s.id === me.id) + 1
  const myXP       = ranked.find(s => s.id === me.id)?.xp ?? 0
  const myLevel    = getLevel(myXP)
  const myNextLvl  = LEVELS[myLevel.num] ?? null
  const myXpInto   = myXP - myLevel.min
  const myXpNeeded = myNextLvl ? myNextLvl.min - myLevel.min : 1
  const myPct      = myNextLvl ? Math.min(100, Math.round((myXpInto / myXpNeeded) * 100)) : 100
  const xpToNext   = myNextLvl ? myNextLvl.min - myXP : 0
  const playerAhead  = ranked[myRank - 2]
  const xpToOvertake = playerAhead ? Math.max(0, playerAhead.xp - myXP + 1) : 0

  return (
    <div className="space-y-3">
      {/* MY POSITION CARD */}
      <div
        className={'rounded-2xl p-4 border shadow-sm ' + (themeGrad ? 'border-0 text-white' : myLevel.bg)}
        style={themeGrad ? { background: themeGrad, boxShadow: `0 4px 24px ${tp}55` } : {}}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="olla-me-avatar w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md ring-2 ring-white/30"
            style={tp && ts ? { background: `linear-gradient(135deg, ${ts}, ${tp})` } : { background: 'linear-gradient(135deg, #1e3a8a, #1e40af)' }}
          >
            {'#' + myRank}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`olla-me-name font-extrabold text-sm ${themeGrad ? 'text-white' : 'text-gray-900'}`}>{'Tu · ' + me.fullName}</div>
            {myTitle && (() => {
              const myTitleEntry = (me.equipped || []).find(e => e.type === 'TITLE')
              const myTitleEffect = myTitleEntry?.cosmetic?.cssPayload?.titleEffect || 'none'
              const myTitleRarity = myTitleEntry?.cosmetic?.rarity || 'COMMON'
              return (
                <div className="mt-0.5">
                  <TitleBadge name={myTitleEntry?.cosmetic?.name || myTitle} effect={myTitleEffect} rarity={myTitleRarity} />
                </div>
              )
            })()}
            <Link href={'/learn/' + token + '/levels'} className={'inline-flex items-center gap-1 text-xs font-bold hover:underline mt-0.5 ' + (themeGrad ? 'text-white/90' : myLevel.color)}>
              <myLevel.Icon className={'w-3 h-3 ' + (themeGrad ? 'text-white/80' : myLevel.iconColor)} />
              {'Nivel ' + myLevel.num + ' — ' + myLevel.name}
            </Link>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-2xl font-extrabold ${themeGrad ? 'text-white' : 'text-gray-900'}`}>{myXP}</div>
            <div className={`text-[10px] ${themeGrad ? 'text-white/60' : 'text-gray-500'}`}>XP total</div>
          </div>
        </div>

        {myNextLvl ? (
          <Link href={'/learn/' + token + '/levels'} className="block group">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className={themeGrad ? 'text-white/80' : myLevel.color}>{'Nv.' + myLevel.num + ' ' + myLevel.name}</span>
              <span className={themeGrad ? 'text-white/70' : 'text-gray-500'}>
                <strong className={themeGrad ? 'text-white' : 'text-gray-900'}>{xpToNext + ' XP'}</strong>
                {' pana la '}
                <span className={themeGrad ? 'text-white/90' : myNextLvl.color}>{myNextLvl.name}</span>
              </span>
            </div>
            <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
              <div className={'h-full rounded-full transition-all duration-700 ' + myLevel.bar} style={{ width: myPct + '%' }} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className={'text-[10px] group-hover:opacity-80 transition flex items-center gap-1 ' + (themeGrad ? 'text-white/60' : 'text-gray-400')}>
                <ChevronRightIcon className="w-3 h-3" />
                {' Vezi toate nivelurile'}
              </span>
              <span className={'text-[10px] ' + (themeGrad ? 'text-white/60' : 'text-gray-500')}>{myXpInto + ' / ' + myXpNeeded + ' XP'}</span>
            </div>
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 py-1">
            <FireSolid className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-bold text-rose-600">Nivel maxim atins — Legend!</span>
            <FireSolid className="w-4 h-4 text-rose-500" />
          </div>
        )}

        {playerAhead && xpToOvertake > 0 && (
          <div className="mt-3 px-3 py-2 bg-white/20 rounded-xl flex items-center gap-2 text-xs">
            <Bars3BottomLeftIcon className={`w-4 h-4 shrink-0 ${themeGrad ? 'text-white/80' : 'text-[#30919f]'}`} />
            <span className={themeGrad ? 'text-white/90' : 'text-[#a0b8bc]'}>
              <strong className={themeGrad ? 'text-white font-extrabold' : 'text-[#30919f]'}>{'+' + xpToOvertake + ' XP'}</strong>
              {' ca sa-l depasesti pe '}
              <strong>{playerAhead.fullName}</strong>
              {' (locul #' + (myRank - 1) + ')'}
            </span>
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="bg-[#0f2127] rounded-2xl shadow-sm border border-[#30919f]/20 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#30919f]/20 flex items-center gap-2 bg-[#136976]/20">
          <StarIcon className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-[#a0b8bc]">Toți elevii</span>
          <span className="ml-auto text-xs text-[#a0b8bc] bg-[#30919f]/10 px-2 py-0.5 rounded-full">{ranked.length + ' elevi'}</span>
        </div>
        <div className="divide-y divide-[#30919f]/10">
          {ranked.map((student, idx) => {
            const rank  = idx + 1
            const level = getLevel(student.xp)
            const isMe  = student.id === me.id
            const isTop = rank <= 3
            const bannerStyle = getBannerStyle(student.bannerName)
            return (
              <div key={student.id}
                className={'olla-leaderboard-row relative px-4 py-3 flex items-center gap-3 transition-colors ' + (isMe ? 'olla-me-row' : '')}
                style={!bannerStyle
                  ? (isMe && tp && ts
                      ? { background: `linear-gradient(135deg, ${tp}22 0%, ${ts}33 50%, ${tp}22 100%)`, borderLeft: `4px solid ${tp}` }
                      : isMe
                        ? { background: '#30919f22', borderLeft: '4px solid #30919f' }
                        : {})
                  : {}}
              >
                {bannerStyle && (
                  <span aria-hidden className="absolute inset-0 pointer-events-none" style={{ ...bannerStyle, opacity: 0.55 }} />
                )}
                <div className="w-7 shrink-0 flex items-center justify-center">
                  {isTop
                    ? <TrophySolid className={'w-5 h-5 ' + RANK_COLOR[idx]} />
                    : <span className="text-sm font-bold text-[#a0b8bc] tabular-nums">{rank}</span>}
                </div>
                <div className={'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm ring-2 ' + (isMe ? 'olla-me-avatar ' : '') + (isTop ? RANK_BG[idx] + ' ' + RANK_RING[idx] + ' ' + RANK_TEXT[idx] : isMe ? 'bg-gradient-to-br from-[#136976] to-[#30919f] text-white ring-[#30919f]/40' : 'bg-[#1a3540] text-[#a0b8bc] ring-[#30919f]/10')}
                >
                  {student.titleIcon
                    ? <img src={student.titleIcon} alt="" className="w-full h-full rounded-full object-cover" />
                    : student.titleRarity
                      ? <CosmeticArt type="TITLE" rarity={student.titleRarity} className="w-full h-full" />
                      : student.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={'text-sm font-semibold truncate ' + (isMe ? 'olla-me-name text-[#30919f]' : bannerStyle ? 'text-white drop-shadow' : 'text-white')}>
                    {isMe ? student.fullName + ' (tu)' : student.fullName}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link href={'/learn/' + token + '/levels'} className={'inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border mt-0.5 hover:opacity-75 transition ' + (bannerStyle ? 'bg-white/80 text-gray-900 border-white/60' : level.badge)}>
                      <level.Icon className="w-2.5 h-2.5" />
                      {'Nv.' + level.num + ' ' + level.name}
                    </Link>
                    {student.titleName && (
                      <TitleBadge
                        name={student.titleName}
                        effect={student.titleEffect || 'none'}
                        rarity={student.titleRarity || 'COMMON'}
                        className="mt-0.5"
                      />
                    )}
                    {student.leaderboardEffectName && (() => {
                      const p = getLeaderboardEffectPreset(student.leaderboardEffectName)
                      return p ? (
                        <span
                          className="mt-0.5 w-8 h-8 inline-block shrink-0"
                          title={student.leaderboardEffectName}
                          style={{ filter: `drop-shadow(0 0 8px ${p.glow})` }}
                        >
                          <CosmeticArt type="LEADERBOARD_EFFECT" name={student.leaderboardEffectName} rarity={student.leaderboardEffectRarity || 'LEGENDARY'} className="w-full h-full" />
                        </span>
                      ) : null
                    })()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={'text-base font-extrabold tabular-nums ' + (isMe ? 'text-[#30919f]' : bannerStyle ? 'text-white drop-shadow' : isTop ? RANK_COLOR[idx] : 'text-white')}>{student.xp}</div>
                  <div className={'text-[10px] ' + (bannerStyle ? 'text-white/70' : 'text-[#a0b8bc]')}>XP</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Event ranked list ─────────────────────────────────────────────────────────
function EventList({ event, me, theme }) {
  const tp = theme?.primary || null
  const ts = theme?.secondary || null
  const color = event.themeColor || '#f59e0b'

  const entries = event.entries // already sorted by score desc
  const myEntry = entries.find(e => e.studentId === me.id)
  const myRank  = myEntry ? entries.findIndex(e => e.studentId === me.id) + 1 : null
  const playerAhead = myRank && myRank > 1 ? entries[myRank - 2] : null
  const scoreToOvertake = playerAhead ? Math.max(0, playerAhead.score - (myEntry?.score ?? 0) + 1) : 0

  const typeLabel = { XP: 'XP acumulat', CODING: 'probleme rezolvate', GEMS: 'Gems', COINS: 'Coins' }[event.type] ?? event.type

  return (
    <div className="space-y-3">
      {/* Event banner */}
      <div
        className="rounded-2xl p-4 text-white shadow-md"
        style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}
      >
        <div className="flex items-center gap-3 mb-1">
          <CalendarDaysIcon className="w-5 h-5 text-white/80 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-sm">{event.name}</div>
            {event.description && <div className="text-xs text-white/70 mt-0.5">{event.description}</div>}
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-white/60">{typeLabel}</div>
            <div className="text-[10px] font-bold text-white/80">⏱ {timeLeft(event.endsAt)}</div>
          </div>
        </div>
      </div>

      {/* My position in this event */}
      {myEntry ? (
        <div
          className="rounded-2xl p-4 border-0 text-white shadow-sm"
          style={{ background: tp && ts ? `linear-gradient(135deg, ${tp} 0%, ${ts} 60%, ${tp} 100%)` : `linear-gradient(135deg, ${color}99, ${color}cc)`, boxShadow: `0 4px 24px ${color}44` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md ring-2 ring-white/30"
              style={{ background: `linear-gradient(135deg, ${color}88, ${color})` }}
            >
              {'#' + myRank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-sm text-white">{'Tu · ' + me.fullName}</div>
              <div className="text-[10px] text-white/70 mt-0.5">Poziția ta în acest event</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-extrabold text-white">{myEntry.score}</div>
              <div className="text-[10px] text-white/60">{typeLabel}</div>
            </div>
          </div>
          {playerAhead && scoreToOvertake > 0 && (
            <div className="mt-3 px-3 py-2 bg-white/20 rounded-xl flex items-center gap-2 text-xs">
              <Bars3BottomLeftIcon className="w-4 h-4 shrink-0 text-white/80" />
              <span className="text-white/90">
                <strong className="text-white font-extrabold">{'+' + scoreToOvertake}</strong>
                {' ca să-l depășești pe '}
                <strong>{playerAhead.student.fullName}</strong>
                {' (locul #' + (myRank - 1) + ')'}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 text-center">
          <div className="text-2xl mb-1">🏁</div>
          <div className="text-sm font-bold text-amber-800">Nu ai intrare în acest event</div>
          <div className="text-xs text-amber-600 mt-1">Rezolvă probleme în perioada evenimentului pentru a apărea în clasament.</div>
        </div>
      )}

      {/* Prizes for top 1/2/3 */}
      {event.rewards && event.rewards.filter(r => r.rank <= 3 && !r.rankTo).length > 0 && (() => {
        const top3Rewards = event.rewards.filter(r => r.rank <= 3 && !r.rankTo).sort((a, b) => a.rank - b.rank)
        const medalEmoji = ['🥇', '🥈', '🥉']
        const medalGrad  = [
          'from-yellow-400 to-amber-500 ring-yellow-300',
          'from-slate-300 to-slate-400 ring-slate-200',
          'from-amber-600 to-orange-700 ring-amber-400',
        ]
        return (
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-sm" style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)` }}>
            <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: `${color}30` }}>
              <TrophySolid className="w-4 h-4" style={{ color }} />
              <span className="text-sm font-bold text-white">Premii</span>
            </div>
            <div className="divide-y" style={{ borderColor: `${color}20` }}>
              {top3Rewards.map(r => (
                <div key={r.id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${medalGrad[r.rank - 1]} ring-2 flex items-center justify-center text-lg shrink-0 shadow-md`}>
                    {medalEmoji[r.rank - 1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#a0b8bc] uppercase tracking-wider">Locul {r.rank}{r.title ? ` · ${r.title}` : ''}</div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {r.xp > 0    && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">⚡ {r.xp} XP</span>}
                      {r.coins > 0 && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">🪙 {r.coins} Coins</span>}
                      {r.gems > 0  && <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">💎 {r.gems} Gems</span>}
                      {r.cosmeticId && <span className="px-2 py-0.5 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-bold">✨ Cosmetic exclusiv</span>}
                      {r.chestId && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">🎁 Cufăr</span>}
                      {r.customReward && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">🎀 {r.customReward}</span>}
                      {!r.xp && !r.coins && !r.gems && !r.cosmeticId && !r.chestId && !r.customReward && <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Event list */}
      <div className="bg-[#0f2127] rounded-2xl shadow-sm border border-[#30919f]/20 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#30919f]/20 flex items-center gap-2 bg-[#136976]/20">
          <TrophyIcon className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-bold text-[#a0b8bc]">Clasament event</span>
          <span className="ml-auto text-xs text-[#a0b8bc] bg-[#30919f]/10 px-2 py-0.5 rounded-full">{entries.length + ' participanți'}</span>
        </div>
        {entries.length === 0 ? (
          <div className="py-12 text-center text-[#a0b8bc] text-sm">Nimeni nu a acumulat puncte încă.</div>
        ) : (
          <div className="divide-y divide-[#30919f]/10">
            {entries.map((entry, idx) => {
              const rank  = idx + 1
              const isMe  = entry.studentId === me.id
              const isTop = rank <= 3
              return (
                <div
                  key={entry.id}
                  className={'px-4 py-3 flex items-center gap-3 transition-colors ' + (isMe ? '' : 'hover:bg-gray-50/80')}
                  style={isMe
                    ? { background: tp && ts ? `linear-gradient(135deg, ${tp}22 0%, ${ts}33 50%, ${tp}22 100%)` : `${color}18`, borderLeft: `4px solid ${color}` }
                    : {}}
                >
                  <div className="w-7 shrink-0 flex items-center justify-center">
                    {isTop
                      ? <TrophySolid className={'w-5 h-5 ' + RANK_COLOR[idx]} />
                    : <span className="text-sm font-bold text-[#a0b8bc] tabular-nums">{rank}</span>}
                </div>
                <div className={'w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm ring-2 ' +
                    (isTop
                      ? RANK_BG[idx] + ' ' + RANK_RING[idx] + ' ' + RANK_TEXT[idx]
                      : isMe
                        ? 'text-white ring-white/40'
                        : 'bg-[#1a3540] text-[#a0b8bc] ring-[#30919f]/10')}
                    style={isMe && !isTop ? { background: color, ringColor: color } : {}}
                  >
                    {entry.student.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={'text-sm font-semibold truncate ' + (isMe ? 'text-[#30919f]' : 'text-white')}>
                      {isMe ? entry.student.fullName + ' (tu)' : entry.student.fullName}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={'text-base font-extrabold tabular-nums ' + (isTop ? RANK_COLOR[idx] : isMe ? 'text-[#30919f]' : 'text-white')}>{entry.score}</div>
                    <div className="text-[10px] text-[#a0b8bc]">{typeLabel}</div>
                    {(() => {
                      const prize = (event.rewards || []).find(r => r.rank === rank && !r.rankTo)
                      if (!prize) return null
                      const medal = ['🥇','🥈','🥉'][rank - 1]
                      if (!medal) return null
                      return <div className="text-[10px] font-bold mt-0.5">{medal} Premiu</div>
                    })()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main tabs component ───────────────────────────────────────────────────────
export default function LeaderboardTabs({ ranked, activeEvents, me, token, theme }) {
  const [tab, setTab] = useState('global')

  const tabs = [
    { id: 'global', label: '🌍 Global' },
    ...activeEvents.map(ev => ({ id: ev.id, label: '🏆 ' + ev.name })),
  ]

  const activeEvent = activeEvents.find(ev => ev.id === tab)

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
      {/* TAB SWITCHER — only show if there are active events */}
      {activeEvents.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                'flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ' +
                (tab === t.id
                  ? 'bg-[#30919f] text-white shadow-md'
                  : 'bg-[#0f2127] text-[#a0b8bc] border border-[#30919f]/30 hover:border-[#30919f] hover:text-[#30919f]')
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      {tab === 'global' || !activeEvent ? (
        <GlobalList ranked={ranked} me={me} token={token} theme={theme} />
      ) : (
        <EventList event={activeEvent} me={me} theme={theme} />
      )}
    </div>
  )
}
