// Sistem de punctaj degresiv pentru problemele din lecții
//
// Reguli:
// - MULTIPLE_CHOICE cu N opțiuni: N încercări, formula liniară: 100 → 0
//   ex: 4 opțiuni → 100, 67, 33, 0
//   ex: 5 opțiuni → 100, 75, 50, 25, 0
//   ex: 3 opțiuni → 100, 50, 0
//   ex: 2 opțiuni → 100, 0
// - Toate celelalte tipuri (SHORT_ANSWER, INPUT_OUTPUT, CODING): 4 încercări
//   distribuție: 100, 75, 50, 25  (la a 4-a greşit → „Vezi rezolvarea" 0p)
// - Hint apăsat: −10p din scorul final, o singură utilizare per problemă
// - „Vezi rezolvarea": forțează 0p, blochează problema (nu se mai poate reîncerca)

const NON_MC_GRADES = [100, 75, 50, 25]

export function getAttemptGrades(problem) {
  if (!problem) return NON_MC_GRADES.slice()
  if (problem.type === 'MULTIPLE_CHOICE') {
    const n = Math.max(2, Array.isArray(problem.options) ? problem.options.length : 4)
    // Distribuție liniară: 100 la 1, 0 la n
    return Array.from({ length: n }, (_, i) => Math.max(0, Math.round(100 * (n - 1 - i) / (n - 1))))
  }
  return NON_MC_GRADES.slice()
}

export function getMaxAttempts(problem) {
  return getAttemptGrades(problem).length
}

export function gradeForAttempt(problem, attemptNumber) {
  const grades = getAttemptGrades(problem)
  if (attemptNumber < 1) return grades[0]
  if (attemptNumber > grades.length) return 0
  return grades[attemptNumber - 1]
}

export function applyHintPenalty(grade, hintUsed) {
  if (!hintUsed) return grade
  return Math.max(0, grade - 10)
}
