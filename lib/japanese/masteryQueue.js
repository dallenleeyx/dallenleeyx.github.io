// lib/japanese/masteryQueue.js — pure "twice per sitting, both correct
// masters" queue algorithm, ported from app.js's gradeCurrent (Flashcards)
// and reused by Grammar Practice (Phase 6). Every item gets exactly two
// presentations per sitting: the first grade always requeues to the back for
// its second showing; the second presentation is the verdict -- both correct
// this sitting -> mastered, anything else -> weak. No cross-session streak,
// no partial credit -- every sitting is graded independently from persisted
// state passed in by the caller.

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildMasteryQueue(items, shuffleOn) {
  const withCounters = items.map((item) => ({ ...item, attempts: 0, correctAttempts: 0 }));
  const queue = shuffleOn ? shuffle(withCounters) : withCounters.slice();
  return {
    sessionItems: withCounters,
    queue: queue.slice(1),
    current: queue[0] || null,
    masteredCount: 0,
    totalCount: withCounters.length,
  };
}

// Returns { next, verdict }. verdict is null except on an item's second
// (deciding) presentation, when it's { item, mastered }.
export function gradeMasteryQueue(state, isCorrect) {
  const { current, queue, sessionItems, masteredCount, totalCount } = state;
  if (!current) return { next: state, verdict: null };
  const item = { ...current, attempts: current.attempts + 1, correctAttempts: current.correctAttempts + (isCorrect ? 1 : 0) };
  let nextQueue = queue;
  let verdict = null;
  if (item.attempts < 2) {
    nextQueue = [...queue, item];
  } else {
    verdict = { item, mastered: item.correctAttempts === 2 };
  }
  return {
    next: {
      sessionItems,
      queue: nextQueue.slice(1),
      current: nextQueue[0] || null,
      masteredCount: masteredCount + (verdict?.mastered ? 1 : 0),
      totalCount,
    },
    verdict,
  };
}

export function skipMasteryQueue(state) {
  const { current, queue } = state;
  if (!current) return state;
  const nextQueue = [...queue, current];
  return { ...state, queue: nextQueue.slice(1), current: nextQueue[0] || null };
}

// Call after an item finishes both exposures this session. sessionItems is
// the full deck the session started with (not the live queue, which empties
// as you go), so this can tell whether every word from this item's lesson
// has now also finished, all correct.
export function isLessonComplete(sessionItems, level, lesson) {
  if (lesson === undefined) return false;
  const lessonItems = sessionItems.filter((i) => i.level === level && i.lesson === lesson);
  if (!lessonItems.length) return false;
  return lessonItems.every((i) => i.attempts >= 2 && i.correctAttempts === 2);
}
