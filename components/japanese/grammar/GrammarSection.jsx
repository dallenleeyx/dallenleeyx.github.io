'use client';
// components/japanese/grammar/GrammarSection.jsx — Grammar's own subnav
// (Grammar/Practice/Conjugation), all subviews mounted at once with
// CSS-driven visibility, same rationale as JapaneseTabs one level up.
import { useState } from 'react';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { GrammarProgressProvider } from '../../../lib/japanese/GrammarProgressContext';
import { Reference } from './Reference';
import { Practice } from './Practice';

const SUBVIEWS = [
  { id: 'grammar', labelKey: 'tabGrammar' },
  { id: 'grammarpractice', labelKey: 'tabGrammarPractice' },
  { id: 'conjugation', labelKey: 'tabConjugation' },
];

export function GrammarSection({ active }) {
  const { t } = useJapaneseI18n();
  const [activeSubview, setActiveSubview] = useState('grammar');

  return (
    <GrammarProgressProvider>
      <div className="subnav" id="grammar-subnav">
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

      <div className={`subview${activeSubview === 'grammar' ? ' active' : ''}`}>
        <Reference />
      </div>
      <div className={`subview${activeSubview === 'grammarpractice' ? ' active' : ''}`}>
        <Practice active={active && activeSubview === 'grammarpractice'} />
      </div>
      <div className={`subview${activeSubview === 'conjugation' ? ' active' : ''}`}>
        <p>Conjugation coming in a later phase.</p>
      </div>
    </GrammarProgressProvider>
  );
}
