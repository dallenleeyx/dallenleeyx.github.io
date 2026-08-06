'use client';
// hooks/dashboard/useGoalPlanSync.js — client hook for cross-device sync of
// the 6-month `goalPlan` document. Structurally identical to
// lib/useCoursesSync.js (see that file's comments for why each piece of the
// debounce/poll/local-cache shape exists) with one addition:
// `regeneratePlan()`, which POSTs to the Claude-backed generate endpoint --
// that route persists directly server-side, so its response replaces local
// state outright instead of going through the debounced push path.
import { useCallback, useEffect, useRef, useState } from 'react';
import { EMPTY_GOAL_PLAN } from '../../lib/dashboard/planSeed';

const LOCAL_KEY = 'dashboardGoalPlan';
const DEBOUNCE_MS = 1000;
const LOCAL_WRITE_DEBOUNCE_MS = 250;
const POLL_MS = 5000;

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeLocal(plan, updatedAt) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ plan, updatedAt }));
  } catch (e) {
    // ignore quota/availability errors — local cache is best-effort
  }
}

export function useGoalPlanSync() {
  const [plan, setPlanState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const updatedAtRef = useRef(0);
  const debounceRef = useRef(null);
  const inFlightRef = useRef(false);
  const pendingRef = useRef(null);
  const readyRef = useRef(false);
  const localWriteTimerRef = useRef(null);
  const pendingLocalWriteRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = readLocal();
      try {
        const res = await fetch('/api/dashboard/plan');
        if (!res.ok) throw new Error('fetch failed');
        const server = await res.json();
        if (cancelled) return;
        if (local && local.updatedAt > (server.updatedAt || 0)) {
          updatedAtRef.current = local.updatedAt;
          setPlanState(local.plan);
          pendingRef.current = { plan: local.plan, updatedAt: local.updatedAt };
          schedulePush();
        } else {
          updatedAtRef.current = server.updatedAt || 0;
          setPlanState(server.plan || EMPTY_GOAL_PLAN);
          writeLocal(server.plan || EMPTY_GOAL_PLAN, updatedAtRef.current);
        }
      } catch (e) {
        if (cancelled) return;
        setOffline(true);
        if (local) {
          updatedAtRef.current = local.updatedAt;
          setPlanState(local.plan);
        } else {
          updatedAtRef.current = Date.now();
          setPlanState(EMPTY_GOAL_PLAN);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          readyRef.current = true;
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const poll = useCallback(async () => {
    if (!readyRef.current || inFlightRef.current) return;
    try {
      const res = await fetch('/api/dashboard/plan');
      if (!res.ok) throw new Error('poll failed');
      const server = await res.json();
      setOffline(false);
      const serverUpdatedAt = server.updatedAt || 0;
      if (serverUpdatedAt > updatedAtRef.current) {
        updatedAtRef.current = serverUpdatedAt;
        setPlanState(server.plan || EMPTY_GOAL_PLAN);
        writeLocal(server.plan || EMPTY_GOAL_PLAN, serverUpdatedAt);
      }
    } catch (e) {
      setOffline(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(poll, POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') poll(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [poll]);

  useEffect(() => {
    const flush = () => {
      if (!pendingLocalWriteRef.current) return;
      if (localWriteTimerRef.current) clearTimeout(localWriteTimerRef.current);
      const { plan: p, updatedAt: u } = pendingLocalWriteRef.current;
      pendingLocalWriteRef.current = null;
      writeLocal(p, u);
    };
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, []);

  const pushToServer = useCallback(async () => {
    if (!pendingRef.current) return;
    if (inFlightRef.current) return;
    const payload = pendingRef.current;
    pendingRef.current = null;
    inFlightRef.current = true;
    try {
      const res = await fetch('/api/dashboard/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('save failed');
      setOffline(false);
    } catch (e) {
      setOffline(true);
      pendingRef.current = payload;
    } finally {
      inFlightRef.current = false;
      if (pendingRef.current) schedulePush();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function schedulePush() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(pushToServer, DEBOUNCE_MS);
  }

  function scheduleLocalWrite() {
    if (localWriteTimerRef.current) clearTimeout(localWriteTimerRef.current);
    localWriteTimerRef.current = setTimeout(() => {
      if (!pendingLocalWriteRef.current) return;
      const { plan: p, updatedAt: u } = pendingLocalWriteRef.current;
      pendingLocalWriteRef.current = null;
      writeLocal(p, u);
    }, LOCAL_WRITE_DEBOUNCE_MS);
  }

  const setPlan = useCallback((updater) => {
    setPlanState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const updatedAt = Date.now();
      updatedAtRef.current = updatedAt;
      pendingLocalWriteRef.current = { plan: next, updatedAt };
      scheduleLocalWrite();
      pendingRef.current = { plan: next, updatedAt };
      schedulePush();
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The generate route calls Claude and persists the result itself (see
  // app/api/dashboard/plan/generate/route.js) -- it's the authoritative
  // writer for that request, so the response replaces local state directly
  // rather than going through the debounced push path a manual edit would.
  const regeneratePlan = useCallback(async (input) => {
    setRegenerating(true);
    try {
      const res = await fetch('/api/dashboard/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('generate failed');
      const server = await res.json();
      updatedAtRef.current = server.updatedAt;
      setPlanState(server.plan);
      writeLocal(server.plan, server.updatedAt);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String((e && e.message) || e) };
    } finally {
      setRegenerating(false);
    }
  }, []);

  return { plan, setPlan, loading, offline, regenerating, regeneratePlan };
}
