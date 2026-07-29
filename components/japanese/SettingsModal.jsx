'use client';
// components/japanese/SettingsModal.jsx — silent-mode/dark-mode toggles,
// ported from index.html's #settings-modal. The theme picker was dropped
// along with the site's 5 selectable color palettes -- it's monochrome now,
// so light/dark is the only visual choice left to make.
import { useJapaneseTheme } from '../../lib/japanese/ThemeProvider';
import { useJapaneseI18n } from '../../lib/japanese/I18nProvider';

function Toggle({ active, onClick, label }) {
  return (
    <button
      className={`settings-toggle${active ? ' active' : ''}`}
      role="switch"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
    />
  );
}

export function SettingsModal({ onClose }) {
  const { theme, setTheme } = useJapaneseTheme();
  const { t, silentMode, setSilentMode } = useJapaneseI18n();

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close-x" aria-label="Close" onClick={onClose}>×</button>
        <h3>{t('settingsTitle')}</h3>

        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-label">{t('settingsSilentMode')}</span>
            <span className="settings-row-desc">{t('settingsSilentModeDesc')}</span>
          </div>
          <Toggle active={silentMode} onClick={() => setSilentMode((v) => !v)} label={t('settingsSilentMode')} />
        </div>

        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-label">{t('settingsDarkMode')}</span>
            <span className="settings-row-desc">{t('settingsDarkModeDesc')}</span>
          </div>
          <Toggle
            active={theme === 'dark'}
            onClick={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}
            label={t('settingsDarkMode')}
          />
        </div>
      </div>
    </div>
  );
}
