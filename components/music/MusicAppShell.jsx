'use client';
// components/music/MusicAppShell.jsx — top-level client wrapper for the
// Music section: sets up the namespaced .music-shell wrapper div the CSS
// targets (see app/music/music.css) and renders the tab bar.
import { MusicTabs } from './MusicTabs';

export function MusicAppShell() {
  return (
    <div className="music-shell">
      <header className="music-header">
        <span className="music-brand">Music</span>
        <p className="music-subtitle">intervals, chords &amp; staff reading</p>
      </header>
      <main className="music-main">
        <MusicTabs />
      </main>
    </div>
  );
}
