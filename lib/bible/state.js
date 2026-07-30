// lib/bible/state.js — pure updater functions over the `bible` state blob
// ({ notes, completed, current, versionId }), used by useBibleSync's setState.
export const EMPTY_BIBLE_STATE = { notes: {}, completed: {}, current: null, versionId: null };

// notes: { [bookId]: { [chapterNumber]: text } }. An emptied-out note is
// deleted rather than kept as '', so a book/chapter with no notes never
// shows a stray "has notes" dot.
export function withNote(state, bookId, chapter, text) {
  const bookNotes = { ...(state.notes[bookId] || {}) };
  if (text && text.trim()) {
    bookNotes[chapter] = text;
  } else {
    delete bookNotes[chapter];
  }
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
