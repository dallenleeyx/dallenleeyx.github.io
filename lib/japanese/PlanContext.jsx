'use client';
// lib/japanese/PlanContext.jsx — Home's study-plan state: the pace/dates
// settings, which lessons are ticked done (and when), and the review-phase
// daily habit checklist. localStorage-backed, and wired into the
// cross-device sync registry as one combined 'planBundle' section (mirroring
// how the original pushed all four pieces from a single syncContributors
// entry).
import { createContext, useContext, useEffect, useState } from 'react';
import { defaultPlan, todayISO } from './timeline';
import { useSyncSection } from './SyncContext';

const PLAN_KEY = 'jpstudy_plan_v1';
const PLAN_DONE_KEY = 'jpstudy_plan_done_v1';
const PLAN_DAILY_KEY = 'jpstudy_plan_daily_v1';
const PLAN_EDITS_KEY = 'jpstudy_plan_edits_v1';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  // Starts at the SSR-safe defaults (no saved overrides applied yet) and
  // restores the real saved values only after mount -- see
  // ThemeProvider.jsx's file-level comment for why reading localStorage
  // inside useState()'s initializer itself causes a hydration mismatch.
  // The `hydrated` gate stops the save-effects from firing with these
  // not-yet-restored defaults and overwriting the real saved data before
  // it's even been read.
  const [plan, setPlanState] = useState(() => defaultPlan());
  const [planDone, setPlanDone] = useState({});
  const [planDaily, setPlanDaily] = useState({});
  const [planEdits, setPlanEdits] = useState({ done: {}, daily: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlanState((prev) => ({ ...prev, ...loadJSON(PLAN_KEY, {}) }));
    setPlanDone(loadJSON(PLAN_DONE_KEY, {}));
    setPlanDaily(loadJSON(PLAN_DAILY_KEY, {}));
    const saved = loadJSON(PLAN_EDITS_KEY, null);
    setPlanEdits({ done: (saved && saved.done) || {}, daily: (saved && saved.daily) || {} });
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveJSON(PLAN_KEY, plan); }, [plan, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(PLAN_DONE_KEY, planDone); }, [planDone, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(PLAN_DAILY_KEY, planDaily); }, [planDaily, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(PLAN_EDITS_KEY, planEdits); }, [planEdits, hydrated]);

  const schedulePush = useSyncSection('planBundle', {
    get: () => ({ plan, planDone, planDaily, planEdits }),
    apply: (remote) => {
      if (remote.plan) setPlanState((prev) => ({ ...prev, ...remote.plan }));
      if (remote.planDone) setPlanDone(remote.planDone);
      if (remote.planDaily) setPlanDaily(remote.planDaily);
      if (remote.planEdits) setPlanEdits({ done: remote.planEdits.done || {}, daily: remote.planEdits.daily || {} });
    },
  });

  // Only a real edit re-stamps updatedAt -- stamping on every load would
  // make this device's copy look newest on every visit, so a freshly-opened
  // second device would win a future sync merge with its untouched defaults.
  const updatePlan = (patch) => {
    setPlanState((prev) => ({ ...prev, ...patch, updatedAt: Date.now() }));
    schedulePush();
  };

  const markEdit = (kind, key) => {
    setPlanEdits((prev) => ({ ...prev, [kind]: { ...prev[kind], [key]: Date.now() } }));
  };

  const toggleTaskDone = (task, key, today = todayISO()) => {
    setPlanDone((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = today;
      return next;
    });
    markEdit('done', key);
    schedulePush();
  };

  const toggleHabitDone = (habitId, today = todayISO()) => {
    const dailyKey = `${today}::${habitId}`;
    setPlanDaily((prev) => {
      const day = { ...(prev[today] || {}) };
      if (day[habitId]) delete day[habitId];
      else day[habitId] = true;
      return { ...prev, [today]: day };
    });
    markEdit('daily', dailyKey);
    schedulePush();
  };

  const resetPlan = () => {
    setPlanDone({});
    setPlanDaily({});
    setPlanEdits({ done: {}, daily: {} });
    setPlanState({ ...defaultPlan(todayISO()), updatedAt: Date.now() });
    schedulePush();
  };

  return (
    <PlanContext.Provider value={{ plan, planDone, planDaily, planEdits, updatePlan, toggleTaskDone, toggleHabitDone, resetPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
