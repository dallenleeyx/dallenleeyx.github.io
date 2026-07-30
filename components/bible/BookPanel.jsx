'use client';
// components/bible/BookPanel.jsx — the selected book's chapter grid plus an
// inline accordion for one chapter's notes at a time.
import { useState } from 'react';
import { ChapterNotes } from './ChapterNotes';
import { PassageView } from './PassageView';

export function BookPanel({ book, state, onSetCurrent, onToggleCompleted, onNoteChange }) {
  const [openChapter, setOpenChapter] = useState(null);
  const bookNotes = state.notes[book.id] || {};
  const isCurrent = !!(state.current && state.current.bookId === book.id);
  const isCompleted = !!state.completed[book.id];
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="bib-panel">
      <div className="bib-panel-header">
        <h3 className="bib-panel-title">{book.name}</h3>
        <div className="bib-panel-actions">
          <button
            className={`tk-btn tk-btn-sm ${isCurrent ? 'tk-btn-primary' : 'tk-btn-outline'}`}
            onClick={() => onSetCurrent(isCurrent ? null : book.id)}
          >
            {isCurrent ? 'currently reading' : 'set as currently reading'}
          </button>
          <button
            className={`tk-btn tk-btn-sm ${isCompleted ? 'tk-btn-primary' : 'tk-btn-outline'}`}
            onClick={() => onToggleCompleted(book.id)}
          >
            {isCompleted ? '✓ finished' : 'mark finished'}
          </button>
        </div>
      </div>

      <div className="bib-chapter-grid">
        {chapters.map((c) => (
          <button
            key={c}
            className={`bib-chapter-btn${openChapter === c ? ' active' : ''}${bookNotes[c] ? ' has-notes' : ''}`}
            onClick={() => setOpenChapter(openChapter === c ? null : c)}
          >
            {c}
          </button>
        ))}
      </div>

      {openChapter && (
        <div className="bib-chapter-detail">
          <p className="bib-chapter-detail-title">{book.name} {openChapter}</p>
          <PassageView versionId={state.versionId} bookId={book.id} chapter={openChapter} />
          <ChapterNotes
            value={bookNotes[openChapter] || ''}
            onChange={(text) => onNoteChange(book.id, openChapter, text)}
          />
        </div>
      )}
    </div>
  );
}
