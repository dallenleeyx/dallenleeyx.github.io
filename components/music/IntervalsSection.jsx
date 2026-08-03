'use client';
// components/music/IntervalsSection.jsx — Staff and Ear are deliberately
// separate drills (not a shared toggle), so each is its own component with
// its own question/score lifecycle; switching sub-tabs remounts (via key)
// and starts a clean session rather than carrying over the other mode's
// score.
import { useState } from 'react';
import { IntervalsStaffDrill } from './IntervalsStaffDrill';
import { IntervalsEarDrill } from './IntervalsEarDrill';

export function IntervalsSection() {
  const [mode, setMode] = useState('staff');
  return (
    <>
      <div className="music-subnav">
        <button type="button" className={`music-subnav-btn${mode === 'staff' ? ' active' : ''}`} onClick={() => setMode('staff')}>Staff</button>
        <button type="button" className={`music-subnav-btn${mode === 'ear' ? ' active' : ''}`} onClick={() => setMode('ear')}>Ear Training</button>
      </div>
      {mode === 'staff' ? <IntervalsStaffDrill key="staff" /> : <IntervalsEarDrill key="ear" />}
    </>
  );
}
