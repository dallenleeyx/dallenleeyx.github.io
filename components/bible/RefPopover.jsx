'use client';
// components/bible/RefPopover.jsx — the "preview, don't navigate" card shown
// when a [Book C:V] ref chip is clicked, mirroring math/RefPopover.jsx's
// centered-modal approach. Unlike Math's popover (which reads a locally
// synced item), this one fetches NIV text from the server-side passage proxy.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { VerseText } from './VerseText';

export function RefPopover({ refText, onClose }) {
  const [result, setResult] = useState({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setResult({ status: 'loading' });
    (async () => {
      try {
        const res = await fetch(`/api/bible/passage?ref=${encodeURIComponent(refText)}&version=NIV`);
        const body = await res.json();
        if (cancelled) return;
        setResult({ status: res.ok ? 'ok' : 'error', data: body });
      } catch (e) {
        if (!cancelled) setResult({ status: 'error', data: null });
      }
    })();
    return () => { cancelled = true; };
  }, [refText]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Portaled to <body> for the same reason as math/RefPopover.jsx: escapes
  // any ancestor `transform` (e.g. a flipped card) that would otherwise
  // clip a `position: fixed` descendant to that ancestor's box.
  return createPortal(
    <div className="bible-ref-portal-root">
      <div className="bible-ref-backdrop" onClick={onClose}>
        <div className="bible-ref-popover" onClick={(e) => e.stopPropagation()}>
          <button className="bible-ref-close" onClick={onClose} aria-label="Close preview">✕</button>
          <h4 className="bible-ref-popover-title">{result.data?.ref || refText}</h4>
          <div className="bible-ref-popover-versions">
            <div className="bible-ref-popover-version">
              <span className="bible-version-badge">NIV</span>
              {result.status === 'loading' && <p className="bible-ref-loading">Loading…</p>}
              {result.status === 'error' && <p className="bible-ref-missing">{result.data?.error || 'Could not load this passage.'}</p>}
              {result.status === 'ok' && (
                <>
                  <p className="bible-ref-popover-text"><VerseText text={result.data.text} /></p>
                  {result.data.placeholder && <p className="bible-ref-placeholder-note">{result.data.label}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
