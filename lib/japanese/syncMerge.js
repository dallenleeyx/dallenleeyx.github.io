// lib/japanese/syncMerge.js — pure merge logic for the Japanese progress
// document, ported verbatim (algorithm-for-algorithm) from the original
// static site's js/sync.js, with all Firebase/DOM-specific code stripped out.
// No dependencies beyond plain objects, so this runs identically server-side
// (the PUT route's read-merge-write against Redis) and client-side (merging a
// polled server snapshot against in-memory local state) -- merge semantics
// can never drift between the two call sites.

export const SYNC_SECTIONS = ['vocab', 'grammar', 'streak', 'plan', 'planDone', 'planDaily', 'planEdits', 'mastery', 'srs'];

// A very old document was just the bare vocab map; normalize legacy and
// partial shapes into the full 9-section shape so every merge function below
// can assume every key exists.
export function normalizeSyncState(state) {
  const empty = { vocab: {}, grammar: {}, streak: {}, plan: {}, planDone: {}, planDaily: {}, planEdits: { done: {}, daily: {} }, mastery: {}, srs: {} };
  if (!state || typeof state !== 'object') return empty;
  if (!SYNC_SECTIONS.some((k) => k in state)) return { ...empty, vocab: state };
  const out = {};
  SYNC_SECTIONS.forEach((k) => {
    out[k] = state[k] && typeof state[k] === 'object' ? state[k] : empty[k];
  });
  return out;
}

// Vocab/grammar progress maps: per-word right/wrong counters. Compares total
// study attempts instead of just timestamps, so a device whose clock is a few
// seconds behind still wins if it has more practice attempts recorded.
export function mergeProgressMaps(localMap, remoteMap) {
  const merged = Object.assign({}, localMap || {});

  Object.keys(remoteMap || {}).forEach((id) => {
    const r = remoteMap[id];
    const l = merged[id];

    if (!r) return;
    if (!l) {
      merged[id] = r;
      return;
    }

    const rTotal = (r.correct || 0) + (r.wrong || 0);
    const lTotal = (l.correct || 0) + (l.wrong || 0);

    if (rTotal > lTotal) {
      merged[id] = r;
    } else if (rTotal === 0 && lTotal > 0 && r.lastSeen && l.lastSeen && r.lastSeen > l.lastSeen) {
      merged[id] = r;
    } else if (rTotal === lTotal && r.lastSeen && (!l.lastSeen || r.lastSeen > l.lastSeen)) {
      merged[id] = r;
    } else if (typeof r === 'object' && typeof l === 'object' && !r.lastSeen && !l.lastSeen) {
      merged[id] = Object.assign({}, l, r);
    }
  });

  return merged;
}

// Per-key last-write-wins, using edit stamps recorded whenever a key is set
// OR unset. A plain union could only ever say "done", so unticking a lesson
// was undone again by the next snapshot; comparing stamps lets a fresh
// deletion beat a stale completion, while two devices completing DIFFERENT
// lessons still both survive since different keys never compete. Unstamped
// keys are legacy data and lose to anything stamped.
export function mergeStamped(localMap, remoteMap, localAt, remoteAt) {
  const out = {};
  const keys = new Set(
    Object.keys(localMap || {})
      .concat(Object.keys(remoteMap || {}))
      .concat(Object.keys(localAt || {}))
      .concat(Object.keys(remoteAt || {}))
  );
  keys.forEach((k) => {
    const lt = Number((localAt || {})[k]) || 0;
    const rt = Number((remoteAt || {})[k]) || 0;
    const isStamped = (localAt || {})[k] !== undefined || (remoteAt || {})[k] !== undefined;
    let winner;
    if (rt > lt) winner = remoteMap;
    else if (lt > rt) winner = localMap;
    else if (isStamped) {
      // Equal stamps on a key somebody deliberately edited means we are
      // seeing our own write come back. If either side lacks the key, that
      // absence IS the edit, so absence has to win -- preferring the side
      // that still holds it is exactly what resurrected unticked lessons.
      winner =
        (localMap || {})[k] === undefined
          ? localMap
          : (remoteMap || {})[k] === undefined
          ? remoteMap
          : localMap;
    } else {
      winner = (localMap || {})[k] !== undefined ? localMap : remoteMap;
    }
    const v = (winner || {})[k];
    if (v !== undefined) out[k] = v;
  });
  return out;
}

export function mergeEditStamps(localAt, remoteAt) {
  const out = { ...(localAt || {}) };
  Object.keys(remoteAt || {}).forEach((k) => {
    out[k] = Math.max(Number(out[k]) || 0, Number(remoteAt[k]) || 0);
  });
  return out;
}

