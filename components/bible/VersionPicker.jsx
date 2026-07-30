'use client';
// components/bible/VersionPicker.jsx — picks which api.bible translation
// renders passage text. Shows abbreviations only (full names can get long)
// via the shared Dropdown component. The version list itself comes live
// from api.bible via our /api/bible/versions proxy -- never hardcoded.
import { useBibleVersions } from '../../lib/useBiblePassage';
import { Dropdown } from './Dropdown';

export function VersionPicker({ versionId, onChange }) {
  const { versions, error } = useBibleVersions();

  if (error) {
    return <p className="bib-version-error" title={error}>translations unavailable</p>;
  }
  if (!versions) {
    return <p className="bib-version-loading">loading…</p>;
  }
  if (!versions.length) {
    return <p className="bib-version-error">no translations</p>;
  }

  const options = versions.map((v) => ({ value: v.id, label: v.abbreviation || v.name }));
  return (
    <Dropdown
      value={versionId}
      options={options}
      onChange={onChange}
      placeholder="Version"
      className="bib-dropdown-version"
    />
  );
}
