'use client';
// lib/math/MathSyncContext.jsx — cross-device poll-and-merge sync for the
// Math record, same rationale as FitnessSyncContext.jsx: applies the same
// pure mergeMathState the PUT route uses server-side, rather than just
// overwriting local state with the server's, so concurrent edits from two
// devices both survive.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { mergeMathState, normalizeMathState, stableStringify } from './syncMerge';
import { uid } from './items';

const POLL_MS = 5000;
const PUSH_DEBOUNCE_MS = 1200;

const MathSyncContext = createContext(null);

export function MathSyncProvider({ children }) {
  const [state, setState] = useState(() => normalizeMathState(null));
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
      const res = await fetch('/api/math', {
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
      const res = await fetch('/api/math');
      if (!res.ok) return;
      const body = await res.json();
      const merged = mergeMathState(stateRef.current, body.state);
      setState(merged);
      setLoading(false);
      if (stableStringify(merged) !== stableStringify(normalizeMathState(body.state))) {
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

  const addItem = useCallback((item) => {
    const id = uid();
    setState((prev) => ({ ...prev, items: { ...prev.items, [id]: { ...item, id, updatedAt: Date.now() } } }));
    schedulePush();
    return id;
  }, []);

  const addItems = useCallback((items) => {
    setState((prev) => {
      const now = Date.now();
      const next = { ...prev.items };
      items.forEach((item) => {
        const id = uid();
        next[id] = { ...item, id, updatedAt: now };
      });
      return { ...prev, items: next };
    });
    schedulePush();
  }, []);

  const updateItem = useCallback((id, patch) => {
    setState((prev) => {
      const existing = prev.items[id];
      if (!existing) return prev;
      return { ...prev, items: { ...prev.items, [id]: { ...existing, ...patch, updatedAt: Date.now() } } };
    });
    schedulePush();
  }, []);

  const deleteItem = useCallback((id) => {
    setState((prev) => {
      const existing = prev.items[id];
      if (!existing) return prev;
      return { ...prev, items: { ...prev.items, [id]: { ...existing, deleted: true, updatedAt: Date.now() } } };
    });
    schedulePush();
  }, []);

  // Per-(course, lecture) revised flag -- its own LWW record, same as an
  // item, keyed by a composite string since a lecture isn't an entity with
  // its own id anywhere else in the state.
  const toggleRevised = useCallback((course, lecture) => {
    const key = `${course}::${lecture}`;
    setState((prev) => {
      const current = !!prev.revised[key]?.done;
      return { ...prev, revised: { ...prev.revised, [key]: { done: !current, updatedAt: Date.now() } } };
    });
    schedulePush();
  }, []);

  return (
    <MathSyncContext.Provider
      value={{ state, loading, addItem, addItems, updateItem, deleteItem, toggleRevised }}
    >
      {children}
    </MathSyncContext.Provider>
  );
}

export function useMath() {
  const ctx = useContext(MathSyncContext);
  if (!ctx) throw new Error('useMath must be used within MathSyncProvider');
  return ctx;
}
