// Helpers comune pentru toate seed-urile de module
// Fiecare problemă: { title, type, difficulty, description, options?, correctAnswer, hint?, explanation, points?, topic, tags? }

export function mc(title, description, options, correct, explanation, opts = {}) {
  return {
    title,
    type: 'MULTIPLE_CHOICE',
    difficulty: opts.difficulty || 'EASY',
    description,
    options,
    correctAnswer: correct,
    hint: opts.hint || null,
    explanation,
    points: opts.points || 10,
    topic: opts.topic,
    tags: opts.tags || [],
    estimatedTime: opts.estimatedTime || 3,
  }
}

export function sa(title, description, correct, explanation, opts = {}) {
  return {
    title,
    type: 'SHORT_ANSWER',
    difficulty: opts.difficulty || 'EASY',
    description,
    options: [],
    correctAnswer: correct,
    hint: opts.hint || null,
    explanation,
    points: opts.points || 15,
    topic: opts.topic,
    tags: opts.tags || [],
    estimatedTime: opts.estimatedTime || 5,
  }
}

export function io(title, description, expectedOutput, explanation, opts = {}) {
  return {
    title,
    type: 'INPUT_OUTPUT',
    difficulty: opts.difficulty || 'MEDIUM',
    description,
    options: [],
    correctAnswer: expectedOutput,
    hint: opts.hint || null,
    explanation,
    points: opts.points || 20,
    topic: opts.topic,
    tags: opts.tags || [],
    estimatedTime: opts.estimatedTime || 10,
    starterCode: opts.starterCode || null,
    language: opts.language || null,
  }
}

export function code(title, description, language, starter, explanation, opts = {}) {
  return {
    title,
    type: 'CODING',
    difficulty: opts.difficulty || 'MEDIUM',
    description,
    options: [],
    correctAnswer: opts.correctAnswer || null,
    hint: opts.hint || null,
    explanation,
    points: opts.points || 25,
    topic: opts.topic,
    tags: opts.tags || [],
    estimatedTime: opts.estimatedTime || 15,
    starterCode: starter,
    language,
  }
}
