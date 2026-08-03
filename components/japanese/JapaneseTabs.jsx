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
import { Home } from './home/Home';
import { NotesSection } from './notes/NotesSection';
import { DictionarySection } from './dictionary/DictionarySection';

const VIEWS = [
  { id: 'home', labelKey: 'tabHome' },
  { id: 'vocab', labelKey: 'tabVocab' },
  { id: 'grammar', labelKey: 'tabGrammar' },
  { id: 'notes', labelKey: 'tabNotes' },
  { id: 'dictionary', labelKey: 'tabDictionary' },
];

const JapaneseViewContext = createContext(null);

export function JapaneseViewProvider({ children }) {
  const [activeView, setActiveView] = useState('home');
  return (
    <JapaneseViewContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </JapaneseViewContext.Provider>
  );
}

// Lets Home's task list jump straight to the Vocab or Grammar tab when a
// task is opened. Deep-linking the exact subview/level/lesson selection
// would need those sections' local subview state lifted into a shared
// context -- out of scope here, so opening a task switches tabs only.
export function useJapaneseView() {
  const ctx = useContext(JapaneseViewContext);
  if (!ctx) throw new Error('useJapaneseView must be used within JapaneseViewProvider');
  return ctx;
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
        <Home active={activeView === 'home'} />
      </section>
      <section id="vocab-view" className={`view${activeView === 'vocab' ? ' active' : ''}`}>
        <VocabSection active={activeView === 'vocab'} />
      </section>
      <section id="grammar-view" className={`view${activeView === 'grammar' ? ' active' : ''}`}>
        <GrammarSection active={activeView === 'grammar'} />
      </section>
      <section id="notes-view" className={`view${activeView === 'notes' ? ' active' : ''}`}>
        <NotesSection />
      </section>
      <section id="dictionary-view" className={`view${activeView === 'dictionary' ? ' active' : ''}`}>
        <DictionarySection />
      </section>
    </main>
  );
}
