'use client';
// components/bible/VersionPicker.jsx — picks which api.bible translation is
// used to render passage text. The version list itself comes live from
// api.bible via our /api/bible/versions proxy -- never hardcoded here.
import { useBibleVersions } from '../../lib/useBiblePassage';

export function VersionPicker({ versionId, onChange }) {
  const { versions, error } = useBibleVersions();

  if (error) {
    return <p className="bib-version-error">Couldn't load translations ({error}). Check BIBLE_API_KEY is configured.</p>;
  }
  if (!versions) {
    return <p className="bib-version-loading">Loading translations…</p>;
  }
  if (!versions.length) {
    return <p className="bib-version-error">No translations available for this API key.</p>;
  }

  return (
    <select
      className="bib-version-select"
      value={versionId || ''}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="" disabled>Choose a translation…</option>
      {versions.map((v) => (
        <option key={v.id} value={v.id}>{v.name}{v.abbreviation ? ` (${v.abbreviation})` : ''}</option>
      ))}
    </select>
  );
}
