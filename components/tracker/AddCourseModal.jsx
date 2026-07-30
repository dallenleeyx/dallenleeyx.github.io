'use client';
// components/tracker/AddCourseModal.jsx
import { Fragment, useState } from 'react';

export function AddCourseModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const submit = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), code: code.trim(), desc: desc.trim() });
  };
  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">Add a course</div>
          <div className="tk-modal-field">
            <label>Course title</label>
            <input className="tk-input" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Linear Algebra" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Course code</label>
            <input className="tk-input" value={code} onChange={e => setCode(e.target.value)} placeholder="MA2101" onKeyDown={e => e.key === 'Enter' && submit()} />
            <p className="tk-modal-field-hint">Must match this course's code exactly as it appears in your school's calendar export, so imported .ics events get matched to it later.</p>
          </div>
          <div className="tk-modal-field">
            <label>Description</label>
            <textarea className="tk-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What this course covers…" />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!title.trim()} onClick={submit}>Add course</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
