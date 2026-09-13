'use client';
// components/bible/RefPopover.jsx — the "preview, don't navigate" card shown
// when a [Book C:V] ref chip is clicked, mirroring math/RefPopover.jsx's
// centered-modal approach. Unlike Math's popover (which reads a locally
// synced item), this one fetches from the server-side passage proxy --
// fetching both ESV and NIV in parallel, since side-by-side comparison is
// the whole point of this section, so even a quick preview shows both.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const VERSIONS = ['ESV', 'NIV'];

export function RefPopover({ refText, onClose }) {
  const [results, setResults] = useState(() => Object.fromEntries(VERSIONS.map((v) => [v, { status: 'loading' }])));

  useEffect(() => {
    let cancelled = false;
    setResults(Object.fromEntries(VERSIONS.map((v) => [v, { status: 'loading' }])));
    VERSIONS.forEach(async (v) => {
      try {
        const res = await fetch(`/api/bible/passage?ref=${encodeURIComponent(refText)}&version=${v}`);
        const body = await res.json();
        if (cancelled) return;
        setResults((prev) => ({ ...prev, [v]: { status: res.ok ? 'ok' : 'error', data: body } }));
      } catch (e) {
        if (!cancelled) setResults((prev) => ({ ...prev, [v]: { status: 'error', data: null } }));
      }
    });
    return () => { cancelled = true; };
  }, [refText]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const anyRef = Object.values(results).find((r) => r.data?.ref)?.data?.ref;

  // Portaled to <body> for the same reason as math/RefPopover.jsx: escapes
  // any ancestor `transform` (e.g. a flipped card) that would otherwise
  // clip a `position: fixed` descendant to that ancestor's box.
  return createPortal(
    <div className="bible-ref-portal-root">
      <div className="bible-ref-backdrop" onClick={onClose}>
        <div className="bible-ref-popover" onClick={(e) => e.stopPropagation()}>
          <button className="bible-ref-close" onClick={onClose} aria-label="Close preview">✕</button>
          <h4 className="bible-ref-popover-title">{anyRef || refText}</h4>
          <div className="bible-ref-popover-versions">
            {VERSIONS.map((v) => {
              const r = results[v];
              return (
                <div key={v} className="bible-ref-popover-version">
                  <span className="bible-version-badge">{v}</span>
                  {r.status === 'loading' && <p className="bible-ref-loading">Loading…</p>}
                  {r.status === 'error' && <p className="bible-ref-missing">{r.data?.error || 'Could not load this passage.'}</p>}
                  {r.status === 'ok' && (
                    <>
                      <p className="bible-ref-popover-text">{r.data.text}</p>
                      {r.data.placeholder && <p className="bible-ref-placeholder-note">{r.data.label}</p>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
