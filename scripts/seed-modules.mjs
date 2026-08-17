// Seed runner pentru modulele de învățare
// Rulează: node scripts/seed-modules.mjs

import { PrismaClient } from '@prisma/client'
import { allModules } from './modules-data/index.mjs'

const prisma = new PrismaClient()

async function seedModule(modData) {
  console.log(`\n📦 Modul: ${modData.title} (${modData.slug})`)

  // 1) Upsert modul
  const mod = await prisma.learningModule.upsert({
    where: { slug: modData.slug },
    create: {
      slug: modData.slug,
      title: modData.title,
      description: modData.description,
      language: modData.language,
      order: modData.order ?? 0,
      active: true,
    },
    update: {
      title: modData.title,
      description: modData.description,
      language: modData.language,
      order: modData.order ?? 0,
      active: true,
    },
    select: { id: true },
  })

  let totalLessons = 0
  let totalProblems = 0

  // 2) Lecții — secvențial pentru log clar
  for (let i = 0; i < modData.lessons.length; i++) {
    const lessonData = modData.lessons[i]
    const order = i + 1

    // Upsert lecție pe (moduleId, slug)
    const lesson = await prisma.lesson.upsert({
      where: {
        moduleId_slug: { moduleId: mod.id, slug: lessonData.slug },
      },
      create: {
        moduleId: mod.id,
        slug: lessonData.slug,
        title: lessonData.title,
        order,
        isFree: !!lessonData.isFree,
        theory: lessonData.theory,
        active: true,
      },
      update: {
        title: lessonData.title,
        order,
        isFree: !!lessonData.isFree,
        theory: lessonData.theory,
        active: true,
      },
      select: { id: true },
    })

    // 3) Upsert ADITIV pe (lessonId, title) — NU mai ștergem nimic.
    //    Astfel problemele adăugate manual prin admin UI sunt păstrate;
    //    problemele cu același titlu sunt actualizate; cele lipsă sunt create.
    if (lessonData.problems?.length) {
      // Pre-fetch problemele existente pentru a determina dacă facem create vs update
      const existing = await prisma.problem.findMany({
        where: { lessonId: lesson.id },
        select: { id: true, title: true },
      })
      const existingByTitle = new Map(existing.map((e) => [e.title, e.id]))

      for (let idx = 0; idx < lessonData.problems.length; idx++) {
        const p = lessonData.problems[idx]
        const data = {
          title: p.title,
          description: p.description,
          difficulty: p.difficulty || 'EASY',
          topic: p.topic || lessonData.slug,
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
          lessonOrder: idx + 1,
          active: true,
        }
        const existingId = existingByTitle.get(p.title)
        if (existingId) {
          await prisma.problem.update({ where: { id: existingId }, data })
        } else {
          await prisma.problem.create({ data })
        }
      }
      totalProblems += lessonData.problems.length
    }

    totalLessons++
    process.stdout.write(`  ✓ ${order}. ${lessonData.title} (${lessonData.problems?.length || 0} probleme)\n`)
  }

  console.log(`  ✅ ${totalLessons} lecții, ${totalProblems} probleme`)
  return { lessons: totalLessons, problems: totalProblems }
}

async function main() {
  console.log('🚀 Seed: Learning Modules\n')
  const start = Date.now()

  let totalLessons = 0
  let totalProblems = 0
  for (const mod of allModules) {
    const r = await seedModule(mod)
    totalLessons += r.lessons
    totalProblems += r.problems
  }

  const sec = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n✅ DONE in ${sec}s`)
  console.log(`   Module:   ${allModules.length}`)
  console.log(`   Lecții:   ${totalLessons}`)
  console.log(`   Probleme: ${totalProblems}`)
}

main()
  .catch((e) => {
    console.error('❌ Eroare seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
