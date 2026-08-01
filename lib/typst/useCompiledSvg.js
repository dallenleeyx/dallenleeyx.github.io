'use client';
// lib/typst/useCompiledSvg.js — debounced Typst-source-to-SVG compile,
// shared by the plain preview (components/tracker/TypstPreview.jsx, used
// for short fragments like Revision.jsx's flashcards) and the paginated,
// zoomable viewer (components/tracker/PagedTypstViewer.jsx, used for full
// documents) so the two never drift on compile/debounce behavior.
import { useEffect, useRef, useState } from 'react';
import { compileSvg } from './engine';
import { wrapWithPreamble } from './preamble';

export function useCompiledSvg(source, debounceMs = 0) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [compiling, setCompiling] = useState(true);
  const seq = useRef(0);

  useEffect(() => {
    if (!String(source || '').trim()) {
      setSvg('');
      setError('');
      setCompiling(false);
      return;
    }
    const mySeq = ++seq.current;
    setCompiling(true);
    const timer = setTimeout(() => {
      compileSvg(wrapWithPreamble(source))
        .then((result) => {
          if (mySeq !== seq.current) return;
          setSvg(result);
          setError('');
        })
        .catch((e) => {
          if (mySeq !== seq.current) return;
          setError(String((e && e.message) || e));
        })
        .finally(() => {
          if (mySeq === seq.current) setCompiling(false);
        });
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [source, debounceMs]);

  return { svg, error, compiling };
}
