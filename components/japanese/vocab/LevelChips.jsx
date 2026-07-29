'use client';
// components/japanese/vocab/LevelChips.jsx — shared N5-N1/All level filter,
// reused across Word List, Flashcards, Writing, and Furigana.
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function LevelChips({ value, onChange }) {
  const { t } = useJapaneseI18n();
  return (
    <div className="level-chips">
      <button className={`chip${value === 'all' ? ' active' : ''}`} onClick={() => onChange('all')}>{t('all')}</button>
      {LEVELS.map((l) => (
        <button
          key={l}
          className={`chip ${l.toLowerCase()}${value === l ? ' active' : ''}`}
          onClick={() => onChange(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
