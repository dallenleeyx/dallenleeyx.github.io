'use client';
// components/japanese/JapaneseTabs.jsx — top-level Home/Vocab/Grammar tabs.
// All three views stay mounted at all times (CSS-driven visibility via the
// .active class), matching the original site's behavior where switching tabs
// never destroys an in-progress flashcard queue, a half-drawn kanji stroke,
// or a mid-quiz session -- conditionally mounting/unmounting per tab would be
// a real regression here.
//
// Split into a TabBar (rendered inside the header, alongside the brand and
// settings gear) and Content (the actual view sections) since the original
// layout puts the tab strip inside .site-header, not below it -- both share
// state via a small local context rather than one component owning both,
// since JapaneseAppShell needs to interleave the tab bar between other
// header content.
import { createContext, useContext, useState } from 'react';
import { useJapaneseI18n } from '../../lib/japanese/I18nProvider';
import { VocabSection } from './vocab/VocabSection';
import { GrammarSection } from './grammar/GrammarSection';

const VIEWS = [
  { id: 'home', labelKey: 'tabHome' },
  { id: 'vocab', labelKey: 'tabVocab' },
  { id: 'grammar', labelKey: 'tabGrammar' },
];

const JapaneseViewContext = createContext(null);

export function JapaneseViewProvider({ children }) {
  const [activeView, setActiveView] = useState('vocab');
  return (
    <JapaneseViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </JapaneseViewContext.Provider>
  );
}

export function JapaneseTabBar() {
  const { t } = useJapaneseI18n();
  const { activeView, setActiveView } = useContext(JapaneseViewContext);
  return (
    <div className="view-tabs">
      {VIEWS.map(({ id, labelKey }) => (
        <button
          key={id}
          className={`tab${activeView === id ? ' active' : ''}`}
          onClick={() => setActiveView(id)}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}

export function JapaneseViewContent() {
  const { activeView } = useContext(JapaneseViewContext);
  return (
    <main>
      <section id="home-view" className={`view${activeView === 'home' ? ' active' : ''}`}>
        <p>Home study timeline coming in a later phase.</p>
      </section>
      <section id="vocab-view" className={`view${activeView === 'vocab' ? ' active' : ''}`}>
        <VocabSection active={activeView === 'vocab'} />
      </section>
      <section id="grammar-view" className={`view${activeView === 'grammar' ? ' active' : ''}`}>
        <GrammarSection active={activeView === 'grammar'} />
      </section>
    </main>
  );
}
