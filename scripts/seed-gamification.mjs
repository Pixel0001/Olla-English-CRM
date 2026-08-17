// scripts/seed-gamification.mjs
// Seed pentru: Cosmetics, Themes, Chests + ChestRewards.
// Idempotent — verifică după nume înainte de a crea.
//
// Rulare:  node scripts/seed-gamification.mjs

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ─── COSMETICS ────────────────────────────────────────────
const COSMETICS = [
  // Frames
  { name: 'Ramă Bronz',       type: 'ANIMATED_FRAME', rarity: 'COMMON',    currency: 'COINS', price: 200,  description: 'Ramă elegantă de bronz pentru avatar.' },
  { name: 'Ramă Argint',      type: 'ANIMATED_FRAME', rarity: 'RARE',      currency: 'COINS', price: 500,  description: 'Strălucirea argintului pentru profilul tău.' },
  { name: 'Ramă Aur',         type: 'ANIMATED_FRAME', rarity: 'EPIC',      currency: 'COINS', price: 1500, description: 'Ramă aurită rezervată celor mai dedicați elevi.' },
  { name: 'Ramă Diamant',     type: 'ANIMATED_FRAME', rarity: 'LEGENDARY', currency: 'GEMS',  price: 50,   description: 'O ramă de diamant care emană prestigiu.' },
  { name: 'Ramă Phoenix',     type: 'ANIMATED_FRAME', rarity: 'MYTHIC',    currency: 'GEMS',  price: 200,  description: 'Flăcările eterne ale unui phoenix legendar.' },

  // Username colors (badges)
  { name: 'Insignă Începător',   type: 'USERNAME_COLOR', rarity: 'COMMON',    currency: 'COINS', price: 100,  description: 'Primul tău pas în comunitatea Olla.' },
  { name: 'Insignă Codificator', type: 'USERNAME_COLOR', rarity: 'RARE',      currency: 'COINS', price: 400,  description: 'Pentru pasionații de cod.' },
  { name: 'Insignă Maestru',     type: 'USERNAME_COLOR', rarity: 'EPIC',      currency: 'GEMS',  price: 30,   description: 'Recunoaștere pentru maeștrii Python.' },
  { name: 'Insignă Hacker',      type: 'USERNAME_COLOR', rarity: 'LEGENDARY', currency: 'GEMS',  price: 80,   description: 'Stilul unui adevărat hacker.' },

  // Banners
  { name: 'Banner Curcubeu',  type: 'PROFILE_BANNER', rarity: 'COMMON',    currency: 'COINS', price: 250,  description: 'Un banner colorat pentru profil.' },
  { name: 'Banner Galaxie',   type: 'PROFILE_BANNER', rarity: 'EPIC',      currency: 'COINS', price: 1200, description: 'Călătorie printre stele.' },
  { name: 'Banner Aurora',    type: 'PROFILE_BANNER', rarity: 'LEGENDARY', currency: 'GEMS',  price: 60,   description: 'Strălucirea aurorei boreale.' },

  // Pets
  { name: 'Pet Pisicuță',     type: 'PET',    rarity: 'RARE',      currency: 'COINS', price: 700,  description: 'O pisicuță drăgălașă te însoțește.' },
  { name: 'Pet Dragonel',     type: 'PET',    rarity: 'EPIC',      currency: 'GEMS',  price: 40,   description: 'Un mic dragon vesel.' },
  { name: 'Pet Phoenix',      type: 'PET',    rarity: 'MYTHIC',    currency: 'GEMS',  price: 250,  description: 'Phoenix-ul mitologic, prieten loial.' },

  // Particle effects
  { name: 'Efect Stele',      type: 'PARTICLE_EFFECT', rarity: 'RARE',      currency: 'COINS', price: 600,  description: 'Stele scânteietoare în jurul avatarului.' },
  { name: 'Efect Foc',        type: 'PARTICLE_EFFECT', rarity: 'EPIC',      currency: 'GEMS',  price: 35,   description: 'Flăcări incandescente.' },
  { name: 'Efect Fulger',     type: 'PARTICLE_EFFECT', rarity: 'LEGENDARY', currency: 'GEMS',  price: 90,   description: 'Energia electrică pură.' },

  // Coding auras
  { name: 'Aură Cod Verde',   type: 'CODING_AURA', rarity: 'RARE',      currency: 'COINS', price: 550,  description: 'O aură verde în editorul de cod.' },
  { name: 'Aură Cod Neon',    type: 'CODING_AURA', rarity: 'EPIC',      currency: 'GEMS',  price: 45,   description: 'Lumină neon în jurul codului tău.' },

  // Leaderboard effects
  { name: 'Efect Top Aur',    type: 'LEADERBOARD_EFFECT', rarity: 'EPIC',      currency: 'GEMS', price: 50,  description: 'Numele tău strălucește în clasament.' },
  { name: 'Efect Top Phoenix', type: 'LEADERBOARD_EFFECT', rarity: 'MYTHIC',   currency: 'GEMS', price: 280, description: 'Animat cu flăcările phoenixului.' },

  // Titles
  { name: 'Titlu „Începător”',     type: 'TITLE', rarity: 'COMMON',    currency: 'COINS', price: 150,  description: 'Afișează-l mândru pe profil.' },
  { name: 'Titlu „Pythonist”',     type: 'TITLE', rarity: 'EPIC',      currency: 'COINS', price: 1000, description: 'Pentru cei care iubesc Python.' },
  { name: 'Titlu „Cod Master”',    type: 'TITLE', rarity: 'LEGENDARY', currency: 'GEMS',  price: 70,   description: 'Statutul de maestru al codului.' },
  { name: 'Titlu „Legendă Olla”', type: 'TITLE', rarity: 'MYTHIC',    currency: 'GEMS',  price: 300,  description: 'Doar pentru elită.' },

  // Entry effects
  { name: 'Efect Intrare Star',  type: 'ENTRY_EFFECT', rarity: 'RARE', currency: 'COINS', price: 500, description: 'Stele când intri pe platformă.' },
  { name: 'Efect Intrare Cool',  type: 'ENTRY_EFFECT', rarity: 'COMMON', currency: 'COINS', price: 100, description: 'Anunţă cool sosirea ta.' },

  // Backgrounds
  { name: 'Fundal Cosmic',    type: 'ANIMATED_BACKGROUND', rarity: 'EPIC',      currency: 'COINS', price: 1300, description: 'Profilul tău în spațiu.' },
  { name: 'Fundal Neon',      type: 'ANIMATED_BACKGROUND', rarity: 'LEGENDARY', currency: 'GEMS',  price: 75,   description: 'Lumini de neon futuristice.' },

  // Generic rare cosmetic
  { name: 'Trofeu Aur',       type: 'RARE_COSMETIC', rarity: 'LEGENDARY', currency: 'GEMS', price: 100, description: 'Un trofeu de aur exclusivist.' },
]

