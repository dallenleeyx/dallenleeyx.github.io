'use client';
// components/tracker/ZoomableNotes.jsx — wraps rendered notes content in a
// PDF-viewer-like zoom/pan surface: Ctrl+scroll or Ctrl +/-/0 to zoom (also
// covers trackpad pinch, which browsers report as ctrlKey wheel events),
// click-drag to pan once zoomed past 100%. Below 100% zoom, plain native
// scrolling still works exactly as before -- panning only takes over once
// CSS transforms make native scroll math (which ignores transforms) stop
// matching the visually scaled content.
import { useEffect, useRef, useState } from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const clamp = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

export function ZoomableNotes({ children }) {
  const surfaceRef = useRef(null);
  const hoveredRef = useRef(false);
  const dragRef = useRef(null); // { startX, startY, panX, panY, moved } | null
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => {
        const next = clamp(z - e.deltaY * 0.012);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (!hoveredRef.current) return;
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom((z) => clamp(z + ZOOM_STEP));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoom((z) => {
          const next = clamp(z - ZOOM_STEP);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        e.preventDefault();
        resetView();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const zoomed = zoom > 1;

  const onMouseDown = (e) => {
    if (!zoomed || e.button !== 0) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y, moved: false };
  };
  const onMouseMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    d.moved = true;
    setPan({ x: d.panX + dx, y: d.panY + dy });
  };
  const endDrag = () => { dragRef.current = null; };

  return (
    <div
      className={`tk-zoom-viewport${zoomed ? ' zoomed' : ''}`}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; endDrag(); }}
    >
      <div className="tk-zoom-toolbar no-print">
        <button type="button" className="tk-zoom-btn" onClick={() => setZoom((z) => clamp(z - ZOOM_STEP))} title="Zoom out (Ctrl -)">−</button>
        <span className="tk-zoom-pct">{Math.round(zoom * 100)}%</span>
        <button type="button" className="tk-zoom-btn" onClick={() => setZoom((z) => clamp(z + ZOOM_STEP))} title="Zoom in (Ctrl +)">+</button>
        {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
          <button type="button" className="tk-zoom-reset" onClick={resetView} title="Reset view (Ctrl 0)">Reset</button>
        )}
      </div>
      <div
        ref={surfaceRef}
        className="tk-zoom-surface"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
      >
        <div
          className="tk-zoom-content"
          style={{ transform: zoomed ? `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` : `scale(${zoom})`, transformOrigin: '0 0' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
