// Atașează problemele de matrice la lecțiile corespunzătoare
// C  → lecția "Matrice — Tablouri 2D în C"    (id: 69fa064bdef2195f95a48d5e)
// C++ → lecția "Matrice (Tablouri 2D)" în C++ (id: 69fa0675def2195f95a48dcc)

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const LESSON_MAP = {
  c:   '69fa064bdef2195f95a48d5e',
  cpp: '69fa0675def2195f95a48dcc',
}

for (const [lang, lessonId] of Object.entries(LESSON_MAP)) {
  const result = await prisma.problem.updateMany({
    where: { topic: 'matrice', language: lang, lessonId: null },
    data: { lessonId }
  })
  console.log(`✅ ${lang.toUpperCase()}: ${result.count} probleme atașate la lecție`)
}

// Verificare
for (const [lang, lessonId] of Object.entries(LESSON_MAP)) {
  const count = await prisma.problem.count({ where: { lessonId, topic: 'matrice' } })
  console.log(`   Lecție ${lang.toUpperCase()}: ${count} probleme total`)
}

// JS și Python rămân standalone (nu există lecții dedicate)
const standalone = await prisma.problem.count({
  where: { topic: 'matrice', lessonId: null }
})
console.log(`\n📦 Standalone (JS/Python, în banca de probleme): ${standalone}`)

await prisma.$disconnect()