// ─── THEMES (sunt și ele Cosmetic cu type=THEME, dar și înregistrare în Theme) ───
const THEMES = [
  { name: 'Tema Albastru Clasic',  primaryColor: '#1e3a8a', secondaryColor: '#3b82f6', accentColor: '#fbbf24', bgGradient: 'from-blue-50 to-indigo-50',  glowColor: '#3b82f6', currency: 'COINS', price: 300,  rarity: 'COMMON',    description: 'Tema implicită Olla.' },
  { name: 'Tema Verde Smarald',    primaryColor: '#065f46', secondaryColor: '#10b981', accentColor: '#fbbf24', bgGradient: 'from-emerald-50 to-teal-50', glowColor: '#10b981', currency: 'COINS', price: 600,  rarity: 'RARE',      description: 'Verde proaspăt și energic.' },
  { name: 'Tema Roz Sunset',       primaryColor: '#9d174d', secondaryColor: '#ec4899', accentColor: '#fde047', bgGradient: 'from-pink-50 to-rose-50',    glowColor: '#ec4899', currency: 'COINS', price: 800,  rarity: 'RARE',      description: 'Apus de soare în culori vii.' },
  { name: 'Tema Violet Galactic',  primaryColor: '#581c87', secondaryColor: '#a855f7', accentColor: '#fde047', bgGradient: 'from-violet-50 to-purple-50', glowColor: '#a855f7', currency: 'GEMS',  price: 30,   rarity: 'EPIC',      description: 'Mistic și elegant.' },
  { name: 'Tema Aur Imperial',     primaryColor: '#78350f', secondaryColor: '#f59e0b', accentColor: '#fde047', bgGradient: 'from-amber-50 to-orange-50', glowColor: '#f59e0b', currency: 'GEMS',  price: 80,   rarity: 'LEGENDARY', description: 'Aur și prestigiu imperial.' },
  { name: 'Tema Phoenix Ardent',   primaryColor: '#7f1d1d', secondaryColor: '#ef4444', accentColor: '#fde047', bgGradient: 'from-rose-50 via-orange-50 to-amber-50', glowColor: '#ef4444', currency: 'GEMS', price: 250, rarity: 'MYTHIC', description: 'Flăcările eterne ale phoenix-ului.' },
]

