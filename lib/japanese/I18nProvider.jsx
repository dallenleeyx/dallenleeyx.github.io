'use client';
// lib/japanese/I18nProvider.jsx — EN/日本語 chrome-only translation (never
// study content), ported from app.js's t()/currentLang. Silent mode (mutes
// the Google Cloud TTS audio on flashcard flip -- see lib/japanese/speak.js)
// lives here too since the Settings modal owns both toggles.
import { createContext, useContext, useEffect, useState } from 'react';
import { I18N } from './data/i18n';

const LANG_KEY = 'jpstudy_lang_v1';
const SILENT_MODE_KEY = 'jpstudy_silent_mode_v1';

const JapaneseI18nContext = createContext(null);

export function JapaneseI18nProvider({ children }) {
  // Starts at the SSR-safe defaults and restores the real saved values only
  // after mount -- see ThemeProvider.jsx's file-level comment for why
  // reading localStorage inside useState()'s initializer itself causes a
  // hydration mismatch (SSR never sees a saved value, since localStorage
  // doesn't exist server-side).
  const [lang, setLang] = useState('en');
  const [silentMode, setSilentMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && I18N[saved]) setLang(saved);
    } catch (e) {}
    try {
      if (localStorage.getItem(SILENT_MODE_KEY) === '1') setSilentMode(true);
    } catch (e) {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }, [lang, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(SILENT_MODE_KEY, silentMode ? '1' : '0'); } catch (e) {}
  }, [silentMode, hydrated]);

  const t = (key, vars) => {
    const dict = I18N[lang] || {};
    let str = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(`{${k}}`, vars[k]);
      });
    }
    return str;
  };

  return (
    <JapaneseI18nContext.Provider value={{ lang, setLang, t, silentMode, setSilentMode }}>
      {children}
    </JapaneseI18nContext.Provider>
  );
}

export function useJapaneseI18n() {
  const ctx = useContext(JapaneseI18nContext);
  if (!ctx) throw new Error('useJapaneseI18n must be used within JapaneseI18nProvider');
  return ctx;
}
