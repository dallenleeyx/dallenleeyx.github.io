'use client';
// components/math/ItemEditor.jsx — add or edit one entry. Reused for both
// the "Add" subview (editingItem is null) and the pencil icon in Browse
// (editingItem is set, via MathAppShell lifting the editing id).
import { useEffect, useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { ITEM_TYPES } from '../../lib/math/items';
import { LatexEditor } from './LatexEditor';
import { BulkImport } from './BulkImport';

const NEW_SECTION_VALUE = '__new__';

export function ItemEditor({ course, editingItem, onDone }) {
  const { state, addItem, updateItem, addSection } = useMath();
  const [lecture, setLecture] = useState(1);
  const [type, setType] = useState(ITEM_TYPES[0]);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [creatingSection, setCreatingSection] = useState(false);
  const [statement, setStatement] = useState('');
  const [proof, setProof] = useState('');
  const [remarks, setRemarks] = useState('');

  const sectionList = state.sections[course]?.list || [];

  useEffect(() => {
    if (editingItem) {
      setLecture(editingItem.lecture ?? 1);
      setType(editingItem.type || ITEM_TYPES[0]);
      setNumber(editingItem.number || '');
      setName(editingItem.name || '');
      setSection(editingItem.section || '');
      setStatement(editingItem.statement || '');
      setProof(editingItem.proof || '');
      setRemarks(editingItem.remarks || '');
    } else {
      setLecture(1);
      setType(ITEM_TYPES[0]);
      setNumber('');
      setName('');
      setSection('');
      setStatement('');
      setProof('');
      setRemarks('');
    }
    setCreatingSection(false);
    setNewSectionName('');
  }, [editingItem]);

  function handleSectionSelect(value) {
    if (value === NEW_SECTION_VALUE) {
      setCreatingSection(true);
      return;
    }
    setSection(value);
  }

  function handleCreateSection() {
    if (!newSectionName.trim()) return;
    addSection(course, newSectionName);
    setSection(newSectionName.trim());
    setNewSectionName('');
    setCreatingSection(false);
  }

  function handleSave() {
    if (!statement.trim()) return;
    const payload = {
      course,
      lecture: Number(lecture) || 1,
      type,
      number: number.trim(),
      name: name.trim(),
      section,
      statement,
      proof,
      remarks,
    };
    if (editingItem) {
      updateItem(editingItem.id, payload);
    } else {
      addItem(payload);
      setNumber('');
      setName('');
      setStatement('');
      setProof('');
      setRemarks('');
    }
    onDone?.();
  }

  return (
    <div className="math-editor-form">
      <h3>{editingItem ? 'Edit entry' : `New entry — ${course}`}</h3>

      <div className="math-form-row">
        <label>
          Lecture
          <input type="number" min="1" value={lecture} onChange={(e) => setLecture(e.target.value)} />
        </label>
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Number <span className="math-form-optional">(optional, e.g. "4.5")</span>
          <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="4.5" />
        </label>
      </div>

      <label className="math-form-label-block">
        Name <span className="math-form-optional">(optional, e.g. "Riesz Representation Theorem")</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      </label>

      <label className="math-form-label-block">
        Section <span className="math-form-optional">(optional — groups entries under a heading in Browse)</span>
        {creatingSection ? (
          <span className="math-section-inline-create">
            <input
              type="text"
              autoFocus
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateSection(); if (e.key === 'Escape') setCreatingSection(false); }}
              placeholder="New section name"
            />
            <button type="button" className="math-ghost-btn math-btn-primary" onClick={handleCreateSection} disabled={!newSectionName.trim()}>Create</button>
            <button type="button" className="math-ghost-btn" onClick={() => setCreatingSection(false)}>Cancel</button>
          </span>
        ) : (
          <select value={section} onChange={(e) => handleSectionSelect(e.target.value)}>
            <option value="">— No section —</option>
            {sectionList.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value={NEW_SECTION_VALUE}>+ New section…</option>
          </select>
        )}
      </label>

      <label className="math-form-label-block">
        Statement
        <LatexEditor
          value={statement}
          onChange={setStatement}
          placeholder="Write the statement. Use $...$ for inline math, $$...$$ for display math, \ref{4.5} to cross-link another entry."
          minRows={4}
        />
      </label>

      <label className="math-form-label-block">
        Proof <span className="math-form-optional">(optional)</span>
        <LatexEditor value={proof} onChange={setProof} placeholder="Write the proof (optional)." minRows={6} />
      </label>

      <label className="math-form-label-block">
        Remarks <span className="math-form-optional">(optional — your own gloss on what this means)</span>
        <LatexEditor value={remarks} onChange={setRemarks} placeholder="How you'd explain this to yourself." minRows={3} />
      </label>

      <div className="math-form-actions">
        <button className="math-ghost-btn math-btn-primary" onClick={handleSave}>
          {editingItem ? 'Save changes' : 'Add entry'}
        </button>
        {editingItem && <button className="math-ghost-btn" onClick={onDone}>Cancel</button>}
      </div>

      {!editingItem && <BulkImport course={course} />}
    </div>
  );
}
