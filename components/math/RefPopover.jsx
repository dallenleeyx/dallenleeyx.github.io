'use client';
// components/math/RefPopover.jsx — the "preview, don't navigate" card shown
// when a \ref{...} chip is clicked. A centered modal rather than an
// anchored tooltip, since it has to work for long statements/proofs and on
// mobile taps alike without any positioning math.
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { renderLatexToHtml } from '../../lib/math/renderLatex';

export function RefPopover({ refKey, item, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Portaled to <body>: a flashcard's flip transform would otherwise become
  // this popover's containing block (a `transform` on an ancestor does that
  // to `position: fixed` descendants), clipping it to the card instead of
  // covering the viewport.
  return createPortal(
    // math-ref-portal-root redeclares the --math-* tokens: this subtree is
    // outside .math-shell (portaled to <body> to escape the flip card's
    // transform), so it can't inherit custom properties scoped to that
    // container -- without this the popover renders with no background.
    <div className="math-ref-portal-root">
      <div className="math-ref-backdrop" onClick={onClose}>
        <div className="math-ref-popover" onClick={(e) => e.stopPropagation()}>
          <button className="math-ref-close" onClick={onClose} aria-label="Close preview">✕</button>
          {item ? (
            <>
              <div className="math-ref-popover-head">
                <span className={`math-type-badge math-type-${item.type.toLowerCase()}`}>{item.type}</span>
                {item.number && <span className="math-item-number">{item.number}</span>}
              </div>
              {item.name && <h4 className="math-ref-popover-name">{item.name}</h4>}
              <div
                className="math-ref-popover-statement"
                dangerouslySetInnerHTML={{ __html: renderLatexToHtml(item.statement) }}
              />
            </>
          ) : (
            <p className="math-ref-missing">No entry found for “{refKey}” in this course yet.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
