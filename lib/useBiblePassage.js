'use client';
// lib/useBiblePassage.js — client hook that fetches one chapter's passage
// text (via our own /api/bible/passage proxy, never calling api.bible
// directly) whenever bibleId/bookId/chapter change. Fails gracefully:
// missing key / network / rate-limit all surface as a plain `error`
// message rather than a crash, since api.bible is a third-party service
// this app doesn't control the uptime of.
import { useEffect, useState } from 'react';

export function useBiblePassage(bibleId, bookId, chapter) {
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bibleId || !bookId || !chapter) {
      setPassage(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ bibleId, bookId, chapter: String(chapter) });
    fetch(`/api/bible/passage?${params.toString()}`)
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || 'failed to load passage');
        return body;
      })
      .then((body) => { if (!cancelled) setPassage(body); })
      .catch((e) => { if (!cancelled) setError(e.message || 'failed to load passage'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [bibleId, bookId, chapter]);

  return { passage, loading, error };
}

export function useBibleVersions() {
  const [versions, setVersions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/bible/versions')
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || 'failed to load versions');
        return body;
      })
      .then((body) => { if (!cancelled) setVersions(body.versions || []); })
      .catch((e) => { if (!cancelled) setError(e.message || 'failed to load versions'); });
    return () => { cancelled = true; };
  }, []);

  return { versions, error };
}
