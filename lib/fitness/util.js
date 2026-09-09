// lib/fitness/util.js — small shared helpers (id generation, date
// formatting) used across the Fitness section. Replaces defaultPlan.js's
// day-key machinery now that the section no longer assumes a fixed
// Monday-Sunday template -- see defaultWorkouts.js for the workout library
// and Schedule.jsx for the rolling plan that took its place.
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
