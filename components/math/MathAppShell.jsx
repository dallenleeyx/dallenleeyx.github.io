'use client';
// components/math/MathAppShell.jsx — top-level client wrapper for the Math
// section: course switcher (MA4262/MA4266) + a subnav (Browse/Flashcards/
// Add), same "mount every subview, toggle with CSS" rationale as
// VocabSection.jsx / FitnessAppShell.jsx. The editing target lives here
// (not inside ItemEditor) so Browse's pencil icon can jump straight to a
// pre-filled editor.
import { useState } from 'react';
import { MathSyncProvider, useMath } from '../../lib/math/MathSyncContext';
import { COURSES } from '../../lib/math/items';
import { Browse } from './Browse';
import { Flashcards } from './Flashcards';
import { ItemEditor } from './ItemEditor';

const SUBVIEWS = [
  { id: 'browse', label: 'Browse' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'add', label: 'Add' },
];

function ShellInner() {
  const { state } = useMath();
  const [course, setCourse] = useState(COURSES[0]);
  const [subview, setSubview] = useState('browse');
  const [editingId, setEditingId] = useState(null);

  const editingItem = editingId ? state.items[editingId] : null;

  function handleEdit(id) {
    setEditingId(id);
    setSubview('add');
  }
  function handleDoneEditing() {
    setEditingId(null);
    setSubview('browse');
  }
  function handleTabClick(id) {
    if (id === 'add') setEditingId(null); // the tab always means "new entry"; only Browse's pencil pre-fills
    setSubview(id);
  }

  return (
    <div className="math-shell">
      <header className="math-header">
        <span className="math-brand">
          <span className="math-brand-icon" aria-hidden="true">∑</span>
          <span className="math-brand-text">Math</span>
        </span>
        <span className="math-subtitle">theorems, definitions & proofs — categorised by lecture</span>
      </header>

      <div className="math-course-switch">
        {COURSES.map((c) => (
          <button
            key={c}
            className={`math-course-btn${course === c ? ' active' : ''}`}
            onClick={() => { setCourse(c); setEditingId(null); }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="math-subnav">
        {SUBVIEWS.map(({ id, label }) => (
          <button
            key={id}
            className={`math-subnav-btn${subview === id ? ' active' : ''}`}
            onClick={() => handleTabClick(id)}
          >
            {id === 'add' && editingItem ? 'Edit' : label}
          </button>
        ))}
      </div>

      <main className="math-main">
        <div className={`math-subview${subview === 'browse' ? ' active' : ''}`}>
          <Browse course={course} onEdit={handleEdit} />
        </div>
        <div className={`math-subview${subview === 'flashcards' ? ' active' : ''}`}>
          <Flashcards course={course} />
        </div>
        <div className={`math-subview${subview === 'add' ? ' active' : ''}`}>
          <ItemEditor course={course} editingItem={editingItem} onDone={handleDoneEditing} />
        </div>
      </main>
    </div>
  );
}

export function MathAppShell() {
  return (
    <MathSyncProvider>
      <ShellInner />
    </MathSyncProvider>
  );
}
