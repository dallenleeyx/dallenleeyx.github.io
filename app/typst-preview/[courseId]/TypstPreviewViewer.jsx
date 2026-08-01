'use client';
// app/typst-preview/[courseId]/TypstPreviewViewer.jsx — Overleaf-style
// "view in browser" companion to the notes editor: a dedicated tab showing
// just the live-compiling preview, with its own zoom/pan controls. Has no
// textarea of its own -- it mirrors whatever's typed in an open
// NotesEditor for this course via BroadcastChannel (see
// lib/typst/liveChannel.js), falling back to the last-synced doc from
// /api/data so the tab shows real content immediately even if no editor
// tab happens to be open (or on a refresh).
import { useEffect, useRef, useState } from 'react';
import { compileSvg } from '../../../lib/typst/engine';
import { wrapWithPreamble } from '../../../lib/typst/preamble';
import { typstLiveChannelName } from '../../../lib/typst/liveChannel';

const MIN_SCALE = 0.2;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.15;
const COMPILE_DEBOUNCE_MS = 250;
const PAN_STEP_PX = 80;

export function TypstPreviewViewer({ courseId }) {
  const [source, setSource] = useState(null); // null = still loading initial content
  const [courseName, setCourseName] = useState('');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const dragRef = useRef(null);
  const compileSeq = useRef(0);

  // Initial content from whatever's last synced, so this tab isn't blank
  // if no editor tab for this course happens to be open right now.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/data').then((r) => r.json()).then((data) => {
      if (cancelled) return;
      const course = (data.courses || []).find((c) => c.id === courseId);
      setSource(course ? (course.doc || '') : '');
      setCourseName(course ? course.name : '');
    }).catch(() => { if (!cancelled) setSource(''); });
    return () => { cancelled = true; };
  }, [courseId]);

  // Live updates from an open NotesEditor for this course.
  useEffect(() => {
    const channel = new BroadcastChannel(typstLiveChannelName(courseId));
    channel.onmessage = (e) => {
      if (typeof e.data?.source === 'string') setSource(e.data.source);
    };
    return () => channel.close();
  }, [courseId]);

  useEffect(() => {
    if (source == null) return;
    const mySeq = ++compileSeq.current;
    const timer = setTimeout(() => {
      compileSvg(wrapWithPreamble(source))
        .then((result) => { if (mySeq === compileSeq.current) { setSvg(result); setError(''); } })
        .catch((e) => { if (mySeq === compileSeq.current) setError(String((e && e.message) || e)); });
    }, COMPILE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [source]);

  const zoomBy = (factor) => setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s * factor)));

  const fitWidth = () => {
    const vp = viewportRef.current;
    const svgEl = contentRef.current?.querySelector('svg');
    if (!vp || !svgEl) return;
    const naturalWidth = svgEl.getBoundingClientRect().width / scale;
    if (!naturalWidth) return;
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, (vp.clientWidth - 48) / naturalWidth)));
    vp.scrollTo({ top: 0, left: 0 });
  };

  const resetView = () => {
    setScale(1);
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  };

  // Plain wheel scrolls normally (native overflow scroll); Ctrl/Cmd+wheel
  // zooms, centered roughly where the cursor is -- the standard
  // browser/PDF-viewer convention, and the same one this app already uses
  // for "zoom" elsewhere so it doesn't fight normal trackpad scrolling.
  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
  };

  // Click-and-drag panning, in addition to normal scrolling.
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const vp = viewportRef.current;
    if (!vp) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, scrollLeft: vp.scrollLeft, scrollTop: vp.scrollTop };
    vp.classList.add('dragging');
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      vp.scrollLeft = d.scrollLeft - (ev.clientX - d.startX);
      vp.scrollTop = d.scrollTop - (ev.clientY - d.startY);
    };
    const onUp = () => {
      dragRef.current = null;
      vp.classList.remove('dragging');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Arrow-key panning and +/-/0 zoom, once the viewport has focus.
  const handleKeyDown = (e) => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (e.key === 'ArrowLeft') { vp.scrollLeft -= PAN_STEP_PX; e.preventDefault(); }
    else if (e.key === 'ArrowRight') { vp.scrollLeft += PAN_STEP_PX; e.preventDefault(); }
    else if (e.key === 'ArrowUp') { vp.scrollTop -= PAN_STEP_PX; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { vp.scrollTop += PAN_STEP_PX; e.preventDefault(); }
    else if (e.key === '+' || e.key === '=') { zoomBy(ZOOM_STEP); e.preventDefault(); }
    else if (e.key === '-') { zoomBy(1 / ZOOM_STEP); e.preventDefault(); }
    else if (e.key === '0') { resetView(); e.preventDefault(); }
  };

  return (
    <div className="tk-typst-viewer">
      <div className="tk-typst-viewer-bar">
        <div className="tk-typst-viewer-title">{courseName || 'Notes'} — live preview</div>
        <div className="tk-typst-viewer-controls">
          <button className="tk-mono-btn" onClick={() => zoomBy(1 / ZOOM_STEP)} aria-label="Zoom out">−</button>
          <span className="tk-typst-viewer-zoom">{Math.round(scale * 100)}%</span>
          <button className="tk-mono-btn" onClick={() => zoomBy(ZOOM_STEP)} aria-label="Zoom in">+</button>
          <button className="tk-mono-btn" onClick={fitWidth}>Fit width</button>
          <button className="tk-mono-btn" onClick={resetView}>Reset</button>
        </div>
      </div>
      <div
        className="tk-typst-viewer-viewport"
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {error ? (
          <pre className="tk-typst-error">{error}</pre>
        ) : source == null ? (
          <div className="tk-typst-viewer-status">Loading…</div>
        ) : !svg ? (
          <div className="tk-typst-viewer-status">Compiling…</div>
        ) : (
          <div
            className="tk-typst-viewer-content"
            ref={contentRef}
            style={{ transform: `scale(${scale})` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </div>
  );
}
