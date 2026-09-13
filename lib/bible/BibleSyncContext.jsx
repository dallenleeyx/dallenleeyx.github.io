'use client';
// lib/bible/BibleSyncContext.jsx — cross-device poll-and-merge sync for the
// Bible record, same rationale as math/MathSyncContext.jsx: applies the
// same pure mergeBibleState the PUT route uses server-side, rather than
// just overwriting local state with the server's, so concurrent edits from
// two devices both survive.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { mergeBibleState, normalizeBibleState, stableStringify } from './syncMerge';

const POLL_MS = 5000;
const PUSH_DEBOUNCE_MS = 1200;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const BibleSyncContext = createContext(null);

export function BibleSyncProvider({ children }) {
  const [state, setState] = useState(() => normalizeBibleState(null));
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
      const res = await fetch('/api/bible', {
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
      const res = await fetch('/api/bible');
      if (!res.ok) return;
      const body = await res.json();
      const merged = mergeBibleState(stateRef.current, body.state);
      setState(merged);
      setLoading(false);
      if (stableStringify(merged) !== stableStringify(normalizeBibleState(body.state))) {
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

  const addCommentary = useCallback((body) => {
    const id = uid();
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      commentary: { ...prev.commentary, [id]: { id, body, createdAt: now, updatedAt: now } },
    }));
    schedulePush();
    return id;
  }, []);

  const updateCommentary = useCallback((id, body) => {
    setState((prev) => {
      const existing = prev.commentary[id];
      if (!existing) return prev;
      return { ...prev, commentary: { ...prev.commentary, [id]: { ...existing, body, updatedAt: Date.now() } } };
    });
    schedulePush();
  }, []);

  const deleteCommentary = useCallback((id) => {
    setState((prev) => {
      const existing = prev.commentary[id];
      if (!existing) return prev;
      return { ...prev, commentary: { ...prev.commentary, [id]: { ...existing, deleted: true, updatedAt: Date.now() } } };
    });
    schedulePush();
  }, []);

  // patch: partial fields to merge into that date's QT entry, e.g.
  // { passage: '...' } or { comments: '...' }.
  const updateQt = useCallback((dateISO, patch) => {
    setState((prev) => {
      const existing = prev.qt[dateISO] || {};
      return { ...prev, qt: { ...prev.qt, [dateISO]: { ...existing, ...patch, updatedAt: Date.now() } } };
    });
    schedulePush();
  }, []);

  const setPrayerFocus = useCallback((text) => {
    setState((prev) => ({ ...prev, prayerFocus: { text, updatedAt: Date.now() } }));
    schedulePush();
  }, []);

  return (
    <BibleSyncContext.Provider
      value={{ state, loading, addCommentary, updateCommentary, deleteCommentary, updateQt, setPrayerFocus }}
    >
      {children}
    </BibleSyncContext.Provider>
  );
}

export function useBible() {
  const ctx = useContext(BibleSyncContext);
  if (!ctx) throw new Error('useBible must be used within BibleSyncProvider');
  return ctx;
}
