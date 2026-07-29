'use client';
// lib/japanese/GrammarProgressContext.jsx — Grammar Practice's own progress
// state: the SM-2 review schedule (one record per question id) and a
// lesson-mastery flag store, kept separate from vocab's stores since grammar
// lessons are numbered independently of vocab lessons (mixing the two golden
// checks would make them meaningless). localStorage-backed for now; Phase 9
// wires these into the cross-device sync registry.
import { createContext, useContext, useEffect, useState } from 'react';
import { scheduleCard, isDue, isNew } from './srs';

const GP_SRS_KEY = 'jpstudy_gp_srs_v1';
const GP_MASTERY_KEY = 'jpstudy_gp_lesson_passed_v1';

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

function lessonKey(level, lesson) {
  return `${level}::${lesson}`;
}

function useSrsStore() {
  const [store, setStore] = useState(() => loadJSON(GP_SRS_KEY, {}));
  useEffect(() => { saveJSON(GP_SRS_KEY, store); }, [store]);

  const recordResult = (qid, isCorrect, now = Date.now()) => {
    setStore((prev) => ({ ...prev, [qid]: scheduleCard(prev[qid], isCorrect, now) }));
  };
  const isCardDue = (qid, now = Date.now()) => isDue(store[qid], now);
  const isCardNew = (qid) => isNew(store[qid]);
  const dueCounts = (questions, now = Date.now()) => {
    let due = 0;
    let fresh = 0;
    questions.forEach((q) => {
      if (isNew(store[q.id])) fresh += 1;
      else if (isDue(store[q.id], now)) due += 1;
    });
    return { due, fresh, total: questions.length };
  };
  const reset = () => setStore({});

  return { isCardDue, isCardNew, dueCounts, recordResult, reset };
}

function useMasteryStore() {
  const [store, setStore] = useState(() => loadJSON(GP_MASTERY_KEY, {}));
  useEffect(() => { saveJSON(GP_MASTERY_KEY, store); }, [store]);
  return {
    isPassed: (level, lesson) => !!store[lessonKey(level, lesson)],
    markPassed: (level, lesson) => {
      const k = lessonKey(level, lesson);
      setStore((prev) => (prev[k] ? prev : { ...prev, [k]: true }));
    },
    reset: () => setStore({}),
  };
}

const GrammarProgressContext = createContext(null);

export function GrammarProgressProvider({ children }) {
  const srs = useSrsStore();
  const gpMastery = useMasteryStore();
  return (
    <GrammarProgressContext.Provider value={{ srs, gpMastery }}>
      {children}
    </GrammarProgressContext.Provider>
  );
}

export function useGrammarProgress() {
  const ctx = useContext(GrammarProgressContext);
  if (!ctx) throw new Error('useGrammarProgress must be used within GrammarProgressProvider');
  return ctx;
}
