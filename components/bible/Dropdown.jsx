'use client';
// components/bible/Dropdown.jsx — small custom-styled dropdown shared by
// the book/chapter/version pickers, instead of a plain native <select> --
// a disclosure button plus a floating, styled option list. Not a full ARIA
// combobox, but closes on outside click and Escape. Options can be a flat
// array of { value, label } or grouped as [{ groupLabel, options }] (used
// for the book picker's Old/New Testament sections).
import { useEffect, useRef, useState } from 'react';

export function Dropdown({ value, options, onChange, placeholder = 'Select…', className = '' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isGrouped = options.length > 0 && Array.isArray(options[0]?.options);
  const flatOptions = isGrouped ? options.flatMap((g) => g.options) : options;
  const current = flatOptions.find((o) => o.value === value);

  const renderOption = (o) => (
    <button
      type="button"
      key={o.value}
      className={`bib-dropdown-option${o.value === value ? ' active' : ''}`}
      onClick={() => { onChange(o.value); setOpen(false); }}
    >
      {o.label}
    </button>
  );

  return (
    <div className={`bib-dropdown${open ? ' open' : ''} ${className}`} ref={rootRef}>
      <button type="button" className="bib-dropdown-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="bib-dropdown-value">{current ? current.label : placeholder}</span>
        <svg className="bib-dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="bib-dropdown-panel" role="listbox">
          {isGrouped
            ? options.map((g) => (
                <div className="bib-dropdown-group" key={g.groupLabel}>
                  <p className="bib-dropdown-group-label">{g.groupLabel}</p>
                  {g.options.map(renderOption)}
                </div>
              ))
            : options.map(renderOption)}
        </div>
      )}
    </div>
  );
}
