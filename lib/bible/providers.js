// lib/bible/providers.js — server-only. Turns a parsed reference into
// passage text from whichever source matches the requested version.
//
// NIV and ESV are copyrighted translations, so real text requires the
// user's own api.bible account: https://scripture.api.bible/. One
// BIBLE_API_KEY authenticates every lookup; each translation is then a
// separate per-version Bible ID from that dashboard (request/approval is
// per publisher -- NIV specifically needs Biblica's sign-off, not instant):
//   BIBLE_API_KEY
//   ESV_BIBLE_ID
//   NIV_BIBLE_ID
// Until a version's Bible ID is configured, that lookup falls back to the
// World English Bible via bible-api.com (free, keyless, public domain), so
// the reader and ref-preview popovers work fully today and upgrade
// silently the moment real IDs are added -- nothing else in the app needs
// to change.
const BIBLE_IDS = { ESV: 'ESV_BIBLE_ID', NIV: 'NIV_BIBLE_ID' };

async function fetchFromBibleApi(version, parsed) {
  const key = process.env.BIBLE_API_KEY;
  const bibleId = process.env[BIBLE_IDS[version]];
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
  return text ? { text, label: version } : null;
}

async function fetchFallback(parsed, requestedVersion) {
  const q = encodeURIComponent(parsed.display);
  const res = await fetch(`https://bible-api.com/${q}?translation=web`);
  if (!res.ok) return null;
  const data = await res.json();
  const text = (data.text || '').trim();
  if (!text) return null;
  return { text, label: `WEB — placeholder for ${requestedVersion} until a Bible ID is configured` };
}

export async function fetchPassage(version, parsed) {
  try {
    if (BIBLE_IDS[version]) {
      const r = await fetchFromBibleApi(version, parsed);
      if (r) return { ...r, placeholder: false };
    }
  } catch (e) {
    // network/parse failure from the real provider -- fall through to the
    // free fallback rather than surfacing a hard error to the reader
  }
  const fb = await fetchFallback(parsed, version).catch(() => null);
  return fb ? { ...fb, placeholder: true } : null;
}
