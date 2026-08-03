'use client';
// components/japanese/dictionary/DictionarySection.jsx — free-text word
// search backed by Jisho's public dictionary API and Tatoeba's public
// sentence-search API (app/api/japanese/dictionary/route.js proxies both
// server-side, since neither sends CORS headers for browser-side fetches).
// Works for both vocabulary and grammar-pattern lookups since Jisho's index
// covers ordinary JMdict entries and many grammar expressions/particles
// alike -- there's no separate grammar-only source needed.
//
// Search is live: typing debounces into a request instead of needing a
// button press, with an incrementing request id (rather than an
// AbortController -- fetch abort raises in the .catch here too, and this
// keeps the guard to one line) so a slow, stale response can never
// clobber a faster, newer one.
import { useEffect, useRef, useState } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { speakJapanese } from '../../../lib/japanese/speak';

const DEBOUNCE_MS = 350;

function SpeakButton({ text, silentMode, label }) {
  return (
    <button
      type="button"
      className="ghost-btn dict-speak-btn"
      title={label}
      aria-label={label}
      onClick={() => speakJapanese(text, silentMode)}
    >
      🔊
    </button>
  );
}

function ResultCard({ entry, silentMode, t }) {
  return (
    <div className="dict-card">
      <div className="dict-card-header">
        <span className="dict-word">{entry.word}</span>
        {entry.reading && entry.reading !== entry.word && <span className="dict-reading">{entry.reading}</span>}
        <SpeakButton text={entry.reading || entry.word} silentMode={silentMode} label={t('dictListen')} />
        {entry.jlpt.map((lvl) => (
          <span key={lvl} className={`dict-jlpt-badge ${lvl.toLowerCase()}`}>{lvl}</span>
        ))}
        {entry.isCommon && <span className="dict-common-badge">{t('dictCommon')}</span>}
      </div>
      <ol className="dict-senses">
        {entry.senses.map((s, i) => (
          <li key={i} className="dict-sense">
            {s.partsOfSpeech.length > 0 && <span className="dict-pos">{s.partsOfSpeech.join(', ')}</span>}
            <span className="dict-definitions">{s.englishDefinitions.join('; ')}</span>
          </li>
        ))}
      </ol>
      {entry.examples && entry.examples.length > 0 && (
        <div className="dict-examples">
          <div className="dict-examples-heading">{t('dictExamplesHeading')}</div>
          {entry.examples.map((ex, i) => (
            <div key={i} className="dict-example">
              <div className="dict-example-jp-row">
                <span className="dict-example-jp">{ex.japanese}</span>
                <SpeakButton text={ex.japanese} silentMode={silentMode} label={t('dictListen')} />
              </div>
              {ex.english && <div className="dict-example-en">{ex.english}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DictionarySection() {
  const { t, silentMode } = useJapaneseI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const requestIdRef = useRef(0);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      requestIdRef.current += 1;
      setResults(null);
      setStatus('idle');
      return;
    }
    const requestId = ++requestIdRef.current;
    setStatus('loading');
    const timer = setTimeout(() => {
      fetch(`/api/japanese/dictionary?q=${encodeURIComponent(q)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('lookup failed'))))
        .then((data) => {
          if (requestIdRef.current !== requestId) return; // a newer keystroke already superseded this
          setResults(data.results || []);
          setStatus('idle');
        })
        .catch(() => {
          if (requestIdRef.current !== requestId) return;
          setResults(null);
          setStatus('error');
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <div className="controls dict-search-row">
        <input
          type="search"
          className="wl-search-input dict-search-input"
          autoComplete="off"
          spellCheck="false"
          placeholder={t('dictSearchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {status === 'loading' && <span className="dict-searching-note">{t('dictSearching')}</span>}
      </div>

      {status === 'error' && <p className="dict-status-note dict-error">{t('dictError')}</p>}
      {results === null && status !== 'error' && <p className="dict-status-note">{t('dictEmptyHint')}</p>}
      {results !== null && results.length === 0 && status !== 'error' && <p className="dict-status-note">{t('dictNoResults')}</p>}

      {results && results.length > 0 && (
        <div className="dict-results">
          {results.map((entry, i) => <ResultCard key={i} entry={entry} silentMode={silentMode} t={t} />)}
        </div>
      )}
    </>
  );
}
