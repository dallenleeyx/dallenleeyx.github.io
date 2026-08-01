// lib/typst/blocks.js — recovers flashcard-ready content (kind/name/body)
// from Typst source produced by this app's own editor and preamble
// (#theorem(...)[...], #definition[...], etc.). Not a general Typst parser
// -- just enough bracket/string-aware scanning to do the same job
// extractBlocks()/extractFlashcards() did for the old ::: syntax in
// lib/markdown.jsx, now that notes are Typst source instead of markdown.
import { ENV_TYPES } from '../markdown';

function findMatchingBracket(src, openIdx) {
  let depth = 0;
  let inStr = false;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function skipParenArgs(src, openIdx) {
  let depth = 0;
  let inStr = false;
  let i = openIdx;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth === 0) { i++; break; } }
  }
  return { argsSrc: src.slice(openIdx, i), nextIndex: i };
}

function parseNameArg(argsSrc) {
  const m = argsSrc.match(/name\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (!m) return '';
  return m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

const KIND_RE = new RegExp(`#(${ENV_TYPES.join('|')})\\b`, 'g');

// top-level (well, first-encountered -- nested blocks inside a body are
// left in place for the recursive statement/proof split below) #kind[...]
// / #kind(...)[...]  calls in Typst source.
export function extractTypstBlocks(source) {
  const src = String(source || '');
  const blocks = [];
  KIND_RE.lastIndex = 0;
  let m;
  while ((m = KIND_RE.exec(src))) {
    const kind = m[1];
    let i = KIND_RE.lastIndex;
    let argsSrc = '';
    if (src[i] === '(') {
      const skipped = skipParenArgs(src, i);
      argsSrc = skipped.argsSrc;
      i = skipped.nextIndex;
    }
    while (src[i] === ' ') i++;
    if (src[i] !== '[') { KIND_RE.lastIndex = i; continue; }
    const close = findMatchingBracket(src, i);
    if (close === -1) continue;
    const body = src.slice(i + 1, close);
    const startLine = src.slice(0, m.index).split('\n').length - 1;
    blocks.push({ type: kind, name: parseNameArg(argsSrc), body, startIndex: m.index, startLine });
    KIND_RE.lastIndex = close + 1;
  }
  return blocks;
}

// pulls the first nested #proof[...] out of a block's body (bracket-aware),
// leaving the rest as the statement -- mirrors splitProof() in lib/markdown.jsx
export function splitTypstProof(body) {
  const src = String(body || '');
  const m = /#proof\b/.exec(src);
  if (!m) return { statement: src, proof: null };
  let i = m.index + m[0].length;
  if (src[i] === '(') {
    i = skipParenArgs(src, i).nextIndex;
  }
  while (src[i] === ' ') i++;
  if (src[i] !== '[') return { statement: src, proof: null };
  const close = findMatchingBracket(src, i);
  if (close === -1) return { statement: src, proof: null };
  const proof = src.slice(i + 1, close);
  const statement = src.slice(0, m.index) + src.slice(close + 1);
  return { statement, proof };
}

// flashcard-ready blocks: every top-level env block except proof (proofs
// are nested inside their statement block and pulled out via
// splitTypstProof instead)
export function extractTypstFlashcards(source) {
  return extractTypstBlocks(source)
    .filter((b) => b.type !== 'proof')
    .map((b) => {
      const { statement, proof } = splitTypstProof(b.body);
      return { type: b.type, name: b.name, statement, proof, startIndex: b.startIndex, startLine: b.startLine };
    });
}
