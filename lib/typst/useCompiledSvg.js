'use client';
// lib/typst/useCompiledSvg.js — debounced Typst-source-to-SVG compile,
// shared by the plain preview (components/tracker/TypstPreview.jsx, used
// for short fragments like Revision.jsx's flashcards) and the paginated,
// zoomable viewer (components/tracker/PagedTypstViewer.jsx, used for full
// documents) so the two never drift on compile/debounce behavior.
import { useEffect, useRef, useState } from 'react';
import { compileSvg } from './engine';
import { wrapWithPreamble } from './preamble';

// `auto: false` stops the effect from recompiling on every source change
// (still debounced by default) -- for a several-page document, a full
// recompile is a full WASM Typst run over the whole doc plus a full SVG
// DOM replace (see PagedTypstViewer.jsx's file comment on why that can't
// just be a partial/incremental update), so doing that after every pause
// in typing is where the lag actually comes from. With auto off, the doc
// still compiles once up front (so opening the editor shows real content,
// not a blank pane) and thereafter only via the returned compileNow() --
// wired to a toolbar button by the caller.
export function useCompiledSvg(source, debounceMs = 0, { auto = true } = {}) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [compiling, setCompiling] = useState(true);
  const seq = useRef(0);
  const compiledSourceRef = useRef(null);

  const compile = (src) => {
    if (!String(src || '').trim()) {
      setSvg('');
      setError('');
      setCompiling(false);
      compiledSourceRef.current = src;
      return;
    }
    const mySeq = ++seq.current;
    setCompiling(true);
    compileSvg(wrapWithPreamble(src))
      .then((result) => {
        if (mySeq !== seq.current) return;
        setSvg(result);
        setError('');
        compiledSourceRef.current = src;
      })
      .catch((e) => {
        if (mySeq !== seq.current) return;
        setError(String((e && e.message) || e));
      })
      .finally(() => {
        if (mySeq === seq.current) setCompiling(false);
      });
  };

  useEffect(() => {
    if (auto) {
      const timer = setTimeout(() => compile(source), debounceMs);
      return () => clearTimeout(timer);
    }
    if (compiledSourceRef.current === null) compile(source); // first mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, debounceMs, auto]);

  const compileNow = () => compile(source);
  // Only meaningful with auto off: lets the UI show "you have unbuilt
  // edits" instead of silently rendering a preview that's fallen behind
  // what's actually in the textarea.
  const stale = !auto && compiledSourceRef.current !== null && source !== compiledSourceRef.current;

  return { svg, error, compiling, compileNow, stale };
}
