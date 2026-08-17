// Same logic as web/lib/problem-scoring.js — must stay in sync.
const NON_MC_GRADES = [100, 50];

export function getAttemptGrades(problem) {
  if (!problem) return NON_MC_GRADES.slice();
  if (problem.type === 'MULTIPLE_CHOICE') {
    const n = Math.max(2, Array.isArray(problem.options) ? problem.options.length : 4);
    return Array.from({ length: n }, (_, i) =>
      Math.max(0, Math.round(100 * (n - 1 - i) / (n - 1)))
    );
  }
  return NON_MC_GRADES.slice();
}

export function getMaxAttempts(problem) {
  return getAttemptGrades(problem).length;
}

export function gradeForAttempt(problem, attemptNumber) {
  const grades = getAttemptGrades(problem);
  if (attemptNumber < 1) return grades[0];
  if (attemptNumber > grades.length) return 0;
  return grades[attemptNumber - 1];
}

export function applyHintPenalty(grade, hintUsed) {
  if (!hintUsed) return grade;
  return Math.max(0, grade - 10);
}
