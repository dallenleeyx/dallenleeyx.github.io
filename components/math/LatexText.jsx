'use client';
// components/math/LatexText.jsx — renders a statement/proof/remarks field
// that may contain $inline$ / $$display$$ LaTeX and \ref{...} cross-links.
// See lib/math/renderLatex.js for why dangerouslySetInnerHTML is safe here:
// everything outside a math delimiter is HTML-escaped first, so only
// KaTeX's own trusted markup (plus the one plain <span> we emit for a ref
// chip) ever reaches the DOM.
//
// Clicking a \ref{...} chip opens a preview popover instead of navigating,
// so you never lose your place mid-proof. `course` scopes which entries a
// ref can resolve against; pass `interactive={false}` (used inside the
// popover itself) to render chips as plain text and avoid popover-in-popover.
import { useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { renderLatexToHtml } from '../../lib/math/renderLatex';
import { resolveRef } from '../../lib/math/refs';
import { RefPopover } from './RefPopover';

export function LatexText({ text, className, course, interactive = true }) {
  const { state } = useMath();
  const [preview, setPreview] = useState(null);

  function handleClick(e) {
    if (!interactive) return;
    const chip = e.target.closest('.math-ref-chip');
    if (!chip) return;
    e.stopPropagation();
    const key = chip.getAttribute('data-ref-key');
    const items = Object.values(state.items).filter((it) => !it.deleted && it.course === course);
    setPreview({ key, item: resolveRef(key, items) });
  }

  function handleKeyDown(e) {
    if (!interactive) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!e.target.closest('.math-ref-chip')) return;
    e.preventDefault();
    handleClick(e);
  }

  return (
    <>
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: renderLatexToHtml(text) }}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
      />
      {preview && (
        <RefPopover refKey={preview.key} item={preview.item} onClose={() => setPreview(null)} />
      )}
    </>
  );
}
