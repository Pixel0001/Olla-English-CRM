import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

const [modules, lessons, problems, freeL] = await Promise.all([
  p.learningModule.count({ where: { active: true } }),
  p.lesson.count({ where: { active: true } }),
  p.problem.count({ where: { active: true } }),
  p.lesson.count({ where: { active: true, isFree: true } }),
])

const mods = await p.learningModule.findMany({
  where: { active: true },
  orderBy: { order: 'asc' },
  select: {
    title: true, language: true,
    _count: { select: { lessons: { where: { active: true } } } },
    lessons: { where: { active: true }, select: { _count: { select: { problems: { where: { active: true } } } } } }
  }
})

const types = await p.problem.groupBy({ by: ['type'], where: { active: true }, _count: true })
const diffs = await p.problem.groupBy({ by: ['difficulty'], where: { active: true }, _count: true })

console.log('=== TOTAL ===')
console.log(`Module: ${modules} | Lecții: ${lessons} | Probleme: ${problems}`)
console.log(`Lecții gratuite: ${freeL}`)
console.log('\n=== PER MODUL ===')
mods.forEach(m => {
  const probs = m.lessons.reduce((s, l) => s + l._count.problems, 0)
  console.log(`  ${m.title} (${m.language}): ${m._count.lessons} lecții, ${probs} probleme`)
})
console.log('\n=== TIPURI PROBLEME ===')
types.forEach(t => console.log(`  ${t.type}: ${t._count}`))
console.log('\n=== DIFICULTATE ===')
diffs.forEach(d => console.log(`  ${d.difficulty}: ${d._count}`))

await p.$disconnect()
