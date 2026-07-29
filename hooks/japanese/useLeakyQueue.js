'use client';
// hooks/japanese/useLeakyQueue.js — React wrapper around
// lib/japanese/leakyQueue.js, shared by Conjugation's "By form" and
// "Sentences" modes. Nothing here needs to notify another component/context
// (masteredCount is purely internal, and this mode is deliberately not
// persisted), so unlike useMasteryQueue/useCleanRunQueue/useGrammarPractice
// there's no lastVerdict/lastResult side-channel to thread out.
import { useCallback, useState } from 'react';
import { buildLeakyQueue, gradeLeakyQueue, skipLeakyQueue, shuffle } from '../../lib/japanese/leakyQueue';

const EMPTY = { queue: [], current: null, masteredCount: 0, totalCount: 0 };

export function useLeakyQueue() {
  const [state, setState] = useState(EMPTY);

  const start = useCallback((items, shuffleOn) => {
    setState(buildLeakyQueue(items, shuffleOn));
  }, []);

  const grade = useCallback((isCorrect) => {
    setState((prev) => gradeLeakyQueue(prev, isCorrect));
  }, []);

  const skip = useCallback(() => {
    setState((prev) => skipLeakyQueue(prev));
  }, []);

  const reshuffleQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: shuffle(prev.queue) }));
  }, []);

  return { ...state, start, grade, skip, reshuffleQueue };
}
