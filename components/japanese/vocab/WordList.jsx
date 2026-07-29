'use client';
// components/japanese/vocab/WordList.jsx — browse by lesson, or search across
// every word by kanji/reading/meaning. Words you're struggling with (more
// wrong than right) are highlighted; a lesson chip turns gold once all three
// practice modes have cleared it.
import { useMemo, useState } from 'react';
import { VOCAB_DATA, VOCAB_LESSONS } from '../../../lib/japanese/data/vocab';
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

function WordRow({ item, isWeak }) {
  return (
    <tr className={isWeak ? 'wl-row-weak' : undefined}>
      <td className="wl-word">{item.word}</td>
      <td className="wl-reading">{item.reading}</td>
      <td className="wl-meaning">{item.meaning}</td>
    </tr>
  );
}

function WordTable({ items, isWeak, t }) {
  return (
    <table className="wordlist-table">
      <thead><tr><th>{t('wlWord')}</th><th>{t('wlReading')}</th><th>{t('wlMeaning')}</th></tr></thead>
      <tbody>
        {items.map((item, i) => <WordRow key={i} item={item} isWeak={isWeak(item)} />)}
      </tbody>
    </table>
  );
}

function LessonBlock({ heading, items, isWeak, t }) {
  if (!items.length) return null;
  return (
    <div className="wordlist-lesson-block">
      <h4 className="wordlist-lesson-heading">{heading}</h4>
      <WordTable items={items} isWeak={isWeak} t={t} />
    </div>
  );
}

export function WordList() {
  const { t } = useJapaneseI18n();
  const { isWeak, isFullyMastered } = useVocabProgress();
  const [level, setLevel] = useState('all');
  const [lesson, setLesson] = useState(null);
  const [query, setQuery] = useState('');

  const handleLevelChange = (l) => { setLevel(l); setLesson(null); };

  const trimmedQuery = query.trim();

  const content = useMemo(() => {
    if (trimmedQuery) {
      const levels = level === 'all' ? Object.keys(VOCAB_DATA) : [level];
      const matches = searchResults(levels, trimmedQuery);
      if (!matches.length) return <p className="wl-empty-note">{t('wlNoResults')}</p>;
      return <WordTable items={matches} isWeak={isWeak} t={t} />;
    }

    if (level === 'all') {
      const levels = Object.keys(VOCAB_DATA);
      return levels.map((l) => {
        const items = VOCAB_DATA[l] || [];
        if (!items.length) return null;
        const lessonTitles = VOCAB_LESSONS[l] || {};
        const lessonNums = lessonNumbersFor(l);
        const hasUnlabeled = items.some((item) => item.lesson === undefined);
        const groups = hasUnlabeled ? [...lessonNums, undefined] : lessonNums;
        return (
          <div className="wordlist-group" key={l}>
            <h3 className={`wordlist-level-heading ${l.toLowerCase()}`}>{l}</h3>
            {groups.map((n) => {
              const lessonItems = items.filter((item) => item.lesson === n).map((item) => ({ ...item, level: l }));
              const heading = n === undefined ? 'Other' : lessonTitles[n] ? `${n}課 ${lessonTitles[n]}` : `${n}課`;
              return <LessonBlock key={n ?? 'other'} heading={heading} items={lessonItems} isWeak={isWeak} t={t} />;
            })}
          </div>
        );
      });
    }

    const items = (VOCAB_DATA[level] || []).map((item) => ({ ...item, level }));
    if (!items.length) return null;
    const lessonTitles = VOCAB_LESSONS[level] || {};
    const lessonNums = lessonNumbersFor(level);
    const hasUnlabeled = items.some((item) => item.lesson === undefined);
    const groups = lesson === null ? (hasUnlabeled ? [...lessonNums, undefined] : lessonNums) : [lesson];
    return groups.map((n) => {
      const lessonItems = items.filter((item) => item.lesson === n);
      const heading = n === undefined ? 'Other' : lessonTitles[n] ? `${n}課 ${lessonTitles[n]}` : `${n}課`;
      return <LessonBlock key={n ?? 'other'} heading={heading} items={lessonItems} isWeak={isWeak} t={t} />;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, lesson, trimmedQuery, isWeak, t]);

  return (
    <>
      <div className="controls">
        <LevelChips value={level} onChange={handleLevelChange} />
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
