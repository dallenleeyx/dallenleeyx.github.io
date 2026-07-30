// lib/bible/state.js — pure updater functions over the `bible` state blob
// ({ notes, completed, current, versionId }), used by useBibleSync's setState.
export const EMPTY_BIBLE_STATE = { notes: {}, completed: {}, current: null, versionId: null };

function genNoteId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// Guards against the pre-revamp shape (a single freeform string per
// chapter, from before notes were anchored to verse ranges) -- any
// leftover data in that old shape is just treated as no notes rather than
// crashing, instead of writing a migration for a feature that shipped
// only moments earlier.
export function notesForChapter(state, bookId, chapter) {
  const raw = state.notes[bookId] && state.notes[bookId][chapter];
  return Array.isArray(raw) ? raw : [];
}

// notes: { [bookId]: { [chapterNumber]: [{ id, verseStart, verseEnd, text,
// updatedAt }] } } -- YouVersion-style: a note is anchored to one verse or a
// contiguous verse range, not the whole chapter. Passing an existing note's
// `id` updates it in place; omitting `id` creates a new one.
export function withVerseNote(state, bookId, chapter, { id, verseStart, verseEnd, text }) {
  const existing = notesForChapter(state, bookId, chapter);
  const nextNotes = id
    ? existing.map((n) => (n.id === id ? { ...n, verseStart, verseEnd, text, updatedAt: Date.now() } : n))
    : [...existing, { id: genNoteId(), verseStart, verseEnd, text, updatedAt: Date.now() }];
  const bookNotes = { ...(state.notes[bookId] || {}), [chapter]: nextNotes };
  return { ...state, notes: { ...state.notes, [bookId]: bookNotes } };
}

export function withVerseNoteDeleted(state, bookId, chapter, noteId) {
  const nextNotes = notesForChapter(state, bookId, chapter).filter((n) => n.id !== noteId);
  const bookNotes = { ...(state.notes[bookId] || {}) };
  if (nextNotes.length) bookNotes[chapter] = nextNotes;
  else delete bookNotes[chapter];
  const notes = { ...state.notes };
  if (Object.keys(bookNotes).length) notes[bookId] = bookNotes;
  else delete notes[bookId];
  return { ...state, notes };
}

export function withVersion(state, versionId) {
  return { ...state, versionId: versionId || null };
}

export function withCurrent(state, bookId) {
  if (!bookId) return { ...state, current: null };
  return { ...state, current: { bookId, startedAt: Date.now() } };
}

// Marking a book done clears it from "currently reading" (it's finished);
// un-marking it (a misclick) leaves `current` alone rather than guessing.
export function withCompletedToggled(state, bookId) {
  const wasCompleted = !!state.completed[bookId];
  const completed = { ...state.completed };
  if (wasCompleted) delete completed[bookId];
  else completed[bookId] = { completedAt: Date.now() };
  const current = (!wasCompleted && state.current && state.current.bookId === bookId) ? null : state.current;
  return { ...state, completed, current };
}
