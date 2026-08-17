// Aplică enrichment-ul (teorie extinsă + probleme suplimentare) pentru lecțiile existente
// Rulează: node scripts/enrich-modules.mjs

import { PrismaClient } from '@prisma/client'
import { pythonEnriched } from './modules-data/python-enriched.mjs'
import { pythonEnrichedPart2 } from './modules-data/python-enriched-part2.mjs'
import { jsEnriched } from './modules-data/javascript-enriched.mjs'
import { htmlEnriched } from './modules-data/html-enriched.mjs'
import { cssEnriched } from './modules-data/css-enriched.mjs'

const prisma = new PrismaClient()

const enrichmentSets = {
  'python-fundamentals': { ...pythonEnriched, ...pythonEnrichedPart2 },
  'javascript-fundamentals': jsEnriched,
  'html-basics': htmlEnriched,
  'css-basics': cssEnriched,
}

async function enrichModule(moduleSlug, enrichments) {
  const mod = await prisma.learningModule.findUnique({
    where: { slug: moduleSlug },
    select: { id: true, title: true },
  })
  if (!mod) {
    console.log(`⚠️  Modulul "${moduleSlug}" nu există — sărit`)
    return { lessons: 0, problems: 0 }
  }

  console.log(`\n📦 ${mod.title}`)
  let updated = 0
  let addedProblems = 0

  for (const [lessonSlug, data] of Object.entries(enrichments)) {
    const lesson = await prisma.lesson.findUnique({
      where: { moduleId_slug: { moduleId: mod.id, slug: lessonSlug } },
      select: { id: true, title: true },
    })
    if (!lesson) {
      console.log(`  ⚠️  Lecția "${lessonSlug}" nu există — sărit`)
      continue
    }

    // 1) Înlocuiește teoria
    if (data.theory) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { theory: data.theory },
      })
    }

    // 2) Adaugă probleme suplimentare la sfârșitul listei
    if (data.extraProblems?.length) {
      // Calculează lessonOrder de start = max curent + 1
      const max = await prisma.problem.aggregate({
        where: { lessonId: lesson.id },
        _max: { lessonOrder: true },
      })
      const startOrder = (max._max.lessonOrder ?? 0) + 1

      // Verifică dacă deja au fost adăugate (după title) ca să fie idempotent
      const existingTitles = new Set(
        (await prisma.problem.findMany({
          where: { lessonId: lesson.id },
          select: { title: true },
        })).map(p => p.title)
      )

      const toAdd = data.extraProblems.filter(p => !existingTitles.has(p.title))

      if (toAdd.length > 0) {
        await prisma.problem.createMany({
          data: toAdd.map((p, idx) => ({
            title: p.title,
            description: p.description,
            difficulty: p.difficulty || 'EASY',
            topic: p.topic || lessonSlug,
            type: p.type || 'MULTIPLE_CHOICE',
            options: p.options || [],
            correctAnswer: p.correctAnswer ?? null,
            starterCode: p.starterCode ?? null,
            explanation: p.explanation || '',
            hint: p.hint ?? null,
            tags: p.tags || [],
            estimatedTime: p.estimatedTime || 5,
            points: p.points || 10,
            language: p.language ?? null,
            lessonId: lesson.id,
            lessonOrder: startOrder + idx,
            active: true,
          })),
        })
        addedProblems += toAdd.length
      }
    }

    updated++
    console.log(`  ✓ ${lesson.title} — teorie extinsă${data.extraProblems?.length ? ` + ${data.extraProblems.length} probleme noi` : ''}`)
  }

  return { lessons: updated, problems: addedProblems }
}

async function main() {
  console.log('🚀 Enrichment lecții — teorie extinsă + probleme suplimentare\n')
  const start = Date.now()

  let totalLessons = 0
  let totalProblems = 0
  for (const [slug, data] of Object.entries(enrichmentSets)) {
    const r = await enrichModule(slug, data)
    totalLessons += r.lessons
    totalProblems += r.problems
  }

  const sec = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n✅ DONE in ${sec}s`)
  console.log(`   Lecții actualizate: ${totalLessons}`)
  console.log(`   Probleme adăugate:  ${totalProblems}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
