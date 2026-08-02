'use client';
// components/tracker/visualizers/AddVisualizerModal.jsx — pick a
// visualizer type and give it a title/caption; the actual parameters
// (size, bandwidth, ...) are adjusted afterward via the live sliders on
// the post itself, not set up front here.
import { Fragment, useState } from 'react';
import { VISUALIZER_TYPES } from './registry';

export function AddVisualizerModal({ onClose, onCreate }) {
  const types = Object.entries(VISUALIZER_TYPES);
  const [type, setType] = useState(types[0][0]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    onCreate({ type, title: title.trim(), caption: caption.trim() });
  };

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">New visualizer</div>
          <div className="tk-modal-field">
            <label>Type</label>
            <select className="tk-input" value={type} onChange={e => setType(e.target.value)}>
              {types.map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div className="tk-modal-field">
            <label>Title</label>
            <input className="tk-input" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Tridiagonal matrix" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Caption (optional)</label>
            <textarea className="tk-textarea" value={caption} onChange={e => setCaption(e.target.value)} placeholder="A short note about what this shows…" />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!title.trim()} onClick={submit}>Add</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
