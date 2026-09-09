'use client';
// components/math/BulkImport.jsx — paste a JSON array of entries and add
// them all at once, instead of filling the single-entry form N times.
// Expected shape per entry: { lecture, type, number?, name?, section?,
// statement, proof?, remarks? }. course comes from the currently active
// course tab, not from the pasted JSON, so the same export can't land in
// the wrong one. Any section name used that the course doesn't already
// have gets registered (in first-seen order) so it shows up in the TOC
// without a separate manual step.
import { useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { ITEM_TYPES } from '../../lib/math/items';

function validateEntries(raw) {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of entries.');
  return parsed.map((entry, i) => {
    if (!entry || typeof entry !== 'object') throw new Error(`Entry ${i + 1} is not an object.`);
    if (!entry.statement || !String(entry.statement).trim()) throw new Error(`Entry ${i + 1} is missing a statement.`);
    const type = ITEM_TYPES.includes(entry.type) ? entry.type : ITEM_TYPES[0];
    return {
      lecture: Number(entry.lecture) || 1,
      type,
      number: entry.number ? String(entry.number).trim() : '',
      name: entry.name ? String(entry.name).trim() : '',
      section: entry.section ? String(entry.section).trim() : '',
      statement: String(entry.statement),
      proof: entry.proof ? String(entry.proof) : '',
      remarks: entry.remarks ? String(entry.remarks) : '',
    };
  });
}

export function BulkImport({ course }) {
  const { state, addItems, addSection } = useMath();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null);

  function handleImport() {
    try {
      const entries = validateEntries(text);
      const existing = state.sections[course]?.list || [];
      const newSections = [...new Set(entries.map((e) => e.section).filter((s) => s && !existing.includes(s)))];
      newSections.forEach((s) => addSection(course, s));
      addItems(entries.map((e) => ({ ...e, course })));
      setStatus({ ok: true, msg: `Added ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} to ${course}.` });
      setText('');
    } catch (e) {
      setStatus({ ok: false, msg: e.message || 'Could not parse that JSON.' });
    }
  }

  return (
    <div className="math-bulk-import">
      <button className="math-ghost-btn" onClick={() => setOpen((v) => !v)}>
        {open ? 'hide bulk import' : 'bulk import (JSON)'}
      </button>
      {open && (
        <div className="math-bulk-import-body">
          <p className="math-bulk-import-hint">
            Paste a JSON array of entries for {course}. Each item needs at least a{' '}
            <code>statement</code>; <code>lecture</code>, <code>type</code>, <code>number</code>,{' '}
            <code>name</code>, <code>section</code>, <code>proof</code> and <code>remarks</code> are all optional.
            Any new <code>section</code> name is added to the course automatically.
          </p>
          <textarea
            className="math-bulk-import-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='[{"lecture": 4, "type": "Theorem", "number": "4.6", "name": "Path lifting", "statement": "...", "proof": "..."}]'
            rows={8}
          />
          <button className="math-ghost-btn math-btn-primary" onClick={handleImport} disabled={!text.trim()}>
            Import
          </button>
          {status && (
            <p className={status.ok ? 'math-bulk-import-ok' : 'math-bulk-import-err'}>{status.msg}</p>
          )}
        </div>
      )}
    </div>
  );
}
