'use client';
// components/bible/Reader.jsx — look up a passage and read it in one or
// both versions side by side. Fetches straight from the passage proxy
// (app/api/bible/passage/route.js); not part of the synced state since
// there's nothing here worth persisting across devices.
import { useState } from 'react';

const VERSIONS = ['ESV', 'NIV'];

export function Reader() {
  const [refInput, setRefInput] = useState('John 3:16');
  const [activeVersions, setActiveVersions] = useState(['ESV', 'NIV']);
  const [results, setResults] = useState({});

  function toggleVersion(v) {
    setActiveVersions((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  async function handleLookup(e) {
    e?.preventDefault();
    const ref = refInput.trim();
    if (!ref) return;
    const versions = activeVersions.length ? activeVersions : ['ESV'];
    setResults(Object.fromEntries(versions.map((v) => [v, { status: 'loading' }])));
    versions.forEach(async (v) => {
      try {
        const res = await fetch(`/api/bible/passage?ref=${encodeURIComponent(ref)}&version=${v}`);
        const body = await res.json();
        setResults((prev) => ({ ...prev, [v]: { status: res.ok ? 'ok' : 'error', data: body } }));
      } catch (err) {
        setResults((prev) => ({ ...prev, [v]: { status: 'error', data: null } }));
      }
    });
  }

  const paneCount = Object.keys(results).length;

  return (
    <div className="bible-reader">
      <form className="bible-reader-form" onSubmit={handleLookup}>
        <input
          className="bible-form-input bible-reader-input"
          value={refInput}
          onChange={(e) => setRefInput(e.target.value)}
          placeholder="e.g. John 3:16, Genesis 1:1-2, Romans 8"
        />
        <div className="bible-version-toggles">
          {VERSIONS.map((v) => (
            <button
              type="button"
              key={v}
              className={`bible-version-toggle${activeVersions.includes(v) ? ' active' : ''}`}
              onClick={() => toggleVersion(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <button className="bible-ghost-btn bible-btn-primary" type="submit">Go</button>
      </form>

      {paneCount > 0 && (
        <div className={`bible-reader-panes${paneCount > 1 ? ' dual' : ''}`}>
          {Object.entries(results).map(([v, r]) => (
            <div key={v} className="bible-reader-pane">
              <div className="bible-reader-pane-head">
                <span className="bible-version-badge">{v}</span>
                {r.data?.ref && <span className="bible-reader-pane-ref">{r.data.ref}</span>}
              </div>
              {r.status === 'loading' && <p className="bible-ref-loading">Loading…</p>}
              {r.status === 'error' && <p className="bible-ref-missing">{r.data?.error || 'Could not load this passage.'}</p>}
              {r.status === 'ok' && (
                <>
                  <p className="bible-reader-pane-text">{r.data.text}</p>
                  {r.data.placeholder && <p className="bible-ref-placeholder-note">{r.data.label}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
