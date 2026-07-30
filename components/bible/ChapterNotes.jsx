'use client';
// components/bible/ChapterNotes.jsx — a plain journal box for one chapter's
// notes: a textarea plus a live-rendered preview underneath, like the rest
// of this app's "type on the left, see it rendered" notes editors, just
// without the Math site's LaTeX/theorem-block machinery.
import { renderNotes } from '../../lib/bible/notesMarkdown';

export function ChapterNotes({ value, onChange }) {
  const rendered = renderNotes(value);
  return (
    <div className="bib-notes">
      <textarea
        className="bib-notes-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'What stood out to you in this chapter?\n\nUse # for a heading, ** for bold, * for italic, - for a list.'}
        rows={8}
      />
      {value && value.trim() && (
        <div className="bib-notes-preview">{rendered}</div>
      )}
    </div>
  );
}
