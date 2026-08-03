'use client';
// components/music/MusicTabs.jsx — Intervals/Chords/Staff Notes tabs.
// Unlike the Japanese section's tabs, these conditionally mount (only the
// active one renders): every drill here is a single self-contained
// question with no multi-step state worth preserving across a tab switch
// (no in-progress flashcard queue, no half-drawn stroke) -- starting fresh
// next time you open a tab is the expected, unsurprising behavior for a
// quiz. Keeping only one drill mounted also means only one is ever able to
// schedule audio, which matters since Web Audio playback isn't tied to
// visibility the way a paused video would be.
import { useState } from 'react';
import { IntervalsSection } from './IntervalsSection';
import { ChordsSection } from './ChordsSection';
import { StaffNotesSection } from './StaffNotesSection';

const TABS = [
  { id: 'intervals', label: 'Intervals' },
  { id: 'chords', label: 'Chords' },
  { id: 'staffNotes', label: 'Staff Notes' },
];

export function MusicTabs() {
  const [active, setActive] = useState('intervals');

  return (
    <>
      <div className="music-tab-bar">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`music-tab${active === id ? ' active' : ''}`}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="music-tab-content">
        {active === 'intervals' && <IntervalsSection key="intervals" />}
        {active === 'chords' && <ChordsSection key="chords" />}
        {active === 'staffNotes' && <StaffNotesSection key="staffNotes" />}
      </div>
    </>
  );
}
