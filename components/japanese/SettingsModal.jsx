'use client';
// components/japanese/SettingsModal.jsx — silent-mode/dark-mode toggles + the
// 5-palette theme picker, ported from index.html's #settings-modal.
import { useJapaneseTheme, COLOR_THEMES, COLOR_THEME_INFO } from '../../lib/japanese/ThemeProvider';
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
  const { theme, setTheme, colorTheme, setColorTheme } = useJapaneseTheme();
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

        <div className="settings-row settings-row-column">
          <div className="settings-row-text">
            <span className="settings-row-label">{t('settingsThemeLabel')}</span>
            <span className="settings-row-desc">{t('settingsThemeDesc')}</span>
          </div>
        </div>

        <div className="theme-swatch-grid">
          {COLOR_THEMES.map((key) => {
            const info = COLOR_THEME_INFO[key];
            return (
              <button
                key={key}
                className={`theme-swatch${colorTheme === key ? ' active' : ''}`}
                aria-label={info.label}
                onClick={() => setColorTheme(key)}
              >
                <span className="theme-swatch-colors">
                  {info.swatch.map((c, i) => (
                    <span key={i} className="theme-swatch-color" style={{ background: c }} />
                  ))}
                </span>
                <span className="theme-swatch-label">{t(`themeName${key[0].toUpperCase()}${key.slice(1)}`)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
