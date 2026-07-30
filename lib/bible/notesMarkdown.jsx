// lib/bible/notesMarkdown.jsx — tiny live-preview renderer for a chapter's
// journal notes: headings, bullet lists, and paragraphs, with the same
// inline bold/italic/code syntax as the Math site's notes (reusing
// renderInline rather than re-implementing it).
import React from 'react';
import { renderInline } from '../markdown';

export function renderNotes(text) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let para = [];
  let list = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', lines: para });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: list });
      list = [];
    }
  };

  lines.forEach((line) => {
    const h1 = line.match(/^#\s+(.*)$/);
    const h2 = !h1 && line.match(/^##\s+(.*)$/);
    const item = !h1 && !h2 && line.match(/^\s*[-*]\s+(.*)$/);
    if (h1) { flushPara(); flushList(); blocks.push({ type: 'h1', text: h1[1] }); }
    else if (h2) { flushPara(); flushList(); blocks.push({ type: 'h2', text: h2[1] }); }
    else if (item) { flushPara(); list.push(item[1]); }
    else if (line.trim() === '') { flushPara(); flushList(); }
    else { flushList(); para.push(line); }
  });
  flushPara();
  flushList();

  return blocks.map((b, i) => {
    const key = `b-${i}`;
    if (b.type === 'h1') return <h3 className="bib-note-h1" key={key}>{renderInline(b.text, key)}</h3>;
    if (b.type === 'h2') return <h4 className="bib-note-h2" key={key}>{renderInline(b.text, key)}</h4>;
    if (b.type === 'ul') {
      return (
        <ul className="bib-note-ul" key={key}>
          {b.items.map((it, j) => <li key={`${key}-${j}`}>{renderInline(it, `${key}-${j}`)}</li>)}
        </ul>
      );
    }
    return <p className="bib-note-p" key={key}>{renderInline(b.lines.join(' '), key)}</p>;
  });
}
