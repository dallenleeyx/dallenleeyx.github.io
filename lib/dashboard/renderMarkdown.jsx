// lib/dashboard/renderMarkdown.jsx — a small, self-contained renderer for
// Claude-generated prose (report text, the plan's narrative): paragraphs,
// **bold**/*italic*, and "- " bullet lists. Not a general markdown engine
// (no headings/links/code/tables) -- the old, much more elaborate
// lib/markdown.jsx was purpose-built for the removed Typst-era notes
// editor and went with it; this only needs to handle what Claude actually
// writes in a report or plan narrative.
import { Fragment } from 'react';

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

export function renderMarkdown(text) {
  const blocks = String(text || '').trim().split(/\n\s*\n/);
  return blocks.map((block, bi) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l));
    if (isList) {
      return (
        <ul key={bi}>
          {lines.map((l, li) => <li key={li}>{renderInline(l.replace(/^[-*]\s+/, ''), `${bi}-${li}`)}</li>)}
        </ul>
      );
    }
    return <p key={bi}>{renderInline(lines.join(' '), String(bi))}</p>;
  });
}
