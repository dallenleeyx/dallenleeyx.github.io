'use client';
// components/tracker/visualizers/CodeVisualizer.jsx — runs a post's pasted
// HTML/CSS/JS in a sandboxed iframe. `sandbox="allow-scripts"` (no
// `allow-same-origin`) means the iframe gets its own opaque origin: its
// script can't read this app's cookies/localStorage/session or call back
// into the parent page, so pasted code -- however careless or copied from
// wherever -- can't touch this site's actual data. It can still run
// <script>, draw on a <canvas>, fetch a CDN library, etc., which is all
// a visualizer actually needs.
export function CodeVisualizer({ code }) {
  return (
    <iframe
      className="tk-viz-iframe"
      sandbox="allow-scripts"
      srcDoc={code}
      title="Visualizer"
    />
  );
}
