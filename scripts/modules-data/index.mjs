// Aggregator pentru toate modulele de învățare
import { pythonModule } from './python.mjs'
import { javascriptModule } from './javascript.mjs'
import { htmlModule } from './html.mjs'
import { cssModule } from './css.mjs'
import { cModule } from './c.mjs'
import { cppModule } from './cpp.mjs'
import { csharpModule } from './csharp.mjs'
import { pythonMetodicaPatch } from './python-metodica.mjs'
import { javascriptMetodicaPatch } from './javascript-metodica.mjs'
import { pythonMetodicaExtraPatch } from './python-metodica-extra.mjs'
import { javascriptMetodicaExtraPatch } from './javascript-metodica-extra.mjs'
// Teorie îmbogățită (stil prietenos pentru elevi 9-10 ani)
import { pythonEnriched } from './python-enriched.mjs'
import { pythonEnrichedPart2 } from './python-enriched-part2.mjs'
import { jsEnriched } from './javascript-enriched.mjs'
import { htmlEnriched } from './html-enriched.mjs'
import { cssEnriched } from './css-enriched.mjs'
// Quiz packs — completează fiecare lecție la min 10 probleme
import { pythonQuizPack } from './python-quiz-pack.mjs'
import { javascriptQuizPack } from './javascript-quiz-pack.mjs'
import { htmlQuizPack } from './html-quiz-pack.mjs'
import { cssQuizPack } from './css-quiz-pack.mjs'
import { cQuizPack } from './c-quiz-pack.mjs'
import { cppQuizPack } from './cpp-quiz-pack.mjs'
import { csharpQuizPack } from './csharp-quiz-pack.mjs'
// Extras — lecții suplimentare pentru a ajunge la ~25 lecții/limbaj
import { cExtras } from './c-extras.mjs'
import { cppExtras } from './cpp-extras.mjs'
import { csharpExtras } from './csharp-extras.mjs'
// Module noi: React / Tailwind / Next.js Frontend / Next.js Backend
import { reactModule } from './react.mjs'
import { tailwindModule } from './tailwind.mjs'
import { nextjsFrontendModule } from './nextjs-frontend.mjs'
import { nextjsBackendModule } from './nextjs-backend.mjs'
// Modul școală primară
import { matematicaClasa1Module } from './matematica-clasa1.mjs'

// Convertește un dicționar enriched ({ slug: { theory, problems } })
// într-un patch ({ replaceTheory, appendProblems }).
function enrichedToPatch(dict) {
  const replaceTheory = {}
  const appendProblems = {}
  for (const [slug, ent] of Object.entries(dict || {})) {
    if (ent.theory) replaceTheory[slug] = ent.theory
    if (ent.problems && ent.problems.length) appendProblems[slug] = ent.problems
  }
  return { replaceTheory, appendProblems }
}

// Aplică un patch peste un modul:
//  - replaceTheory[slug]  → înlocuiește teoria
//  - appendTheory[slug]   → concatenează la final de theory
//  - appendProblems[slug] → concatenează la final de problems
//  - newLessons[]         → inserează după lecția cu afterSlug
function applyPatch(mod, patch) {
  if (!patch) return mod
  let lessons = mod.lessons.map((l) => {
    const out = { ...l }
    if (patch.replaceTheory && patch.replaceTheory[l.slug]) {
      out.theory = patch.replaceTheory[l.slug]
    }
    if (patch.appendTheory && patch.appendTheory[l.slug]) {
      out.theory = (out.theory || '') + patch.appendTheory[l.slug]
    }
    if (patch.appendProblems && patch.appendProblems[l.slug]) {
      out.problems = [...(out.problems || []), ...patch.appendProblems[l.slug]]
    }
    return out
  })
  for (const nl of patch.newLessons || []) {
    const { afterSlug, ...lesson } = nl
    const idx = lessons.findIndex((l) => l.slug === afterSlug)
    if (idx >= 0) lessons.splice(idx + 1, 0, lesson)
    else lessons.push(lesson)
  }
  return { ...mod, lessons }
}

// Ordine: base → enriched (înlocuiește teoria) → metodica (adaugă teorie+probleme+lecții noi) → metodica-extra
const enrichedPython = applyPatch(
  applyPatch(
    applyPatch(
      applyPatch(pythonModule, enrichedToPatch({ ...pythonEnriched, ...pythonEnrichedPart2 })),
      pythonMetodicaPatch
    ),
    pythonMetodicaExtraPatch
  ),
  pythonQuizPack
)
const enrichedJavascript = applyPatch(
  applyPatch(
    applyPatch(applyPatch(javascriptModule, enrichedToPatch(jsEnriched)), javascriptMetodicaPatch),
    javascriptMetodicaExtraPatch
  ),
  javascriptQuizPack
)
const enrichedHtml = applyPatch(applyPatch(htmlModule, enrichedToPatch(htmlEnriched)), htmlQuizPack)
const enrichedCss = applyPatch(applyPatch(cssModule, enrichedToPatch(cssEnriched)), cssQuizPack)
const enrichedC = applyPatch(applyPatch(cModule, cQuizPack), cExtras)
const enrichedCpp = applyPatch(applyPatch(cppModule, cppQuizPack), cppExtras)
const enrichedCsharp = applyPatch(applyPatch(csharpModule, csharpQuizPack), csharpExtras)

export const allModules = [
  enrichedPython,
  enrichedJavascript,
  enrichedHtml,
  enrichedCss,
  enrichedC,
  enrichedCpp,
  enrichedCsharp,
  reactModule,
  tailwindModule,
  nextjsFrontendModule,
  nextjsBackendModule,
  matematicaClasa1Module,
]
