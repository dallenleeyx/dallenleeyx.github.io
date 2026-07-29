'use client';
// hooks/japanese/useCleanRunQueue.js — React wrapper around
// lib/japanese/cleanRunQueue.js, shared by Writing and Furigana.
import { useCallback, useState } from 'react';
import { buildCleanRunQueue, shuffle, gradeCleanRunQueue } from '../../lib/japanese/cleanRunQueue';

const EMPTY = { sessionItems: [], queue: [], current: null, masteredCount: 0, totalCount: 0 };

export function useCleanRunQueue() {
  const [state, setState] = useState(EMPTY);

  const start = useCallback((items, shuffleOn) => {
    setState(buildCleanRunQueue(items, shuffleOn));
  }, []);

  // onResult(verdict, restart) -- when restart is true, the run just ended
  // on a miss and the caller is expected to call start() again with a fresh
  // deck; this hook doesn't do that itself since it doesn't own level/lesson/
  // isolate-mode filtering.
  const grade = useCallback((isCorrect, onResult) => {
    // The updater function must stay pure (no calls into other components'
    // setState) -- capture the verdict/restart into local variables here,
    // then fire the callback afterward, once this update itself is done.
    let verdictOut = null;
    let restartOut = false;
    setState((prev) => {
      const { next, verdict, restart } = gradeCleanRunQueue(prev, isCorrect);
      verdictOut = verdict;
      restartOut = restart;
      return restart ? prev : next;
    });
    if (onResult) onResult(verdictOut, restartOut);
  }, []);

  const skip = useCallback(() => {
    setState((prev) => {
      if (!prev.current) return prev;
      const nextQueue = [...prev.queue, prev.current];
      return { ...prev, queue: nextQueue.slice(1), current: nextQueue[0] || null };
    });
  }, []);

  const reshuffleQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: shuffle(prev.queue) }));
  }, []);

  return { ...state, start, grade, skip, reshuffleQueue };
}
