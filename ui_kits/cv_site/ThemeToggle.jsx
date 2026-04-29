// ThemeToggle.jsx — light/dark + accent color picker
function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Toggle light/dark mode">
      <div className="toggle-icon icon-sun">☀️</div>
      <div className="toggle-icon icon-moon">🌙</div>
    </button>
  );
}

const ACCENTS = [
  { id: 'mono',    label: 'Mono',    swatch: 'linear-gradient(135deg,#e0e0e0,#888)' },
  { id: 'coral',   label: 'Coral',   swatch: '#ff8a73' },
  { id: 'indigo',  label: 'Indigo',  swatch: '#8aa3ff' },
  { id: 'emerald', label: 'Emerald', swatch: '#6fdcaf' },
  { id: 'amber',   label: 'Amber',   swatch: '#f5c46b' },
  { id: 'rose',    label: 'Rose',    swatch: '#ec8ac4' },
];

function AccentPicker({ accent, onChange }) {
  return (
    <div className="accent-picker" role="radiogroup" aria-label="Accent color">
      {ACCENTS.map(a => (
        <button
          key={a.id}
          className={`accent-swatch ${accent === a.id ? 'active' : ''}`}
          style={{ background: a.swatch }}
          title={a.label}
          aria-label={a.label}
          aria-checked={accent === a.id}
          role="radio"
          onClick={() => onChange(a.id)}
        />
      ))}
    </div>
  );
}

window.ThemeToggle = ThemeToggle;
window.AccentPicker = AccentPicker;
window.ACCENTS = ACCENTS;
