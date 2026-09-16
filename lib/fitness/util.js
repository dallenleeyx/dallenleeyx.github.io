// lib/fitness/util.js — small shared helpers (id generation, date
// formatting) used across the Fitness section. Replaces defaultPlan.js's
// day-key machinery now that the section no longer assumes a fixed
// Monday-Sunday template -- see programTemplate.js for the fixed weekly
// program and Schedule.jsx for the rolling plan that took its place.
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, n) {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

export function todayISO() {
  return toISO(new Date());
}

// normalizeSet — a logged set used to be just a bare rep count (a number).
// Sets now carry weight + reps + an optional free-text note (e.g. "failure"),
// so this reads either shape and always returns the new one, letting old
// already-logged numeric sets keep displaying correctly after the format
// change instead of needing a one-time data migration.
export function normalizeSet(raw) {
  if (raw == null) return { weight: null, reps: null, note: '' };
  if (typeof raw === 'number') return { weight: null, reps: raw, note: '' };
  return { weight: raw.weight ?? null, reps: raw.reps ?? null, note: raw.note || '' };
}
