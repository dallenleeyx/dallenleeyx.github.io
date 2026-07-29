// lib/japanese/timeline.js — pure date math and lesson-queue/pace logic for
// Home's study-timeline planner: a two-phase plan built backwards from the
// exam date. Phase 1 "learn" walks every vocab and grammar lesson once at a
// chosen daily pace; phase 2 "review" starts the day after the learning
// deadline and is recurring habits rather than new material.
//
// The daily checklist deliberately shows the NEXT undone lessons rather than
// whatever the calendar says should be done on this exact date -- miss a few
// days and a date-keyed plan strands you on lessons you'll never open again;
// this way you always get the next chunk, and "how far behind am I" is
// reported separately instead of being baked into the list.
//
// Framework-agnostic and testable: every function takes its inputs
// explicitly (plan/planDone/queues/now) rather than reading global or React
// state internally.

export const PLAN_LEVELS = ['N4', 'N3'];

export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Local midnight rather than Date.parse on the bare ISO string, which JS
// reads as UTC and would shift the day for anyone west of Greenwich.
export function parseISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function daysBetween(aISO, bISO) {
  return Math.round((parseISO(bISO) - parseISO(aISO)) / 86400000);
}

export function addDaysISO(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return todayISO(d);
}

export function fmtDate(iso, lang) {
  return parseISO(iso).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Day + month only -- used where the year is always obvious from a nearby
// countdown.
export function fmtDateShort(iso, lang) {
  return parseISO(iso).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-GB', { day: 'numeric', month: 'short' });
}

export function fmtShort(iso, lang) {
  return parseISO(iso).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function defaultPlan(startDate) {
  return {
    startDate: startDate || todayISO(),
    studyEnd: '2026-09-30',
    examDate: '2026-12-06',
    vocabPerDay: 3,
    grammarPerDay: 2,
  };
}

// Builds the lesson queue for one track (vocab or grammar) from its data
// file, ordered by level then lesson number -- derived from the data, not
// hard-coded, so a new lesson added to the data lengthens the plan
// automatically instead of silently falling outside it.
export function buildLessonQueue(data, kind, levels = PLAN_LEVELS) {
  const out = [];
  levels.forEach((lvl) => {
    const nums = [...new Set((data[lvl] || []).map((i) => i.lesson).filter((n) => n !== undefined))].sort((a, b) => a - b);
    nums.forEach((n) => out.push({ kind, level: lvl, lesson: n }));
  });
  return out;
}

export function taskKey(task) {
  return `${task.kind}:${task.level}:${task.lesson}`;
}

// planDone stores the ISO date a lesson was ticked, not just true, so the
// plan can tell "finished today's three" from "finished three at some
// point". Older saves used a bare `true`; those stay done, they just don't
// count toward today's quota (the safe direction to be wrong in).
export function isTaskDone(planDone, task) {
  return !!planDone[taskKey(task)];
}

export function doneOn(planDone, task) {
  const v = planDone[taskKey(task)];
  return typeof v === 'string' ? v : null;
}

export function doneTodayCount(queue, planDone, today) {
  return queue.filter((t) => doneOn(planDone, t) === today).length;
}

export function doneCount(queue, planDone) {
  return queue.filter((t) => isTaskDone(planDone, t)).length;
}

export function nextUndone(queue, planDone, n) {
  return queue.filter((t) => !isTaskDone(planDone, t)).slice(0, n);
}

// Everything still to do, split into day-sized chunks. Doing a fourth lesson
// today doesn't just tick a box -- it shortens the queue, so tomorrow starts
// one lesson further along.
export function projectDays(queueLeft, perDay, doneToday, dayCount) {
  const out = [];
  const todayQuota = Math.max(0, perDay - doneToday);
  out.push(queueLeft.slice(0, todayQuota));
  let i = todayQuota;
  for (let d = 1; d < dayCount; d++) {
    out.push(queueLeft.slice(i, i + perDay));
    i += perDay;
  }
  return out;
}

export function finishDateFor(leftCount, perDay, doneToday, today) {
  if (leftCount <= 0) return today;
  const todayQuota = Math.max(0, perDay - doneToday);
  if (leftCount <= todayQuota) return today;
  return addDaysISO(today, Math.ceil((leftCount - todayQuota) / Math.max(1, perDay)));
}

export function planPhase(plan, iso) {
  if (daysBetween(iso, plan.studyEnd) >= 0) return 'learn';
  if (daysBetween(iso, plan.examDate) >= 0) return 'review';
  return 'done';
}

// Spreads whatever is still undone across the days actually left -- the
// "recalculate pace" button's logic, exposed as a pure function of
// leftover counts and the deadline.
export function recalculatePace(vocabLeft, grammarLeft, today, studyEnd) {
  const daysLeft = Math.max(1, daysBetween(today, studyEnd) + 1);
  return {
    vocabPerDay: Math.max(1, Math.ceil(vocabLeft / daysLeft)),
    grammarPerDay: Math.max(1, Math.ceil(grammarLeft / daysLeft)),
  };
}

// Review-phase habits repeat daily (keyed by date, not by lesson). Labels
// are plain English -- this is chrome, not vocab/grammar content, but isn't
// routed through the i18n dictionary since Home's review-phase checklist is
// the only consumer and always renders in English regardless of the
// Japanese-content language toggle.
export const REVIEW_HABITS = [
  { id: 'srs', label: 'Clear due grammar reviews', view: 'grammar' },
  { id: 'weak', label: 'Practice weak words', view: 'vocab' },
  { id: 'furigana', label: 'Practice furigana', view: 'vocab' },
  { id: 'writing', label: 'Practice kanji writing', view: 'vocab' },
];
