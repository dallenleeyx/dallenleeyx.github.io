'use client';
import { useState } from 'react';
import { StaffNotesDrill } from './StaffNotesDrill';

const MODES = [
  { id: 'noteToName', label: 'Note → Name' },
  { id: 'nameToNote', label: 'Name → Note' },
  { id: 'mixed', label: 'Mixed' },
];

export function StaffNotesSection() {
  const [mode, setMode] = useState('noteToName');
  return (
    <>
      <div className="music-subnav">
        {MODES.map(({ id, label }) => (
          <button key={id} type="button" className={`music-subnav-btn${mode === id ? ' active' : ''}`} onClick={() => setMode(id)}>
            {label}
          </button>
        ))}
      </div>
      <StaffNotesDrill key={mode} mode={mode} />
    </>
  );
}
