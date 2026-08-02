'use client';
// components/tracker/visualizers/VisualizerPost.jsx — one "post" card in a
// course's Visualizers feed: title, optional caption, then the rendered
// widget (post.code -- GeoGebra commands -- run via GeoGebraVisualizer).
// An "Edit" button swaps the rendered applet for a textarea of the same
// commands so they can be tweaked and re-run, without a separate modal.
import { useState } from 'react';
import { GeoGebraVisualizer } from './GeoGebraVisualizer';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function VisualizerPost({ post, onSaveCode, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.code);

  const startEdit = () => {
    setDraft(post.code);
    setEditing(true);
  };
  const save = () => {
    onSaveCode(draft);
    setEditing(false);
  };

  return (
    <div className="tk-viz-post">
      <div className="tk-viz-post-head">
        <div style={{ minWidth: 0 }}>
          <div className="tk-viz-post-title">{post.title}</div>
          <div className="tk-viz-post-meta">{formatDate(post.createdAt)}</div>
        </div>
        <div className="tk-viz-post-actions no-print">
          {!editing && <button className="tk-mono-btn" onClick={startEdit}>Edit</button>}
          <button className="tk-x-btn" onClick={onRemove}>×</button>
        </div>
      </div>
      {post.caption && <p className="tk-viz-post-caption">{post.caption}</p>}
      {editing ? (
        <div className="tk-viz-code-edit">
          <textarea
            className="tk-textarea tk-viz-code-textarea"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            spellCheck={false}
          />
          <div className="tk-viz-code-edit-foot">
            <button className="tk-mono-btn" onClick={() => setEditing(false)}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={save}>Save & run</button>
          </div>
        </div>
      ) : (
        <GeoGebraVisualizer code={post.code} />
      )}
    </div>
  );
}
