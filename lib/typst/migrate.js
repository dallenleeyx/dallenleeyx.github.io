// lib/typst/migrate.js — one-time, non-destructive conversion of the old
// markdown-shorthand notes format (::: blocks, markdown emphasis, KaTeX
// $...$/$$...$$) into Typst source for the new editor. Bold/italic/lists/
// headings/theorem-style blocks convert directly since they have a clean
// Typst equivalent; math has no reliable 1:1 mapping from LaTeX to Typst
// syntax, so it is carried over as literal, unrendered text inside a
// visible "TODO math" flag (see #math-todo in lib/typst/preamble.js)
// instead of guessing at a translation that could silently produce wrong
// mathematics.
import { ENV_TYPES, consumeBlockBody } from '../markdown';

function typstString(str) {
  return '"' + String(str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n') + '"';
}

// Escapes the handful of characters that trigger Typst markup mode
// mid-paragraph (bold/italic/heading/math/function-call/link syntax etc.)
// so plain prose carried over from the old format renders as plain text.
function escapeTypstMarkup(str) {
  return String(str ?? '').replace(/([\\*_#$`[\]<>@])/g, '\\$1');
}

// Splits a line into runs of: display math ($$...$$), inline math ($...$),
// bold (**...**), code (`...`), flag ({{...}}), italic (*...*/_..._), and
// plain text -- mirrors lib/markdown.jsx's renderInline split so the two
// stay in sync.
function convertInline(text) {
  if (!text) return '';
  const parts = String(text).split(/(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`|\{\{[^}]+\}\}|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part) => {
    if (!part) return '';
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
      return `#math-todo(${typstString(part.slice(2, -2).trim())})`;
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
      return `#math-todo(${typstString(part.slice(1, -1).trim())})`;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 3) {
      return `*${convertInline(part.slice(2, -2))}*`;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return `#raw(${typstString(part.slice(1, -1))})`;
    }
    if (part.startsWith('{{') && part.endsWith('}}') && part.length > 4) {
      return `#flag[${escapeTypstMarkup(part.slice(2, -2).trim())}]`;
    }
    if ((part.startsWith('*') && part.endsWith('*') && part.length > 1) ||
        (part.startsWith('_') && part.endsWith('_') && part.length > 1)) {
      return `_${convertInline(part.slice(1, -1))}_`;
    }
    return escapeTypstMarkup(part);
  }).join('');
}

function convertBody(text) {
  const lines = String(text || '').split('\n');
  const out = [];
  let para = [], list = [];
  const flushPara = () => { if (para.length) { out.push(convertInline(para.join(' '))); out.push(''); para = []; } };
  const flushList = () => { if (list.length) { list.forEach((it) => out.push(`- ${convertInline(it)}`)); out.push(''); list = []; } };

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    const blockMatch = trimmed.match(/^:::(\w+)\s*(.*)$/);
    if (blockMatch) {
      flushPara(); flushList();
      const type = blockMatch[1].toLowerCase();
      const name = blockMatch[2].trim();
      const { bodyLines, nextIndex } = consumeBlockBody(lines, i + 1);
      i = nextIndex;
      if (type === 'flag') {
        out.push(`#flag[${escapeTypstMarkup((name + ' ' + bodyLines.join(' ')).trim())}]`);
        out.push('');
        continue;
      }
      if (!ENV_TYPES.includes(type)) {
        // unknown block type -- carry it over untouched rather than
        // silently dropping it, flagged for the user to sort out by hand
        out.push(`#math-todo(${typstString([`:::${type} ${name}`.trim(), ...bodyLines].join('\n'))})`);
        out.push('');
        continue;
      }
      const inner = convertBody(bodyLines.join('\n'));
      if (type === 'proof') {
        out.push(`#proof[\n${inner}\n]`);
      } else {
        out.push(name ? `#${type}(name: ${typstString(name)})[\n${inner}\n]` : `#${type}[\n${inner}\n]`);
      }
      out.push('');
      continue;
    }

    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 3) {
      flushPara(); flushList();
      out.push(`#math-todo(${typstString(trimmed.slice(2, -2).trim())})`);
      out.push('');
      i++;
      continue;
    }

    const h = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      out.push(`${'='.repeat(h[1].length)} ${convertInline(h[2])}`);
      out.push('');
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) { flushPara(); list.push(trimmed.replace(/^[-*]\s+/, '')); i++; continue; }
    if (trimmed.startsWith('> ')) { flushPara(); flushList(); out.push(`#quote(block: true)[${convertInline(trimmed.slice(2))}]`); out.push(''); i++; continue; }
    if (trimmed === '') { flushPara(); flushList(); i++; continue; }

    flushList();
    para.push(trimmed);
    i++;
  }
  flushPara(); flushList();
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function migrateDocToTypst(doc) {
  return convertBody(doc);
}
