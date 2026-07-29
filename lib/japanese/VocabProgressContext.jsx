'use client';
// lib/japanese/VocabProgressContext.jsx — shared vocab progress state (per-
// word right/wrong stats for each of the three practice modes, plus a
// per-mode lesson-mastery flag store) so Word List, Flashcards, Writing, and
// Furigana all read/write the same live data instead of drifting out of sync
// with their own copies. localStorage-backed for now; Phase 9 wires these
// stores into the cross-device sync registry.
import { createContext, useContext, useEffect, useState } from 'react';
import { wordId } from './wordId';

const PROGRESS_KEY = 'jpstudy_progress_v1'; // flashcards
const KANJI_PROGRESS_KEY = 'jpstudy_kanji_progress_v1'; // writing
const FURIGANA_PROGRESS_KEY = 'jpstudy_furigana_progress_v1';
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

// Shared shape for all three per-word progress stores (flashcards' correct/
// wrong bookkeeping isn't used, but the mastered/weak flag semantics are
// identical: "mastered"/"weak" reflect only the LAST sitting with this word).
function useProgressStore(storageKey) {
  const [store, setStore] = useState(() => loadJSON(storageKey, {}));
  useEffect(() => { saveJSON(storageKey, store); }, [store]);

  const getStats = (item) => store[wordId(item)] || {};
  const isWeak = (item) => !!getStats(item).weak;
  const isMastered = (item) => !!getStats(item).mastered;

  const recordResult = (item, masteredThisSitting) => {
    setStore((prev) => ({
      ...prev,
      [wordId(item)]: { mastered: masteredThisSitting, weak: !masteredThisSitting, lastSeen: new Date().toISOString() },
    }));
  };

  const resetProgressFor = (items) => {
    const now = new Date().toISOString();
    setStore((prev) => {
      const next = { ...prev };
      items.forEach((item) => { next[wordId(item)] = { mastered: false, weak: false, lastSeen: now }; });
      return next;
    });
  };

  return { isWeak, isMastered, getStats, recordResult, resetProgressFor };
}

function useMasteryStore(storageKey) {
  const [store, setStore] = useState(() => loadJSON(storageKey, {}));
  useEffect(() => { saveJSON(storageKey, store); }, [store]);
  return {
    isPassed: (level, lesson) => !!store[lessonKey(level, lesson)],
    markPassed: (level, lesson) => {
      const k = lessonKey(level, lesson);
      setStore((prev) => (prev[k] ? prev : { ...prev, [k]: true }));
    },
  };
}

const VocabProgressContext = createContext(null);

export function VocabProgressProvider({ children }) {
  const flashcards = useProgressStore(PROGRESS_KEY);
  const writing = useProgressStore(KANJI_PROGRESS_KEY);
  const furigana = useProgressStore(FURIGANA_PROGRESS_KEY);

  const fcMastery = useMasteryStore(FC_MASTERY_KEY);
  const kwMastery = useMasteryStore(KW_MASTERY_KEY);
  const fgMastery = useMasteryStore(FG_MASTERY_KEY);

  // Word List's golden lesson chip: all three practice modes cleared.
  const isFullyMastered = (level, lesson) =>
    fcMastery.isPassed(level, lesson) && kwMastery.isPassed(level, lesson) && fgMastery.isPassed(level, lesson);

  return (
    <VocabProgressContext.Provider
      value={{
        // Flashcards' progress store stays exposed under the original flat
        // names, since it was the first (and most-used) consumer.
        isWeak: flashcards.isWeak,
        isMastered: flashcards.isMastered,
        getStats: flashcards.getStats,
        recordSessionResult: flashcards.recordResult,
        resetProgressFor: flashcards.resetProgressFor,
        writing,
        furigana,
        fcMastery,
        kwMastery,
        fgMastery,
        isFullyMastered,
      }}
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
