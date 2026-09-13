// lib/bible/providers.js — server-only. Turns a parsed reference into
// passage text from whichever source matches the requested version.
//
// NIV and ESV are copyrighted translations, so real text requires the
// user's own publisher API keys as env vars:
//   ESV_API_KEY               — free, instant, from https://api.esv.org/account/create-application/
//   BIBLE_API_KEY, NIV_BIBLE_ID — free account at https://scripture.api.bible/,
//                                 then request access to NIV in the dashboard
//                                 (Biblica has to approve it; not instant)
// Until a version's key is configured, every lookup falls back to the World
// English Bible via bible-api.com (free, keyless, public domain), so the
// reader and ref-preview popovers work fully today and upgrade silently the
// moment real keys are added -- nothing else in the app needs to change.
async function fetchEsv(parsed) {
  const key = process.env.ESV_API_KEY;
  if (!key) return null;
  const q = encodeURIComponent(parsed.display);
  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${q}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=true&include-passage-references=false`,
    { headers: { Authorization: `Token ${key}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const text = (data.passages || []).join('\n').trim();
  return text ? { text, label: 'ESV' } : null;
}

async function fetchNiv(parsed) {
  const key = process.env.BIBLE_API_KEY;
  const bibleId = process.env.NIV_BIBLE_ID;
  if (!key || !bibleId) return null;
  const start = `${parsed.code}.${parsed.chapter}${parsed.verseStart ? `.${parsed.verseStart}` : ''}`;
  const end = parsed.verseEnd ? `${parsed.code}.${parsed.chapter}.${parsed.verseEnd}` : null;
  const passageId = end ? `${start}-${end}` : start;
  const res = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-verse-numbers=true&include-chapter-numbers=false`,
    { headers: { 'api-key': key } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const text = (data.data?.content || '').replace(/\s+/g, ' ').trim();
  return text ? { text, label: 'NIV' } : null;
}

async function fetchFallback(parsed, requestedVersion) {
  const q = encodeURIComponent(parsed.display);
  const res = await fetch(`https://bible-api.com/${q}?translation=web`);
  if (!res.ok) return null;
  const data = await res.json();
  const text = (data.text || '').trim();
  if (!text) return null;
  return { text, label: `WEB — placeholder for ${requestedVersion} until an API key is configured` };
}

export async function fetchPassage(version, parsed) {
  try {
    if (version === 'ESV') {
      const r = await fetchEsv(parsed);
      if (r) return { ...r, placeholder: false };
    } else if (version === 'NIV') {
      const r = await fetchNiv(parsed);
      if (r) return { ...r, placeholder: false };
    }
  } catch (e) {
    // network/parse failure from the real provider -- fall through to the
    // free fallback rather than surfacing a hard error to the reader
  }
  const fb = await fetchFallback(parsed, version).catch(() => null);
  return fb ? { ...fb, placeholder: true } : null;
}
