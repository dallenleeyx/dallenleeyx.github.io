'use client';
// lib/japanese/VocabProgressContext.jsx — shared vocab progress state (per-
// word right/wrong stats for each of the three practice modes, plus a
// per-mode lesson-mastery flag store) so Word List, Flashcards, Writing, and
// Furigana all read/write the same live data instead of drifting out of sync
// with their own copies. localStorage-backed, and wired into the
// cross-device sync registry (lib/japanese/SyncContext.jsx) -- all three
// progress maps sync under their own key ('vocab'/'writing'/'furigana'), and
// the three lesson-mastery stores sync together under 'vocabMastery'.
import { createContext, useContext, useEffect, useState } from 'react';
import { wordId } from './wordId';
import { useSyncSection } from './SyncContext';

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
//
// Starts empty (SSR-safe) and restores the real saved value only after
// mount -- see ThemeProvider.jsx's file-level comment for why reading
// localStorage inside useState()'s initializer itself causes a hydration
// mismatch. The `hydrated` gate stops the save-effect from firing with the
// not-yet-restored empty store and overwriting the real saved data before
// it's even been read.
function useProgressStore(storageKey, syncKey) {
  const [store, setStore] = useState({});
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setStore(loadJSON(storageKey, {})); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveJSON(storageKey, store); }, [store, hydrated]);

  const schedulePush = useSyncSection(syncKey, {
    get: () => store,
    apply: (remote) => setStore(remote),
  });

  const getStats = (item) => store[wordId(item)] || {};
  const isWeak = (item) => !!getStats(item).weak;
  const isMastered = (item) => !!getStats(item).mastered;

  const recordResult = (item, masteredThisSitting) => {
    setStore((prev) => ({
      ...prev,
      [wordId(item)]: { mastered: masteredThisSitting, weak: !masteredThisSitting, lastSeen: new Date().toISOString() },
    }));
    schedulePush();
  };

  const resetProgressFor = (items) => {
    const now = new Date().toISOString();
    setStore((prev) => {
      const next = { ...prev };
      items.forEach((item) => { next[wordId(item)] = { mastered: false, weak: false, lastSeen: now }; });
      return next;
    });
    schedulePush();
  };

  return { isWeak, isMastered, getStats, recordResult, resetProgressFor };
}

// fc/kw/fg lesson-mastery flags all sync together under one 'vocabMastery'
// section (grammar practice's 'gp' badges live in GrammarProgressContext
// instead, since Vocab and Grammar are independently-mounted sections, not
// sequential owners of one shared store).
function useVocabMasteryStores() {
  const [fc, setFc] = useState({});
  const [kw, setKw] = useState({});
  const [fg, setFg] = useState({});
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setFc(loadJSON(FC_MASTERY_KEY, {}));
    setKw(loadJSON(KW_MASTERY_KEY, {}));
    setFg(loadJSON(FG_MASTERY_KEY, {}));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveJSON(FC_MASTERY_KEY, fc); }, [fc, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(KW_MASTERY_KEY, kw); }, [kw, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(FG_MASTERY_KEY, fg); }, [fg, hydrated]);

  const schedulePush = useSyncSection('vocabMastery', {
    get: () => ({ fc, kw, fg }),
    apply: (remote) => {
      if (remote.fc) setFc(remote.fc);
      if (remote.kw) setKw(remote.kw);
      if (remote.fg) setFg(remote.fg);
    },
  });

  const makeStore = (map, setMap) => ({
    isPassed: (level, lesson) => !!map[lessonKey(level, lesson)],
    markPassed: (level, lesson) => {
      const k = lessonKey(level, lesson);
      setMap((prev) => (prev[k] ? prev : { ...prev, [k]: true }));
      schedulePush();
    },
  });

  return { fcMastery: makeStore(fc, setFc), kwMastery: makeStore(kw, setKw), fgMastery: makeStore(fg, setFg) };
}

const VocabProgressContext = createContext(null);

export function VocabProgressProvider({ children }) {
  const flashcards = useProgressStore(PROGRESS_KEY, 'vocab');
  const writing = useProgressStore(KANJI_PROGRESS_KEY, 'writing');
  const furigana = useProgressStore(FURIGANA_PROGRESS_KEY, 'furigana');

  const { fcMastery, kwMastery, fgMastery } = useVocabMasteryStores();

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
