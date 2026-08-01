'use client';
// components/tracker/PagedTypstViewer.jsx — renders a compiled Typst
// document with visible page-break dividers and Prev/Next page
// navigation, with zoom/pan into the compiled content itself -- not the
// browser's own page zoom.
//
// Two SVG <use>-based tricks were tried here first (duplicating the full
// per-page markup, then a single shared <defs> re-viewed via <use> per
// page, then even just one <use> for only the current page) and every one
// of them reproducibly crashed the tab on real content: Typst's own
// compiled output already leans on internal <use> reuse for repeated
// glyphs (tens of thousands of references in just a several-page
// document), and re-resolving that whole recursive structure -- which is
// what a browser must do for *any* <use> referencing it, even a single
// one -- got expensive enough to crash well within normal note lengths.
// So this instead renders the plain compiled SVG exactly once via
// dangerouslySetInnerHTML (the same safe, proven approach every other
// Typst-rendering spot in this app already uses) and overlays lightweight
// non-SVG <div> dividers at each page-break Y position -- Typst's own
// page margins mean that's real whitespace in the rendered content, not
// text the divider would cover. "Page management" here means visible
// page breaks, baked-in page numbers, and jump-to-page scrolling, not
// literal separate un-scrollable page cards.
//
// Ctrl/Cmd+wheel (mouse, or trackpad pinch -- browsers report pinch as a
// wheel event with ctrlKey set) zooms, anchored at the cursor so the point
// under it stays put -- the primary, button-free interaction this was
// built for. Plain wheel/scroll still behaves like a normal page: no
// interception. Click-drag pans by mouse. Keyboard shortcuts (arrow keys
// to pan, PageUp/PageDown to jump pages, Ctrl/Cmd +/-/0 to zoom) are a
// secondary option that only takes over once you've actually clicked into
// the preview (tabIndex + real DOM focus) -- never on mere hover, so they
// can't steal keystrokes from a textarea sitting right next to this in the
// split editor view.
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useCompiledSvg } from '../../lib/typst/useCompiledSvg';
import { computePageLayout } from '../../lib/typst/pagedSvg';

const MIN_SCALE = 0.2;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.15;
const PAN_STEP_PX = 80;

