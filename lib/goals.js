// lib/goals.js — pure helpers for the Dashboard's Goals widget: named target
// dates (midterms, finals, JLPT exams) with a countdown, independent of the
// day-to-day task list. Deliberately simple -- not tied to a course or
// lesson, no merge complexity needed (a user-edited list has no meaningful
// concurrent-edit case, so app/api/goals/route.js is last-write-wins, same
// as app/api/data/route.js).
export function newGoalId() {
  return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function sortGoals(goals) {
  return (goals || []).slice().sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
}

// Positive = days from now until the goal; 0 = today; negative = past.
export function daysUntil(dateISO, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateISO + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}

export function countdownLabel(dateISO, now = new Date()) {
  const n = daysUntil(dateISO, now);
  if (n < 0) return `${-n} day(s) ago`;
  if (n === 0) return 'today';
  if (n === 1) return 'tomorrow';
  return `in ${n} days`;
}
