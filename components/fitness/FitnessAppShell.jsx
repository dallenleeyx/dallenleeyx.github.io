'use client';
// components/fitness/FitnessAppShell.jsx — top-level client wrapper for the
// Fitness section: sets up the sync provider and a subnav (Today/Workouts/
// Schedule/History/Stats), same "mount every subview, toggle with CSS"
// rationale as VocabSection.jsx one level up in Japanese.
import { useState } from 'react';
import { FitnessSyncProvider } from '../../lib/fitness/FitnessSyncContext';
import { DailyLog } from './DailyLog';
import { WorkoutLibrary } from './WorkoutLibrary';
import { Schedule } from './Schedule';
import { History } from './History';
import { Stats } from './Stats';

const SUBVIEWS = [
  { id: 'log', label: 'Today' },
  { id: 'workouts', label: 'Workouts' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'history', label: 'History' },
  { id: 'stats', label: 'Stats' },
];

function ShellInner() {
  const [activeSubview, setActiveSubview] = useState('log');

  return (
    <div className="fit-shell">
      <header className="fit-header">
        <span className="fit-brand">
          <span className="fit-brand-icon" aria-hidden="true">🏋️</span>
          <span className="fit-brand-text">Fitness</span>
        </span>
        <span className="fit-subtitle">your workouts, your schedule, your log, synced from Apple Health</span>
      </header>

      <div className="fit-subnav" id="fitness-subnav">
        {SUBVIEWS.map(({ id, label }) => (
          <button
            key={id}
            className={`fit-subnav-btn${activeSubview === id ? ' active' : ''}`}
            onClick={() => setActiveSubview(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="fit-main">
        <div className={`fit-subview${activeSubview === 'log' ? ' active' : ''}`}>
          <DailyLog />
        </div>
        <div className={`fit-subview${activeSubview === 'workouts' ? ' active' : ''}`}>
          <WorkoutLibrary />
        </div>
        <div className={`fit-subview${activeSubview === 'schedule' ? ' active' : ''}`}>
          <Schedule />
        </div>
        <div className={`fit-subview${activeSubview === 'history' ? ' active' : ''}`}>
          <History />
        </div>
        <div className={`fit-subview${activeSubview === 'stats' ? ' active' : ''}`}>
          <Stats />
        </div>
      </main>
    </div>
  );
}

export function FitnessAppShell() {
  return (
    <FitnessSyncProvider>
      <ShellInner />
    </FitnessSyncProvider>
  );
}