// ─── CHESTS ──────────────────────────────────────────────
const CHESTS = [
  {
    name: 'Cufăr Comun', tier: 'COMMON', currency: 'COINS', price: 300,
    description: 'Conține un item de rarity Common sau Rare cu șansă mică de Epic.',
    rewards: [
      { kind: 'rarity', rarity: 'COMMON',    weight: 60 },
      { kind: 'rarity', rarity: 'RARE',      weight: 30 },
      { kind: 'rarity', rarity: 'EPIC',      weight: 8 },
      { kind: 'coins',  amount: 100,         weight: 2 },
    ],
  },
  {
    name: 'Cufăr Rar', tier: 'RARE', currency: 'COINS', price: 800,
    description: 'Garantat un item Rare sau mai bun.',
    rewards: [
      { kind: 'rarity', rarity: 'RARE',      weight: 55 },
      { kind: 'rarity', rarity: 'EPIC',      weight: 30 },
      { kind: 'rarity', rarity: 'LEGENDARY', weight: 10 },
      { kind: 'gems',   amount: 10,          weight: 5 },
    ],
  },
  {
    name: 'Cufăr Epic', tier: 'EPIC', currency: 'GEMS', price: 50,
    description: 'Cufăr premium cu recompense Epic și Legendary.',
    rewards: [
      { kind: 'rarity', rarity: 'EPIC',      weight: 50 },
      { kind: 'rarity', rarity: 'LEGENDARY', weight: 35 },
      { kind: 'rarity', rarity: 'MYTHIC',    weight: 10 },
      { kind: 'gems',   amount: 30,          weight: 5 },
    ],
  },
  {
    name: 'Cufăr Legendar', tier: 'LEGENDARY', currency: 'GEMS', price: 150,
    description: 'Cufărul suprem — șanse mari pentru Mythic.',
    rewards: [
      { kind: 'rarity', rarity: 'LEGENDARY', weight: 55 },
      { kind: 'rarity', rarity: 'MYTHIC',    weight: 35 },
      { kind: 'gems',   amount: 100,         weight: 10 },
    ],
  },
]

async function main() {
  console.log('🎮 Seed Gamification — start')

  // ─── 1. Cosmetics ───
  let createdCosm = 0, skippedCosm = 0
  for (const c of COSMETICS) {
    const exists = await prisma.cosmetic.findFirst({ where: { name: c.name } })
    if (exists) { skippedCosm++; continue }
    await prisma.cosmetic.create({
      data: { ...c, active: true, shopVisible: true },
    })
    createdCosm++
  }
  console.log(`  ✓ Cosmetics: +${createdCosm} create, ${skippedCosm} existau`)

  // ─── 2. Themes (Cosmetic cu type=THEME + Theme) ───
  let createdTh = 0, skippedTh = 0
  for (const t of THEMES) {
    const existsCosm = await prisma.cosmetic.findFirst({ where: { name: t.name } })
    if (!existsCosm) {
      await prisma.cosmetic.create({
        data: {
          name: t.name, type: 'THEME', rarity: t.rarity, currency: t.currency,
          price: t.price, description: t.description, active: true, shopVisible: true,
        },
      })
    }
    const existsTheme = await prisma.theme.findFirst({ where: { name: t.name } })
    if (existsTheme) { skippedTh++; continue }
    await prisma.theme.create({
      data: {
        name: t.name,
        description: t.description,
        rarity: t.rarity,
        currency: t.currency,
        price: t.price,
        primary: t.primaryColor,
        secondary: t.secondaryColor,
        accent: t.accentColor,
        bgGradient: t.bgGradient,
        glowColor: t.glowColor,
        active: true,
      },
    })
    createdTh++
  }
  console.log(`  ✓ Themes: +${createdTh} create, ${skippedTh} existau`)

  // ─── 3. Chests + ChestRewards ───
  let createdCh = 0, skippedCh = 0
  for (const ch of CHESTS) {
    const existing = await prisma.chest.findFirst({ where: { name: ch.name } })
    if (existing) { skippedCh++; continue }

    const chest = await prisma.chest.create({
      data: {
        name: ch.name, tier: ch.tier, currency: ch.currency, price: ch.price,
        description: ch.description, active: true,
      },
    })

    // Pentru fiecare „kind=rarity" creăm câte un ChestReward pentru fiecare cosmetic
    // de acea rarity (deci la deschidere se va alege random unul dintre ele).
    for (const r of ch.rewards) {
      if (r.kind === 'rarity') {
        const cosmetics = await prisma.cosmetic.findMany({
          where: { rarity: r.rarity, active: true, shopVisible: true },
          select: { id: true },
        })
        const split = cosmetics.length > 0 ? Math.max(1, Math.round(r.weight / cosmetics.length)) : 0
        for (const c of cosmetics) {
          await prisma.chestReward.create({
            data: { chestId: chest.id, cosmeticId: c.id, weight: split },
          })
        }
      } else if (r.kind === 'coins') {
        await prisma.chestReward.create({
          data: { chestId: chest.id, coinsAmount: r.amount, weight: r.weight },
        })
      } else if (r.kind === 'gems') {
        await prisma.chestReward.create({
          data: { chestId: chest.id, gemsAmount: r.amount, weight: r.weight },
        })
      }
    }
    createdCh++
  }
  console.log(`  ✓ Chests: +${createdCh} create, ${skippedCh} existau`)

  console.log('🎮 Seed Gamification — gata.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
