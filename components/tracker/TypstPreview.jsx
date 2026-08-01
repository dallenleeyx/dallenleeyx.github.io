'use client';
// components/tracker/TypstPreview.jsx — compiles Typst source (wrapped in
// the shared preamble) to SVG and renders it. This is real, vector-quality
// typesetting -- unlike the old renderDoc()+KaTeX preview, there's no
// separate math-vs-text rendering path, it's all one document compile.
import { useEffect, useRef, useState } from 'react';
import { compileSvg } from '../../lib/typst/engine';
import { wrapWithPreamble } from '../../lib/typst/preamble';

export function TypstPreview({ source, debounceMs = 0, className, emptyMessage }) {
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
