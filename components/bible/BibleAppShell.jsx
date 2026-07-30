'use client';
// components/bible/BibleAppShell.jsx — top-level Bible section: a
// "currently reading" bookmark + completed-books count, a compact
// book/chapter/version picker, and a verse-by-verse reader with
// YouVersion-style verse-anchored notes for whatever chapter is selected.
import { useState } from 'react';
import { useBibleSync } from '../../lib/useBibleSync';
import { withCurrent, withCompletedToggled, withVersion, withVerseNote, withVerseNoteDeleted, notesForChapter } from '../../lib/bible/state';
import { ProgressHeader } from './ProgressHeader';
import { ReaderControls } from './ReaderControls';
import { VerseReader } from './VerseReader';

export function BibleAppShell() {
  const { state, setState, loading, offline } = useBibleSync();
  const [bookId, setBookId] = useState('genesis');
  const [chapter, setChapter] = useState(1);

  if (loading || !state) {
    return <div className="tk-loading-screen">Loading your notes…</div>;
  }

  const handleBookChange = (id) => { setBookId(id); setChapter(1); };
  const handleVersionChange = (versionId) => setState((prev) => withVersion(prev, versionId));
  const handleStopCurrent = () => setState((prev) => withCurrent(prev, null));
  const handleSetCurrent = () => setState((prev) => withCurrent(prev, (prev.current && prev.current.bookId === bookId) ? null : bookId));
  const handleToggleCompleted = () => setState((prev) => withCompletedToggled(prev, bookId));
  const handleSaveNote = (payload) => setState((prev) => withVerseNote(prev, bookId, chapter, payload));
  const handleDeleteNote = (noteId) => setState((prev) => withVerseNoteDeleted(prev, bookId, chapter, noteId));

  const isCurrent = !!(state.current && state.current.bookId === bookId);
  const isCompleted = !!state.completed[bookId];
  const chapterNotes = notesForChapter(state, bookId, chapter);

  return (
    <div className="bib-app">
      <header className="bib-header">
        <h1 className="bib-title">Bible</h1>
        <p className="bib-subtitle">One book a month. God's Word on your heart every day.</p>
        {offline && <p className="bib-offline">Offline — changes are saved locally and will sync once you're back online.</p>}
      </header>

      <ProgressHeader state={state} onStopCurrent={handleStopCurrent} />

      <ReaderControls
        state={state}
        bookId={bookId}
        chapter={chapter}
        onBookChange={handleBookChange}
        onChapterChange={setChapter}
        versionId={state.versionId}
        onVersionChange={handleVersionChange}
      />

      <div className="bib-book-actions">
        <button className={`tk-btn tk-btn-sm ${isCurrent ? 'tk-btn-primary' : 'tk-btn-outline'}`} onClick={handleSetCurrent}>
          {isCurrent ? 'currently reading' : 'set as currently reading'}
        </button>
        <button className={`tk-btn tk-btn-sm ${isCompleted ? 'tk-btn-primary' : 'tk-btn-outline'}`} onClick={handleToggleCompleted}>
          {isCompleted ? '✓ finished' : 'mark finished'}
        </button>
      </div>

      <VerseReader
        versionId={state.versionId}
        bookId={bookId}
        chapter={chapter}
        notes={chapterNotes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}
