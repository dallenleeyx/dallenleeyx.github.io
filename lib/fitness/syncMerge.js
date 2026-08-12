// lib/fitness/syncMerge.js — pure merge logic shared by the client sync
// provider and the PUT route, same rationale as japanese/syncMerge.js: two
// writers can touch this record independently (the web UI editing the plan
// or checking off today's workout, and the Apple Shortcut posting Health
// data straight to /api/fitness/health-sync) and both updates must survive
// a merge, not clobber each other.
//
// State shape: { plan: { updatedAt, days }, logs: { [dateISO]: { manual, health } } }
// `plan` is a single last-write-wins blob (edited rarely, from one place at
// a time). Each day's `logs` entry keeps `manual` (web UI: completed +
// logged sets) and `health` (Shortcut: Apple Health workout data) as
// SEPARATE last-write-wins sub-objects, each carrying its own updatedAt --
// so a Health sync push can never overwrite a manual log edit, or vice
// versa, even if they land in the same merge.
import { defaultDays } from './defaultPlan';

export function normalizeFitnessState(state) {
  const s = state && typeof state === 'object' ? state : {};
  const plan = s.plan && typeof s.plan === 'object' && s.plan.days
    ? { updatedAt: s.plan.updatedAt || 0, days: s.plan.days }
    : { updatedAt: 0, days: defaultDays() };
  const logs = s.logs && typeof s.logs === 'object' ? s.logs : {};
  return { plan, logs };
}

function pickNewer(a, b) {
  if (!a) return b || undefined;
  if (!b) return a;
  return (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
}

export function mergeFitnessState(a, b) {
  const na = normalizeFitnessState(a);
  const nb = normalizeFitnessState(b);

  const plan = (nb.plan.updatedAt || 0) > (na.plan.updatedAt || 0) ? nb.plan : na.plan;

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

  return { plan, logs };
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
