'use client';
// components/bible/VerseReader.jsx — renders one chapter's passage
// verse-by-verse (superscript numbers, generous row spacing, a serif
// reading font) and owns YouVersion-style verse-anchored note-taking: tap a
// verse to select it, tap another verse to extend the range, then attach a
// note to that exact range. Tapping an already-annotated verse reopens its
// note for editing instead of starting a new selection.
import { useState } from 'react';
import { useBiblePassage } from '../../lib/useBiblePassage';
import { renderNotes } from '../../lib/bible/notesMarkdown';

function findNoteForVerse(notes, num) {
  return notes.find((n) => num >= Number(n.verseStart) && num <= Number(n.verseEnd));
}

export function VerseReader({ versionId, bookId, chapter, notes, onSaveNote, onDeleteNote }) {
  const { passage, loading, error } = useBiblePassage(versionId, bookId, chapter);
  const [selection, setSelection] = useState(null); // { start, end } | null
  const [editingNoteId, setEditingNoteId] = useState(null); // null while composing a brand-new note
  const [draftText, setDraftText] = useState('');

  const openComposerFor = (start, end, existing) => {
    setSelection({ start, end });
    setEditingNoteId(existing ? existing.id : null);
    setDraftText(existing ? existing.text : '');
  };

  const closeComposer = () => {
    setSelection(null);
    setEditingNoteId(null);
    setDraftText('');
  };

  const handleVerseClick = (num) => {
    if (selection) {
      setSelection({ start: Math.min(selection.start, num), end: Math.max(selection.end, num) });
      return;
    }
    openComposerFor(num, num, findNoteForVerse(notes, num));
  };

  const handleDelete = () => {
    if (editingNoteId) onDeleteNote(editingNoteId);
    closeComposer();
  };

  const handleSave = () => {
    if (!selection) return;
    const text = draftText.trim();
    if (!text) { handleDelete(); return; }
    onSaveNote({ id: editingNoteId, verseStart: selection.start, verseEnd: selection.end, text });
    closeComposer();
  };

  if (!versionId) {
    return <p className="bib-passage-hint">Choose a translation above to read and annotate this chapter.</p>;
  }
  if (loading) return <p className="bib-passage-hint">Loading passage…</p>;
  if (error) return <p className="bib-passage-error">Couldn't load this passage ({error}).</p>;
  if (!passage) return null;

  const sortedNotes = notes.slice().sort((a, b) => a.verseStart - b.verseStart);

  return (
    <div className="bib-passage">
      {passage.reference && <p className="bib-passage-ref">{passage.reference}</p>}
      <p className="bib-verse-hint">
        Tap a verse to select it, tap another to extend the range, then add a note. Tap a highlighted verse to edit its note.
      </p>

      <div className="bib-verse-list">
        {(passage.blocks || []).map((block, i) => {
          if (block.type === 'heading') {
            return <h4 className="bib-passage-heading" key={`h-${i}`}>{block.text}</h4>;
          }
          const num = Number(block.number);
          const inSelection = !!selection && num >= selection.start && num <= selection.end;
          const note = findNoteForVerse(notes, num);
          let cls = 'bib-verse-row';
          if (inSelection) cls += ' selected';
          if (note) cls += ' has-note';
          return (
            <button type="button" className={cls} key={`v-${block.number}`} onClick={() => handleVerseClick(num)}>
              <sup className="bib-verse-num">{block.number}</sup>
              <span className="bib-verse-text">{block.text}</span>
            </button>
          );
        })}
      </div>

      {passage.copyright && <p className="bib-passage-copyright">{passage.copyright}</p>}

      {selection && (
        <div className="bib-verse-composer">
          <p className="bib-verse-composer-title">
            {editingNoteId ? 'Edit note on' : 'Note on'} v.{selection.start}{selection.end !== selection.start ? `–${selection.end}` : ''}
          </p>
          <textarea
            className="bib-notes-input"
            autoFocus
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="What stood out to you here?"
            rows={5}
          />
          {draftText.trim() && <div className="bib-notes-preview">{renderNotes(draftText)}</div>}
          <div className="bib-verse-composer-actions">
            <button type="button" className="tk-btn tk-btn-outline tk-btn-sm" onClick={closeComposer}>cancel</button>
            {editingNoteId && <button type="button" className="tk-btn tk-btn-outline tk-btn-sm" onClick={handleDelete}>delete</button>}
            <button type="button" className="tk-btn tk-btn-primary tk-btn-sm" onClick={handleSave}>save</button>
          </div>
        </div>
      )}

      {sortedNotes.length > 0 && (
        <div className="bib-verse-notes-list">
          <p className="bib-verse-notes-list-title">Notes in this chapter</p>
          {sortedNotes.map((n) => (
            <button
              type="button"
              className="bib-verse-note-item"
              key={n.id}
              onClick={() => openComposerFor(Number(n.verseStart), Number(n.verseEnd), n)}
            >
              <span className="bib-verse-note-ref">v.{n.verseStart}{n.verseEnd !== n.verseStart ? `–${n.verseEnd}` : ''}</span>
              <span className="bib-verse-note-snippet">{n.text.length > 80 ? `${n.text.slice(0, 80)}…` : n.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
