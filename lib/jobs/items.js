// lib/jobs/items.js — shared constants for the Jobs section. Statuses are a
// fixed short list rather than user-managed, since the whole point is a
// simple three-stage pipeline; add another stage here (e.g. "Rejected") if
// the pipeline ever needs one.
export const STATUSES = ['Not applied', 'Applied', 'Accepted'];

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
