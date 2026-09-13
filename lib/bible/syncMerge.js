// lib/bible/syncMerge.js — pure merge logic shared by the client sync
// provider and the PUT route, same rationale as math/syncMerge.js.
//
// State shape: { commentary: { [id]: { id, body, createdAt, updatedAt,
// deleted? } }, qt: { [dateISO]: { passage, comments, updatedAt } },
// prayerFocus: { text, updatedAt } }.
//
// `commentary` entries and each day's `qt` entry are independent per-key
// last-write-wins records, same as Math's items. `prayerFocus` (what you're
// praying for this season) changes rarely and isn't tied to a date, so it's
// a single whole-value LWW blob, same as Fitness's `workouts`/`schedule`.
export function normalizeBibleState(state) {
  const s = state && typeof state === 'object' ? state : {};
  return {
    commentary: s.commentary && typeof s.commentary === 'object' ? s.commentary : {},
    qt: s.qt && typeof s.qt === 'object' ? s.qt : {},
    prayerFocus: s.prayerFocus && typeof s.prayerFocus === 'object' ? s.prayerFocus : { text: '', updatedAt: 0 },
  };
}

function pickNewer(a, b) {
  if (!a) return b || undefined;
  if (!b) return a;
  return (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
}

function mergeByKey(a, b) {
  const merged = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const m = pickNewer(a[key], b[key]);
    if (m) merged[key] = m;
  }
  return merged;
}

export function mergeBibleState(a, b) {
  const na = normalizeBibleState(a);
  const nb = normalizeBibleState(b);
  return {
    commentary: mergeByKey(na.commentary, nb.commentary),
    qt: mergeByKey(na.qt, nb.qt),
    prayerFocus: (nb.prayerFocus.updatedAt || 0) > (na.prayerFocus.updatedAt || 0) ? nb.prayerFocus : na.prayerFocus,
  };
}

export function stableStringify(value) {
  return JSON.stringify(value, (key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val).sort().reduce((acc, k) => { acc[k] = val[k]; return acc; }, {});
    }
    return val;
  });
}
