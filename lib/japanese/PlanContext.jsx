'use client';
// lib/japanese/PlanContext.jsx — Home's study-plan state: the pace/dates
// settings, which lessons are ticked done (and when), and the review-phase
// daily habit checklist. localStorage-backed for now; Phase 9 wires this
// into the cross-device sync registry.
import { createContext, useContext, useEffect, useState } from 'react';
import { defaultPlan, todayISO } from './timeline';

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
  const [plan, setPlanState] = useState(() => ({ ...defaultPlan(), ...loadJSON(PLAN_KEY, {}) }));
  const [planDone, setPlanDone] = useState(() => loadJSON(PLAN_DONE_KEY, {}));
  const [planDaily, setPlanDaily] = useState(() => loadJSON(PLAN_DAILY_KEY, {}));
  const [planEdits, setPlanEdits] = useState(() => {
    const saved = loadJSON(PLAN_EDITS_KEY, null);
    return { done: (saved && saved.done) || {}, daily: (saved && saved.daily) || {} };
  });

  useEffect(() => { saveJSON(PLAN_KEY, plan); }, [plan]);
  useEffect(() => { saveJSON(PLAN_DONE_KEY, planDone); }, [planDone]);
  useEffect(() => { saveJSON(PLAN_DAILY_KEY, planDaily); }, [planDaily]);
  useEffect(() => { saveJSON(PLAN_EDITS_KEY, planEdits); }, [planEdits]);

  // Only a real edit re-stamps updatedAt -- stamping on every load would
  // make this device's copy look newest on every visit, so a freshly-opened
  // second device would win a future sync merge with its untouched defaults.
  const updatePlan = (patch) => {
    setPlanState((prev) => ({ ...prev, ...patch, updatedAt: Date.now() }));
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
  };

  const resetPlan = () => {
    setPlanDone({});
    setPlanDaily({});
    setPlanEdits({ done: {}, daily: {} });
    setPlanState({ ...defaultPlan(todayISO()), updatedAt: Date.now() });
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
