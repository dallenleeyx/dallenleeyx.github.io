// lib/japanese/leakyQueue.js — pure "leaky" streak queue: a correct answer
// twice IN A ROW masters an item and retires it; a single miss doesn't
// restart anything (unlike cleanRunQueue) but does reset that item's streak
// to zero and "leaks" it back a few spots ahead (min(3, queue.length), not
// straight to the back) so it resurfaces soon rather than at the very end.
// Shared by Conjugation's "By form" drill and "Sentences" quiz -- the
// original app duplicated this logic between the two; this consolidates it.
// Session-only: unlike the vocab/grammar queues, nothing here is persisted
// or reported to an external progress store, matching the original's design
// (conjugation drilling is a lighter-weight, ungraded warm-up).
import { shuffle } from './masteryQueue';

export { shuffle };

export function buildLeakyQueue(items, shuffleOn) {
  const withStreak = items.map((item) => ({ ...item, streak: 0 }));
  const queue = shuffleOn ? shuffle(withStreak) : withStreak.slice();
  return {
    queue: queue.slice(1),
    current: queue[0] || null,
    masteredCount: 0,
    totalCount: withStreak.length,
  };
}

export function gradeLeakyQueue(state, isCorrect) {
  const { current, queue, masteredCount, totalCount } = state;
  if (!current) return state;
  let nextQueue = queue;
  let mastered = false;
  if (isCorrect) {
    const item = { ...current, streak: (current.streak || 0) + 1 };
    if (item.streak >= 2) {
      mastered = true;
    } else {
      nextQueue = [...queue, item];
    }
  } else {
    const item = { ...current, streak: 0 };
    const pos = Math.min(3, queue.length);
    nextQueue = [...queue.slice(0, pos), item, ...queue.slice(pos)];
  }
  return {
    queue: nextQueue.slice(1),
    current: nextQueue[0] || null,
    masteredCount: masteredCount + (mastered ? 1 : 0),
    totalCount,
  };
}

export function skipLeakyQueue(state) {
  const { current, queue } = state;
  if (!current) return state;
  const nextQueue = [...queue, current];
  return { ...state, queue: nextQueue.slice(1), current: nextQueue[0] || null };
}
