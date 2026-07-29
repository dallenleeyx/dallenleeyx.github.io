'use client';
// components/tracker/DeleteCourseModal.jsx — type DELETE to confirm
import { Fragment, useState } from 'react';

export function DeleteCourseModal({ course, onClose, onConfirm }) {
  const [text, setText] = useState('');
  const ready = text.trim().toUpperCase() === 'DELETE';
  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">Delete "{course.name}"?</div>
          <p className="tk-note-p" style={{ marginBottom: '1rem' }}>This removes the course, its assignments, and its notes for good. This can't be undone.</p>
          <div className="tk-modal-field">
            <label>Type DELETE to confirm</label>
            <input className="tk-input" autoFocus value={text} onChange={e => setText(e.target.value)} placeholder="DELETE" onKeyDown={e => e.key === 'Enter' && ready && onConfirm()} />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!ready} onClick={onConfirm}>Delete course</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