export function mergePlanEdits(l, r) {
  return {
    done: mergeEditStamps((l || {}).done, (r || {}).done),
    daily: mergeEditStamps((l || {}).daily, (r || {}).daily),
  };
}

// Habits are date -> habit id -> true. Flattened to "date::habit" so the same
// stamped last-write-wins applies, since these can be unticked too.
export function mergePlanDaily(localMap, remoteMap, localAt, remoteAt) {
  const flat = (m) => {
    const out = {};
    Object.keys(m || {}).forEach((d) => {
      Object.keys(m[d] || {}).forEach((h) => {
        if (m[d][h]) out[d + '::' + h] = true;
      });
    });
    return out;
  };
  const merged = mergeStamped(flat(localMap), flat(remoteMap), localAt, remoteAt);
  const out = {};
  Object.keys(merged).forEach((k) => {
    const i = k.indexOf('::');
    const d = k.slice(0, i);
    const h = k.slice(i + 2);
    (out[d] || (out[d] = {}))[h] = true;
  });
  return out;
}

// Plan settings (dates, pace) are a single coherent set rather than a map, so
// the newest edit wins outright. Only a genuine edit stamps updatedAt; a
// document written before that stamp existed has none and loses.
export function mergePlanSettings(localPlan, remotePlan) {
  const l = localPlan && typeof localPlan === 'object' ? localPlan : {};
  const r = remotePlan && typeof remotePlan === 'object' ? remotePlan : {};
  if (!Object.keys(r).length) return l;
  if (!Object.keys(l).length) return r;
  return (Number(r.updatedAt) || 0) > (Number(l.updatedAt) || 0) ? r : l;
}

// Lesson badges: a pass earned on any device is a pass. Straight union of the
// per-mode maps, since a badge can only ever be earned, never revoked.
export function mergeMastery(localM, remoteM) {
  const out = {};
  const modes = new Set(Object.keys(localM || {}).concat(Object.keys(remoteM || {})));
  modes.forEach((mode) => {
    out[mode] = { ...((localM || {})[mode] || {}), ...((remoteM || {})[mode] || {}) };
  });
  return out;
}

// Review schedule: per question, keep whichever copy is due SOONER. That
// deliberately errs toward reviewing more rather than less -- if you lapsed a
// card on one device, taking the later due date would throw that lapse away,
// whereas an unnecessary extra review costs nothing.
export function mergeSrs(localS, remoteS) {
  const out = { ...(localS || {}) };
  Object.keys(remoteS || {}).forEach((qid) => {
    const a = out[qid];
    const b = remoteS[qid];
    if (!a) out[qid] = b;
    else if (typeof b.due === 'number' && typeof a.due === 'number') out[qid] = b.due < a.due ? b : a;
    else out[qid] = a;
  });
  return out;
}

// Key insertion order must never decide whether two states are "the same" --
// merge functions can build sections in different orders, so a plain
// JSON.stringify comparison would report identical states as different.
export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  return (
    '{' +
    Object.keys(value)
      .sort()
      .map((k) => JSON.stringify(k) + ':' + stableStringify(value[k]))
      .join(',') +
    '}'
  );
}

export function mergeSyncState(localState, remoteState) {
  const local = normalizeSyncState(localState);
  const remote = normalizeSyncState(remoteState);
  const merged = {
    vocab: mergeProgressMaps(local.vocab, remote.vocab),
    grammar: mergeProgressMaps(local.grammar, remote.grammar),
  };

  if (remote.streak && (!local.streak || (remote.streak.lastDate && (!local.streak.lastDate || remote.streak.lastDate > local.streak.lastDate)))) {
    merged.streak = remote.streak;
  } else {
    merged.streak = local.streak || {};
  }

  merged.mastery = mergeMastery(local.mastery, remote.mastery);
  merged.srs = mergeSrs(local.srs, remote.srs);
  merged.plan = mergePlanSettings(local.plan, remote.plan);
  merged.planEdits = mergePlanEdits(local.planEdits, remote.planEdits);
  merged.planDone = mergeStamped(
    local.planDone,
    remote.planDone,
    (local.planEdits || {}).done,
    (remote.planEdits || {}).done
  );
  merged.planDaily = mergePlanDaily(
    local.planDaily,
    remote.planDaily,
    (local.planEdits || {}).daily,
    (remote.planEdits || {}).daily
  );

  return merged;
}
