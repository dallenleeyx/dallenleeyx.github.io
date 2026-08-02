'use client';
// components/tracker/visualizers/AddVisualizerModal.jsx — a blank box for
// GeoGebra commands (math notation -- Slider(...), Sequence(...), etc,
// not HTML/CSS/JS -- see GeoGebraVisualizer) rather than a form for
// picking a fixed visualizer type. "Use band matrix example" fills in a
// working starter so there's something to look at and tweak immediately,
// since writing one from a blank textarea isn't the point -- pasting and
// adjusting is.
import { Fragment, useState } from 'react';
import { BAND_MATRIX_EXAMPLE_GGB } from './starterExample';

export function AddVisualizerModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [code, setCode] = useState('');

  const submit = () => {
    if (!title.trim() || !code.trim()) return;
    onCreate({ title: title.trim(), caption: caption.trim(), code });
  };

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal tk-viz-add-modal">
          <div className="tk-modal-title">New visualizer</div>
          <div className="tk-modal-field">
            <label>Title</label>
            <input className="tk-input" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Tridiagonal example" />
          </div>
          <div className="tk-modal-field">
            <label>Caption (optional)</label>
            <textarea className="tk-textarea" value={caption} onChange={e => setCaption(e.target.value)} placeholder="A short note about what this shows…" />
          </div>
          <div className="tk-modal-field">
            <label>
              GeoGebra commands (one per line)
              <button type="button" className="tk-mono-btn tk-viz-example-btn" onClick={() => setCode(BAND_MATRIX_EXAMPLE_GGB)}>Use band matrix example</button>
            </label>
            <textarea
              className="tk-textarea tk-viz-code-textarea"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={'n = Slider(2, 24, 1)\nf(x) = sin(n x)\n…'}
              spellCheck={false}
            />
            <p className="tk-modal-field-hint">Each line runs as a GeoGebra command in an embedded GeoGebra Classic applet — no HTML/JS needed. Runs in a sandboxed iframe, isolated from the rest of the site.</p>
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!title.trim() || !code.trim()} onClick={submit}>Add</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
