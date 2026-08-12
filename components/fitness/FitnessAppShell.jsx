'use client';
// components/fitness/FitnessAppShell.jsx — top-level client wrapper for the
// Fitness section: sets up the sync provider and a small subnav (Plan/Log/
// History), same "mount every subview, toggle with CSS" rationale as
// VocabSection.jsx one level up in Japanese.
import { useState } from 'react';
import { FitnessSyncProvider } from '../../lib/fitness/FitnessSyncContext';
import { PlanEditor } from './PlanEditor';
import { DailyLog } from './DailyLog';
import { History } from './History';

const SUBVIEWS = [
  { id: 'log', label: 'Today' },
  { id: 'plan', label: 'Plan' },
  { id: 'history', label: 'History' },
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
        <span className="fit-subtitle">your plan, your log, synced from Apple Health</span>
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
        <div className={`fit-subview${activeSubview === 'plan' ? ' active' : ''}`}>
          <PlanEditor />
        </div>
        <div className={`fit-subview${activeSubview === 'history' ? ' active' : ''}`}>
          <History />
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
