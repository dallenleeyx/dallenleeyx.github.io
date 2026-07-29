'use client';
// hooks/japanese/useMasteryQueue.js — React wrapper around
// lib/japanese/masteryQueue.js's pure queue, shared by Flashcards and Grammar
// Practice (via useGrammarPractice, which composes this same algorithm with
// SRS scheduling).
//
// grade()'s result is threaded back out through `lastVerdict` in the
// returned state, NOT through a callback fired "after" setState() -- React
// does not guarantee a state updater passed to setState runs synchronously
// before the code following that call, so capturing an updater's local
// output into a variable and reading it immediately afterward is unreliable
// (confirmed empirically: the updater can run after that read, silently
// dropping the callback). Consumers should watch `lastVerdict` with a
// useEffect instead, which is guaranteed to run after the state commits.
import { useCallback, useState } from 'react';
import { buildMasteryQueue, gradeMasteryQueue, skipMasteryQueue, shuffle } from '../../lib/japanese/masteryQueue';

const EMPTY = { sessionItems: [], queue: [], current: null, masteredCount: 0, totalCount: 0, lastVerdict: null };

export function useMasteryQueue() {
  const [state, setState] = useState(EMPTY);

  const start = useCallback((items, shuffleOn) => {
    setState({ ...buildMasteryQueue(items, shuffleOn), lastVerdict: null });
  }, []);

  const grade = useCallback((isCorrect) => {
    setState((prev) => {
      const { next, verdict } = gradeMasteryQueue(prev, isCorrect);
      return { ...next, lastVerdict: verdict || null };
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
