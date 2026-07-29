'use client';
// lib/useCoursesSync.js — client hook for cross-device sync of `courses`.
// localStorage stays an instant local cache (synchronous write on every
// change); a separately debounced network PUT reconciles with the server.
// A short poll interval (plus an immediate poll on tab focus) pulls in
// changes saved from other devices without needing a manual refresh.
import { useCallback, useEffect, useRef, useState } from 'react';
import { TRACKER_SEED } from './seed-data';

const LOCAL_KEY = 'proofLabData';
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

function writeLocal(courses, updatedAt) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ courses, updatedAt }));
  } catch (e) {
    // ignore quota/availability errors — local cache is best-effort
  }
}

export function useCoursesSync() {
  const [courses, setCoursesState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [seeded, setSeeded] = useState(false);
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
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('fetch failed');
        const server = await res.json();
        if (cancelled) return;
        if (local && local.updatedAt > (server.updatedAt || 0)) {
          updatedAtRef.current = local.updatedAt;
          setCoursesState(local.courses);
          pendingRef.current = { courses: local.courses, updatedAt: local.updatedAt };
          schedulePush();
        } else {
          updatedAtRef.current = server.updatedAt || 0;
          setCoursesState(server.courses || TRACKER_SEED);
          writeLocal(server.courses || TRACKER_SEED, updatedAtRef.current);
          if (server.seeded) setSeeded(true);
        }
      } catch (e) {
        if (cancelled) return;
        setOffline(true);
        if (local) {
          updatedAtRef.current = local.updatedAt;
          setCoursesState(local.courses);
        } else {
          updatedAtRef.current = Date.now();
          setCoursesState(TRACKER_SEED);
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

  // pulls in changes saved from another device; ignored if we have a
  // pending/newer local edit, since updatedAtRef already reflects that
  const poll = useCallback(async () => {
    if (!readyRef.current || inFlightRef.current) return;
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('poll failed');
      const server = await res.json();
      setOffline(false);
      const serverUpdatedAt = server.updatedAt || 0;
      if (serverUpdatedAt > updatedAtRef.current) {
        updatedAtRef.current = serverUpdatedAt;
        setCoursesState(server.courses || TRACKER_SEED);
        writeLocal(server.courses || TRACKER_SEED, serverUpdatedAt);
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
      const res = await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('save failed');
      setOffline(false);
    } catch (e) {
      setOffline(true);
      // keep the latest attempt pending so the next schedulePush retries it
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

  const setCourses = useCallback((updater) => {
    setCoursesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const updatedAt = Date.now();
      updatedAtRef.current = updatedAt;
      writeLocal(next, updatedAt);
      pendingRef.current = { courses: next, updatedAt };
      schedulePush();
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const importData = useCallback((importedCourses) => {
    setCourses(() => importedCourses);
    setSeeded(false);
  }, [setCourses]);

  return { courses, setCourses, loading, offline, seeded, importData };
}
