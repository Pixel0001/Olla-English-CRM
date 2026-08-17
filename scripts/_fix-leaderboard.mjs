import { readFileSync, writeFileSync } from 'fs'

const p = 'C:/Users/Stefan/Desktop/Olla/app/learn/[token]/leaderboard/page.js'
const t = readFileSync(p, 'utf8')

const startMarker = 'const me = await prisma.student.findFirst({'
const endMarker = 'const myXP       = xpMap.get(me.id) ?? 0'

const s = t.indexOf(startMarker)
const e = t.indexOf(endMarker) + endMarker.length

if (s === -1 || e === -1) {
  console.error('Markers not found', { s, e })
  process.exit(1)
}

const replacement = `// React cache() — deduplicat cu layout, include equipped + activeThemeId
  const me = await getStudentByToken(token)
  if (!me || me.active === false) notFound()

  // Tema + ranking in paralel — ranking e cached 60s
  const [theme, ranked] = await Promise.all([
    me.activeThemeId ? getThemeById(me.activeThemeId) : Promise.resolve(null),
    getLeaderboardRanking(),
  ])

  const tp = theme?.primary   || null
  const ts = theme?.secondary || null
  const themeGrad = tp && ts
    ? \`linear-gradient(135deg, \${tp} 0%, \${ts} 60%, \${tp} 100%)\`
    : null

  // TITLE din equipped (deja in student din getStudentByToken)
  const myTitle = (me.equipped || [])
    .find(e => e.type === 'TITLE')?.cosmetic?.name
    ?.replace(/^Titlu\\s+[„"']?/, '').replace(/["„'"]$/, '') || null

  const myRank     = ranked.findIndex(s => s.id === me.id) + 1
  const myXP       = ranked.find(s => s.id === me.id)?.xp ?? 0`

// Also need to remove the old notFound() call since we have it in replacement
const before = t.slice(0, s)
  .replace("  const me = await prisma.student.findFirst({", '') // just in case
  .replace("  if (!me || me.active === false) notFound()\n\n  let theme = null\n  if (me.activeThemeId) {\n    theme = await prisma.theme.findUnique({ where: { id: me.activeThemeId } })\n  }\n", '')

const result = t.slice(0, s) + replacement + t.slice(e)
writeFileSync(p, result, 'utf8')
console.log('Done. s='+s, 'e='+e, 'replaced', e-s, 'chars with', replacement.length, 'chars')
