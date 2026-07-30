'use client';
// components/bible/ReaderControls.jsx — the compact "book / chapter /
// version" picker row, replacing the old book-grid + chapter-grid layout:
// three custom dropdowns side by side (wrapping on narrow screens) so
// picking where to read takes almost no vertical space.
import { BIBLE_BOOKS, BIBLE_BOOKS_BY_ID } from '../../lib/bible/books';
import { Dropdown } from './Dropdown';
import { VersionPicker } from './VersionPicker';

function bookLabel(book, state) {
  const prefix = state.completed[book.id] ? '✓ ' : '';
  const suffix = state.current && state.current.bookId === book.id ? ' — reading' : '';
  return `${prefix}${book.name}${suffix}`;
}

export function ReaderControls({ state, bookId, chapter, onBookChange, onChapterChange, versionId, onVersionChange }) {
  const bookOptions = [
    {
      groupLabel: 'Old Testament',
      options: BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => ({ value: b.id, label: bookLabel(b, state) })),
    },
    {
      groupLabel: 'New Testament',
      options: BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => ({ value: b.id, label: bookLabel(b, state) })),
    },
  ];

  const book = BIBLE_BOOKS_BY_ID[bookId];
  const chapterOptions = book
    ? Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
        const hasNotes = ((state.notes[bookId] || {})[n] || []).length > 0;
        return { value: n, label: `${hasNotes ? '• ' : ''}Chapter ${n}` };
      })
    : [];

  return (
    <div className="bib-reader-controls">
      <Dropdown
        value={bookId}
        options={bookOptions}
        onChange={onBookChange}
        placeholder="Choose a book…"
        className="bib-dropdown-book"
      />
      <Dropdown
        value={chapter}
        options={chapterOptions}
        onChange={(v) => onChapterChange(Number(v))}
        placeholder="Chapter"
        className="bib-dropdown-chapter"
      />
      <VersionPicker versionId={versionId} onChange={onVersionChange} />
    </div>
  );
}
