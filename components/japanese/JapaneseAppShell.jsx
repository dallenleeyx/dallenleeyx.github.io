'use client';
// components/japanese/JapaneseAppShell.jsx — top-level client wrapper for the
// Japanese section: sets up theme/i18n/view context and the namespaced
// .jp-shell wrapper div the ported CSS targets (see app/japanese/japanese.css).
import { useState } from 'react';
import { JapaneseThemeProvider, useJapaneseTheme } from '../../lib/japanese/ThemeProvider';
import { JapaneseI18nProvider, useJapaneseI18n } from '../../lib/japanese/I18nProvider';
import { JapaneseViewProvider, JapaneseTabBar, JapaneseViewContent } from './JapaneseTabs';
import { SettingsModal } from './SettingsModal';

function ShellInner() {
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
        <JapaneseTabBar />
        <div className="header-right">
          <button className="settings-gear-btn" aria-label={t('settingsTitle')} onClick={() => setSettingsOpen(true)}>⚙️</button>
        </div>
      </header>
      <JapaneseViewContent />
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

export function JapaneseAppShell() {
  return (
    <JapaneseThemeProvider>
      <JapaneseI18nProvider>
        <JapaneseViewProvider>
          <ShellInner />
        </JapaneseViewProvider>
      </JapaneseI18nProvider>
    </JapaneseThemeProvider>
  );
}
