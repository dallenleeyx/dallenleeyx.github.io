// lib/japanese/syncMerge.js — pure merge logic for the Japanese progress
// document. Ported from the original static site's js/sync.js merge
// functions (algorithm-for-algorithm for the parts that carry over), with
// the schema corrected against what Phases 4-8 actually built:
//
// - Dropped "grammar" (a legacy per-pattern correct/wrong map the original
//   itself says nothing writes to anymore -- an older grammar-practice
//   implementation predating the current SM-2 one) and "streak" (tracked in
//   the original but never displayed anywhere in its UI -- dead weight).
// - Added "writing" and "furigana": the original only ever synced
//   Flashcards' per-word progress under "vocab" -- Writing's and Furigana's
//   own per-word weak/mastered tracking was local-only, seemingly an
//   oversight rather than a deliberate choice (no comment explains why they
//   were excluded, unlike the deliberate scope decisions elsewhere in that
//   file). Our port gave all three modes equivalent progress stores
//   (VocabProgressContext, Phase 5), so all three now sync equivalently.
// - Split the original's single "mastery" (fc/kw/fg/gp lesson badges) into
//   "vocabMastery" ({fc,kw,fg}, owned by VocabProgressContext) and
//   "grammarMastery" (a flat gp map, owned by GrammarProgressContext) --
//   those two contexts are mounted independently (Vocab/Grammar sections
//   are always-mounted siblings, not sequential owners of one blob), so
//   each needs its own sync section rather than fighting over one key.
// - The plan/planDone/planDaily/planEdits bundle (all owned by PlanContext)
//   is grouped under one "planBundle" key, mirroring how the original
//   pushed all four from a single syncContributors entry.
//
// No dependencies beyond plain objects, so this runs identically
// server-side (the PUT route's read-merge-write against Redis) and
// client-side (merging a polled server snapshot against in-memory local
// state) -- merge semantics can never drift between the two call sites.

export const SYNC_SECTIONS = ['vocab', 'writing', 'furigana', 'vocabMastery', 'grammarMastery', 'srs', 'planBundle'];

const EMPTY_PLAN_BUNDLE = { plan: {}, planDone: {}, planDaily: {}, planEdits: { done: {}, daily: {} } };

export function normalizeSyncState(state) {
  const empty = { vocab: {}, writing: {}, furigana: {}, vocabMastery: {}, grammarMastery: {}, srs: {}, planBundle: EMPTY_PLAN_BUNDLE };
  if (!state || typeof state !== 'object') return empty;
  if (!SYNC_SECTIONS.some((k) => k in state)) return empty;
  const out = {};
  SYNC_SECTIONS.forEach((k) => {
    out[k] = state[k] && typeof state[k] === 'object' ? state[k] : empty[k];
  });
  out.planBundle = {
    plan: out.planBundle.plan && typeof out.planBundle.plan === 'object' ? out.planBundle.plan : {},
    planDone: out.planBundle.planDone && typeof out.planBundle.planDone === 'object' ? out.planBundle.planDone : {},
    planDaily: out.planBundle.planDaily && typeof out.planBundle.planDaily === 'object' ? out.planBundle.planDaily : {},
    planEdits: {
      done: (out.planBundle.planEdits || {}).done || {},
      daily: (out.planBundle.planEdits || {}).daily || {},
    },
  };
  return out;
}

// Vocab/writing/furigana progress maps: per-word stats keyed by wordId.
// Compares total study attempts instead of just timestamps, so a device
// whose clock is a few seconds behind still wins if it has more practice
// attempts recorded. (Current recordResult() stores {mastered, weak,
// lastSeen} with no correct/wrong counters, so in practice this always
// falls through to the lastSeen comparison below -- kept verbatim from the
// original rather than trimmed, since it's harmless and matches an older
// stats shape the merge still needs to tolerate in old imported data.)
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

// Lesson badges, grouped by mode ({fc: {...}, kw: {...}, fg: {...}}): a pass
// earned on any device is a pass, so this is a straight union per mode.
export function mergeMastery(localM, remoteM) {
  const out = {};
  const modes = new Set(Object.keys(localM || {}).concat(Object.keys(remoteM || {})));
  modes.forEach((mode) => {
    out[mode] = mergeBadgeMap((localM || {})[mode], (remoteM || {})[mode]);
  });
  return out;
}

// A flat lesson-passed badge map (level::lesson -> true): union, since a
// badge can only ever be earned, never revoked by normal use.
export function mergeBadgeMap(localMap, remoteMap) {
  return { ...(localMap || {}), ...(remoteMap || {}) };
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
  return {
    vocab: mergeProgressMaps(local.vocab, remote.vocab),
    writing: mergeProgressMaps(local.writing, remote.writing),
    furigana: mergeProgressMaps(local.furigana, remote.furigana),
    vocabMastery: mergeMastery(local.vocabMastery, remote.vocabMastery),
    grammarMastery: mergeBadgeMap(local.grammarMastery, remote.grammarMastery),
    srs: mergeSrs(local.srs, remote.srs),
    planBundle: {
      plan: mergePlanSettings(local.planBundle.plan, remote.planBundle.plan),
      planEdits: mergePlanEdits(local.planBundle.planEdits, remote.planBundle.planEdits),
      planDone: mergeStamped(
        local.planBundle.planDone,
        remote.planBundle.planDone,
        local.planBundle.planEdits.done,
        remote.planBundle.planEdits.done
      ),
      planDaily: mergePlanDaily(
        local.planBundle.planDaily,
        remote.planBundle.planDaily,
        local.planBundle.planEdits.daily,
        remote.planBundle.planEdits.daily
      ),
    },
  };
}
