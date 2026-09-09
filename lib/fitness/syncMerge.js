// lib/fitness/syncMerge.js — pure merge logic shared by the client sync
// provider and the PUT route, same rationale as japanese/syncMerge.js: two
// writers can touch this record independently (the web UI editing the
// workout library/schedule/log, and the Apple Shortcut posting Health data
// straight to /api/fitness/health-sync) and both updates must survive a
// merge, not clobber each other.
//
// State shape: { workouts: { updatedAt, list }, schedule: { updatedAt, days },
// logs: { [dateISO]: { manual, health } } }.
//
// `workouts` (the named-workout library, e.g. "Workout A") and `schedule`
// (which workout you're planning for each of the next few weeks) are each a
// single last-write-wins blob -- both are edited rarely, from one place at a
// time, so there's no need to diff/merge them field-by-field.
//
// Each day's `logs` entry keeps `manual` (web UI: weight, actual sets/reps
// logged, cardio) and `health` (Shortcut: Apple Health workout data) as
// SEPARATE last-write-wins sub-objects, each carrying its own updatedAt --
// so a Health sync push can never overwrite a manual log edit, or vice
// versa, even if they land in the same merge.
import { defaultWorkouts } from './defaultWorkouts';

export function normalizeFitnessState(state) {
  const s = state && typeof state === 'object' ? state : {};
  const workouts = s.workouts && typeof s.workouts === 'object' && Array.isArray(s.workouts.list)
    ? { updatedAt: s.workouts.updatedAt || 0, list: s.workouts.list }
    : { updatedAt: 0, list: defaultWorkouts() };
  const schedule = s.schedule && typeof s.schedule === 'object' && s.schedule.days
    ? { updatedAt: s.schedule.updatedAt || 0, days: s.schedule.days }
    : { updatedAt: 0, days: {} };
  const logs = s.logs && typeof s.logs === 'object' ? s.logs : {};
  return { workouts, schedule, logs };
}

function pickNewer(a, b) {
  if (!a) return b || undefined;
  if (!b) return a;
  return (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
}

export function mergeFitnessState(a, b) {
  const na = normalizeFitnessState(a);
  const nb = normalizeFitnessState(b);

  const workouts = (nb.workouts.updatedAt || 0) > (na.workouts.updatedAt || 0) ? nb.workouts : na.workouts;
  const schedule = (nb.schedule.updatedAt || 0) > (na.schedule.updatedAt || 0) ? nb.schedule : na.schedule;

  const logs = {};
  for (const date of new Set([...Object.keys(na.logs), ...Object.keys(nb.logs)])) {
    const la = na.logs[date] || {};
    const lb = nb.logs[date] || {};
    const manual = pickNewer(la.manual, lb.manual);
    const health = pickNewer(la.health, lb.health);
    if (manual || health) {
      logs[date] = {};
      if (manual) logs[date].manual = manual;
      if (health) logs[date].health = health;
    }
  }

  return { workouts, schedule, logs };
}

// Deterministic stringify (sorted keys) so two equivalent states compare
// equal regardless of key insertion order -- used to decide whether a
// client-side merge actually changed anything and needs pushing back.
export function stableStringify(value) {
  return JSON.stringify(value, (key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val).sort().reduce((acc, k) => { acc[k] = val[k]; return acc; }, {});
    }
    return val;
  });
}
