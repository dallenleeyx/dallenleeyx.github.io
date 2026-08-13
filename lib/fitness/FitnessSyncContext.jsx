'use client';
// lib/fitness/FitnessSyncContext.jsx — cross-device poll-and-merge sync for
// the Fitness record, the same rationale as japanese/SyncContext.jsx: two
// writers (this browser tab, and the Apple Shortcut posting straight to
// /api/fitness/health-sync) can each add data that must survive a merge, so
// polling applies the SAME pure mergeFitnessState the PUT route uses
// server-side rather than just overwriting local state with the server's.
//
// Simpler than the Japanese provider: Fitness only ever has two top-level
// fields (plan, logs) shared by one component tree, so there's no need for
// Japanese's per-store "section" registry -- the mutators just live here.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { mergeFitnessState, normalizeFitnessState, stableStringify } from './syncMerge';

const POLL_MS = 5000;
const PUSH_DEBOUNCE_MS = 1200;

const FitnessSyncContext = createContext(null);

export function FitnessSyncProvider({ children }) {
  const [state, setState] = useState(() => normalizeFitnessState(null));
  const [loading, setLoading] = useState(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  const pushTimerRef = useRef(null);
  const inFlightRef = useRef(false);
  const dirtyRef = useRef(false);
  const readyRef = useRef(false);

  const doPush = useCallback(async () => {
    if (!readyRef.current || inFlightRef.current || !dirtyRef.current) return;
    dirtyRef.current = false;
    inFlightRef.current = true;
    try {
      const res = await fetch('/api/fitness', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: stateRef.current }),
      });
      if (!res.ok) throw new Error('push failed');
    } catch (e) {
      dirtyRef.current = true; // retry on the next scheduled push
    } finally {
      inFlightRef.current = false;
      if (dirtyRef.current) schedulePush();
    }
  }, []);

  function schedulePush() {
    dirtyRef.current = true;
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(doPush, PUSH_DEBOUNCE_MS);
  }

  const poll = useCallback(async () => {
    if (!readyRef.current) return;
    try {
      const res = await fetch('/api/fitness');
      if (!res.ok) return;
      const body = await res.json();
      const merged = mergeFitnessState(stateRef.current, body.state);
      setState(merged);
      setLoading(false);
      // If merging pulled in something the server didn't have (a local
      // edit made since the last successful push), push it back so it
      // isn't lost on the next poll.
      if (stableStringify(merged) !== stableStringify(normalizeFitnessState(body.state))) {
        schedulePush();
      }
    } catch (e) {
      // offline or a transient failure -- the next scheduled poll retries
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    readyRef.current = true;
    poll();
    const interval = setInterval(poll, POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') poll(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePlan = useCallback((days) => {
    setState((prev) => ({ ...prev, plan: { updatedAt: Date.now(), days } }));
    schedulePush();
  }, []);

  // patch: partial fields to merge into today's (or dateISO's) manual log,
  // e.g. { completed: true } or { exercises: [...] }.
  const updateLog = useCallback((dateISO, patch) => {
    setState((prev) => {
      const prevEntry = prev.logs[dateISO] || {};
      const nextManual = { ...(prevEntry.manual || {}), ...patch, updatedAt: Date.now() };
      return { ...prev, logs: { ...prev.logs, [dateISO]: { ...prevEntry, manual: nextManual } } };
    });
    schedulePush();
  }, []);

  return (
    <FitnessSyncContext.Provider value={{ state, loading, updatePlan, updateLog }}>
      {children}
    </FitnessSyncContext.Provider>
  );
}

export function useFitness() {
  const ctx = useContext(FitnessSyncContext);
  if (!ctx) throw new Error('useFitness must be used within FitnessSyncProvider');
  return ctx;
}
