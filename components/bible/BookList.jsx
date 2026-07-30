'use client';
// components/bible/BookList.jsx — OT/NT grouped grid of all 66 books; picking
// one opens its chapter panel below the grid it belongs to.
import { useState } from 'react';
import { BIBLE_BOOKS, BIBLE_BOOKS_BY_ID } from '../../lib/bible/books';
import { BookPanel } from './BookPanel';

function BookGrid({ label, books, selectedId, state, onSelect }) {
  return (
    <section className="bib-testament">
      <h4 className="bib-testament-label">{label}</h4>
      <div className="bib-book-grid">
        {books.map((b) => {
          const isCurrent = !!(state.current && state.current.bookId === b.id);
          const isCompleted = !!state.completed[b.id];
          let cls = 'bib-book-btn';
          if (selectedId === b.id) cls += ' active';
          if (isCurrent) cls += ' is-current';
          if (isCompleted) cls += ' is-completed';
          return (
            <button key={b.id} className={cls} onClick={() => onSelect(b.id)}>
              {isCompleted && <span className="bib-book-check" aria-hidden="true">✓</span>}
              {b.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function BookList({ state, onSetCurrent, onToggleCompleted, onNoteChange }) {
  const [selectedId, setSelectedId] = useState(null);
  const ot = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
  const nt = BIBLE_BOOKS.filter((b) => b.testament === 'NT');
  const selected = selectedId ? BIBLE_BOOKS_BY_ID[selectedId] : null;

  const handleSelect = (id) => setSelectedId((prev) => (prev === id ? null : id));

  return (
    <div className="bib-book-list">
      <BookGrid label="Old Testament" books={ot} selectedId={selectedId} state={state} onSelect={handleSelect} />
      <BookGrid label="New Testament" books={nt} selectedId={selectedId} state={state} onSelect={handleSelect} />
      {selected && (
        <BookPanel
          book={selected}
          state={state}
          onSetCurrent={onSetCurrent}
          onToggleCompleted={onToggleCompleted}
          onNoteChange={onNoteChange}
        />
      )}
    </div>
  );
}
