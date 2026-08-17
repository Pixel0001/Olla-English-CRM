import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const lessons = await prisma.lesson.findMany({
  where: { slug: { contains: 'matrice' } },
  select: { id: true, title: true, slug: true, module: { select: { title: true, slug: true } } }
})
console.log(JSON.stringify(lessons, null, 2))

// Și problemele standalone de matrice
const problems = await prisma.problem.findMany({
  where: { topic: 'matrice', lessonId: null },
  select: { id: true, title: true, language: true },
  orderBy: { language: 'asc' }
})
console.log(`\nProbleme standalone: ${problems.length}`)
problems.slice(0, 8).forEach(p => console.log(`  ${p.language}: ${p.title}`))

await prisma.$disconnect()
