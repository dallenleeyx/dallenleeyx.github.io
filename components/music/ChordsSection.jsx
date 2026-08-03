'use client';
import { useState } from 'react';
import { ChordsStaffDrill } from './ChordsStaffDrill';
import { ChordsEarDrill } from './ChordsEarDrill';

export function ChordsSection() {
  const [mode, setMode] = useState('staff');
  return (
    <>
      <div className="music-subnav">
        <button type="button" className={`music-subnav-btn${mode === 'staff' ? ' active' : ''}`} onClick={() => setMode('staff')}>Staff</button>
        <button type="button" className={`music-subnav-btn${mode === 'ear' ? ' active' : ''}`} onClick={() => setMode('ear')}>Ear Training</button>
      </div>
      {mode === 'staff' ? <ChordsStaffDrill key="staff" /> : <ChordsEarDrill key="ear" />}
    </>
  );
}
