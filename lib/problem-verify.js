/**
 * Pure, client-safe answer verification.
 * Same algorithm as `lib/problem-utils.js#verifyAnswer` but without the
 * `crypto` import — safe to bundle into client components.
 *
 * Used by LessonRunner to give instant feedback for non-coding problems
 * before the network /submit call returns.
 */

function normalize(s) {
  if (s === null || s === undefined) return ''
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ')
}

function looseCodeNormalize(s) {
  if (s === null || s === undefined) return ''
  let v = String(s)
  v = v.replace(/\s*\/\/[^\n]*$/gm, '').replace(/\s*#[^\n]*$/gm, '')
  v = v.replace(/'/g, '"')
  v = v.replace(/[\u2018\u2019]/g, '"').replace(/[\u201C\u201D]/g, '"')
  v = v.replace(/\s+/g, '')
  v = v.replace(/;+$/g, '')
  return v.toLowerCase()
}

function looksLikeCode(s) {
  if (!s) return false
  return /[=()[\]{}"';:]|\bdef\b|\bfunction\b|\blet\b|\bconst\b|\bvar\b|\bprint\b|\bconsole\b/.test(String(s))
}

function flexibleMatch(correctAnswer, studentAnswer) {
  if (correctAnswer == null || studentAnswer == null) return false
  const accepted = String(correctAnswer).split('|').map(s => s.trim()).filter(Boolean)
  if (accepted.length === 0) return false

  const studentNorm = normalize(studentAnswer)
  const studentLoose = looseCodeNormalize(studentAnswer)

  for (const acc of accepted) {
    const accNorm = normalize(acc)
    if (accNorm === studentNorm) return true
    if (looksLikeCode(acc) || looksLikeCode(studentAnswer)) {
      const accLoose = looseCodeNormalize(acc)
      if (accLoose && accLoose === studentLoose) return true
    }
  }
  return false
}

export function verifyAnswerLocal(problem, answer) {
  const normalizedAnswer = normalize(answer)
  if (!problem) return { isCorrect: false, normalizedAnswer }

  switch (problem.type) {
    case 'MULTIPLE_CHOICE': {
      const correct = normalize(problem.correctAnswer)
      if (correct === normalizedAnswer) return { isCorrect: true, normalizedAnswer }
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
      // correctAnswer is stored as JSON array, e.g. '["opt1","opt3"]'
      // answer is either a JS array or a JSON string of the selected options
      let correct = []
      let selected = []
      try { correct = JSON.parse(problem.correctAnswer || '[]').map(normalize) } catch {}
      try { selected = (Array.isArray(answer) ? answer : JSON.parse(answer || '[]')).map(normalize) } catch {}
      if (correct.length === 0) return { isCorrect: false, partialGrade: 0, normalizedAnswer }
      const correctHits = selected.filter(s => correct.includes(s)).length
      const wrongHits = selected.filter(s => !correct.includes(s)).length
      const partialGrade = Math.max(0, Math.round(((correctHits - wrongHits) / correct.length) * 100))
      const serialized = Array.isArray(answer) ? JSON.stringify(answer) : (answer || '[]')
      return { isCorrect: partialGrade >= 60, partialGrade, normalizedAnswer: serialized }
    }
    case 'CODING': {
      const expectedLoose = looseCodeNormalize(problem.correctAnswer)
      if (!expectedLoose) return { isCorrect: false, normalizedAnswer }
      const variants = String(problem.correctAnswer).split('|').map(v => looseCodeNormalize(v)).filter(Boolean)
      const studentLoose = looseCodeNormalize(answer)
      const isCorrect = variants.some(v => v === studentLoose || studentLoose.includes(v))
      return { isCorrect, normalizedAnswer }
    }
    case 'FILL_IN':
    case 'DRAG_BLOCKS':
    case 'DRAG_INLINE': {
      let studentArr = []
      let correctArr = []
      try { studentArr = JSON.parse(Array.isArray(answer) ? JSON.stringify(answer) : (answer || '[]')) } catch {}
      try { correctArr = JSON.parse(problem.correctAnswer || '[]') } catch {}
      if (correctArr.length === 0) return { isCorrect: false, normalizedAnswer }
      const hits = correctArr.filter((tok, i) => normalize(tok) === normalize(studentArr[i] || '')).length
      const partialGrade = Math.round((hits / correctArr.length) * 100)
      return { isCorrect: partialGrade === 100, partialGrade, normalizedAnswer: JSON.stringify(studentArr) }
    }
    default:
      return { isCorrect: false, normalizedAnswer }
  }
}
