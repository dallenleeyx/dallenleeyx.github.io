'use client';
// components/bible/BibleAppShell.jsx — top-level client wrapper: a subnav
// over Reader/Commentary/QT/Stats, same "mount every subview, toggle with
// CSS" rationale as MathAppShell.jsx/FitnessAppShell.jsx.
import { useState } from 'react';
import { BibleSyncProvider } from '../../lib/bible/BibleSyncContext';
import { Reader } from './Reader';
import { Commentary } from './Commentary';
import { QT } from './QT';
import { Stats } from './Stats';

const SUBVIEWS = [
  { id: 'reader', label: 'Reader' },
  { id: 'commentary', label: 'Commentary' },
  { id: 'qt', label: 'QT' },
  { id: 'stats', label: 'Stats' },
];

function ShellInner() {
  const [subview, setSubview] = useState('reader');

  return (
    <div className="bible-shell">
      <header className="bible-header">
        <span className="bible-brand">
          <span className="bible-brand-icon" aria-hidden="true">✝</span>
          <span className="bible-brand-text">Bible</span>
        </span>
        <span className="bible-subtitle">reading, commentary &amp; quiet times</span>
      </header>

      <div className="bible-subnav">
        {SUBVIEWS.map(({ id, label }) => (
          <button
            key={id}
            className={`bible-subnav-btn${subview === id ? ' active' : ''}`}
            onClick={() => setSubview(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="bible-main">
        <div className={`bible-subview${subview === 'reader' ? ' active' : ''}`}><Reader /></div>
        <div className={`bible-subview${subview === 'commentary' ? ' active' : ''}`}><Commentary /></div>
        <div className={`bible-subview${subview === 'qt' ? ' active' : ''}`}><QT /></div>
        <div className={`bible-subview${subview === 'stats' ? ' active' : ''}`}><Stats /></div>
      </main>
    </div>
  );
}

export function BibleAppShell() {
  return (
    <BibleSyncProvider>
      <ShellInner />
    </BibleSyncProvider>
  );
}
