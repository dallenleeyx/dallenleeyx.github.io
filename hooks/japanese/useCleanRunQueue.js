'use client';
// hooks/japanese/useCleanRunQueue.js — React wrapper around
// lib/japanese/cleanRunQueue.js, shared by Writing and Furigana.
//
// grade()'s result comes back through `lastResult` in the returned state,
// not a callback fired "after" setState() -- React does not guarantee a
// state updater passed to setState runs synchronously before the code
// following that call, so capturing an updater's local output into a
// variable and reading it immediately afterward is unreliable (confirmed
// empirically). Consumers should watch `lastResult` with a useEffect
// instead, which is guaranteed to run after the state commits.
import { useCallback, useState } from 'react';
import { buildCleanRunQueue, shuffle, gradeCleanRunQueue } from '../../lib/japanese/cleanRunQueue';

const EMPTY = { sessionItems: [], queue: [], current: null, masteredCount: 0, totalCount: 0, lastResult: null };

export function useCleanRunQueue() {
  const [state, setState] = useState(EMPTY);

  const start = useCallback((items, shuffleOn) => {
    setState({ ...buildCleanRunQueue(items, shuffleOn), lastResult: null });
  }, []);

  // lastResult is { verdict, restart } -- when restart is true, the run just
  // ended on a miss and the caller is expected to call start() again with a
  // fresh deck; this hook doesn't do that itself since it doesn't own
  // level/lesson/isolate-mode filtering.
  const grade = useCallback((isCorrect) => {
    setState((prev) => {
      const { next, verdict, restart } = gradeCleanRunQueue(prev, isCorrect);
      return { ...(restart ? prev : next), lastResult: { verdict, restart } };
    });
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
