// lib/japanese/furiganaToHtml.js — turns "漢字[かんじ]" bracket notation into
// <ruby><rt> furigana markup. Shared by Grammar Practice's quiz sentences and
// (in Phase 7) Conjugation Sentences' quiz engine. Escapes first so any stray
// <, >, or & in the source text can't leak into the markup.
function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function furiganaToHtml(text) {
  return escapeHtml(text).replace(/([一-龯々〆〇]+)\[([^\]<>]+)\]/g, '<ruby>$1<rt>$2</rt></ruby>');
}
