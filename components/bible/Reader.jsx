'use client';
// components/bible/Reader.jsx — look up a passage and read it in NIV.
// Fetches straight from the passage proxy (app/api/bible/passage/route.js);
// not part of the synced state since there's nothing here worth persisting
// across devices.
import { useState } from 'react';

export function Reader() {
  const [refInput, setRefInput] = useState('John 3:16');
  const [result, setResult] = useState(null);

  async function handleLookup(e) {
    e?.preventDefault();
    const ref = refInput.trim();
    if (!ref) return;
    setResult({ status: 'loading' });
    try {
      const res = await fetch(`/api/bible/passage?ref=${encodeURIComponent(ref)}&version=NIV`);
      const body = await res.json();
      setResult({ status: res.ok ? 'ok' : 'error', data: body });
    } catch (err) {
      setResult({ status: 'error', data: null });
    }
  }

  return (
    <div className="bible-reader">
      <form className="bible-reader-form" onSubmit={handleLookup}>
        <input
          className="bible-form-input bible-reader-input"
          value={refInput}
          onChange={(e) => setRefInput(e.target.value)}
          placeholder="e.g. John 3:16, Genesis 1:1-2, Romans 8"
        />
        <button className="bible-ghost-btn bible-btn-primary" type="submit">Go</button>
      </form>

      {result && (
        <div className="bible-reader-panes">
          <div className="bible-reader-pane">
            <div className="bible-reader-pane-head">
              <span className="bible-version-badge">NIV</span>
              {result.data?.ref && <span className="bible-reader-pane-ref">{result.data.ref}</span>}
            </div>
            {result.status === 'loading' && <p className="bible-ref-loading">Loading…</p>}
            {result.status === 'error' && <p className="bible-ref-missing">{result.data?.error || 'Could not load this passage.'}</p>}
            {result.status === 'ok' && (
              <>
                <p className="bible-reader-pane-text">{result.data.text}</p>
                {result.data.placeholder && <p className="bible-ref-placeholder-note">{result.data.label}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
