'use client';
// components/japanese/notes/RichTextEditor.jsx — bold/italic/highlight
// toolbar over a plain textarea (wraps the current selection in **/*/==
// markers, or leaves the cursor between them with nothing selected), the
// same UX as the math site's NotesEditor.wrapSelection, plus a live
// preview rendered in the Japanese display font.
import { useRef } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { renderNoteBody } from '../../../lib/japanese/richText';

export function RichTextEditor({ value, onChange, placeholder }) {
  const { t } = useJapaneseI18n();
  const taRef = useRef(null);

  const wrapSelection = (marker) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    onChange(value.slice(0, start) + marker + selected + marker + value.slice(end));
    const newStart = start + marker.length;
    const newEnd = newStart + selected.length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newStart, newEnd);
    });
  };

  return (
    <div className="notes-editor">
      <div className="notes-editor-toolbar">
        <button type="button" className="ghost-btn notes-fmt-btn" title={t('notesBold')} onClick={() => wrapSelection('**')}><strong>B</strong></button>
        <button type="button" className="ghost-btn notes-fmt-btn" title={t('notesItalic')} onClick={() => wrapSelection('*')}><em>I</em></button>
        <button type="button" className="ghost-btn notes-fmt-btn notes-fmt-highlight" title={t('notesHighlight')} onClick={() => wrapSelection('==')}>H</button>
      </div>
      <textarea
        ref={taRef}
        className="notes-textarea"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value.trim() && (
        <div className="notes-preview">
          <div className="notes-preview-label">{t('notesPreviewLabel')}</div>
          <div className="notes-preview-body" dangerouslySetInnerHTML={{ __html: renderNoteBody(value) }} />
        </div>
      )}
    </div>
  );
}
