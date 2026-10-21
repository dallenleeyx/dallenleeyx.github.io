'use client';
// components/japanese/vocab/WordList.jsx — browse by lesson, or search across
// every word by kanji/reading/meaning. Manually marked weak words are
// highlighted and filterable; a lesson chip turns gold once all three
// practice modes have cleared it.
import { useMemo, useState } from 'react';
import { VOCAB_DATA, VOCAB_LESSONS } from '../../../lib/japanese/data/vocab';
import { wordId } from '../../../lib/japanese/wordId';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { useVocabProgress } from '../../../lib/japanese/VocabProgressContext';
import { LevelChips } from './LevelChips';
import { LessonChips, lessonNumbersFor } from './LessonChips';

function queryKind(query) {
  if (/[一-龯]/.test(query)) return 'kanji';
  if (/[ぁ-んァ-ヶーゝゞ]/.test(query)) return 'reading';
  return 'meaning';
}
function matchesQuery(item, query, kind) {
  if (kind === 'kanji') return item.word.includes(query);
  if (kind === 'reading') return (item.reading || item.word).includes(query);
  return (item.meaning || '').toLowerCase().includes(query.toLowerCase());
}
function searchResults(levels, query) {
  const kind = queryKind(query);
  const matches = [];
  levels.forEach((l) => {
    (VOCAB_DATA[l] || []).forEach((item) => {
      if (matchesQuery(item, query, kind)) matches.push({ ...item, level: l });
    });
  });
  if (kind === 'kanji') matches.sort((a, b) => a.word.indexOf(query) - b.word.indexOf(query));
  return matches;
}

function WordRow({ item, weak, onToggleWeak, t }) {
  return (
    <tr className={weak ? 'wl-row-weak' : undefined}>
      <td className="wl-word">{item.word}</td>
      <td className="wl-reading">{item.reading}</td>
      <td className="wl-meaning">{item.meaning}</td>
      <td className="wl-weak">
        <button
          type="button"
          className={`weak-word-toggle${weak ? ' active' : ''}`}
          aria-pressed={weak}
          aria-label={`${t(weak ? 'unmarkWeak' : 'markWeak')}: ${item.word}`}
          onClick={() => onToggleWeak(item)}
        >
          <span aria-hidden="true">{weak ? '★' : '☆'}</span>
          <span className="weak-word-label">{t(weak ? 'weakMarked' : 'markWeak')}</span>
        </button>
      </td>
    </tr>
  );
}

function WordTable({ items, isWeak, onToggleWeak, t }) {
  return (
    <table className="wordlist-table">
      <thead><tr><th>{t('wlWord')}</th><th>{t('wlReading')}</th><th>{t('wlMeaning')}</th><th>{t('wlWeak')}</th></tr></thead>
      <tbody>
        {items.map((item) => <WordRow key={wordId(item)} item={item} weak={isWeak(item)} onToggleWeak={onToggleWeak} t={t} />)}
      </tbody>
    </table>
  );
}

function LessonBlock({ heading, items, isWeak, onToggleWeak, t }) {
  if (!items.length) return null;
  return (
    <div className="wordlist-lesson-block">
      <h4 className="wordlist-lesson-heading">{heading}</h4>
      <WordTable items={items} isWeak={isWeak} onToggleWeak={onToggleWeak} t={t} />
    </div>
  );
}

export function WordList() {
  const { t } = useJapaneseI18n();
  const { isWeak, toggleWeak, isFullyMastered } = useVocabProgress();
  const [level, setLevel] = useState('all');
  const [lesson, setLesson] = useState(null);
  const [query, setQuery] = useState('');
  const [weakOnly, setWeakOnly] = useState(false);

  const handleLevelChange = (l) => { setLevel(l); setLesson(null); };

  const trimmedQuery = query.trim();
  const weakCount = Object.keys(VOCAB_DATA).reduce(
    (total, l) => total + (VOCAB_DATA[l] || []).filter((item) => isWeak({ ...item, level: l })).length,
    0
  );

  const content = useMemo(() => {
    const filterWeak = (items) => weakOnly ? items.filter(isWeak) : items;
    if (trimmedQuery) {
      const levels = level === 'all' ? Object.keys(VOCAB_DATA) : [level];
      const matches = filterWeak(searchResults(levels, trimmedQuery));
      if (!matches.length) return <p className="wl-empty-note">{t(weakOnly ? 'wlNoWeakResults' : 'wlNoResults')}</p>;
      return <WordTable items={matches} isWeak={isWeak} onToggleWeak={toggleWeak} t={t} />;
    }

    if (level === 'all') {
      const levels = Object.keys(VOCAB_DATA);
      if (weakOnly && !weakCount) return <p className="wl-empty-note">{t('wlNoWeakResults')}</p>;
      return levels.map((l) => {
        const items = filterWeak((VOCAB_DATA[l] || []).map((item) => ({ ...item, level: l })));
        if (!items.length) return null;
        const lessonTitles = VOCAB_LESSONS[l] || {};
        const lessonNums = lessonNumbersFor(l);
        const hasUnlabeled = items.some((item) => item.lesson === undefined);
        const groups = hasUnlabeled ? [...lessonNums, undefined] : lessonNums;
        return (
          <div className="wordlist-group" key={l}>
            <h3 className={`wordlist-level-heading ${l.toLowerCase()}`}>{l}</h3>
            {groups.map((n) => {
              const lessonItems = items.filter((item) => item.lesson === n);
              const heading = n === undefined ? 'Other' : lessonTitles[n] ? `${n}課 ${lessonTitles[n]}` : `${n}課`;
              return <LessonBlock key={n ?? 'other'} heading={heading} items={lessonItems} isWeak={isWeak} onToggleWeak={toggleWeak} t={t} />;
            })}
          </div>
        );
      });
    }

    const items = filterWeak((VOCAB_DATA[level] || []).map((item) => ({ ...item, level })));
    if (!items.length) return <p className="wl-empty-note">{t(weakOnly ? 'wlNoWeakResults' : 'wlNoResults')}</p>;
    const lessonTitles = VOCAB_LESSONS[level] || {};
    const lessonNums = lessonNumbersFor(level);
    const hasUnlabeled = items.some((item) => item.lesson === undefined);
    const groups = lesson === null ? (hasUnlabeled ? [...lessonNums, undefined] : lessonNums) : [lesson];
    return groups.map((n) => {
      const lessonItems = items.filter((item) => item.lesson === n);
      const heading = n === undefined ? 'Other' : lessonTitles[n] ? `${n}課 ${lessonTitles[n]}` : `${n}課`;
      return <LessonBlock key={n ?? 'other'} heading={heading} items={lessonItems} isWeak={isWeak} onToggleWeak={toggleWeak} t={t} />;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, lesson, trimmedQuery, weakOnly, weakCount, isWeak, toggleWeak, t]);

  return (
    <>
      <div className="controls">
        <LevelChips value={level} onChange={handleLevelChange} />
        <button
          type="button"
          className={`chip isolate-chip${weakOnly ? ' active' : ''}`}
          aria-pressed={weakOnly}
          onClick={() => setWeakOnly((v) => !v)}
        >
          {t('wlWeakOnly')} ({weakCount})
        </button>
        <input
          type="search"
          className="wl-search-input"
          autoComplete="off"
          spellCheck="false"
          placeholder={t('wlSearchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <LessonChips
        level={level}
        selected={lesson}
        multiSelect={false}
        onToggle={setLesson}
        statusClass={(lv, n) => (isFullyMastered(lv, n) ? ' chip-golden' : '')}
      />
      <div id="wordlist-container">{content}</div>
    </>
  );
}
