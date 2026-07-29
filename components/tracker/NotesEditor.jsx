'use client';
// components/tracker/NotesEditor.jsx — full-screen, Overleaf-style notes editor
import { useEffect, useRef } from 'react';
import {
  extractToc, renderDoc, MATH_CMDS, ENV_TYPES, ENV_LABELS,
  blockTemplate, mathTemplate, flagInlineTemplate,
} from '../../lib/markdown';

export function NotesEditor({ course, doc, onClose, onChange }) {
  const taRef = useRef(null);
  const toc = extractToc(doc, 'nh-');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const insertSnippet = ({ text, selStart, selEnd }, blockLevel) => {
    const ta = taRef.current;
    const value = doc || '';
    const start = ta ? ta.selectionStart : value.length;
    const end = ta ? ta.selectionEnd : value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const pad = blockLevel && before.length && !before.endsWith('\n') ? '\n' : '';
    onChange(before + pad + text + after);
    const base = before.length + pad.length;
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(base + selStart, base + selEnd);
    });
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="tk-editor-overlay">
      <div className="tk-editor-topbar">
        <button className="tk-mono-btn" onClick={onClose}>← Back</button>
        <div className="tk-editor-course">{course.glyph} · {course.name} — Notes</div>
        <div style={{ width: 64 }} />
      </div>
      <div className="tk-doc-toolbar">
        {MATH_CMDS.map(m => (
          <button key={m.cmd} className="tk-mono-btn" onClick={() => insertSnippet(mathTemplate(m.cmd), false)}>{m.glyph} {m.cmd}</button>
        ))}
        <span className="tk-toolbar-sep" />
        {ENV_TYPES.map(t => (
          <button key={t} className="tk-mono-btn" onClick={() => insertSnippet(blockTemplate(t), true)}>{ENV_LABELS[t]}</button>
        ))}
        <span className="tk-toolbar-sep" />
        <button className="tk-mono-btn tk-flag-toolbar-btn" onClick={() => insertSnippet(flagInlineTemplate(), false)}>🚩 Flag</button>
      </div>
      <div className="tk-editor-body">
        <div className="tk-doc-layout">
          <div className="tk-doc-toc">
            <div className="tk-doc-toc-label">Contents</div>
            {toc.length ? toc.map(h => (
              <a key={h.id} className={`tk-doc-toc-item lvl${h.level}`} onClick={() => scrollToHeading(h.id)}>{h.text || 'Untitled'}</a>
            )) : <div className="tk-doc-toc-empty">Add a # heading</div>}
          </div>
          <div className="tk-doc-edit">
            <textarea
              ref={taRef}
              className="tk-doc-textarea"
              value={doc || ''}
              placeholder={'# Heading\n\nWrite here — **bold**, *italic*, $x^2$, $$\\int f\\,dx$$ …\nUse the toolbar for \\mathcal, \\mathbb, theorem/definition blocks, or a flag.'}
              onChange={e => onChange(e.target.value)}
            />
          </div>
          <div className="tk-doc-preview">
            {(doc || '').trim() ? renderDoc(doc, 'nh-') : <div className="tk-note-p tk-note-empty">Nothing written yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
