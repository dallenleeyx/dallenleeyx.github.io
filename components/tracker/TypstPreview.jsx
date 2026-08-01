'use client';
// components/tracker/TypstPreview.jsx — compiles Typst source (wrapped in
// the shared preamble) to SVG and renders it, unpaginated and unzoomable.
// For short fragments only (Revision.jsx's flashcards) where a whole page
// layout makes no sense -- full documents use PagedTypstViewer instead.
import { useCompiledSvg } from '../../lib/typst/useCompiledSvg';

export function TypstPreview({ source, debounceMs = 0, className, emptyMessage }) {
  const { svg, error, compiling } = useCompiledSvg(source, debounceMs);

  if (!String(source || '').trim()) {
    return <div className={`tk-note-p tk-note-empty ${className || ''}`}>{emptyMessage || 'Nothing written yet.'}</div>;
  }
  if (error) {
    return <pre className={`tk-typst-error ${className || ''}`}>{error}</pre>;
  }
  return (
    <div className={`tk-typst-render${compiling ? ' compiling' : ''} ${className || ''}`} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
