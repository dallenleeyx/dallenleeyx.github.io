'use client';
// components/math/SectionManager.jsx — a collapsible panel for defining a
// course's main sections up front (order, name) rather than only ever
// discovering them from whatever items already exist. Renaming/deleting
// here cascades to every item currently tagged with that section (see
// MathSyncContext.jsx), so the section list is always the source of truth
// for what "Unsectioned" means, not a derived guess.
import { useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';

export function SectionManager({ course }) {
  const { state, addSection, renameSection, deleteSection, reorderSections } = useMath();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const list = state.sections[course]?.list || [];

  function handleAdd() {
    if (!newName.trim()) return;
    addSection(course, newName);
    setNewName('');
  }

  function startEdit(i, name) {
    setEditingIndex(i);
    setEditingValue(name);
  }

  function commitEdit(oldName) {
    if (editingValue.trim() && editingValue.trim() !== oldName) {
      renameSection(course, oldName, editingValue);
    }
    setEditingIndex(null);
  }

  function move(i, delta) {
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    const next = list.slice();
    [next[i], next[j]] = [next[j], next[i]];
    reorderSections(course, next);
  }

  return (
    <div className="math-section-manager">
      <button className="math-ghost-btn" onClick={() => setOpen((v) => !v)}>
        {open ? 'hide sections' : 'manage sections'}
      </button>
      {open && (
        <div className="math-section-manager-body">
          {list.length === 0 && <p className="math-section-manager-hint">No sections yet for {course} -- add one below, then assign it to entries in the editor.</p>}
          <ul className="math-section-list">
            {list.map((name, i) => (
              <li key={name} className="math-section-row">
                <span className="math-section-arrows">
                  <button className="math-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button className="math-icon-btn" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down">↓</button>
                </span>
                {editingIndex === i ? (
                  <input
                    className="math-section-edit-input"
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => commitEdit(name)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(name); if (e.key === 'Escape') setEditingIndex(null); }}
                  />
                ) : (
                  <span className="math-section-name" onClick={() => startEdit(i, name)}>{name}</span>
                )}
                <button className="math-icon-btn" onClick={() => deleteSection(course, name)} aria-label="Delete section">✕</button>
              </li>
            ))}
          </ul>
          <div className="math-section-add-row">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="New section name, e.g. &quot;Covering spaces&quot;"
            />
            <button className="math-ghost-btn math-btn-primary" onClick={handleAdd} disabled={!newName.trim()}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
