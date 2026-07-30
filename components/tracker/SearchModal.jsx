'use client';
// components/tracker/SearchModal.jsx — global search across every course's
// theorem/definition/lemma/etc. blocks. Selecting a result navigates to
// that course and scrolls straight to the matching block.
import { Fragment, useMemo, useState } from 'react';
import { ENV_LABELS } from '../../lib/markdown';
import { searchTheorems } from '../../lib/search';

function snippet(text, query) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const idx = clean.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return clean.slice(0, 140) + (clean.length > 140 ? '…' : '');
  const start = Math.max(0, idx - 40);
  const end = Math.min(clean.length, idx + query.length + 80);
  return (start > 0 ? '…' : '') + clean.slice(start, end) + (end < clean.length ? '…' : '');
}

export function SearchModal({ courses, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchTheorems(courses, query), [courses, query]);

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal tk-search-modal">
          <input
            className="tk-input"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onClose()}
            placeholder="Search theorems, definitions, examples…"
          />
          <div className="tk-search-results">
            {query.trim() && !results.length && <div className="tk-search-empty">No matches.</div>}
            {results.map((r, i) => (
              <div key={i} className="tk-search-result" onClick={() => onSelect(r.course.id, r.startLine)}>
                <div className="tk-search-result-head">
                  <span className="tk-type">{ENV_LABELS[r.type] || r.type}</span>
                  <span className="tk-search-result-course">{r.course.glyph} · {r.course.name}</span>
                </div>
                <div className="tk-search-result-name">{r.name || 'Untitled'}</div>
                <div className="tk-search-result-snippet">{snippet(r.statement, query)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
