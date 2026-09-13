'use client';
// components/bible/Commentary.jsx — a chronological journal of theological
// notes and personal interpretation. One big free-text box per entry
// (per the user's own format: "[1Cor 5:1-2] This verse says that..."),
// with [Ref] chips auto-linked via BibleText. Sorted by creation time (not
// last-edited), so editing an old entry doesn't jump it to the top of the log.
import { useMemo, useState } from 'react';
import { useBible } from '../../lib/bible/BibleSyncContext';
import { BibleText } from './BibleText';

function formatDate(ms) {
  return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function Commentary() {
  const { state, addCommentary, updateCommentary, deleteCommentary } = useBible();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');

  const entries = useMemo(
    () => Object.values(state.commentary).filter((e) => !e.deleted).sort((a, b) => b.createdAt - a.createdAt),
    [state.commentary]
  );

  function handleAdd() {
    if (!draft.trim()) return;
    addCommentary(draft.trim());
    setDraft('');
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditDraft(entry.body);
  }

  function saveEdit() {
    if (editDraft.trim()) updateCommentary(editingId, editDraft.trim());
    setEditingId(null);
  }

  function handleDelete(entry) {
    const preview = entry.body.slice(0, 40).trim();
    const ok = window.confirm(`Delete this entry ("${preview}${entry.body.length > 40 ? '…' : ''}")? This can't be undone.`);
    if (ok) deleteCommentary(entry.id);
  }

  return (
    <div className="bible-commentary">
      <div className="bible-commentary-form">
        <textarea
          className="bible-form-textarea bible-commentary-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="[1Cor 5:1-2] This verse says that..."
          rows={6}
        />
        <button className="bible-ghost-btn bible-btn-primary" onClick={handleAdd} disabled={!draft.trim()}>
          Add entry
        </button>
      </div>

      {!entries.length ? (
        <p className="bible-empty">No entries yet — write your first reflection above.</p>
      ) : (
        <ul className="bible-commentary-list">
          {entries.map((entry) => (
            <li key={entry.id} className="bible-commentary-card">
              <div className="bible-commentary-card-head">
                <span className="bible-commentary-date">{formatDate(entry.createdAt)}</span>
                <span className="bible-item-actions">
                  <button className="bible-icon-btn" onClick={() => startEdit(entry)} aria-label="Edit">✎</button>
                  <button className="bible-icon-btn" onClick={() => handleDelete(entry)} aria-label="Delete">✕</button>
                </span>
              </div>
              {editingId === entry.id ? (
                <div className="bible-commentary-edit">
                  <textarea
                    className="bible-form-textarea bible-commentary-textarea"
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={6}
                  />
                  <div className="bible-form-actions">
                    <button className="bible-ghost-btn bible-btn-primary" onClick={saveEdit}>Save</button>
                    <button className="bible-ghost-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <BibleText text={entry.body} className="bible-commentary-body" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
