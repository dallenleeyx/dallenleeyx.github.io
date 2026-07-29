'use client';
// components/japanese/vocab/LessonChips.jsx — per-level lesson filter chips.
// Word List is single-select (selected: number|null, null = "all lessons");
// Flashcards/Writing/Furigana are multi-select (selected: number[], [] = "all").
import { VOCAB_LESSONS, VOCAB_DATA } from '../../../lib/japanese/data/vocab';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';

export function lessonNumbersFor(level) {
  const items = VOCAB_DATA[level] || [];
  return [...new Set(items.map((item) => item.lesson).filter((n) => n !== undefined))].sort((a, b) => a - b);
}

export function LessonChips({ level, selected, multiSelect, onToggle, statusClass }) {
  const { t } = useJapaneseI18n();
  if (level === 'all') return null;
  const lessonNums = lessonNumbersFor(level);
  if (!lessonNums.length) return null;
  const lessonTitles = VOCAB_LESSONS[level] || {};
  const allActive = multiSelect ? selected.length === 0 : selected === null;

  return (
    <div className="lesson-chips">
      <button className={`chip lesson-chip${allActive ? ' active' : ''}`} onClick={() => onToggle(null)}>
        {t('allLessons')}
      </button>
      {lessonNums.map((n) => {
        const title = lessonTitles[n] ? `${n}課 ${lessonTitles[n]}` : `${n}課`;
        const isActive = multiSelect ? selected.includes(n) : selected === n;
        const extra = statusClass ? statusClass(level, n) : '';
        return (
          <button
            key={n}
            className={`chip lesson-chip${isActive ? ' active' : ''}${extra}`}
            title={title}
            onClick={() => onToggle(n)}
          >
            {n}課
          </button>
        );
      })}
    </div>
  );
}
