'use client';
// components/bible/BibleText.jsx — renders a Commentary/QT text field,
// auto-detecting `[Book C:V-V]` references and turning them into clickable
// chips. Mirrors math/LatexText.jsx: clicking a chip opens a preview
// popover instead of navigating away.
import { useState } from 'react';
import { renderRefsToHtml } from '../../lib/bible/renderRefs';
import { RefPopover } from './RefPopover';

export function BibleText({ text, className, interactive = true }) {
  const [preview, setPreview] = useState(null);

  function handleClick(e) {
    if (!interactive) return;
    const chip = e.target.closest('.bible-ref-chip');
    if (!chip) return;
    e.stopPropagation();
    setPreview(chip.getAttribute('data-ref'));
  }

  function handleKeyDown(e) {
    if (!interactive) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!e.target.closest('.bible-ref-chip')) return;
    e.preventDefault();
    handleClick(e);
  }

  return (
    <>
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: renderRefsToHtml(text) }}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
      />
      {preview && <RefPopover refText={preview} onClose={() => setPreview(null)} />}
    </>
  );
}
