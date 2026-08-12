'use client';
// components/japanese/vocab/VocabSection.jsx — Vocab's own subnav (Word
// List/Reading/Flashcards/Writing/Furigana), all subviews mounted at once
// with CSS-driven visibility, same rationale as JapaneseTabs one level up.
// Reading sits right after Word List, before the three revision drills --
// it's for initial learning (seeing a word in context), not revising a
// word you've already met.
import { useState } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { VocabProgressProvider } from '../../../lib/japanese/VocabProgressContext';
import { WordList } from './WordList';
import { Reading } from './Reading';
import { Flashcards } from './Flashcards';
import { KanjiWriting } from './KanjiWriting';
import { Furigana } from './Furigana';

const SUBVIEWS = [
  { id: 'wordlist', labelKey: 'tabWordlist' },
  { id: 'reading', labelKey: 'tabReading' },
  { id: 'flashcards', labelKey: 'tabFlashcards' },
  { id: 'kanjiwrite', labelKey: 'tabKanjiWrite' },
  { id: 'furigana', labelKey: 'tabFurigana' },
];

export function VocabSection({ active }) {
  const { t } = useJapaneseI18n();
  const [activeSubview, setActiveSubview] = useState('wordlist');

  return (
    <VocabProgressProvider>
      <div className="subnav" id="vocab-subnav">
        {SUBVIEWS.map(({ id, labelKey }) => (
          <button
            key={id}
            className={`subnav-btn${activeSubview === id ? ' active' : ''}`}
            onClick={() => setActiveSubview(id)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <div className={`subview${activeSubview === 'wordlist' ? ' active' : ''}`}>
        <WordList />
      </div>
      <div className={`subview${activeSubview === 'reading' ? ' active' : ''}`}>
        <Reading />
      </div>
      <div className={`subview${activeSubview === 'flashcards' ? ' active' : ''}`}>
        <Flashcards active={active && activeSubview === 'flashcards'} />
      </div>
      <div className={`subview${activeSubview === 'kanjiwrite' ? ' active' : ''}`}>
        <KanjiWriting active={active && activeSubview === 'kanjiwrite'} />
      </div>
      <div className={`subview${activeSubview === 'furigana' ? ' active' : ''}`}>
        <Furigana active={active && activeSubview === 'furigana'} />
      </div>
    </VocabProgressProvider>
  );
}
