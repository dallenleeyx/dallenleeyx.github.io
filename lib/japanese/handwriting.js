// lib/japanese/handwriting.js — client-side kanji handwriting recognition
// via Google's handwriting input-tools endpoint. This is the same
// recognizer behind Google Translate's/Google Input Tools' handwriting
// input, so it's far more accurate than a hobby-trained model would be --
// but it's an unofficial, undocumented public endpoint with no support
// guarantee, so callers must treat failures as expected and fall back to
// manual self-grading (see KanjiWriting.jsx's auto-check mode).
const ENDPOINT = 'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8';

// strokes: Array<Array<{x, y, t}>> from useKanjiCanvas's getStrokes().
// Returns an ordered list of candidate strings (best guess first); throws
// on any network/parsing failure so the caller can show a clear error
// instead of silently mis-grading.
export async function recognizeInk(strokes, width, height, language = 'ja') {
  if (!strokes || !strokes.length) return [];
  const ink = strokes.map(stroke => [
    stroke.map(p => Math.round(p.x)),
    stroke.map(p => Math.round(p.y)),
    stroke.map(p => p.t),
  ]);
  const body = {
    options: 'enable_pre_space',
    requests: [{
      writing_guide: { writing_area_width: Math.round(width), writing_area_height: Math.round(height) },
      ink,
      language,
    }],
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Recognition request failed (${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data) || data[0] !== 'SUCCESS' || !data[1] || !data[1][0]) return [];
  return data[1][0][1] || [];
}

// Whether any of the top candidates matches the target word/kanji exactly,
// or the target appears as a whole component of a longer suggestion.
export function matchesTarget(candidates, target, topN = 5) {
  const t = (target || '').trim();
  if (!t) return false;
  return candidates.slice(0, topN).some(c => c === t || c.includes(t));
}
