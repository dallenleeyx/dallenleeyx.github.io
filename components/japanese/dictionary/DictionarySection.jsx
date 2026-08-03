'use client';
// components/japanese/dictionary/DictionarySection.jsx — free-text word
// search backed by Jisho's public dictionary API (app/api/japanese/
// dictionary/route.js proxies it server-side, since Jisho doesn't send
// CORS headers for browser-side fetches). Works for both vocabulary and
// grammar-pattern lookups since Jisho's index covers ordinary JMdict
// entries and many grammar expressions/particles alike -- there's no
// separate grammar-only source needed.
import { useState } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';

function ResultCard({ entry }) {
  return (
    <div className="dict-card">
      <div className="dict-card-header">
        <span className="dict-word">{entry.word}</span>
        {entry.reading && entry.reading !== entry.word && <span className="dict-reading">{entry.reading}</span>}
        {entry.jlpt.map((lvl) => (
          <span key={lvl} className={`dict-jlpt-badge ${lvl.toLowerCase()}`}>{lvl}</span>
        ))}
      </div>
      <ol className="dict-senses">
        {entry.senses.map((s, i) => (
          <li key={i} className="dict-sense">
            {s.partsOfSpeech.length > 0 && <span className="dict-pos">{s.partsOfSpeech.join(', ')}</span>}
            <span className="dict-definitions">{s.englishDefinitions.join('; ')}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DictionarySection() {
  const { t } = useJapaneseI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setStatus('loading');
    try {
      const res = await fetch(`/api/japanese/dictionary?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('lookup failed');
      const data = await res.json();
      setResults(data.results || []);
      setStatus('idle');
    } catch (e) {
      setResults(null);
      setStatus('error');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <>
      <form className="controls dict-search-row" onSubmit={onSubmit}>
        <input
          type="search"
          className="wl-search-input dict-search-input"
          autoComplete="off"
          spellCheck="false"
          placeholder={t('dictSearchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="ghost-btn btn-primary" disabled={status === 'loading' || !query.trim()}>
          {status === 'loading' ? t('dictSearching') : t('dictSearchBtn')}
        </button>
      </form>

      {status === 'error' && <p className="dict-status-note dict-error">{t('dictError')}</p>}
      {results === null && status !== 'error' && <p className="dict-status-note">{t('dictEmptyHint')}</p>}
      {results !== null && results.length === 0 && status !== 'error' && <p className="dict-status-note">{t('dictNoResults')}</p>}

      {results && results.length > 0 && (
        <div className="dict-results">
          {results.map((entry, i) => <ResultCard key={i} entry={entry} />)}
        </div>
      )}
    </>
  );
}
