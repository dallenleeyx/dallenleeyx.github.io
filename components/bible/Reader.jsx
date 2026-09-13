'use client';
// components/bible/Reader.jsx — a browsable whole-Bible reader: pick a book
// and chapter (or type a reference to jump straight there), flip through
// with prev/next, and it fetches that chapter live from the passage proxy
// on every navigation -- nothing pre-downloaded or cached, same as opening
// a chapter in YouVersion itself. Position isn't part of the synced state
// (it's not something worth merging across devices), just remembered
// per-browser in localStorage as a convenience.
import { useEffect, useState } from 'react';
import { BOOKS } from '../../lib/bible/books';
import { parseRef } from '../../lib/bible/refs';
import { VerseText } from './VerseText';

const LAST_POSITION_KEY = 'bibleReaderPosition';

export function Reader() {
  const [bookIdx, setBookIdx] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [result, setResult] = useState(null);
  const [jumpInput, setJumpInput] = useState('');
  const [jumpError, setJumpError] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_POSITION_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Number.isInteger(saved.bookIdx) && saved.bookIdx >= 0 && saved.bookIdx < BOOKS.length) {
          setBookIdx(saved.bookIdx);
        }
        if (Number.isInteger(saved.chapter) && saved.chapter >= 1) setChapter(saved.chapter);
      }
    } catch (e) {
      // ignore -- just start at Genesis 1
    }
  }, []);

  const book = BOOKS[bookIdx];

  useEffect(() => {
    let cancelled = false;
    setResult({ status: 'loading' });
    const ref = `${book.name} ${chapter}`;
    fetch(`/api/bible/passage?ref=${encodeURIComponent(ref)}&version=NIV`)
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => { if (!cancelled) setResult({ status: ok ? 'ok' : 'error', data: body }); })
      .catch(() => { if (!cancelled) setResult({ status: 'error', data: null }); });
    try {
      localStorage.setItem(LAST_POSITION_KEY, JSON.stringify({ bookIdx, chapter }));
    } catch (e) {
      // private browsing, storage full, etc. -- position just won't persist
    }
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookIdx, chapter]);

  function goToBook(idx) {
    setBookIdx(idx);
    setChapter(1);
  }

  function goPrev() {
    if (chapter > 1) { setChapter((c) => c - 1); return; }
    if (bookIdx > 0) {
      const prevIdx = bookIdx - 1;
      setBookIdx(prevIdx);
      setChapter(BOOKS[prevIdx].chapters);
    }
  }

  function goNext() {
    if (chapter < book.chapters) { setChapter((c) => c + 1); return; }
    if (bookIdx < BOOKS.length - 1) goToBook(bookIdx + 1);
  }

  function handleJump(e) {
    e.preventDefault();
    const parsed = parseRef(jumpInput);
    if (!parsed) {
      setJumpError(`Could not parse "${jumpInput}" as a reference.`);
      return;
    }
    const idx = BOOKS.findIndex((b) => b.code === parsed.code);
    if (idx === -1) {
      setJumpError(`Could not find "${jumpInput}".`);
      return;
    }
    setJumpError(null);
    setBookIdx(idx);
    setChapter(parsed.chapter || 1);
    setJumpInput('');
  }

  const isFirst = bookIdx === 0 && chapter === 1;
  const isLast = bookIdx === BOOKS.length - 1 && chapter === book.chapters;
  const chapterOptions = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="bible-reader">
      <form className="bible-reader-jump-form" onSubmit={handleJump}>
        <input
          className="bible-form-input bible-reader-input"
          value={jumpInput}
          onChange={(e) => setJumpInput(e.target.value)}
          placeholder="Jump to a reference, e.g. Romans 8:28"
        />
        <button className="bible-ghost-btn" type="submit">Go</button>
      </form>
      {jumpError && <p className="bible-ref-missing">{jumpError}</p>}

      <div className="bible-reader-controls">
        <select
          className="bible-form-input bible-reader-book-select"
          value={bookIdx}
          onChange={(e) => goToBook(Number(e.target.value))}
        >
          {BOOKS.map((b, i) => <option key={b.code} value={i}>{b.name}</option>)}
        </select>
        <select
          className="bible-form-input bible-reader-chapter-select"
          value={chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
        >
          {chapterOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bible-reader-panes">
        <div className="bible-reader-pane">
          <div className="bible-reader-pane-head">
            <span className="bible-version-badge">NIV</span>
            <span className="bible-reader-pane-ref">{book.name} {chapter}</span>
          </div>
          {result?.status === 'loading' && <p className="bible-ref-loading">Loading…</p>}
          {result?.status === 'error' && <p className="bible-ref-missing">{result.data?.error || 'Could not load this chapter.'}</p>}
          {result?.status === 'ok' && (
            <>
              <p className="bible-reader-pane-text"><VerseText text={result.data.text} /></p>
              {result.data.placeholder && <p className="bible-ref-placeholder-note">{result.data.label}</p>}
            </>
          )}
        </div>
      </div>

      <div className="bible-reader-chapter-nav">
        <button className="bible-ghost-btn" onClick={goPrev} disabled={isFirst}>← previous chapter</button>
        <button className="bible-ghost-btn" onClick={goNext} disabled={isLast}>next chapter →</button>
      </div>
    </div>
  );
}
