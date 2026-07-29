'use client';
// lib/japanese/ThemeProvider.jsx — 5-palette + light/dark theming for the
// Japanese section. Deliberately namespaced (data-jp-theme/data-jp-color-theme
// on a .jp-shell wrapper, never document.documentElement) so it can never
// collide with the math site's own [data-theme] toggle or its identically
// named CSS custom properties (see app/japanese/japanese.css's header comment).
import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'jpstudy_theme_v1';
const COLOR_THEME_KEY = 'jpstudy_color_theme_v1';

export const COLOR_THEMES = ['slate', 'pastel', 'warm', 'sumi', 'matcha'];

export const COLOR_THEME_INFO = {
  slate: { label: 'Slate & Indigo', swatch: ['#F1F5F9', '#3B6DF4', '#DC2626'] },
  pastel: { label: 'Pastel Sunshine', swatch: ['#F2EAE0', '#82B2C0', '#F6C7B3'] },
  warm: { label: 'Warm Neutrals', swatch: ['#E8E4D9', '#22314F', '#9C4A3C'] },
  sumi: { label: 'Sumi Ink', swatch: ['#F2F0EC', '#1F6F6B', '#B0413A'] },
  matcha: { label: 'Matcha & Cream', swatch: ['#F3EFE1', '#5C7A5A', '#C9A24B'] },
};

const JapaneseThemeContext = createContext(null);

export function JapaneseThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'light'; } catch (e) { return 'light'; }
  });
  const [colorTheme, setColorTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(COLOR_THEME_KEY);
      return COLOR_THEMES.includes(saved) ? saved : 'slate';
    } catch (e) { return 'slate'; }
  });

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }, [theme]);
  useEffect(() => {
    try { localStorage.setItem(COLOR_THEME_KEY, colorTheme); } catch (e) {}
  }, [colorTheme]);

  return (
    <JapaneseThemeContext.Provider value={{ theme, setTheme, colorTheme, setColorTheme }}>
      {children}
    </JapaneseThemeContext.Provider>
  );
}

export function useJapaneseTheme() {
  const ctx = useContext(JapaneseThemeContext);
  if (!ctx) throw new Error('useJapaneseTheme must be used within JapaneseThemeProvider');
  return ctx;
}
