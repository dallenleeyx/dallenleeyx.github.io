'use client';
// components/dashboard/AddGoalModal.jsx — mirrors
// components/tracker/AddCourseModal.jsx's pattern for consistency.
import { Fragment, useState } from 'react';

export function AddGoalModal({ onClose, onCreate }) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const submit = () => {
    if (!label.trim() || !date) return;
    onCreate({ label: label.trim(), date });
  };
  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">Add a goal</div>
          <div className="tk-modal-field">
            <label>Goal</label>
            <input className="tk-input" autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Midterm — Linear Algebra" onKeyDown={(e) => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Date</label>
            <input className="tk-input tk-input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!label.trim() || !date} onClick={submit}>Add goal</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
