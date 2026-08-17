/**
 * Utilități pentru Problem Bank System
 */

import crypto from 'crypto'

/**
 * Generează un token random pentru link-ul public al unui set
 */
export function generateAccessToken() {
  return crypto.randomBytes(16).toString('base64url')
}

/**
 * Normalizează un răspuns text pentru comparație: trim, lowercase, normalize whitespace
 */
function normalize(s) {
  if (s === null || s === undefined) return ''
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Normalizare „lejeră" pentru cod: șterge TOATE spațiile, ghilimele unificate,
 * elimină punct-virgulă final, comentarii Python (`# ...`) și JS (`// ...`).
 * Ex: `nume = "Maria"`, `nume="Maria"`, `nume = 'Maria';` → toate identice.
 */
function looseCodeNormalize(s) {
  if (s === null || s === undefined) return ''
  let v = String(s)
  // elimină comentarii la final de linie (Python `#` și JS `//`)
  v = v.replace(/\s*\/\/[^\n]*$/gm, '').replace(/\s*#[^\n]*$/gm, '')
  // unifică ghilimelele simple cu duble
  v = v.replace(/'/g, '"')
  // unifică quote-uri „ezotice" (smart quotes)
  v = v.replace(/[\u2018\u2019]/g, '"').replace(/[\u201C\u201D]/g, '"')
  // șterge TOATE whitespace (inclusiv newlines)
  v = v.replace(/\s+/g, '')
  // elimină ; final
  v = v.replace(/;+$/g, '')
  return v.toLowerCase()
}

/**
 * Detectează dacă un răspuns „arată ca cod" (conține =, paranteze, ghilimele, etc.)
 */
function looksLikeCode(s) {
  if (!s) return false
  return /[=()[\]{}"';:]|\bdef\b|\bfunction\b|\blet\b|\bconst\b|\bvar\b|\bprint\b|\bconsole\b/.test(String(s))
}

/**
 * Match-uire flexibilă: returnează true dacă oricare formă de normalizare se potrivește.
 * Suportă mai multe răspunsuri acceptate separate prin `|` în correctAnswer.
 * Ex: correctAnswer = `nume = "Maria"|name = "Maria"` acceptă oricare variantă.
 */
function flexibleMatch(correctAnswer, studentAnswer) {
  if (correctAnswer == null || studentAnswer == null) return false
  const accepted = String(correctAnswer).split('|').map(s => s.trim()).filter(Boolean)
  if (accepted.length === 0) return false

  const studentNorm = normalize(studentAnswer)
  const studentLoose = looseCodeNormalize(studentAnswer)

  for (const acc of accepted) {
    const accNorm = normalize(acc)
    if (accNorm === studentNorm) return true
    // dacă răspunsul așteptat conține cod, comparăm și „lejer" (fără spații)
    if (looksLikeCode(acc) || looksLikeCode(studentAnswer)) {
      const accLoose = looseCodeNormalize(acc)
      if (accLoose && accLoose === studentLoose) return true
    }
  }
  return false
}

/**
 * Verifică automat răspunsul elevului în funcție de tipul problemei.
 * @param {Object} problem - obiectul Problem din DB
 * @param {string} answer - răspunsul elevului
 * @returns {{ isCorrect: boolean, normalizedAnswer: string }}
 */
export function verifyAnswer(problem, answer) {
  const normalizedAnswer = normalize(answer)

  if (!problem) return { isCorrect: false, normalizedAnswer }

  switch (problem.type) {
    case 'MULTIPLE_CHOICE': {
      // correctAnswer poate fi index ("0") sau textul opțiunii
      const correct = normalize(problem.correctAnswer)
      if (correct === normalizedAnswer) return { isCorrect: true, normalizedAnswer }
      // încercăm și mapping prin index
      const idx = parseInt(problem.correctAnswer, 10)
      if (!isNaN(idx) && problem.options?.[idx]) {
        return { isCorrect: normalize(problem.options[idx]) === normalizedAnswer, normalizedAnswer }
      }
      return { isCorrect: false, normalizedAnswer }
    }
    case 'SHORT_ANSWER':
    case 'INPUT_OUTPUT': {
      return {
        isCorrect: flexibleMatch(problem.correctAnswer, answer),
        normalizedAnswer,
      }
    }
    case 'MULTIPLE_SELECT': {
      // correctAnswer is a JSON array string; answer is JSON string of selected options
      let correct = []
      let selected = []
      try { correct = JSON.parse(problem.correctAnswer || '[]').map(normalize) } catch {}
      try { selected = (Array.isArray(answer) ? answer : JSON.parse(answer || '[]')).map(normalize) } catch {}
      if (correct.length === 0) return { isCorrect: false, partialGrade: 0, normalizedAnswer: String(answer) }
      const correctHits = selected.filter(s => correct.includes(s)).length
      const wrongHits = selected.filter(s => !correct.includes(s)).length
      const partialGrade = Math.max(0, Math.round(((correctHits - wrongHits) / correct.length) * 100))
      const serialized = Array.isArray(answer) ? JSON.stringify(answer) : (answer || '[]')
      return { isCorrect: partialGrade >= 60, partialGrade, normalizedAnswer: serialized }
    }
    case 'CODING': {
      // Verificăm „lejer" — fără spații, ghilimele unificate, ; opțional, comentarii ignorate
      const expectedLoose = looseCodeNormalize(problem.correctAnswer)
      if (!expectedLoose) return { isCorrect: false, normalizedAnswer }
      // Suport pentru mai multe variante acceptate
      const variants = String(problem.correctAnswer).split('|').map(v => looseCodeNormalize(v)).filter(Boolean)
      const studentLoose = looseCodeNormalize(answer)
      const isCorrect = variants.some(v => v === studentLoose || studentLoose.includes(v))
      return { isCorrect, normalizedAnswer }
    }
    case 'ORDER_IMAGES': {
      // answer = JSON array de URL-uri în ordinea aleasă de elev
      // correct = problem.options (ordinea corectă setată de admin)
      let studentOrder = []
      try { studentOrder = JSON.parse(answer || '[]') } catch {}
      const correct = problem.options || []
      if (correct.length === 0) return { isCorrect: false, normalizedAnswer: String(answer) }
      const isCorrect = correct.length === studentOrder.length &&
        correct.every((url, i) => url === studentOrder[i])
      return { isCorrect, normalizedAnswer: String(answer) }
    }
    case 'FILL_IN': {
      let studentAnswers = []
      let correctAnswers = []
      try { studentAnswers = JSON.parse(answer || '[]') } catch {}
      try { correctAnswers = JSON.parse(problem.correctAnswer || '[]') } catch {}
      if (correctAnswers.length === 0) return { isCorrect: false, normalizedAnswer: String(answer) }
      const correctCount = correctAnswers.filter((ans, i) =>
        flexibleMatch(ans, studentAnswers[i] || '')
      ).length
      const partialGrade = Math.round((correctCount / correctAnswers.length) * 100)
      return { isCorrect: partialGrade === 100, partialGrade, normalizedAnswer: String(answer) }
    }
    case 'DRAG_BLOCKS':
    case 'DRAG_INLINE': {
      // answer = JSON array de tokens plasate în sloturi/blanks (in ordine)
      // correctAnswer = JSON array cu ordinea corectă a token-urilor
      let studentSlots = []
      let correctSlots = []
      try { studentSlots = JSON.parse(answer || '[]') } catch {}
      try { correctSlots = JSON.parse(problem.correctAnswer || '[]') } catch {}
      if (correctSlots.length === 0) return { isCorrect: false, normalizedAnswer: String(answer) }
      const correctCount = correctSlots.filter((tok, i) =>
        flexibleMatch(tok, studentSlots[i] || '')
      ).length
      const partialGrade = Math.round((correctCount / correctSlots.length) * 100)
      return { isCorrect: partialGrade === 100, partialGrade, normalizedAnswer: String(answer) }
    }
    default:
      return { isCorrect: false, normalizedAnswer }
  }
}

/**
 * Selectează random N probleme dintr-o listă, evitând cele recent rezolvate.
 * Distribuie pe dificultăți dacă se specifică `mix`.
 *
 * @param {Object[]} candidates - probleme candidat (deja filtrate pe topic etc.)
 * @param {Object} opts
 * @param {number} opts.count - câte probleme vrem
 * @param {Set<string>} [opts.recentProblemIds] - ID-uri rezolvate recent (de evitat)
 * @param {{ EASY?: number, MEDIUM?: number, HARD?: number }} [opts.mix] - mix dificultăți
 * @returns {Object[]} probleme selectate
 */
export function smartRandomSelect(candidates, { count, recentProblemIds = new Set(), mix } = {}) {
  if (!Array.isArray(candidates) || candidates.length === 0) return []

  // Separăm preferate (nerezolvate recent) vs "fallback"
  const fresh = candidates.filter(p => !recentProblemIds.has(p.id))
  const stale = candidates.filter(p => recentProblemIds.has(p.id))

  const pickFrom = (arr, n) => {
    const copy = [...arr]
    const out = []
    while (out.length < n && copy.length > 0) {
      const idx = Math.floor(Math.random() * copy.length)
      out.push(copy.splice(idx, 1)[0])
    }
    return out
  }

  // Cu mix: extragem din fiecare bucket pe rând
  if (mix && Object.values(mix).some(v => v > 0)) {
    const buckets = {
      EASY: fresh.filter(p => p.difficulty === 'EASY'),
      MEDIUM: fresh.filter(p => p.difficulty === 'MEDIUM'),
      HARD: fresh.filter(p => p.difficulty === 'HARD'),
    }
    const result = []
    for (const diff of ['EASY', 'MEDIUM', 'HARD']) {
      const want = mix[diff] || 0
      result.push(...pickFrom(buckets[diff], want))
    }
    // Dacă nu avem destule, completăm din rest
    if (result.length < count) {
      const remaining = fresh.filter(p => !result.includes(p))
      result.push(...pickFrom(remaining, count - result.length))
    }
    if (result.length < count) {
      result.push(...pickFrom(stale.filter(p => !result.includes(p)), count - result.length))
    }
    return result.slice(0, count)
  }

  // Fără mix: random simplu, întâi fresh apoi stale
  const result = pickFrom(fresh, count)
  if (result.length < count) {
    result.push(...pickFrom(stale, count - result.length))
  }
  return result
}

/**
 * Calculează statistici de tracking pentru un elev.
 * @param {Object[]} attempts - listă de ProblemAttempt cu include problem
 * @returns {{ total, correct, accuracy, byTopic: { topic, total, correct, accuracy }[], weakTopics: string[] }}
 */
export function computeStudentStats(attempts) {
  const total = attempts.length
  const correct = attempts.filter(a => a.isCorrect).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  const byTopicMap = new Map()
  for (const a of attempts) {
    const topic = a.problem?.topic || 'unknown'
    const cur = byTopicMap.get(topic) || { topic, total: 0, correct: 0 }
    cur.total += 1
    if (a.isCorrect) cur.correct += 1
    byTopicMap.set(topic, cur)
  }
  const byTopic = [...byTopicMap.values()].map(t => ({
    ...t,
    accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
  }))

  // Slabe = topic-uri cu cel puțin 2 încercări și accuracy < 60%
  const weakTopics = byTopic
    .filter(t => t.total >= 2 && t.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .map(t => t.topic)

  return { total, correct, accuracy, byTopic, weakTopics }
}

/**
 * Sugerează nivelul de dificultate următor în funcție de istoric.
 * Reguli:
 *  - 3 EASY consecutive corecte → MEDIUM
 *  - 3 MEDIUM consecutive corecte → HARD
 *  - 2 greșeli consecutive la HARD → MEDIUM
 *  - 2 greșeli consecutive la MEDIUM → EASY
 *  - altfel: rămâne pe nivelul curent
 *
 * @param {Array} recentAttempts - lista de attempts/submissions ordonate desc după dată
 *                                  fiecare element trebuie să aibă { isCorrect, problem: { difficulty } }
 * @param {string} currentDifficulty - 'EASY' | 'MEDIUM' | 'HARD'
 * @returns {{ next: string, reason: string }}
 */
export function suggestNextDifficulty(recentAttempts = [], currentDifficulty = 'EASY') {
  const sameLevel = recentAttempts.filter(a => a.problem?.difficulty === currentDifficulty).slice(0, 5)

  // 3 consecutive corecte la nivelul curent → urcă
  const last3 = sameLevel.slice(0, 3)
  if (last3.length === 3 && last3.every(a => a.isCorrect)) {
    if (currentDifficulty === 'EASY') return { next: 'MEDIUM', reason: '3 EASY corecte consecutiv → trecem la MEDIUM' }
    if (currentDifficulty === 'MEDIUM') return { next: 'HARD', reason: '3 MEDIUM corecte consecutiv → trecem la HARD' }
  }

  // 2 consecutive greșite → coboară
  const last2 = sameLevel.slice(0, 2)
  if (last2.length === 2 && last2.every(a => !a.isCorrect)) {
    if (currentDifficulty === 'HARD') return { next: 'MEDIUM', reason: '2 HARD greșite → revenim la MEDIUM' }
    if (currentDifficulty === 'MEDIUM') return { next: 'EASY', reason: '2 MEDIUM greșite → revenim la EASY' }
  }

  return { next: currentDifficulty, reason: 'Continuă pe același nivel' }
}

/**
 * Generează un slug URL-friendly dintr-un titlu.
 */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

