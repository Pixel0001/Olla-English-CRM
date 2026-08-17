'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon, SparklesIcon, GiftIcon, SwatchIcon, ShoppingBagIcon,
  TrophyIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline'
import CosmeticArt from '@/components/student/CosmeticArt'
import TitleBadge from '@/components/student/TitleBadge'
import ChestArt from '@/components/student/ChestArt'
import ThemePreview from '@/components/student/ThemePreview'

const RARITY_STYLES = {
  COMMON:    { ring: 'ring-slate-300',   chip: 'bg-slate-100 text-slate-700',     bg: 'bg-gradient-to-br from-slate-50 to-slate-200',   shadow: '' },
  RARE:      { ring: 'ring-sky-300',     chip: 'bg-sky-100 text-sky-800',         bg: 'bg-gradient-to-br from-sky-50 to-blue-100',     shadow: 'shadow-md shadow-sky-200' },
  EPIC:      { ring: 'ring-fuchsia-300', chip: 'bg-fuchsia-100 text-fuchsia-800', bg: 'bg-gradient-to-br from-fuchsia-50 to-purple-100', shadow: 'shadow-md shadow-fuchsia-200' },
  LEGENDARY: { ring: 'ring-amber-300',   chip: 'bg-amber-100 text-amber-800',     bg: 'bg-gradient-to-br from-amber-50 to-orange-100', shadow: 'shadow-lg shadow-amber-200' },
  MYTHIC:    { ring: 'ring-rose-300',    chip: 'bg-gradient-to-r from-rose-100 to-violet-100 text-rose-800', bg: 'bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-100', shadow: 'shadow-lg shadow-rose-200' },
}

const TABS = [
  { id: 'shop',      label: 'Shop',      icon: ShoppingBagIcon },
  { id: 'chests',    label: 'Cufere',    icon: GiftIcon },
  { id: 'themes',    label: 'Themes',    icon: SwatchIcon },
  { id: 'inventory', label: 'Inventar',  icon: SparklesIcon },
  { id: 'events',    label: 'Events',    icon: TrophyIcon },
]

