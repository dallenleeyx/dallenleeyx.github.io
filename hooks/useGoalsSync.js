'use client';
// hooks/useGoalsSync.js — client hook for cross-device sync of the
// Dashboard's Goals list, mirroring lib/useCoursesSync.js exactly (same
// local-cache-plus-debounced-push-plus-poll shape; last-write-wins, since
// app/api/goals/route.js is LWW too).
import { useCallback, useEffect, useRef, useState } from 'react';

const LOCAL_KEY = 'dashboardGoals';
const DEBOUNCE_MS = 1000;
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

function writeLocal(goals, updatedAt) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ goals, updatedAt }));
  } catch (e) {
    // ignore quota/availability errors -- local cache is best-effort
  }
}

export function useGoalsSync() {
  const [goals, setGoalsState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const updatedAtRef = useRef(0);
  const debounceRef = useRef(null);
  const inFlightRef = useRef(false);
  const pendingRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = readLocal();
      try {
        const res = await fetch('/api/goals');
        if (!res.ok) throw new Error('fetch failed');
        const server = await res.json();
        if (cancelled) return;
        if (local && local.updatedAt > (server.updatedAt || 0)) {
          updatedAtRef.current = local.updatedAt;
          setGoalsState(local.goals);
          pendingRef.current = { goals: local.goals, updatedAt: local.updatedAt };
          schedulePush();
        } else {
          updatedAtRef.current = server.updatedAt || 0;
          setGoalsState(server.goals || []);
          writeLocal(server.goals || [], updatedAtRef.current);
        }
      } catch (e) {
        if (cancelled) return;
        setOffline(true);
        if (local) {
          updatedAtRef.current = local.updatedAt;
          setGoalsState(local.goals);
        } else {
          updatedAtRef.current = Date.now();
          setGoalsState([]);
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
      const res = await fetch('/api/goals');
      if (!res.ok) throw new Error('poll failed');
      const server = await res.json();
      setOffline(false);
      const serverUpdatedAt = server.updatedAt || 0;
      if (serverUpdatedAt > updatedAtRef.current) {
        updatedAtRef.current = serverUpdatedAt;
        setGoalsState(server.goals || []);
        writeLocal(server.goals || [], serverUpdatedAt);
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

  const pushToServer = useCallback(async () => {
    if (!pendingRef.current) return;
    if (inFlightRef.current) return;
    const payload = pendingRef.current;
    pendingRef.current = null;
    inFlightRef.current = true;
    try {
      const res = await fetch('/api/goals', {
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

  const setGoals = useCallback((updater) => {
    setGoalsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const updatedAt = Date.now();
      updatedAtRef.current = updatedAt;
      writeLocal(next, updatedAt);
      pendingRef.current = { goals: next, updatedAt };
      schedulePush();
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { goals, setGoals, loading, offline };
}
