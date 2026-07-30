'use client';
// components/bible/BibleAppShell.jsx — top-level Bible section: a
// "currently reading" bookmark + completed-books count, and a free-pick
// library of all 66 books to open notes for any chapter, any time.
import { useBibleSync } from '../../lib/useBibleSync';
import { withNote, withCurrent, withCompletedToggled, withVersion } from '../../lib/bible/state';
import { ProgressHeader } from './ProgressHeader';
import { BookList } from './BookList';
import { VersionPicker } from './VersionPicker';

export function BibleAppShell() {
  const { state, setState, loading, offline } = useBibleSync();

  if (loading || !state) {
    return <div className="tk-loading-screen">Loading your notes…</div>;
  }

  const handleSetCurrent = (bookId) => setState((prev) => withCurrent(prev, bookId));
  const handleStopCurrent = () => setState((prev) => withCurrent(prev, null));
  const handleToggleCompleted = (bookId) => setState((prev) => withCompletedToggled(prev, bookId));
  const handleNoteChange = (bookId, chapter, text) => setState((prev) => withNote(prev, bookId, chapter, text));
  const handleVersionChange = (versionId) => setState((prev) => withVersion(prev, versionId));

  return (
    <div className="bib-app">
      <header className="bib-header">
        <div className="bib-header-top">
          <div>
            <h1 className="bib-title">Bible</h1>
            <p className="bib-subtitle">One book a month. God's Word on your heart every day.</p>
          </div>
          <VersionPicker versionId={state.versionId} onChange={handleVersionChange} />
        </div>
        {offline && <p className="bib-offline">Offline — changes are saved locally and will sync once you're back online.</p>}
      </header>
      <ProgressHeader state={state} onStopCurrent={handleStopCurrent} />
      <BookList
        state={state}
        onSetCurrent={handleSetCurrent}
        onToggleCompleted={handleToggleCompleted}
        onNoteChange={handleNoteChange}
      />
    </div>
  );
}
