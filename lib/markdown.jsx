// lib/markdown.jsx — markdown + KaTeX renderer for the per-course notes
// document. Pure functions, ported from the original Tracker.jsx.
import React from 'react';
import katex from 'katex';

export function katexHtml(src, displayMode) {
  try { return katex.renderToString(src, { throwOnError: false, displayMode }); }
  catch (e) { return null; }
}

export function renderInline(text, keyPrefix) {
  if (!text) return null;
  const parts = String(text).split(/(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`|\{\{[^}]+\}\}|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
      const html = katexHtml(part.slice(2, -2), true);
      return html ? <span key={key} dangerouslySetInnerHTML={{ __html: html }} /> : <React.Fragment key={key}>{part}</React.Fragment>;
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
      const html = katexHtml(part.slice(1, -1), false);
      return html ? <span key={key} dangerouslySetInnerHTML={{ __html: html }} /> : <React.Fragment key={key}>{part}</React.Fragment>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 3) {
      return <strong key={key}>{renderInline(part.slice(2, -2), key)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={key} className="t-code">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('{{') && part.endsWith('}}') && part.length > 4) {
      return (
        <span key={key} className="tk-flag-tab" tabIndex={0}>
          <span className="tk-flag-tooltip">{renderInline(part.slice(2, -2), key + '-c')}</span>
        </span>
      );
    }
    if ((part.startsWith('*') && part.endsWith('*') && part.length > 1) || (part.startsWith('_') && part.endsWith('_') && part.length > 1)) {
      return <em key={key}>{renderInline(part.slice(1, -1), key)}</em>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

// table of contents: only top-level (#) and second-level (##) headings.
// idPrefix must match the prefix passed to renderDoc() for the same content,
// so ToC links resolve to the right heading (a page can show the same doc
// twice — inline preview and full-screen editor — so ids must not collide).
export function extractToc(doc, idPrefix) {
  const px = idPrefix || 'h-';
  const lines = String(doc || '').split('\n');
  const toc = [];
  lines.forEach((line, i) => {
    const h1 = line.match(/^#\s+(.*)$/);
    const h2 = !h1 && line.match(/^##\s+(.*)$/);
    if (h1) toc.push({ level: 1, text: h1[1].trim(), id: px + i });
    else if (h2) toc.push({ level: 2, text: h2[1].trim(), id: px + i });
  });
  return toc;
}

// environment/callout blocks: ::: theorem | proposition | definition | lemma |
// corollary | example | remark | proof  Name?  …body…  :::
export const ENV_LABELS = { theorem: 'Theorem', proposition: 'Proposition', definition: 'Definition', lemma: 'Lemma', corollary: 'Corollary', example: 'Example', remark: 'Remark', proof: 'Proof' };
export const ENV_TYPES = Object.keys(ENV_LABELS);
export const MATH_CMDS = [
  { cmd: 'mathcal', glyph: '𝒜' },
  { cmd: 'mathfrak', glyph: '𝔄' },
  { cmd: 'mathbb', glyph: '𝔸' },
];

export function blockTemplate(type) {
  const hasName = type !== 'proof';
  const prefix = `:::${type}` + (hasName ? ' ' : '');
  const namePlaceholder = hasName ? 'Name' : '';
  const bodyPlaceholder = type === 'proof' ? 'Proof.' : 'Statement.';
  const line1 = prefix + namePlaceholder;
  const text = `${line1}\n${bodyPlaceholder}\n:::\n`;
  const selStart = hasName ? prefix.length : line1.length + 1;
  const selEnd = hasName ? prefix.length + namePlaceholder.length : line1.length + 1 + bodyPlaceholder.length;
  // hasName types get a title tab-stop (selStart/selEnd above) followed by a
  // content tab-stop the editor can jump to on Tab -- see NotesEditor.jsx.
  return { text, selStart, selEnd, hasName };
}

export function mathTemplate(cmd) {
  const text = `\\${cmd}{}`;
  return { text, selStart: text.length - 1, selEnd: text.length - 1 };
}

// inline flag/comment: a small red tab; hover (or focus) reveals the note
export function flagInlineTemplate() {
  const placeholder = "What don't you understand here?";
  const text = `{{${placeholder}}}`;
  return { text, selStart: 2, selEnd: 2 + placeholder.length };
}

// scans lines[startIdx..] for a ::: block's body, depth-aware so a nested
// ::: block (e.g. a proof written inside a theorem) doesn't get mistaken
// for the outer block's closing marker
export function consumeBlockBody(lines, startIdx) {
  const bodyLines = [];
  let i = startIdx;
  let depth = 1;
  while (i < lines.length && depth > 0) {
    const t = lines[i].trim();
    if (/^:::\w+/.test(t)) depth++;
    else if (t === ':::') depth--;
    if (depth > 0) bodyLines.push(lines[i]);
    i++;
  }
  return { bodyLines, nextIndex: i };
}

// top-level ::: blocks in a doc, each with its raw (unparsed) body
export function extractBlocks(text) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].trim().match(/^:::(\w+)\s*(.*)$/);
    if (m) {
      const { bodyLines, nextIndex } = consumeBlockBody(lines, i + 1);
      blocks.push({ type: m[1].toLowerCase(), name: m[2].trim(), body: bodyLines.join('\n') });
      i = nextIndex;
      continue;
    }
    i++;
  }
  return blocks;
}

// pulls a nested ::: proof ... ::: out of a block's body, leaving the rest as the statement
export function splitProof(body) {
  const lines = String(body || '').split('\n');
  const statementLines = [];
  let proof = null;
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].trim().match(/^:::(\w+)\s*(.*)$/);
    if (m && m[1].toLowerCase() === 'proof') {
      const { bodyLines, nextIndex } = consumeBlockBody(lines, i + 1);
      proof = bodyLines.join('\n');
      i = nextIndex;
      continue;
    }
    statementLines.push(lines[i]);
    i++;
  }
  return { statement: statementLines.join('\n'), proof };
}

// flashcard-ready blocks: every top-level env block except proof (proofs are
// nested inside their statement block and pulled out via splitProof instead)
export function extractFlashcards(doc) {
  return extractBlocks(doc)
    .filter(b => b.type !== 'proof' && ENV_TYPES.includes(b.type))
    .map(b => {
      const { statement, proof } = splitProof(b.body);
      return { type: b.type, name: b.name, statement, proof };
    });
}

export function renderDoc(text, idPrefix) {
  const px = idPrefix || 'h-';
  const lines = String(text || '').split('\n');
  const out = [];
  let para = [], list = [], quote = [];
  const flushPara = () => { if (para.length) { out.push(<p key={'p' + out.length} className="tk-note-p">{renderInline(para.join(' '), 'p' + out.length)}</p>); para = []; } };
  const flushList = () => { if (list.length) { out.push(<ul key={'ul' + out.length} className="tk-note-ul">{list.map((it, li) => <li key={li}>{renderInline(it, 'li' + out.length + '-' + li)}</li>)}</ul>); list = []; } };
  const flushQuote = () => { if (quote.length) { out.push(<blockquote key={'bq' + out.length} className="tk-note-bq">{renderInline(quote.join(' '), 'bq' + out.length)}</blockquote>); quote = []; } };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    const blockMatch = trimmed.match(/^:::(\w+)\s*(.*)$/);
    if (blockMatch) {
      flushAll();
      const type = blockMatch[1].toLowerCase();
      const name = blockMatch[2].trim();
      const { bodyLines, nextIndex } = consumeBlockBody(lines, i + 1);
      i = nextIndex;
      // backward-compat: older notes may still use the ":::flag ... :::" block
      // syntax from before flags became inline tabs — render those as tabs too
      if (type === 'flag') {
        const comment = (name + ' ' + bodyLines.join(' ')).trim();
        out.push(
          <span key={'blk' + out.length} className="tk-flag-tab" tabIndex={0}>
            <span className="tk-flag-tooltip">{renderInline(comment, 'bf' + out.length)}</span>
          </span>
        );
        continue;
      }
      const label = ENV_LABELS[type] || type;
      out.push(
        <div key={'blk' + out.length} className="tk-note-block">
          <div className="tk-note-block-head">
            <span className="tk-type">{label}</span>
            {name && <span className="tk-note-block-name">{renderInline(name, 'bn' + out.length)}</span>}
          </div>
          <div className="tk-note-block-body">{renderDoc(bodyLines.join('\n'), px)}</div>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 3) {
      flushAll();
      const html = katexHtml(trimmed.slice(2, -2), true);
      out.push(html
        ? <div key={'dm' + i} className="tk-note-display-math" dangerouslySetInnerHTML={{ __html: html }} />
        : <p key={'dm' + i} className="tk-note-p">{trimmed}</p>);
      i++;
      continue;
    }

    const h = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushAll();
      const level = h[1].length;
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      out.push(React.createElement(Tag, { key: 'h' + i, id: px + i, className: `tk-note-h${level}` }, renderInline(h[2], 'h' + i)));
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) { flushPara(); flushQuote(); list.push(trimmed.replace(/^[-*]\s+/, '')); i++; continue; }
    if (trimmed.startsWith('> ')) { flushPara(); flushList(); quote.push(trimmed.slice(2)); i++; continue; }
    if (trimmed === '') { flushAll(); i++; continue; }

    flushList(); flushQuote();
    para.push(trimmed);
    i++;
  }
  flushAll();
  return out;
}