// Forwards a small page-aware API instead of the raw scrollable DOM node --
// see NotesEditor.jsx/TrackerApp.jsx's scrollToHeadingLine, which jumps to
// the page holding a given fractional position in the source.
export const PagedTypstViewer = forwardRef(function PagedTypstViewer(
  { source, debounceMs = 300, emptyMessage, showToolbar = false, className },
  forwardedRef
) {
  const { svg, error, compiling } = useCompiledSvg(source, debounceMs);
  const layout = useMemo(() => (svg ? computePageLayout(svg) : null), [svg]);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const firstFitDoneRef = useRef(false);
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState(0);

  const goToPage = (next) => {
    if (!layout) return;
    const vp = viewportRef.current;
    const target = Math.min(layout.numPages - 1, Math.max(0, next));
    setPage(target);
    vp?.scrollTo({ top: target * layout.pageHeightPx * scale, left: 0, behavior: 'smooth' });
  };

  useImperativeHandle(forwardedRef, () => ({
    scrollToFraction(fraction) {
      if (!layout) return;
      goToPage(Math.round(fraction * (layout.numPages - 1)));
    },
    flash() {
      const el = viewportRef.current;
      if (!el) return;
      el.classList.add('tk-note-block-flash');
      setTimeout(() => el.classList.remove('tk-note-block-flash'), 1600);
    },
  }), [layout, scale]);

  // Fits the page width to the viewport the first time a compile succeeds
  // -- not on every recompile, which would otherwise undo the reader's own
  // zoom/pan/page position every time they type another keystroke.
  useEffect(() => {
    if (!layout || firstFitDoneRef.current) return;
    firstFitDoneRef.current = true;
    const vp = viewportRef.current;
    if (!vp) return;
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, (vp.clientWidth - 32) / layout.pageWidthPx)));
  }, [layout]);

  // Keeps the page-number readout in sync with free scrolling, not just
  // Prev/Next clicks.
  const handleScroll = () => {
    if (!layout) return;
    const vp = viewportRef.current;
    if (!vp) return;
    const p = Math.round(vp.scrollTop / (layout.pageHeightPx * scale));
    setPage((prev) => (prev === p ? prev : Math.min(layout.numPages - 1, Math.max(0, p))));
  };

  // Zooms by `factor`; if a viewport-relative cursor position is given,
  // keeps the content under that point fixed on screen instead of
  // drifting toward the top-left corner.
  const zoomAt = (factor, clientX, clientY) => {
    const vp = viewportRef.current;
    if (!vp) return;
    setScale((oldScale) => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale * factor));
      if (clientX != null && clientY != null) {
        const rect = vp.getBoundingClientRect();
        const contentX = (clientX - rect.left + vp.scrollLeft) / oldScale;
        const contentY = (clientY - rect.top + vp.scrollTop) / oldScale;
        requestAnimationFrame(() => {
          vp.scrollLeft = contentX * newScale - (clientX - rect.left);
          vp.scrollTop = contentY * newScale - (clientY - rect.top);
        });
      }
      return newScale;
    });
  };

  const resetView = () => {
    setScale(1);
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  };

  const fitWidth = () => {
    const vp = viewportRef.current;
    if (!vp || !layout) return;
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, (vp.clientWidth - 32) / layout.pageWidthPx)));
    vp.scrollTo({ top: 0, left: 0 });
  };

  // React's onWheel prop isn't reliably attached as a non-passive listener
  // across browsers/versions -- when it isn't, preventDefault() is
  // silently ignored (Chrome logs a console warning for exactly this) and
  // Ctrl+wheel falls through to the browser's own page zoom instead of
  // being caught here. Attaching the listener manually with an explicit
  // {passive:false} guarantees preventDefault actually takes effect.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP, e.clientX, e.clientY);
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

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

  // Only fires while the viewport itself has real DOM focus (clicked into
  // it), never on hover -- see the file-level comment for why.
  const handleKeyDown = (e) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && (e.key === '+' || e.key === '=')) { e.preventDefault(); zoomAt(ZOOM_STEP); }
    else if (mod && e.key === '-') { e.preventDefault(); zoomAt(1 / ZOOM_STEP); }
    else if (mod && e.key === '0') { e.preventDefault(); resetView(); }
    else if (e.key === 'PageUp') { e.preventDefault(); goToPage(page - 1); }
    else if (e.key === 'PageDown') { e.preventDefault(); goToPage(page + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); vp.scrollLeft -= PAN_STEP_PX; }
    else if (e.key === 'ArrowRight') { e.preventDefault(); vp.scrollLeft += PAN_STEP_PX; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); vp.scrollTop -= PAN_STEP_PX; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); vp.scrollTop += PAN_STEP_PX; }
  };

  if (!String(source || '').trim()) {
    return <div className={`tk-note-p tk-note-empty ${className || ''}`}>{emptyMessage || 'Nothing written yet.'}</div>;
  }
  if (error) {
    return <pre className={`tk-typst-error ${className || ''}`}>{error}</pre>;
  }

  return (
    <div className={`tk-paged-wrap ${className || ''}`}>
      {showToolbar && (
        <div className="tk-paged-toolbar">
          <button className="tk-mono-btn" onClick={() => goToPage(page - 1)} disabled={page <= 0}>‹ Prev</button>
          <span className="tk-typst-viewer-zoom">{layout ? `Page ${page + 1} / ${layout.numPages}` : '…'}</span>
          <button className="tk-mono-btn" onClick={() => goToPage(page + 1)} disabled={!layout || page >= layout.numPages - 1}>Next ›</button>
          <span className="tk-toolbar-sep" />
          <button className="tk-mono-btn" onClick={() => zoomAt(1 / ZOOM_STEP)} aria-label="Zoom out">−</button>
          <span className="tk-typst-viewer-zoom">{Math.round(scale * 100)}%</span>
          <button className="tk-mono-btn" onClick={() => zoomAt(ZOOM_STEP)} aria-label="Zoom in">+</button>
          <button className="tk-mono-btn" onClick={fitWidth}>Fit width</button>
          <button className="tk-mono-btn" onClick={resetView}>Reset</button>
        </div>
      )}
      {!showToolbar && (
        <>
          <button className="tk-paged-zoom-badge" onClick={resetView} title="Reset zoom">{Math.round(scale * 100)}%</button>
          {layout && layout.numPages > 1 && (
            <div className="tk-paged-nav-badge">
              <button className="tk-mono-btn" onClick={() => goToPage(page - 1)} disabled={page <= 0}>‹</button>
              <span>{page + 1} / {layout.numPages}</span>
              <button className="tk-mono-btn" onClick={() => goToPage(page + 1)} disabled={page >= layout.numPages - 1}>›</button>
            </div>
          )}
        </>
      )}
      <div
        className="tk-paged-viewport"
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        tabIndex={0}
      >
        {!layout || compiling ? (
          <div className="tk-typst-viewer-status">{compiling ? 'Compiling…' : 'Loading…'}</div>
        ) : (
          <div className="tk-paged-stack" style={{ width: layout.pageWidthPx, transform: `scale(${scale})` }}>
            <div className="tk-paged-content" dangerouslySetInnerHTML={{ __html: svg }} />
            {Array.from({ length: layout.numPages - 1 }).map((_, i) => (
              <div key={i} className="tk-page-divider" style={{ top: (i + 1) * layout.pageHeightPx }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
