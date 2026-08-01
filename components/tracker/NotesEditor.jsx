'use client';
// components/tracker/NotesEditor.jsx — full-screen, Overleaf-style notes
// editor. Source is real Typst (see lib/typst/*) compiled to a live SVG
// preview, not the old markdown-shorthand + KaTeX renderer.
import { useEffect, useRef, useState } from 'react';
import {
  extractTypstToc, MATH_CMDS, ENV_TYPES, ENV_LABELS,
  blockTemplate, mathTemplate, flagInlineTemplate,
} from '../../lib/typst/snippets';
import { typstLiveChannelName } from '../../lib/typst/liveChannel';
import { TypstPreview } from './TypstPreview';

const MIN_EDIT_PCT = 25;
const MAX_EDIT_PCT = 75;
const BROADCAST_DEBOUNCE_MS = 250;

export function NotesEditor({ course, doc, onClose, onChange }) {
  const taRef = useRef(null);
  const layoutRef = useRef(null);
  const dragRef = useRef(null);
  const previewRef = useRef(null);
  const channelRef = useRef(null);
  const previewWindowRef = useRef(null);
  const toc = extractTypstToc(doc);
  // After inserting a titled environment (theorem, definition, …), Tab jumps
  // from the title to the content placeholder on the next line. One-shot:
  // cleared as soon as it's used, or as soon as another snippet/edit happens.
  const envTabStopRef = useRef(null);
  const [editPct, setEditPct] = useState(() => { try { return Number(localStorage.getItem('proofLabEditorSplit')) || 50; } catch (e) { return 50; } });
  const [tocCollapsed, setTocCollapsed] = useState(() => { try { return localStorage.getItem('proofLabTocCollapsed') === '1'; } catch (e) { return false; } });
  // "split" = preview inline, next to the textarea (default). "browser" =
  // preview lives in a separate tab (see app/typst-preview/[courseId]),
  // Overleaf-style, so the editor pane gets the full width instead.
  const [previewMode, setPreviewMode] = useState(() => { try { return localStorage.getItem('proofLabPreviewMode') || 'split'; } catch (e) { return 'split'; } });

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Mirrors this course's live source to a BroadcastChannel so a popped-out
  // "view in browser" preview tab (which has no textarea of its own) stays
  // in sync as you type here, debounced the same way the inline preview is.
  useEffect(() => {
    const channel = new BroadcastChannel(typstLiveChannelName(course.id));
    channelRef.current = channel;
    return () => channel.close();
  }, [course.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      channelRef.current?.postMessage({ source: doc || '' });
    }, BROADCAST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [doc]);

  const setMode = (mode) => {
    setPreviewMode(mode);
    try { localStorage.setItem('proofLabPreviewMode', mode); } catch (e) {}
  };

  // Reuses the same named window on repeat clicks (instead of piling up
  // duplicate tabs) and re-focuses it if it's still open.
  const openPreviewTab = () => {
    const win = window.open(`/typst-preview/${encodeURIComponent(course.id)}`, `typst-preview-${course.id}`);
    if (win) { previewWindowRef.current = win; win.focus(); }
  };

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

    // Typst markup: *bold*, _italic_ (not markdown's **bold**/*italic*)
    if (mod && !e.altKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      wrapSelection('*', '*');
      return;
    }
    if (mod && !e.altKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      wrapSelection('_', '_');
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
          const leading = contentLine.match(/^\s*/)[0].length;
          envTabStopRef.current = null;
          ta.setSelectionRange(offset + leading, offset + contentLine.length);
          return;
        }
      }
      if (ta.selectionStart === ta.selectionEnd && value[ta.selectionStart] === '$') {
        e.preventDefault();
        ta.setSelectionRange(ta.selectionStart + 1, ta.selectionStart + 1);
      }
    }
  };

  // The Typst preview is one compiled SVG with no per-heading DOM anchors
  // (unlike the old renderDoc() JSX tree), so this scrolls to the same
  // fractional position the heading sits at in the source text instead.
  const scrollToHeadingLine = (line) => {
    const el = previewRef.current;
    if (!el) return;
    const totalLines = Math.max(1, (doc || '').split('\n').length - 1);
    const fraction = Math.min(1, line / totalLines);
    el.scrollTo({ top: fraction * Math.max(0, el.scrollHeight - el.clientHeight), behavior: 'smooth' });
  };

  return (
    <div className="tk-editor-overlay">
      <div className="tk-editor-topbar">
        <button className="tk-mono-btn" onClick={onClose}>← Back</button>
        <div className="tk-editor-course">{course.glyph} · {course.name} — Notes</div>
        <div className="tk-preview-mode-toggle">
          <button className={`tk-mono-btn${previewMode === 'split' ? ' active' : ''}`} onClick={() => setMode('split')}>Split</button>
          <button className={`tk-mono-btn${previewMode === 'browser' ? ' active' : ''}`} onClick={() => setMode('browser')}>Browser tab</button>
          {previewMode === 'browser' && (
            <button className="tk-mono-btn" onClick={openPreviewTab}>Open preview ↗</button>
          )}
        </div>
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
              toc.length ? toc.map((h, i) => (
                <a key={i} className={`tk-doc-toc-item lvl${h.level}`} onClick={() => scrollToHeadingLine(h.line)}>{h.text || 'Untitled'}</a>
              )) : <div className="tk-doc-toc-empty">Add a heading (=)</div>
            )}
          </div>
          <div className="tk-doc-edit" style={{ flexBasis: previewMode === 'split' ? `${editPct}%` : '100%' }}>
            <textarea
              ref={taRef}
              className="tk-doc-textarea"
              value={doc || ''}
              placeholder={'= Heading\n\nWrite here — *bold*, _italic_, $x^2$ …\nUse the toolbar for cal/frak/bb, theorem/definition blocks, or a flag.'}
              onChange={e => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {previewMode === 'split' && (
            <>
              <div className="tk-resize-handle" onMouseDown={startResize} title="Drag to resize">
                <span />
              </div>
              <div className="tk-doc-preview" ref={previewRef}>
                <TypstPreview source={doc} debounceMs={400} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
