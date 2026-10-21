'use client';
// lib/japanese/VocabProgressContext.jsx — shared vocab progress state (per-
// word right/wrong stats for each of the three practice modes, plus a
// per-mode lesson-mastery flag store) so Word List, Flashcards, Writing, and
// Furigana all read/write the same live data instead of drifting out of sync
// with their own copies. localStorage-backed, and wired into the
// cross-device sync registry (lib/japanese/SyncContext.jsx) -- all three
// progress maps sync under their own key ('vocab'/'writing'/'furigana'), and
// the three lesson-mastery stores sync together under 'vocabMastery'.
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { wordId } from './wordId';
import { useSyncSection } from './SyncContext';
import { mergeWeakWords } from './syncMerge';

const PROGRESS_KEY = 'jpstudy_progress_v1'; // flashcards
const KANJI_PROGRESS_KEY = 'jpstudy_kanji_progress_v1'; // writing
const FURIGANA_PROGRESS_KEY = 'jpstudy_furigana_progress_v1';
const FC_MASTERY_KEY = 'jpstudy_fc_lesson_passed_v1';
const KW_MASTERY_KEY = 'jpstudy_kw_lesson_passed_v1';
const FG_MASTERY_KEY = 'jpstudy_fg_lesson_passed_v1';
const WEAK_WORDS_KEY = 'jpstudy_manual_weak_words_v1';

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

// Shared per-word practice progress stores; grading changes mastery only.
// Weak words are now selected explicitly in a separate store.
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
  const isMastered = (item) => !!getStats(item).mastered;

  const recordResult = (item, masteredThisSitting) => {
    setStore((prev) => ({
      ...prev,
      [wordId(item)]: { mastered: masteredThisSitting, lastSeen: new Date().toISOString() },
    }));
    schedulePush();
  };

  const resetProgressFor = (items) => {
    const now = new Date().toISOString();
    setStore((prev) => {
      const next = { ...prev };
      items.forEach((item) => { next[wordId(item)] = { mastered: false, lastSeen: now }; });
      return next;
    });
    schedulePush();
  };

  return { isMastered, getStats, recordResult, resetProgressFor };
}

// Manual weak-word flags use separate local storage and cross-device sync.
// Keeping false entries makes unmarking survive merges with older devices.
function useManualWeakWords() {
  const [flags, setFlags] = useState({});
  // Keep the latest edit available synchronously to the sync layer. React
  // state updates are batched, so a push started from a toggle can otherwise
  // read the previous render's snapshot, especially when a tab is hidden.
  const flagsRef = useRef({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadJSON(WEAK_WORDS_KEY, {});
    flagsRef.current = saved;
    setFlags(saved);
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveJSON(WEAK_WORDS_KEY, flags); }, [flags, hydrated]);

  const schedulePush = useSyncSection('weakWords', {
    // Never sync the initial empty placeholder before localStorage has loaded.
    ready: () => hydrated,
    get: () => flagsRef.current,
    apply: (remote) => {
      // A remote GET may have started before a new local click. Merge against
      // the current ref so it cannot undo that click when the response arrives.
      const merged = mergeWeakWords(flagsRef.current, remote);
      flagsRef.current = merged;
      setFlags(merged);
    },
  });

  const isWeak = (item) => !!flags[wordId(item)]?.marked;
  const toggleWeak = (item) => {
    if (!hydrated) return;
    const id = wordId(item);
    const prev = flagsRef.current;
    const next = {
      ...prev,
      [id]: {
        marked: !prev[id]?.marked,
        updatedAt: Math.max(Date.now(), (Number(prev[id]?.updatedAt) || 0) + 1),
      },
    };
    flagsRef.current = next;
    setFlags(next);
    // Persist immediately even if the user closes this tab before React's
    // next effect or the debounced network request has had time to finish.
    saveJSON(WEAK_WORDS_KEY, next);
    schedulePush(250);
  };
  return { isWeak, toggleWeak };
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
    // Manual override for restoring lost progress without redoing the
    // practice run -- see LessonChips' editMode: markPassed alone was
    // write-only (no way to undo an accidental toggle, or clear a lesson
    // you didn't mean to mark).
    unmarkPassed: (level, lesson) => {
      const k = lessonKey(level, lesson);
      setMap((prev) => {
        if (!prev[k]) return prev;
        const next = { ...prev };
        delete next[k];
        return next;
      });
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
  const weakWords = useManualWeakWords();

  const { fcMastery, kwMastery, fgMastery } = useVocabMasteryStores();

  // Word List's golden lesson chip: all three practice modes cleared.
  const isFullyMastered = (level, lesson) =>
    fcMastery.isPassed(level, lesson) && kwMastery.isPassed(level, lesson) && fgMastery.isPassed(level, lesson);

  return (
    <VocabProgressContext.Provider
      value={{
        // Flashcards' progress store stays exposed under the original flat
        // names, since it was the first (and most-used) consumer.
        isWeak: weakWords.isWeak,
        toggleWeak: weakWords.toggleWeak,
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
