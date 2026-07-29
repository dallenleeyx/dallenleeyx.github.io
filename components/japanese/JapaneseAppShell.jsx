'use client';
// components/japanese/JapaneseAppShell.jsx — top-level client wrapper for the
// Japanese section: sets up theme/i18n context and the namespaced .jp-shell
// wrapper div the ported CSS targets (see app/japanese/japanese.css).
import { useState } from 'react';
import { JapaneseThemeProvider, useJapaneseTheme } from '../../lib/japanese/ThemeProvider';
import { JapaneseI18nProvider, useJapaneseI18n } from '../../lib/japanese/I18nProvider';
import { SettingsModal } from './SettingsModal';

function ShellInner({ children }) {
  const { theme, colorTheme } = useJapaneseTheme();
  const { t } = useJapaneseI18n();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="jp-shell" data-jp-theme={theme} data-jp-color-theme={colorTheme}>
      <header className="site-header">
        <span className="brand">
          <span className="brand-jp">日本語ノート</span>
          <span className="brand-en">kanji, vocab & grammar</span>
        </span>
        <div className="header-right">
          <button className="settings-gear-btn" aria-label={t('settingsTitle')} onClick={() => setSettingsOpen(true)}>⚙️</button>
        </div>
      </header>
      {children}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

export function JapaneseAppShell({ children }) {
  return (
    <JapaneseThemeProvider>
      <JapaneseI18nProvider>
        <ShellInner>{children}</ShellInner>
      </JapaneseI18nProvider>
    </JapaneseThemeProvider>
  );
}
