'use client';
// components/tracker/NotesEditor.jsx — full-screen, Overleaf-style notes editor
import { useEffect, useRef, useState } from 'react';
import {
  extractToc, renderDoc, MATH_CMDS, ENV_TYPES, ENV_LABELS,
  blockTemplate, mathTemplate, flagInlineTemplate,
} from '../../lib/markdown';
import { ZoomableNotes } from './ZoomableNotes';

const MIN_EDIT_PCT = 25;
const MAX_EDIT_PCT = 75;

export function NotesEditor({ course, doc, onClose, onChange }) {
  const taRef = useRef(null);
  const layoutRef = useRef(null);
  const dragRef = useRef(null);
  const toc = extractToc(doc, 'nh-');
  // After inserting a titled environment (theorem, definition, …), Tab jumps
  // from the title to the content placeholder on the next line. One-shot:
  // cleared as soon as it's used, or as soon as another snippet/edit happens.
  const envTabStopRef = useRef(null);
  const [editPct, setEditPct] = useState(() => { try { return Number(localStorage.getItem('proofLabEditorSplit')) || 50; } catch (e) { return 50; } });
  const [tocCollapsed, setTocCollapsed] = useState(() => { try { return localStorage.getItem('proofLabTocCollapsed') === '1'; } catch (e) { return false; } });

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleToc = () => {
    setTocCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem('proofLabTocCollapsed', next ? '1' : '0'); } catch (e) {}
      return next;
    });
  };

  // Draggable divider between the edit and preview panes -- lets you weight
  // the split toward whichever you're using, instead of a fixed 50/50.
  const startResize = (e) => {
    e.preventDefault();
    const rect = layoutRef.current.getBoundingClientRect();
    dragRef.current = { rect };
    const onMove = (ev) => {
      const { rect: r } = dragRef.current;
      const pct = ((ev.clientX - r.left) / r.width) * 100;
      setEditPct(Math.min(MAX_EDIT_PCT, Math.max(MIN_EDIT_PCT, pct)));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      dragRef.current = null;
      setEditPct((pct) => {
        try { localStorage.setItem('proofLabEditorSplit', String(pct)); } catch (err) {}
        return pct;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const insertSnippet = ({ text, selStart, selEnd, hasName }, blockLevel) => {
    const ta = taRef.current;
    const value = doc || '';
    const start = ta ? ta.selectionStart : value.length;
    const end = ta ? ta.selectionEnd : value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const pad = blockLevel && before.length && !before.endsWith('\n') ? '\n' : '';
    onChange(before + pad + text + after);
    const base = before.length + pad.length;
    envTabStopRef.current = hasName
      ? { titleLine: (before + pad).split('\n').length - 1 }
      : null;
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(base + selStart, base + selEnd);
    });
  };

  // Replaces the current selection with open+selection+close, leaving the
  // wrapped text selected -- or, with no selection, places the cursor
  // between open/close so typing immediately continues inside the pair.
  const wrapSelection = (open, close) => {
    const ta = taRef.current;
    if (!ta) return;
    const value = doc || '';
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    onChange(value.slice(0, start) + open + selected + close + value.slice(end));
    const newStart = start + open.length;
    const newEnd = newStart + selected.length;
    envTabStopRef.current = null;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newStart, newEnd);
    });
  };

  const handleKeyDown = (e) => {
    const ta = taRef.current;
    if (!ta) return;
    const mod = e.ctrlKey || e.metaKey;

    if (mod && !e.altKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      wrapSelection('**', '**');
      return;
    }
    if (mod && !e.altKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      wrapSelection('*', '*');
      return;
    }

    if (e.key === '$' && !mod && !e.altKey) {
      const { selectionStart: start, selectionEnd: end } = ta;
      const value = doc || '';
      envTabStopRef.current = null;
      if (start === end && value[start] === '$') {
        // typing over an already-present $ -- skip past it instead of
        // inserting a second one
        e.preventDefault();
        ta.setSelectionRange(start + 1, start + 1);
        return;
      }
      e.preventDefault();
      wrapSelection('$', '$');
      return;
    }

    if (e.key === 'Tab') {
      const stop = envTabStopRef.current;
      const value = doc || '';
      if (stop) {
        const cursorLine = value.slice(0, ta.selectionStart).split('\n').length - 1;
        if (cursorLine === stop.titleLine) {
          e.preventDefault();
          const lines = value.split('\n');
          let offset = 0;
          for (let i = 0; i <= stop.titleLine; i++) offset += lines[i].length + 1;
          const contentLine = lines[stop.titleLine + 1] ?? '';
          envTabStopRef.current = null;
          ta.setSelectionRange(offset, offset + contentLine.length);
          return;
        }
      }
      if (ta.selectionStart === ta.selectionEnd && value[ta.selectionStart] === '$') {
        e.preventDefault();
        ta.setSelectionRange(ta.selectionStart + 1, ta.selectionStart + 1);
      }
    }
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
        <div className={`tk-doc-layout${tocCollapsed ? ' toc-collapsed' : ''}`} ref={layoutRef}>
          <div className="tk-doc-toc">
            <button className="tk-toc-toggle" onClick={toggleToc} title={tocCollapsed ? 'Show contents' : 'Hide contents'}>
              {tocCollapsed ? '»' : '« Contents'}
            </button>
            {!tocCollapsed && (
              toc.length ? toc.map(h => (
                <a key={h.id} className={`tk-doc-toc-item lvl${h.level}`} onClick={() => scrollToHeading(h.id)}>{h.text || 'Untitled'}</a>
              )) : <div className="tk-doc-toc-empty">Add a # heading</div>
            )}
          </div>
          <div className="tk-doc-edit" style={{ flexBasis: `${editPct}%` }}>
            <textarea
              ref={taRef}
              className="tk-doc-textarea"
              value={doc || ''}
              placeholder={'# Heading\n\nWrite here — **bold**, *italic*, $x^2$, $$\\int f\\,dx$$ …\nUse the toolbar for \\mathcal, \\mathbb, theorem/definition blocks, or a flag.'}
              onChange={e => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="tk-resize-handle" onMouseDown={startResize} title="Drag to resize">
            <span />
          </div>
          <div className="tk-doc-preview" style={{ flexBasis: `${100 - editPct}%` }}>
            <ZoomableNotes>
              {(doc || '').trim() ? renderDoc(doc, 'nh-') : <div className="tk-note-p tk-note-empty">Nothing written yet.</div>}
            </ZoomableNotes>
          </div>
        </div>
      </div>
    </div>
  );
}
