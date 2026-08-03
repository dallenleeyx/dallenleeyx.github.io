'use client';
// components/japanese/notes/NotesSection.jsx — the Journal tab: lesson
// notes with a title, lesson date, and lightly-formatted body, sortable by
// date and searchable by title. Own lazy provider (LessonNotesProvider),
// same pattern as Vocab/Grammar wrapping their own progress providers
// rather than JapaneseAppShell owning every section's state up front.
import { useMemo, useState } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { LessonNotesProvider, useLessonNotes } from '../../../lib/japanese/LessonNotesContext';
import { RichTextEditor } from './RichTextEditor';
import { stripNoteMarkup } from '../../../lib/japanese/richText';
import { todayISO } from '../../../lib/japanese/timeline';

function emptyDraft() {
  return { title: '', date: todayISO(), body: '' };
}

function NotesEditorForm({ draft, setDraft, onSave, onCancel, onDelete, t }) {
  return (
    <div className="notes-form">
      <div className="notes-form-row">
        <input
          type="text"
          className="notes-title-input"
          placeholder={t('notesTitlePlaceholder')}
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
        <input
          type="date"
          className="notes-date-input"
          aria-label={t('notesDateLabel')}
          value={draft.date}
          onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
        />
      </div>
      <RichTextEditor
        value={draft.body}
        onChange={(body) => setDraft((d) => ({ ...d, body }))}
        placeholder={t('notesBodyPlaceholder')}
      />
      <div className="notes-form-actions">
        {onDelete && <button type="button" className="ghost-btn notes-delete-btn" onClick={onDelete}>{t('notesDelete')}</button>}
        <div className="notes-form-actions-right">
          <button type="button" className="ghost-btn" onClick={onCancel}>{t('notesCancel')}</button>
          <button type="button" className="ghost-btn btn-primary" onClick={onSave}>{t('notesSave')}</button>
        </div>
      </div>
    </div>
  );
}

function NotesList({ notes, query, sortOrder, onOpen, t }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? notes.filter((n) => (n.title || '').toLowerCase().includes(q)) : notes;
    return [...list].sort((a, b) => {
      const da = a.date || '';
      const db = b.date || '';
      return sortOrder === 'oldest' ? da.localeCompare(db) : db.localeCompare(da);
    });
  }, [notes, query, sortOrder]);

  if (!notes.length) return <p className="notes-empty">{t('notesEmpty')}</p>;
  if (!filtered.length) return <p className="notes-empty">{t('notesNoResults')}</p>;

  return (
    <div className="notes-list">
      {filtered.map((n) => (
        <button key={n.id} type="button" className="notes-card" onClick={() => onOpen(n)}>
          <div className="notes-card-header">
            <span className="notes-card-title">{n.title || t('notesUntitled')}</span>
            <span className="notes-card-date">{n.date}</span>
          </div>
          {n.body && <p className="notes-card-snippet">{stripNoteMarkup(n.body).slice(0, 160)}</p>}
        </button>
      ))}
    </div>
  );
}

function NotesSectionInner() {
  const { t } = useJapaneseI18n();
  const { notes, addNote, updateNote, deleteNote } = useLessonNotes();
  const [editing, setEditing] = useState(null); // null | 'new' | note object
  const [draft, setDraft] = useState(emptyDraft());
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const openNew = () => { setDraft(emptyDraft()); setEditing('new'); };
  const openExisting = (n) => { setDraft({ title: n.title || '', date: n.date || todayISO(), body: n.body || '' }); setEditing(n); };
  const cancel = () => setEditing(null);

  const save = () => {
    if (editing === 'new') addNote(draft);
    else if (editing) updateNote(editing.id, draft);
    setEditing(null);
  };

  const remove = () => {
    if (editing && editing !== 'new' && window.confirm(t('notesConfirmDelete'))) {
      deleteNote(editing.id);
      setEditing(null);
    }
  };

  if (editing) {
    return (
      <NotesEditorForm
        draft={draft}
        setDraft={setDraft}
        onSave={save}
        onCancel={cancel}
        onDelete={editing !== 'new' ? remove : null}
        t={t}
      />
    );
  }

  return (
    <>
      <div className="controls">
        <input
          type="search"
          className="wl-search-input"
          autoComplete="off"
          spellCheck="false"
          placeholder={t('notesSearchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="notes-controls-right">
          <div className="direction-toggle">
            <button type="button" className={`dir-btn${sortOrder === 'newest' ? ' active' : ''}`} onClick={() => setSortOrder('newest')}>{t('notesSortNewest')}</button>
            <button type="button" className={`dir-btn${sortOrder === 'oldest' ? ' active' : ''}`} onClick={() => setSortOrder('oldest')}>{t('notesSortOldest')}</button>
          </div>
          <button type="button" className="ghost-btn btn-primary" onClick={openNew}>{t('notesNewEntry')}</button>
        </div>
      </div>
      <NotesList notes={notes} query={query} sortOrder={sortOrder} onOpen={openExisting} t={t} />
    </>
  );
}

export function NotesSection() {
  return (
    <LessonNotesProvider>
      <NotesSectionInner />
    </LessonNotesProvider>
  );
}
