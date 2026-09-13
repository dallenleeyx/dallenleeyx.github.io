// lib/bible/renderRefs.js — turns freeform Commentary/QT text into safe
// HTML, auto-detecting `[Book Chapter:Verse-Verse]` bracket references and
// wrapping each in a clickable chip span. Same escape-first-then-substitute
// rationale as math/renderLatex.js: everything outside a recognised
// reference is HTML-escaped first, so the only markup that can reach the
// DOM is the one plain <span> emitted here. Anything bracketed that isn't a
// parseable reference (e.g. "[note to self]") is left as ordinary text.
import { parseRef } from './refs';

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const BRACKET_RE = /\[([^[\]]{2,40})\]/g;

export function renderRefsToHtml(raw) {
  const text = raw || '';
  const tokens = [];
  let last = 0;
  let m;
  BRACKET_RE.lastIndex = 0;
  while ((m = BRACKET_RE.exec(text))) {
    const parsed = parseRef(m[1]);
    if (!parsed) continue;
    if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) });
    tokens.push({ type: 'ref', value: m[1].trim(), display: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });

  return tokens
    .map((t) => {
      if (t.type === 'text') return escapeHtml(t.value).replace(/\n/g, '<br />');
      const key = escapeHtml(t.value);
      return `<span class="bible-ref-chip" data-ref="${key}" role="button" tabindex="0">${escapeHtml(t.display)}</span>`;
    })
    .join('');
}
