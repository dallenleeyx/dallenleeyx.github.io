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
  // Starts at the SSR-safe default and restores the real saved value only
  // after mount -- localStorage doesn't exist server-side, so reading it
  // inside useState()'s initializer would make the server always render
  // 'light' while the client's very first paint could already show
  // 'dark' (whatever was previously saved), a hydration mismatch on the
  // data-jp-theme attribute JapaneseAppShell sets from this value. The
  // `hydrated` gate stops the save-effect from firing with the
  // not-yet-restored default and overwriting the real saved value before
  // it's even been read.
  const [theme, setTheme] = useState('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) setTheme(saved);
    } catch (e) {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }, [theme, hydrated]);

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
