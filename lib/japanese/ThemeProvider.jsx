'use client';
// lib/japanese/ThemeProvider.jsx — light/dark theming for the Japanese
// section. Deliberately namespaced (data-jp-theme on a .jp-shell wrapper,
// never document.documentElement) so it can never collide with the math
// site's own [data-theme] toggle or its identically named CSS custom
// properties (see app/japanese/japanese.css's header comment). The site is
// monochrome (no selectable color themes) -- light/dark is the only choice.
import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'jpstudy_theme_v1';

const JapaneseThemeContext = createContext(null);

export function JapaneseThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'light'; } catch (e) { return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }, [theme]);

  return (
    <JapaneseThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </JapaneseThemeContext.Provider>
  );
}

export function useJapaneseTheme() {
  const ctx = useContext(JapaneseThemeContext);
  if (!ctx) throw new Error('useJapaneseTheme must be used within JapaneseThemeProvider');
  return ctx;
}
