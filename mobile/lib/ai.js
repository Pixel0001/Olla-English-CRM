// AI helpers for mobile — wrap the public /learn endpoints
import { api } from './api';

export const AI_PAYMENT_LOCK_MESSAGE =
  'Mr. Olla (AI) este disponibil doar pentru elevii cu abonament activ. Vorbește cu profesorul pentru a-ți activa accesul.';

export async function getAiUsage(token) {
  return api(`/api/public/learn/${token}/ai-grade`);
}

export async function gradeWithAi(token, { problemId, lessonId, code, output, source = 'lesson' }) {
  return api(`/api/public/learn/${token}/ai-grade`, {
    method: 'POST',
    body: JSON.stringify({ problemId, lessonId, code, output, source }),
  });
}

export async function getAiChat(token, problemId) {
  return api(`/api/public/learn/${token}/ai-chat?problemId=${encodeURIComponent(problemId)}`);
}

export async function postAiChat(token, { problemId, lessonId, question, code }) {
  return api(`/api/public/learn/${token}/ai-chat`, {
    method: 'POST',
    body: JSON.stringify({ problemId, lessonId, question, code }),
  });
}

export async function getAiStats(token) {
  return api(`/api/public/learn/${token}/ai-stats`);
}

export async function resetProblem(token, lessonId, problemId) {
  return api(`/api/public/learn/${token}/lesson/${lessonId}/reset-problem`, {
    method: 'POST',
    body: JSON.stringify({ problemId }),
  });
}
