// lib/math/syncMerge.js — pure merge logic shared by the client sync
// provider and the PUT route, same rationale as japanese/syncMerge.js and
// fitness/syncMerge.js: two devices can each add or edit different entries
// between polls, and both must survive a merge rather than one overwriting
// the other.
//
// State shape: { items: { [id]: { course, lecture, type, name, statement,
// proof, updatedAt, deleted? } }, revised: { [`${course}::${lecture}`]: {
// done, updatedAt } } }. Each item -- and each lecture's revised flag -- is
// its own independent last-write-wins record, merged by key. Deletes are
// tombstones (deleted: true) rather than removing the key outright, so an
// older copy of the item arriving from another device during a merge can't
// resurrect something that was deliberately deleted -- the UI just filters
// out `deleted` items when rendering.
export function normalizeMathState(state) {
  const s = state && typeof state === 'object' ? state : {};
  return {
    items: s.items && typeof s.items === 'object' ? s.items : {},
    revised: s.revised && typeof s.revised === 'object' ? s.revised : {},
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

export function mergeMathState(a, b) {
  const na = normalizeMathState(a);
  const nb = normalizeMathState(b);
  return {
    items: mergeByKey(na.items, nb.items),
    revised: mergeByKey(na.revised, nb.revised),
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
