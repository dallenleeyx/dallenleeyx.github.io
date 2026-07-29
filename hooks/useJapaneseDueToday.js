'use client';
// hooks/useJapaneseDueToday.js — read-only Dashboard-side view of the
// Japanese app's "due today" list. The Dashboard route is outside
// /japanese's own provider tree (PlanContext, JapaneseSyncProvider), so
// rather than duplicating that whole sync machinery just to display a
// summary, this fetches the server's plan snapshot directly (GET only, no
// push -- the Dashboard never edits Japanese state) and runs it through the
// same lib/japanese/timeline.js:getDueToday the Home tab itself uses.
import { useCallback, useEffect, useState } from 'react';
import { VOCAB_DATA } from '../lib/japanese/data/vocab';
import { GRAMMAR_DATA } from '../lib/japanese/data/grammar';
import { buildLessonQueue, getDueToday, defaultPlan } from '../lib/japanese/timeline';

const POLL_MS = 5000;

export function useJapaneseDueToday() {
  const [items, setItems] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/japanese');
      if (!res.ok) return;
      const body = await res.json();
      const bundle = (body.state && body.state.planBundle) || {};
      const japaneseState = {
        plan: { ...defaultPlan(), ...(bundle.plan || {}) },
        planDone: bundle.planDone || {},
        planDaily: bundle.planDaily || {},
        vocabQueue: buildLessonQueue(VOCAB_DATA, 'vocab'),
        grammarQueue: buildLessonQueue(GRAMMAR_DATA, 'grammar'),
      };
      setItems(getDueToday(japaneseState));
    } catch (e) {
      // offline or a transient failure -- keep showing the last-known list
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [refresh]);

  return items;
}
