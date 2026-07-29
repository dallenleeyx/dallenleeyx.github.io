'use client';
// lib/japanese/VocabProgressContext.jsx — shared vocab progress state (per-
// word right/wrong stats, plus a per-mode lesson-mastery flag store) so
// Word List, Flashcards, Writing, and Furigana all read/write the same
// live data instead of drifting out of sync with their own copies.
// localStorage-backed for now; Phase 9 wires these stores into the cross-
// device sync registry.
import { createContext, useContext, useEffect, useState } from 'react';
import { wordId } from './wordId';

const PROGRESS_KEY = 'jpstudy_progress_v1';
const FC_MASTERY_KEY = 'jpstudy_fc_lesson_passed_v1';
const KW_MASTERY_KEY = 'jpstudy_kw_lesson_passed_v1';
const FG_MASTERY_KEY = 'jpstudy_fg_lesson_passed_v1';

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

const VocabProgressContext = createContext(null);

export function VocabProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => loadJSON(PROGRESS_KEY, {}));
  const [fcMasteryStore, setFcMasteryStore] = useState(() => loadJSON(FC_MASTERY_KEY, {}));
  const [kwMasteryStore, setKwMasteryStore] = useState(() => loadJSON(KW_MASTERY_KEY, {}));
  const [fgMasteryStore, setFgMasteryStore] = useState(() => loadJSON(FG_MASTERY_KEY, {}));

  useEffect(() => { saveJSON(PROGRESS_KEY, progress); }, [progress]);
  useEffect(() => { saveJSON(FC_MASTERY_KEY, fcMasteryStore); }, [fcMasteryStore]);
  useEffect(() => { saveJSON(KW_MASTERY_KEY, kwMasteryStore); }, [kwMasteryStore]);
  useEffect(() => { saveJSON(FG_MASTERY_KEY, fgMasteryStore); }, [fgMasteryStore]);

  const getStats = (item) => progress[wordId(item)] || {};
  // "Weak"/"mastered" reflect only the LAST sitting with this word -- weak
  // clears the moment a later sitting masters it.
  const isWeak = (item) => !!getStats(item).weak;
  const isMastered = (item) => !!getStats(item).mastered;

  const recordSessionResult = (item, masteredThisSitting) => {
    setProgress((prev) => ({
      ...prev,
      [wordId(item)]: { mastered: masteredThisSitting, weak: !masteredThisSitting, lastSeen: new Date().toISOString() },
    }));
  };

  const resetProgressFor = (items) => {
    const now = new Date().toISOString();
    setProgress((prev) => {
      const next = { ...prev };
      items.forEach((item) => { next[wordId(item)] = { correct: 0, wrong: 0, lastSeen: now }; });
      return next;
    });
  };

  function makeMastery(store, setStore) {
    return {
      isPassed: (level, lesson) => !!store[lessonKey(level, lesson)],
      markPassed: (level, lesson) => {
        const k = lessonKey(level, lesson);
        setStore((prev) => (prev[k] ? prev : { ...prev, [k]: true }));
      },
    };
  }

  const fcMastery = makeMastery(fcMasteryStore, setFcMasteryStore);
  const kwMastery = makeMastery(kwMasteryStore, setKwMasteryStore);
  const fgMastery = makeMastery(fgMasteryStore, setFgMasteryStore);

  // Word List's golden lesson chip: all three practice modes cleared.
  const isFullyMastered = (level, lesson) =>
    fcMastery.isPassed(level, lesson) && kwMastery.isPassed(level, lesson) && fgMastery.isPassed(level, lesson);

  return (
    <VocabProgressContext.Provider
      value={{ isWeak, isMastered, getStats, recordSessionResult, resetProgressFor, fcMastery, kwMastery, fgMastery, isFullyMastered }}
    >
      {children}
    </VocabProgressContext.Provider>
  );
}

export function useVocabProgress() {
  const ctx = useContext(VocabProgressContext);
  if (!ctx) throw new Error('useVocabProgress must be used within VocabProgressProvider');
  return ctx;
}
