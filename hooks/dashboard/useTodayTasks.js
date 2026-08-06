'use client';
// hooks/dashboard/useTodayTasks.js — read-only combined "what's due" view
// across math and Japanese. Deliberately returns two separate lists
// (mathItems/japaneseItems) rather than one unified array: the underlying
// shapes are fundamentally different (date-keyed assignments vs a
// queue-keyed lesson/habit list), and forcing a shared shape would either
// lose information or need a fake common schema neither side really has.
// No mutation from here -- the Dashboard is display-only; "mark done"
// still happens on /math or /japanese, the actual source of truth.
import { useCallback, useEffect, useState } from 'react';
import { getUpcomingDueAssignments } from '../../lib/schedule';
import { normalizeSyncState } from '../../lib/japanese/syncMerge';
import { VOCAB_DATA } from '../../lib/japanese/data/vocab';
import { GRAMMAR_DATA } from '../../lib/japanese/data/grammar';
import { buildLessonQueue, nextUndone, planPhase, todayISO, defaultPlan, REVIEW_HABITS } from '../../lib/japanese/timeline';

const POLL_MS = 30000;

export function useTodayTasks() {
  const [mathItems, setMathItems] = useState([]);
  const [japaneseToday, setJapaneseToday] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [coursesRes, japaneseRes] = await Promise.all([
        fetch('/api/data'),
        fetch('/api/japanese'),
      ]);
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setMathItems(getUpcomingDueAssignments(data.courses || [], new Date(), 14));
      }
      if (japaneseRes.ok) {
        const data = await japaneseRes.json();
        const state = normalizeSyncState(data.state);
        const plan = Object.keys(state.planBundle.plan || {}).length ? state.planBundle.plan : defaultPlan();
        const today = todayISO();
        const phase = planPhase(plan, today);
        if (phase === 'learn') {
          const vocabQueue = buildLessonQueue(VOCAB_DATA, 'vocab');
          const grammarQueue = buildLessonQueue(GRAMMAR_DATA, 'grammar');
          setJapaneseToday({
            phase,
            nextVocab: nextUndone(vocabQueue, state.planBundle.planDone, plan.vocabPerDay || 3),
            nextGrammar: nextUndone(grammarQueue, state.planBundle.planDone, plan.grammarPerDay || 2),
          });
        } else if (phase === 'review') {
          setJapaneseToday({ phase, habits: REVIEW_HABITS });
        } else {
          setJapaneseToday({ phase });
        }
      }
    } catch (e) {
      // best-effort — Dashboard tolerates a failed refresh silently, the
      // next poll or focus event tries again
    } finally {
      setLoading(false);
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

  return { mathItems, japaneseToday, loading };
}
