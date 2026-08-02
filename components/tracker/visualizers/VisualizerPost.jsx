'use client';
// components/tracker/visualizers/VisualizerPost.jsx — one "post" card in a
// course's Visualizers feed: title, optional caption, then the actual
// interactive widget for whatever `post.type` is (looked up in registry.js
// so this file never needs to change when a new visualizer type is added).
import { VISUALIZER_TYPES } from './registry';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function VisualizerPost({ post, onChangeParams, onRemove }) {
  const entry = VISUALIZER_TYPES[post.type];
  if (!entry) return null;
  const { Component, label } = entry;
  return (
    <div className="tk-viz-post">
      <div className="tk-viz-post-head">
        <div style={{ minWidth: 0 }}>
          <div className="tk-viz-post-title">{post.title}</div>
          <div className="tk-viz-post-meta">{label} · {formatDate(post.createdAt)}</div>
        </div>
        <button className="tk-x-btn no-print" onClick={onRemove}>×</button>
      </div>
      {post.caption && <p className="tk-viz-post-caption">{post.caption}</p>}
      <Component params={post.params} onChange={onChangeParams} />
    </div>
  );
}
