'use client';
// hooks/japanese/useGrammarPractice.js — Grammar Practice's queue, composing
// the shared masteryQueue algorithm (same "twice per sitting, both correct
// masters it" rule as Flashcards) with SM-2 scheduling gated to an item's
// FIRST attempt this run only -- the second exposure is reinforcement and
// must not reschedule the card.
//
// grade()'s result comes back through `lastGrade` in the returned state, not
// a callback fired "after" setState() -- React does not guarantee a state
// updater passed to setState runs synchronously before the code following
// that call, so capturing an updater's local output into a variable and
// reading it immediately afterward is unreliable (confirmed empirically).
// Consumers should watch `lastGrade` with a useEffect instead, which is
// guaranteed to run after the state commits.
import { useCallback, useState } from 'react';
import { buildMasteryQueue, gradeMasteryQueue, skipMasteryQueue, shuffle } from '../../lib/japanese/masteryQueue';

const EMPTY = { sessionItems: [], queue: [], current: null, masteredCount: 0, totalCount: 0, lastGrade: null };

export function useGrammarPractice() {
  const [state, setState] = useState(EMPTY);

  const start = useCallback((items, shuffleOn) => {
    setState({ ...buildMasteryQueue(items, shuffleOn), lastGrade: null });
  }, []);

  // lastGrade is { firstAttemptItem, isCorrect, verdict }: firstAttemptItem
  // is set only when this grade was the item's first this run (for SRS
  // scheduling); verdict is set only on the item's second (deciding)
  // presentation, same as useMasteryQueue.
  const grade = useCallback((isCorrect) => {
    setState((prev) => {
      if (!prev.current) return prev;
      const firstAttemptItem = prev.current.attempts === 0 ? prev.current : null;
      const { next, verdict } = gradeMasteryQueue(prev, isCorrect);
      return { ...next, lastGrade: { firstAttemptItem, isCorrect, verdict } };
    });
  }, []);

  const skip = useCallback(() => {
    setState((prev) => skipMasteryQueue(prev));
  }, []);

  const reshuffleQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: shuffle(prev.queue) }));
  }, []);

  return { ...state, start, grade, skip, reshuffleQueue };
}
