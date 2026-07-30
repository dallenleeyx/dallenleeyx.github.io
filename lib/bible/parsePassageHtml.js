// lib/bible/parsePassageHtml.js — turns api.bible's HTML chapter content
// into an ordered list of blocks ({ type: 'heading', text } or
// { type: 'paragraph', verses: [{ number, text }] }), so the UI can render
// verses as normal flowing prose (grouped into the same paragraphs the
// translation itself uses) with just the verse number styled as a
// superscript -- not the API's literal "[1]" bracket text, and not one
// verse per row. Runs server-side (in app/api/bible/passage/route.js) so
// the client never has to parse or dangerouslySetInnerHTML third-party
// HTML at all -- it only ever receives this plain, pre-structured JSON.
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

// Matches a heading tag (inner text in group 1), a paragraph open/close tag,
// or a whole <span ...>...</span> element (attrs in group 2) -- verse-start
// markers are always a self-contained span carrying a numeric data-number
// attribute, per api.bible's USX-to-HTML conversion.
const TOKEN_RE = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|<p\b[^>]*>|<\/p>|<span\b([^>]*)>([\s\S]*?)<\/span>/gi;

export function parsePassageHtml(html) {
  const blocks = [];
  if (!html) return blocks;

  let lastIndex = 0;
  let pendingNumber = null;
  let currentParagraph = null;
  let match;

  const pushParagraph = () => {
    if (currentParagraph && currentParagraph.verses.length) blocks.push(currentParagraph);
    currentParagraph = null;
  };

  const flushPendingVerse = (between) => {
    if (pendingNumber == null) return;
    const text = cleanText(between);
    if (text) {
      if (!currentParagraph) currentParagraph = { type: 'paragraph', verses: [] };
      currentParagraph.verses.push({ number: pendingNumber, text });
    }
    pendingNumber = null;
  };

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(html))) {
    const between = html.slice(lastIndex, match.index);
    flushPendingVerse(between);

    const whole = match[0];
    if (match[1] !== undefined) {
      pushParagraph();
      const headingText = cleanText(match[1]);
      if (headingText) blocks.push({ type: 'heading', text: headingText });
    } else if (/^<p\b/i.test(whole)) {
      pushParagraph();
      currentParagraph = { type: 'paragraph', verses: [] };
    } else if (/^<\/p>/i.test(whole)) {
      pushParagraph();
    } else {
      const num = attr(match[2] || '', 'data-number');
      if (num && /^\d+$/.test(num)) pendingNumber = num;
      // any other span (footnote markers, etc.) is dropped along with its
      // content -- include-notes=false on the request already keeps most
      // of that out, this just guards against whatever's left.
    }
    lastIndex = TOKEN_RE.lastIndex;
  }
  flushPendingVerse(html.slice(lastIndex));
  pushParagraph();
  return blocks;
}
