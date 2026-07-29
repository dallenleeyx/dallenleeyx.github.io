'use client';
// components/japanese/vocab/VocabSection.jsx — Vocab's own subnav (Word
// List/Flashcards/Writing/Furigana), all four subviews mounted at once with
// CSS-driven visibility, same rationale as JapaneseTabs one level up.
import { useState } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { VocabProgressProvider } from '../../../lib/japanese/VocabProgressContext';
import { WordList } from './WordList';
import { Flashcards } from './Flashcards';

const SUBVIEWS = [
  { id: 'wordlist', labelKey: 'tabWordlist' },
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
      <div className={`subview${activeSubview === 'flashcards' ? ' active' : ''}`}>
        <Flashcards active={active && activeSubview === 'flashcards'} />
      </div>
      <div id="kanjiwrite-subview" className={`subview${activeSubview === 'kanjiwrite' ? ' active' : ''}`}>
        <p>Writing practice coming in a later phase.</p>
      </div>
      <div id="furigana-subview" className={`subview${activeSubview === 'furigana' ? ' active' : ''}`}>
        <p>Furigana practice coming in a later phase.</p>
      </div>
    </VocabProgressProvider>
  );
}
