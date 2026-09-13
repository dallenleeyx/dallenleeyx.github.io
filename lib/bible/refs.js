// lib/bible/refs.js — parses a human Bible reference ("Gen 1:1-2", "1 Cor
// 5:1-2", "John 3:16", "Genesis 1") into a structured, provider-agnostic
// shape. Pure and framework-free so it works identically client-side (ref
// detection while typing/rendering) and server-side (building provider
// queries in lib/bible/providers.js).
import { BOOKS } from './books';

function normalizeToken(s) {
  return (s || '').toLowerCase().replace(/[.\s]/g, '');
}

export function findBook(token) {
  const norm = normalizeToken(token);
  if (!norm) return null;
  for (const b of BOOKS) {
    if (normalizeToken(b.name) === norm) return b;
    if (b.abbr.includes(norm)) return b;
  }
  // A single distinctive partial match against a full name (e.g. "Genes"),
  // but only if it's unambiguous -- never guess between two candidates.
  if (norm.length >= 3) {
    const candidates = BOOKS.filter((b) => normalizeToken(b.name).startsWith(norm));
    if (candidates.length === 1) return candidates[0];
  }
  return null;
}

// The lazy `(.*?)` for the book part plus the end-anchored chapter:verse
// suffix means backtracking naturally finds the right split even when the
// book name itself contains a digit (e.g. "1 Cor 5:1-2" splits into book
// "1 Cor" and suffix "5:1-2", not book "1" and a bogus parse).
const REF_RE = /^(.*?)\s*(\d+)(?::(\d+)(?:-(\d+))?)?\s*$/;

export function parseRef(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  const m = trimmed.match(REF_RE);
  if (!m) return null;
  const [, bookPart, chapterStr, verseStartStr, verseEndStr] = m;
  const book = findBook(bookPart);
  if (!book) return null;

  const chapter = parseInt(chapterStr, 10);
  const verseStart = verseStartStr ? parseInt(verseStartStr, 10) : null;
  const verseEnd = verseEndStr ? parseInt(verseEndStr, 10) : null;
  const display = `${book.name} ${chapter}${verseStart ? `:${verseStart}${verseEnd ? `-${verseEnd}` : ''}` : ''}`;

  return { book: book.name, code: book.code, chapter, verseStart, verseEnd, display, raw: trimmed };
}
