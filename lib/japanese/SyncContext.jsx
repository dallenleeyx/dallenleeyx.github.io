'use client';
// lib/japanese/SyncContext.jsx — cross-device sync for the Japanese app's
// progress, the direct equivalent of the original static site's
// syncContributors registry (see js/app.js's pushSyncChange/getSyncSnapshot/
// applySyncSnapshot). Each persisted store (VocabProgressContext,
// GrammarProgressContext, PlanContext) registers a { get, apply } pair under
// its own section key via useSyncSection; this provider periodically GETs
// the server's state, merges it against a snapshot assembled from every
// registered section (via lib/japanese/syncMerge.js -- the SAME pure merge
// module the PUT route uses server-side, so merge semantics can never
// drift), and fans the merged result back out to each section's apply().
//
// Unlike the math side's useCoursesSync (poll-and-OVERWRITE, safe there
// because its PUT is last-write-wins on one blob), this is poll-and-MERGE:
// two devices can each add distinct progress that must both survive, so
// applying the server's snapshot directly would silently discard whatever
// this device added since its last successful push.
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { mergeSyncState, normalizeSyncState, stableStringify } from './syncMerge';

const POLL_MS = 5000;
const PUSH_DEBOUNCE_MS = 1200;

const SyncContext = createContext(null);

export function JapaneseSyncProvider({ children }) {
  const sectionsRef = useRef(new Map()); // key -> { get, apply }
  const pushTimerRef = useRef(null);
  const inFlightRef = useRef(false);
  const dirtyRef = useRef(false);
  const readyRef = useRef(false);

  const getLocalSnapshot = useCallback(() => {
    const snapshot = {};
    sectionsRef.current.forEach(({ get }, key) => { snapshot[key] = get(); });
    return snapshot;
  }, []);

  const applySnapshot = useCallback((snapshot) => {
    sectionsRef.current.forEach(({ apply }, key) => {
      if (snapshot[key] !== undefined) apply(snapshot[key]);
    });
  }, []);

  const doPush = useCallback(async () => {
    if (!readyRef.current || inFlightRef.current || !dirtyRef.current) return;
    dirtyRef.current = false;
    inFlightRef.current = true;
    try {
      const state = getLocalSnapshot();
      const res = await fetch('/api/japanese', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      });
      if (!res.ok) throw new Error('push failed');
    } catch (e) {
      dirtyRef.current = true; // retry on the next scheduled push
    } finally {
      inFlightRef.current = false;
      if (dirtyRef.current) schedulePush();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLocalSnapshot]);

  function schedulePush() {
    dirtyRef.current = true;
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(doPush, PUSH_DEBOUNCE_MS);
  }

  const poll = useCallback(async () => {
    if (!readyRef.current) return;
    try {
      const res = await fetch('/api/japanese');
      if (!res.ok) return;
      const body = await res.json();
      const localSnapshot = getLocalSnapshot();
      const merged = mergeSyncState(localSnapshot, body.state);
      applySnapshot(merged);
      // If the merge added anything the server didn't have (progress made
      // locally since the last successful push, or before ever syncing),
      // push the merged result back so it isn't lost on the next poll.
      if (stableStringify(merged) !== stableStringify(normalizeSyncState(body.state))) {
        schedulePush();
      }
    } catch (e) {
      // offline or a transient failure -- the next scheduled poll retries
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLocalSnapshot, applySnapshot]);

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

  const registerSection = useCallback((key, entry) => {
    sectionsRef.current.set(key, entry);
    return () => { sectionsRef.current.delete(key); };
  }, []);

  return (
    <SyncContext.Provider value={{ registerSection, schedulePush }}>
      {children}
    </SyncContext.Provider>
  );
}

// A store calls this once per render with its CURRENT get/apply (get: () =>
// its live local state; apply: (mergedData) => write it into local state).
// The wrapper registered with the provider always delegates to the latest
// closures via refs, so the provider's poll loop -- which fires on its own
// interval, independent of any particular render -- never reads stale data.
// Returns schedulePush(), which the caller's own mutators (recordResult,
// markPassed, etc.) should call after a LOCAL edit so it gets pushed; it
// must NOT be called from apply() itself, or applying a remote snapshot
// would immediately echo it straight back to the server.
export function useSyncSection(key, { get, apply }) {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSyncSection must be used within JapaneseSyncProvider');
  const getRef = useRef(get);
  const applyRef = useRef(apply);
  getRef.current = get;
  applyRef.current = apply;

  useEffect(() => {
    return ctx.registerSection(key, {
      get: (...args) => getRef.current(...args),
      apply: (...args) => applyRef.current(...args),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return ctx.schedulePush;
}
