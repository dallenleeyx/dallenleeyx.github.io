'use client';
// components/bible/ProgressHeader.jsx — "currently reading" bookmark plus a
// simple completed-books count/history. `current` is just an intent marker
// (this is a free-library app, not a locked queue) -- picking a new book
// while one is already current just replaces it.
import { useState } from 'react';
import { BIBLE_BOOKS_BY_ID } from '../../lib/bible/books';

const DAY_MS = 24 * 60 * 60 * 1000;

export function ProgressHeader({ state, onStopCurrent }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const currentBook = state.current ? BIBLE_BOOKS_BY_ID[state.current.bookId] : null;
  const completedEntries = Object.entries(state.completed)
    .map(([bookId, info]) => ({ book: BIBLE_BOOKS_BY_ID[bookId], completedAt: info.completedAt }))
    .filter((e) => e.book)
    .sort((a, b) => b.completedAt - a.completedAt);

  const daysIn = currentBook ? Math.max(1, Math.floor((Date.now() - state.current.startedAt) / DAY_MS) + 1) : 0;

  return (
    <div className="bib-progress">
      <div className="bib-progress-current">
        {currentBook ? (
          <>
            <span className="bib-progress-label">Currently reading</span>
            <span className="bib-progress-book">{currentBook.name}</span>
            <span className="bib-progress-meta">day {daysIn}</span>
            <button className="tk-btn tk-btn-outline tk-btn-sm" onClick={onStopCurrent}>stop</button>
          </>
        ) : (
          <span className="bib-progress-empty">Pick a book below and mark it as "currently reading" to start this month's book.</span>
        )}
      </div>
      <button className="bib-progress-toggle" onClick={() => setHistoryOpen((o) => !o)}>
        {completedEntries.length} / 66 books finished {historyOpen ? '▲' : '▼'}
      </button>
      {historyOpen && (
        <ul className="bib-history">
          {completedEntries.length === 0 && <li className="bib-history-empty">No books finished yet.</li>}
          {completedEntries.map((e) => (
            <li key={e.book.id}>
              <span>{e.book.name}</span>
              <span className="bib-history-date">{new Date(e.completedAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
