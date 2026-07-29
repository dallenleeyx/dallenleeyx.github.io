'use client';
// hooks/japanese/useMasteryQueue.js — React wrapper around
// lib/japanese/masteryQueue.js's pure queue, shared by Flashcards and (in a
// later phase) Grammar Practice.
import { useCallback, useState } from 'react';
import { buildMasteryQueue, gradeMasteryQueue, skipMasteryQueue, shuffle } from '../../lib/japanese/masteryQueue';

const EMPTY = { sessionItems: [], queue: [], current: null, masteredCount: 0, totalCount: 0 };

export function useMasteryQueue() {
  const [state, setState] = useState(EMPTY);

  const start = useCallback((items, shuffleOn) => {
    setState(buildMasteryQueue(items, shuffleOn));
  }, []);

  const grade = useCallback((isCorrect, onVerdict) => {
    // The updater function must stay pure (no calls into other components'
    // setState) -- capture the verdict into a local variable here, then fire
    // the callback afterward, once this update itself is done.
    let verdictOut = null;
    setState((prev) => {
      const { next, verdict } = gradeMasteryQueue(prev, isCorrect);
      verdictOut = verdict;
      return next;
    });
    if (verdictOut && onVerdict) onVerdict(verdictOut);
  }, []);

  const skip = useCallback(() => {
    setState((prev) => skipMasteryQueue(prev));
  }, []);

  const reshuffleQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: shuffle(prev.queue) }));
  }, []);

  return { ...state, start, grade, skip, reshuffleQueue };
}
