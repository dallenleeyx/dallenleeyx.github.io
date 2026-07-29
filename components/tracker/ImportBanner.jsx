'use client';
// components/tracker/ImportBanner.jsx — one-time migration affordance: paste
// the JSON exported from the old GitHub Pages site's localStorage (via
// `copy(localStorage.getItem('proofLabData'))` in its browser console) to
// bring real course data into the new synced backend instead of the seed data.
import { useState } from 'react';

export function ImportBanner({ onImport, onDismiss }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    try {
      const parsed = JSON.parse(text);
      const courses = Array.isArray(parsed) ? parsed : parsed.courses;
      if (!Array.isArray(courses)) throw new Error('not an array');
      onImport(courses);
    } catch (e) {
      setError('That doesn\'t look like valid exported data — check you copied the whole string.');
    }
  };

  return (
    <div className="tk-note-block" style={{ marginBottom: '2rem' }}>
      <div className="tk-note-block-head">
        <span className="tk-type">Import your data</span>
      </div>
      <div className="tk-note-block-body">
        <p className="tk-note-p">
          You're seeing starter courses because no saved data was found for your account yet.
          If you have existing data from the old site, open its browser console and run{' '}
          <code className="t-code">copy(localStorage.getItem('proofLabData'))</code>, then paste it below.
        </p>
        <textarea
          className="tk-textarea"
          style={{ minHeight: 100 }}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste exported JSON here…"
        />
        {error && <p className="tk-note-p" style={{ color: 'var(--tk-flag-red, #c0392b)' }}>{error}</p>}
        <div className="tk-modal-foot" style={{ marginTop: '.8rem' }}>
          <button className="tk-mono-btn" onClick={onDismiss}>Dismiss</button>
          <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!text.trim()} onClick={submit}>Import</button>
        </div>
      </div>
    </div>
  );
}
