// components/bible/VerseText.jsx — renders fetched passage text with its
// inline "[N]" verse-number markers (api.bible's include-verse-numbers=true
// format) turned into small styled superscripts instead of literal brackets.
const VERSE_MARKER = /\[(\d+)\]\s?/;

export function VerseText({ text }) {
  if (!text) return null;
  const parts = text.split(VERSE_MARKER);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <sup key={i} className="bible-verse-num">{part}</sup>
      : part
  );
}