export default function ShopClient({ token, studentName, initialData = null }) {
  const [data, setData] = useState(initialData)
  const [tab, setTab] = useState('shop')
  const [busy, setBusy] = useState(false)
  const [reward, setReward] = useState(null)

  async function load() {
    const r = await fetch(`/api/public/learn/${token}/shop`, { cache: 'no-store' })
    setData(await r.json())
  }
  // Only fetch on mount if server didn't pre-fetch data.
  // When initialData is present (server-side pre-fetch), skip — avoids
  // a redundant API round-trip and prevents content flicker on hydration.
  useEffect(() => { if (!initialData) load() }, [])

  async function buy(cosmeticId) {
    setBusy(true)
    const res = await fetch(`/api/public/learn/${token}/shop/buy`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cosmeticId }),
    })
    const j = await res.json()
    setBusy(false)
    if (res.ok) { toast.success(`Cumpărat: ${j.item?.name || 'item'}`); load() }
    else toast.error(j.error || 'Eroare')
  }

  async function equip(cosmeticId) {
    const res = await fetch(`/api/public/learn/${token}/shop/equip`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cosmeticId }),
    })
    const j = await res.json()
    if (res.ok) {
      toast.success('Echipat ✓')
      const r2 = await fetch(`/api/public/learn/${token}/shop`, { cache: 'no-store' })
      const newData = await r2.json()
      setData(newData)
      // Notifică EquippedShowcase cu noua lista de echipate
      const newEquippedItems = (newData.equipped || []).map(e => ({
        type: e.type, name: e.cosmetic?.name || '', rarity: e.cosmetic?.rarity || 'COMMON'
      }))
      const equippedTheme = newData.equipped?.find(e => e.type === 'THEME')
      window.dispatchEvent(new CustomEvent('olla:equipped-change', {
        detail: { equipped: newEquippedItems, themeName: equippedTheme?.cosmetic?.name || null }
      }))
      // Dacă e temă, aplică culorile instantaneu
      if (j.type === 'THEME') {
        const themeObj = newData.themes?.find(t => t.name === equippedTheme?.cosmetic?.name)
        if (themeObj) window.dispatchEvent(new CustomEvent('olla:theme-change', { detail: themeObj }))
      }
    } else toast.error('Eroare')
  }

  async function unequip(type) {
    const res = await fetch(`/api/public/learn/${token}/shop/equip`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unequip: true, type }),
    })
    if (res.ok) {
      toast.success('Dezechipat')
      if (type === 'THEME') window.dispatchEvent(new CustomEvent('olla:theme-change', { detail: null }))
      const r2 = await fetch(`/api/public/learn/${token}/shop`, { cache: 'no-store' })
      const newData = await r2.json()
      setData(newData)
      const newEquippedItems = (newData.equipped || []).map(e => ({
        type: e.type, name: e.cosmetic?.name || '', rarity: e.cosmetic?.rarity || 'COMMON'
      }))
      const equippedTheme = newData.equipped?.find(e => e.type === 'THEME')
      window.dispatchEvent(new CustomEvent('olla:equipped-change', {
        detail: { equipped: newEquippedItems, themeName: equippedTheme?.cosmetic?.name || null }
      }))
    } else toast.error('Eroare')
  }

  async function openChest(chestId) {
    setBusy(true)
    const res = await fetch(`/api/public/learn/${token}/shop/open-chest`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chestId }),
    })
    const j = await res.json()
    setBusy(false)
    if (res.ok) { setReward(j); load() }
    else toast.error(j.error || 'Eroare')
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fafb]">
        <div className="text-[#136976] font-semibold">Se încarcă magazinul...</div>
      </div>
    )
  }

  // Map cosmetics for theme tab care: pentru themes vrem să afișăm Theme cards (cu culori reale)
  const themeCosmetics = data.cosmetics.filter(c => c.type === 'THEME')
  const themesByName = new Map((data.themes || []).map(t => [t.name, t]))

  return (
    <div className="min-h-screen bg-[#f0fafb]">
      <div className="text-white" style={{ background: 'linear-gradient(135deg, #0c1a1d, #0f2127, #136976)' }}>
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <Balance icon="🪙" label="Coins"  value={data.economy.coins}  accent="from-amber-400 to-yellow-500" text="text-amber-950" />
            <Balance icon="💎" label="Gems"   value={data.economy.gems}   accent="from-[#30919f] to-[#136976]"  text="text-white" />
            <Balance icon="🔥" label="Streak" value={data.economy.streak} accent="from-orange-400 to-rose-500"  text="text-rose-950" suffix="zile" />
          </div>

          {data.economy.streak > 0 && (
            <div className="mt-3 bg-white/10 rounded-xl p-3 text-xs text-white">
              Multiplicator: <span className="font-extrabold text-yellow-300">×{(data.economy.multiplier || 1).toFixed(2)}</span>
              {' · '}Probleme azi: <span className="font-bold">{data.economy.problemsToday}/3</span>
              {data.economy.freezesAvailable > 0 && <> · ❄️ <span className="font-bold">{data.economy.freezesAvailable}</span> freezes</>}
            </div>
          )}
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-white border-b border-teal-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-bold border-b-2 transition ${
                  active ? 'border-[#30919f] text-[#136976]' : 'border-transparent text-slate-500 hover:text-[#136976] hover:bg-teal-50'
                }`}>
                <Icon className="w-4 h-4" />{t.label}
              </button>
            )
          })}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
        {tab === 'shop' && (
          <Grid items={data.cosmetics.filter(c => c.type !== 'THEME')}
            ownedIds={new Set(data.inventory.map(i => i.id))} onBuy={buy} busy={busy} economy={data.economy} />
        )}
        {tab === 'themes' && (
          <ThemeGrid themeCosmetics={themeCosmetics} themesByName={themesByName}
            ownedIds={new Set(data.inventory.map(i => i.id))} onBuy={buy} busy={busy} economy={data.economy} />
        )}
        {tab === 'chests' && <ChestsGrid chests={data.chests} onOpen={openChest} busy={busy} economy={data.economy} />}
        {tab === 'inventory' && (
          <InventoryGrid items={data.inventory} equipped={data.equipped} onEquip={equip} onUnequip={unequip} themesByName={themesByName} />
        )}
        {tab === 'events' && <EventsList events={data.activeEvents} />}
      </main>

      {reward && <RewardModal reward={reward} onClose={() => setReward(null)} />}
    </div>
  )
}

function Balance({ icon, label, value, accent, text, suffix }) {
  return (
    <div className={`bg-gradient-to-br ${accent} rounded-2xl p-3 ${text} shadow-md`}>
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider opacity-90">
        <span className="text-base leading-none">{icon}</span><span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-2xl font-extrabold leading-none">{value}</span>
        {suffix && <span className="text-xs font-semibold opacity-80">{suffix}</span>}
      </div>
    </div>
  )
}

function Grid({ items, ownedIds, onBuy, busy, economy }) {
  if (!items.length) return <Empty msg="Niciun item disponibil momentan." />
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map(it => (
        <CosmeticCard key={it.id} item={it} owned={ownedIds.has(it.id)} onBuy={onBuy} busy={busy} economy={economy} />
      ))}
    </div>
  )
}

function CosmeticCard({ item, owned, onBuy, busy, economy }) {
  const r = RARITY_STYLES[item.rarity] || RARITY_STYLES.COMMON
  const balance = item.currency === 'GEMS' ? economy.gems : economy.coins
  const canAfford = balance >= item.price
  return (
    <div className={`bg-white rounded-2xl overflow-hidden ring-1 ${r.ring} ${r.shadow} hover:-translate-y-0.5 transition`}>
      <div className={`relative h-32 sm:h-36 ${r.bg} flex flex-col items-center justify-center p-3 gap-2`}>
        <CosmeticArt type={item.type} rarity={item.rarity} name={item.name} className={item.type === 'TITLE' ? 'w-16 h-16 drop-shadow-md' : 'w-full h-full drop-shadow-md'} />
        {item.type === 'TITLE' && (
          <TitleBadge
            name={item.name}
            effect={item.cssPayload?.titleEffect || 'none'}
            rarity={item.rarity}
          />
        )}
        <span className={`absolute top-1.5 left-1.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${r.chip}`}>
          {item.rarity}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-sm text-[#0f2127] line-clamp-1">{item.name}</h3>
        <p className="text-[10px] text-slate-500 line-clamp-2 min-h-[28px]">{item.description || labelForType(item.type)}</p>
        {owned ? (
          <div className="w-full px-3 py-1.5 bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5" /> Deținut
          </div>
        ) : (
          <button disabled={busy || !canAfford} onClick={() => onBuy(item.id)}
            className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              canAfford ? 'bg-amber-400 hover:bg-amber-300 text-blue-900 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}>
            <span className="text-base leading-none">{item.currency === 'GEMS' ? '💎' : '🪙'}</span>
            <span>{item.price}</span>
          </button>
        )}
      </div>
    </div>
  )
}

function ThemeGrid({ themeCosmetics, themesByName, ownedIds, onBuy, busy, economy }) {
  // Arată doar temele NECUMPăRATE — cele cumpărate apar în Inventar
  const availableThemes = themeCosmetics.filter(it => !ownedIds.has(it.id))
  if (!availableThemes.length) return <Empty msg="Ai cumpărat toate temele disponibile! Le găseşti în Inventar." />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {availableThemes.map(it => {
        const r = RARITY_STYLES[it.rarity] || RARITY_STYLES.COMMON
        const balance = it.currency === 'GEMS' ? economy.gems : economy.coins
        const canAfford = balance >= it.price
        const themeData = themesByName.get(it.name) || {}
        return (
          <div key={it.id} className={`bg-white rounded-2xl overflow-hidden ring-1 ${r.ring} ${r.shadow} hover:-translate-y-0.5 transition`}>
            <div className="relative h-36 sm:h-40">
              <ThemePreview theme={themeData} className="w-full h-full" />
              <span className={`absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${r.chip} backdrop-blur shadow`}>
                {it.rarity}
              </span>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-bold text-sm text-[#0f2127]">{it.name}</h3>
              <p className="text-[10px] text-slate-500 line-clamp-2 min-h-[28px]">{it.description || 'Tema vizuală pentru profilul tău.'}</p>
              <button disabled={busy || !canAfford} onClick={() => onBuy(it.id)}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  canAfford ? 'bg-amber-400 hover:bg-amber-300 text-blue-900 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}>
                <span className="text-base leading-none">{it.currency === 'GEMS' ? '💎' : '🪙'}</span>
                <span>{it.price}</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ChestsGrid({ chests, onOpen, busy, economy }) {
  if (!chests.length) return <Empty msg="Niciun cufăr disponibil momentan." />
  const TIER_BG = {
    COMMON:    'bg-gradient-to-br from-slate-100 to-slate-200',
    RARE:      'bg-gradient-to-br from-sky-100 to-blue-200',
    EPIC:      'bg-gradient-to-br from-fuchsia-100 to-purple-200',
    LEGENDARY: 'bg-gradient-to-br from-amber-100 to-orange-200',
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {chests.map(c => {
        const balance = c.currency === 'GEMS' ? economy.gems : economy.coins
        const canAfford = balance >= c.price
        return (
          <div key={c.id} className="bg-white rounded-2xl overflow-hidden ring-1 ring-amber-200 shadow-md hover:-translate-y-0.5 transition group">
            <div className={`relative h-36 ${TIER_BG[c.tier] || TIER_BG.COMMON} flex items-center justify-center p-2 overflow-hidden`}>
              <ChestArt tier={c.tier} className="w-full h-full drop-shadow-lg group-hover:scale-105 transition" />
              <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#136976] shadow">
                {c.tier}
              </span>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-bold text-sm text-[#0f2127]">{c.name}</h3>
              <p className="text-[10px] text-slate-500">{c.rewards?.length || 0} recompense posibile</p>
              <button disabled={busy || !canAfford} onClick={() => onOpen(c.id)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  canAfford ? 'bg-amber-400 hover:bg-amber-300 text-blue-900 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}>
                Deschide · <span className="text-base leading-none">{c.currency === 'GEMS' ? '💎' : '🪙'}</span> {c.price}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function InventoryGrid({ items, equipped, onEquip, onUnequip, themesByName }) {
  if (!items.length) return <Empty msg="Inventarul este gol. Cumpără din shop sau deschide cufere!" />
  const equippedIds = new Set(equipped.map(e => e.cosmeticId))
  const equippedByType = Object.fromEntries(equipped.map(e => [e.type, e.cosmeticId]))
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map(it => {
        const r = RARITY_STYLES[it.rarity] || RARITY_STYLES.COMMON
        const isEq = equippedIds.has(it.id)
        const isTheme = it.type === 'THEME'
        const themeData = isTheme ? (themesByName.get(it.name) || {}) : null
        return (
          <div key={it.id} className={`bg-white rounded-2xl overflow-hidden ring-1 ${isEq ? 'ring-emerald-400 shadow-lg shadow-emerald-100' : r.ring}`}>
            <div className={`relative h-32 sm:h-36 ${r.bg} flex items-center justify-center p-3 overflow-hidden`}>
              {isTheme
                ? <ThemePreview theme={themeData} className="w-full h-full" />
                : <CosmeticArt type={it.type} rarity={it.rarity} name={it.name} className="w-full h-full drop-shadow-md" />}
              {isEq && (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow">✓ ECHIPAT</span>
              )}
            </div>
            <div className="p-3 space-y-1.5">
              <h3 className="font-bold text-sm text-[#0f2127] line-clamp-1">{it.name}</h3>
              {isEq ? (
                <button onClick={() => onUnequip(it.type)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100 active:scale-95 transition">
                  Dezechipează
                </button>
              ) : (
                <button onClick={() => onEquip(it.id)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-bold bg-[#30919f] hover:bg-[#136976] text-white active:scale-95 transition">
                  Echipează
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EventsList({ events }) {
  if (!events.length) return <Empty msg="Niciun event activ momentan." />
  return (
    <div className="space-y-3">
      {events.map(ev => {
        const remaining = new Date(ev.endsAt).getTime() - Date.now()
        const days = Math.max(0, Math.floor(remaining / 86400000))
        const hours = Math.max(0, Math.floor((remaining % 86400000) / 3600000))
        return (
          <div key={ev.id} className="bg-white rounded-2xl p-4 ring-1 ring-amber-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                <TrophyIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-[#0f2127]">{ev.name}</h3>
                {ev.description && <p className="text-xs text-slate-600 mt-1">{ev.description}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-teal-100 text-[#136976] rounded-full text-[10px] font-bold uppercase tracking-wider">{ev.type}</span>
                  <span className="text-[10px] text-slate-500">⏱ {days}z {hours}h rămase</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Empty({ msg }) {
  return (
    <div className="text-center py-16 bg-white ring-1 ring-teal-100 rounded-2xl">
      <p className="text-slate-400">{msg}</p>
    </div>
  )
}

function RewardModal({ reward, onClose }) {
  const cosm = reward.cosmetic
  const r = cosm ? (RARITY_STYLES[cosm.rarity] || RARITY_STYLES.COMMON) : null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl ring-2 ring-amber-300 text-center">
        <div className="text-5xl mb-3">🎁</div>
        <h3 className="text-2xl font-extrabold text-[#0f2127] mb-3">Felicitări!</h3>
        {cosm && r && (
          <div className="space-y-2">
            <div className={`mx-auto h-32 w-32 rounded-2xl ${r.bg} flex items-center justify-center p-3 shadow-lg`}>
              <CosmeticArt type={cosm.type} rarity={cosm.rarity} name={cosm.name} className="w-full h-full" />
            </div>
            <p className="font-extrabold text-lg text-[#0f2127]">{cosm.name}</p>
            <p className={`text-[10px] uppercase tracking-wider font-bold inline-block px-3 py-1 rounded-full ${r.chip}`}>{cosm.rarity}</p>
          </div>
        )}
        {reward.coins ? <p className="text-xl font-extrabold text-amber-700 mt-3">🪙 +{reward.coins} Coins</p> : null}
        {reward.gems  ? <p className="text-xl font-extrabold text-cyan-700 mt-3">💎 +{reward.gems} Gems</p> : null}
        {reward.duplicate && <p className="text-xs text-slate-500 mt-2">Item duplicat — convertit automat în Coins.</p>}
        <button onClick={onClose}
          className="mt-5 w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#0c1a1d] rounded-xl font-extrabold transition">
          Super!
        </button>
      </div>
    </div>
  )
}

function labelForType(type) {
  const m = {
    THEME: 'Temă vizuală',
    PROFILE_BANNER: 'Banner profil',
    USERNAME_COLOR: 'Insignă / Culoare nume',
    ANIMATED_FRAME: 'Ramă animată',
    LEADERBOARD_EFFECT: 'Efect clasament',
    ENTRY_EFFECT: 'Efect intrare',
    CODING_AURA: 'Aură cod',
    TITLE: 'Titlu',
    PET: 'Companion',
    RARE_COSMETIC: 'Cosmetic rar',
    ANIMATED_BACKGROUND: 'Fundal animat',
    PARTICLE_EFFECT: 'Efect particule',
  }
  return m[type] || 'Cosmetic'
}
