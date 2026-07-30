// lib/bible/parsePassageHtml.js — turns api.bible's HTML chapter content
// into an ordered list of blocks ({ type: 'heading', text } or
// { type: 'verse', number, text }), so the UI can render each verse as its
// own row (with the verse number styled as a superscript, not the API's
// literal "[1]" bracket text) instead of dumping one raw HTML string on the
// page. Runs server-side (in app/api/bible/passage/route.js) so the client
// never has to parse or dangerouslySetInnerHTML third-party HTML at all --
// it only ever receives this plain, pre-structured JSON.
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function cleanText(raw) {
  return decodeEntities(raw.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function attr(attrs, name) {
  const m = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i').exec(attrs);
  return m ? m[1] : null;
}

// Matches either a heading tag (its inner text captured in group 1) or a
// whole <span ...>...</span> element (attrs in group 2, inner text in group
// 3) -- verse-start markers are always a self-contained span carrying a
// numeric data-number attribute, per api.bible's USX-to-HTML conversion.
const TOKEN_RE = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|<span\b([^>]*)>([\s\S]*?)<\/span>/gi;

export function parsePassageHtml(html) {
  const blocks = [];
  if (!html) return blocks;

  let lastIndex = 0;
  let pendingNumber = null;
  let match;

  const flushPendingVerse = (between) => {
    if (pendingNumber == null) return;
    const text = cleanText(between);
    if (text) blocks.push({ type: 'verse', number: pendingNumber, text });
    pendingNumber = null;
  };

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(html))) {
    const between = html.slice(lastIndex, match.index);
    if (match[1] !== undefined) {
      flushPendingVerse(between);
      const headingText = cleanText(match[1]);
      if (headingText) blocks.push({ type: 'heading', text: headingText });
    } else {
      const num = attr(match[2] || '', 'data-number');
      if (num && /^\d+$/.test(num)) {
        flushPendingVerse(between);
        pendingNumber = num;
      }
      // any other span (footnote markers, etc.) is dropped along with its
      // content -- include-notes=false on the request already keeps most
      // of that out, this just guards against whatever's left.
    }
    lastIndex = TOKEN_RE.lastIndex;
  }
  flushPendingVerse(html.slice(lastIndex));
  return blocks;
}
