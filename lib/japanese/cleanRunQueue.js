// lib/japanese/cleanRunQueue.js — pure "clean run" queue: same twice-per-
// sitting counting as masteryQueue.js, but ANY miss ends the run immediately
// (the caller rebuilds the deck from scratch) rather than requeuing to the
// back. Used by Writing and Furigana. The miss is still banked as a weak
// word first, so "practice weak words" keeps learning from these modes even
// though the item never finishes its second pass.
import { buildMasteryQueue, shuffle } from './masteryQueue';

export { buildMasteryQueue as buildCleanRunQueue, shuffle };

// Returns { next, verdict, restart }. restart=true means the caller should
// rebuild the deck from scratch (via buildCleanRunQueue on the full item
// list) rather than trust `next` -- the run is over.
export function gradeCleanRunQueue(state, isCorrect) {
  const { current, queue, sessionItems, masteredCount, totalCount } = state;
  if (!current) return { next: state, verdict: null, restart: false };
  if (!isCorrect) {
    return { next: state, verdict: { item: current, mastered: false }, restart: true };
  }
  const item = { ...current, attempts: current.attempts + 1, correctAttempts: current.correctAttempts + 1 };
  let nextQueue = queue;
  let verdict = null;
  if (item.attempts < 2) {
    nextQueue = [...queue, item];
  } else {
    verdict = { item, mastered: true };
  }
  return {
    next: {
      sessionItems,
      queue: nextQueue.slice(1),
      current: nextQueue[0] || null,
      masteredCount: masteredCount + (verdict ? 1 : 0),
      totalCount,
    },
    verdict,
    restart: false,
  };
}
