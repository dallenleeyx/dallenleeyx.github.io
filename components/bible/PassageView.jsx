'use client';
// components/bible/PassageView.jsx — renders one chapter's passage text
// (fetched live from api.bible via our server-side proxy) above the notes
// box for that chapter, with a required copyright/attribution line.
import { useBiblePassage } from '../../lib/useBiblePassage';

export function PassageView({ versionId, bookId, chapter }) {
  const { passage, loading, error } = useBiblePassage(versionId, bookId, chapter);

  if (!versionId) {
    return <p className="bib-passage-hint">Choose a translation above to read this chapter here.</p>;
  }
  if (loading) return <p className="bib-passage-hint">Loading passage…</p>;
  if (error) return <p className="bib-passage-error">Couldn't load this passage ({error}).</p>;
  if (!passage) return null;

  return (
    <div className="bib-passage">
      {passage.reference && <p className="bib-passage-ref">{passage.reference}</p>}
      <p className="bib-passage-text">{passage.content}</p>
      {passage.copyright && <p className="bib-passage-copyright">{passage.copyright}</p>}
    </div>
  );
}
