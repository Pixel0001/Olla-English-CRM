// Șterge toate problemele fără lecție atribuită (lessonId = null)
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const toDelete = await prisma.problem.findMany({
  where: { lessonId: null },
  select: { id: true, title: true }
})

console.log(`\n🔍 Probleme fără lecție: ${toDelete.length}`)
if (toDelete.length === 0) {
  console.log('✅ Nimic de șters.')
  await prisma.$disconnect()
  process.exit(0)
}

toDelete.forEach((p, i) => console.log(`  ${i + 1}. ${p.title} (${p.id})`))

const ids = toDelete.map(p => p.id)

// Ștergem înregistrările copil mai întâi
const [att, sub, set] = await Promise.all([
  prisma.problemAttempt.deleteMany({ where: { problemId: { in: ids } } }),
  prisma.problemSubmission.deleteMany({ where: { problemId: { in: ids } } }),
  prisma.setProblem.deleteMany({ where: { problemId: { in: ids } } }),
])
console.log(`\n🧹 Șters: ${att.count} attempts, ${sub.count} submissions, ${set.count} setProblems`)

const result = await prisma.problem.deleteMany({ where: { id: { in: ids } } })
console.log(`✅ Probleme șterse: ${result.count}`)

await prisma.$disconnect()
