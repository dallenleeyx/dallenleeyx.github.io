'use client';
// lib/japanese/LessonNotesContext.jsx — the Journal tab's lesson-note
// entries (title, lesson date, freeform body). Stored as a map keyed by id
// (not an array) so cross-device sync can merge per-entry instead of one
// device's whole snapshot clobbering the other's new entries -- see
// syncMerge.js's mergeLessonNotes. Deletions are soft (a `deleted: true`
// tombstone stamped with updatedAt) rather than removing the key outright,
// so a delete made on one device can't be "undone" by a stale copy another
// device still holds and syncs later -- the merge just compares updatedAt
// like any other edit.
import { createContext, useContext, useEffect, useState } from 'react';
import { useSyncSection } from './SyncContext';

const NOTES_KEY = 'jpstudy_lesson_notes_v1';

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

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const LessonNotesContext = createContext(null);

// Starts empty (SSR-safe) and restores the real saved value only after
// mount -- see ThemeProvider.jsx's file-level comment for why reading
// localStorage inside useState()'s initializer itself causes a hydration
// mismatch. The `hydrated` gate stops the save-effect from firing with the
// not-yet-restored empty store and overwriting the real saved data before
// it's even been read.
export function LessonNotesProvider({ children }) {
  const [store, setStore] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setStore(loadJSON(NOTES_KEY, {})); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveJSON(NOTES_KEY, store); }, [store, hydrated]);

  const schedulePush = useSyncSection('lessonNotes', {
    get: () => store,
    apply: (remote) => setStore(remote),
  });

  const notes = Object.entries(store)
    .filter(([, n]) => n && !n.deleted)
    .map(([id, n]) => ({ id, ...n }));

  const addNote = ({ title, date, body }) => {
    const id = makeId();
    const now = Date.now();
    setStore((prev) => ({ ...prev, [id]: { title, date, body, createdAt: now, updatedAt: now } }));
    schedulePush();
    return id;
  };

  const updateNote = (id, patch) => {
    setStore((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      return { ...prev, [id]: { ...existing, ...patch, updatedAt: Date.now() } };
    });
    schedulePush();
  };

  const deleteNote = (id) => {
    setStore((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      return { ...prev, [id]: { ...existing, deleted: true, updatedAt: Date.now() } };
    });
    schedulePush();
  };

  return (
    <LessonNotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </LessonNotesContext.Provider>
  );
}

export function useLessonNotes() {
  const ctx = useContext(LessonNotesContext);
  if (!ctx) throw new Error('useLessonNotes must be used within LessonNotesProvider');
  return ctx;
}
