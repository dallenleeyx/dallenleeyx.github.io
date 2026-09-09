// lib/math/refs.js — resolves a \ref{...} key (typed inside a statement or
// proof) to the entry it points at. Matches against the entry's optional
// "number" field first (as written in the lecture notes, e.g. "4.6"), with
// a leading type word ("Theorem 4.6") stripped so either form works; falls
// back to matching the entry's name.
const TYPE_WORD_RE = /^(theorem|lemma|proposition|corollary|remark|example|definition)\s+/i;

export function normalizeRefKey(key) {
  return (key || '').trim().replace(TYPE_WORD_RE, '').trim().toLowerCase();
}

export function resolveRef(key, items) {
  const norm = normalizeRefKey(key);
  if (!norm) return null;
  const byNumber = items.find((it) => (it.number || '').trim().toLowerCase() === norm);
  if (byNumber) return byNumber;
  const rawLower = (key || '').trim().toLowerCase();
  return items.find((it) => (it.name || '').trim().toLowerCase() === rawLower) || null;
}
