'use client';
// lib/useBibleSync.js — client hook for cross-device sync of the `bible`
// state blob (notes/completed/current). Mirrors lib/useCoursesSync.js
// exactly: localStorage as an instant local cache, a debounced network PUT,
// and a short poll (plus poll-on-focus) to pull in changes from other
// devices. Last-write-wins by timestamp -- fine here since edits are one
// person, one device at a time (same reasoning as the Math site's notes).
import { useCallback, useEffect, useRef, useState } from 'react';

const LOCAL_KEY = 'bibleData';
const DEBOUNCE_MS = 1000;
const POLL_MS = 5000;
const EMPTY_STATE = { notes: {}, completed: {}, current: null, versionId: null };

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeLocal(state, updatedAt) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ state, updatedAt }));
  } catch (e) {
    // ignore quota/availability errors — local cache is best-effort
  }
}

export function useBibleSync() {
  const [state, setStateRaw] = useState(null);
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
        const res = await fetch('/api/bible');
        if (!res.ok) throw new Error('fetch failed');
        const server = await res.json();
        if (cancelled) return;
        if (local && local.updatedAt > (server.updatedAt || 0)) {
          updatedAtRef.current = local.updatedAt;
          setStateRaw(local.state);
          pendingRef.current = { state: local.state, updatedAt: local.updatedAt };
          schedulePush();
        } else {
          updatedAtRef.current = server.updatedAt || 0;
          setStateRaw(server.state || EMPTY_STATE);
          writeLocal(server.state || EMPTY_STATE, updatedAtRef.current);
        }
      } catch (e) {
        if (cancelled) return;
        setOffline(true);
        if (local) {
          updatedAtRef.current = local.updatedAt;
          setStateRaw(local.state);
        } else {
          updatedAtRef.current = Date.now();
          setStateRaw(EMPTY_STATE);
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
      const res = await fetch('/api/bible');
      if (!res.ok) throw new Error('poll failed');
      const server = await res.json();
      setOffline(false);
      const serverUpdatedAt = server.updatedAt || 0;
      if (serverUpdatedAt > updatedAtRef.current) {
        updatedAtRef.current = serverUpdatedAt;
        setStateRaw(server.state || EMPTY_STATE);
        writeLocal(server.state || EMPTY_STATE, serverUpdatedAt);
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
      const res = await fetch('/api/bible', {
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

  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const base = prev || EMPTY_STATE;
      const next = typeof updater === 'function' ? updater(base) : updater;
      const updatedAt = Date.now();
      updatedAtRef.current = updatedAt;
      writeLocal(next, updatedAt);
      pendingRef.current = { state: next, updatedAt };
      schedulePush();
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, setState, loading, offline };
}
