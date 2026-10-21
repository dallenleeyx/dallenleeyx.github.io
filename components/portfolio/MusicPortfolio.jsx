'use client';

import { useEffect, useMemo, useState } from 'react';
import { MUSIC_CONFIG } from '../../lib/portfolio/content';

const PREVIEW_STORAGE_KEY = 'dallen_portfolio_soundcloud_preview';
const SCENES = [
  { name: 'After the rain', genre: '01 / REFLECTION', mood: 'Soft strings, empty streets, a scene that holds its breath.', energy: 0.36, shape: 1, color: '#ff907b' },
  { name: 'A little hope', genre: '02 / WARMTH', mood: 'Small melodies for people finding their way back.', energy: 0.56, shape: 2, color: '#ffd18d' },
  { name: 'The turning point', genre: '03 / TENSION', mood: 'Rhythm, pulse, movement. Something is about to change.', energy: 0.92, shape: 3, color: '#e2b4ff' },
];

function validSoundCloudUrl(value) {
  try {
    const u = new URL(value.trim());
    if (u.protocol !== 'https:') return null;
    if (!['soundcloud.com', 'www.soundcloud.com', 'm.soundcloud.com'].includes(u.hostname)) return null;
    if (u.pathname === '/' || !u.pathname) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function SoundWaves({ scene }) {
  const bars = useMemo(() => Array.from({ length: 55 }, (_, i) => {
    const distance = Math.abs(i - 27) / 27;
    const a = Math.abs(Math.sin((i + 2) * (0.5 + scene.shape * 0.16)));
    const b = Math.abs(Math.sin((i + 7) * (0.13 + scene.shape * 0.035)));
    return Math.max(6, (16 + 96 * a * b) * (1 - distance * 0.55) * scene.energy);
  }), [scene]);
  return (
    <div className="mus-wave" role="img" aria-label={'Decorative sound wave for ' + scene.name}>
      {bars.map((height, index) => (
        <span key={index} className="mus-wave-bar" style={{ height: height + '%', animationDelay: (index % 11) * -0.18 + 's', backgroundColor: scene.color }} />
      ))}
    </div>
  );
}

export function MusicPortfolio() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [previewInput, setPreviewInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [badUrl, setBadUrl] = useState(false);
  const [selected, setSelected] = useState(MUSIC_CONFIG.tracks[0]?.url || '');
  const [isPlayingVisual, setIsPlayingVisual] = useState(true);
  const scene = SCENES[sceneIndex];
  const featured = validSoundCloudUrl(selected);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREVIEW_STORAGE_KEY) || '';
      if (validSoundCloudUrl(saved)) { setPreviewUrl(saved); setPreviewInput(saved); }
    } catch {}
  }, []);

  const showPlayer = (url) => { setSelected(url); setBadUrl(false); };

  const savePreview = (event) => {
    event.preventDefault();
    const url = validSoundCloudUrl(previewInput);
    if (!url) { setBadUrl(true); return; }
    setPreviewUrl(url);
    showPlayer(url);
    try { localStorage.setItem(PREVIEW_STORAGE_KEY, url); } catch {}
  };

  const clearPreview = () => {
    setPreviewInput('');
    setPreviewUrl('');
    setSelected(MUSIC_CONFIG.tracks[0]?.url || '');
    setBadUrl(false);
    try { localStorage.removeItem(PREVIEW_STORAGE_KEY); } catch {}
  };

  return (
    <main className="pf-container mus-page">
      <div className="mus-hero">
        <div className="mus-hero-copy">
          <span className="pf-overline mus-kicker"><span className="mus-led" /> THE LISTENING ROOM / 001</span>
          <h1>Every story<br />has a <em>sound.</em></h1>
          <p>My corner of the world for original scores, cinematic textures, and sound design. Pull up a chair. Press play when the music arrives.</p>
          <div className="mus-hero-links">
            <a className="pf-button mus-primary-link" href="#listening-desk">Open the player <span>↘</span></a>
            {MUSIC_CONFIG.profileUrl ? (
              <a className="pf-button-outline" href={MUSIC_CONFIG.profileUrl} target="_blank" rel="noopener noreferrer">SoundCloud ↗</a>
            ) : (
              <a className="pf-button-outline" href="https://soundcloud.com/" target="_blank" rel="noopener noreferrer">Explore SoundCloud ↗</a>
            )}
          </div>
        </div>
        <div className="mus-record-scene" aria-hidden="true">
          <div className="mus-record-sleeve"><div className="mus-record-art"><span>NO. 01</span><strong>FEEL<br />SOMETHING.</strong><small>DALLEN LEE — SOUND DIARY</small></div></div>
          <div className="mus-vinyl"><div className="mus-vinyl-label"><span>D.</span></div></div>
          <span className="mus-deco-cross">✳</span>
        </div>
      </div>

      <section className="mus-scenes pf-section" aria-labelledby="mus-scenes-title">
        <div className="pf-section-head">
          <div><span className="pf-overline">THE MOODBOARD</span><h2 id="mus-scenes-title">Turn the feeling up.</h2></div>
          <p>Interactive sound-design moods — concepts, not published tracks.</p>
        </div>
        <div className="mus-console">
          <div className="mus-console-head"><span>SCENE SELECTOR <span className="mus-live-dot" /> LIVE VISUAL</span><span>VOL. / IMAGINATION</span></div>
          <div className="mus-wave-wrap" style={{ '--mus-scene-color': scene.color }}>
            <SoundWaves scene={scene} />
            <div className="mus-wave-label"><span>{scene.genre}</span><strong>{scene.name}</strong><p>{scene.mood}</p></div>
          </div>
          <div className="mus-scene-picks">
            {SCENES.map((s, i) => (
              <button key={s.name} type="button" className={'mus-scene-btn ' + (sceneIndex === i ? 'selected' : '')} onClick={() => setSceneIndex(i)} aria-pressed={sceneIndex === i}>
                <span>0{i + 1}</span>{s.name}<span aria-hidden="true">↗</span>
              </button>
            ))}
            <button type="button" className={'mus-visual-toggle ' + (!isPlayingVisual ? 'paused' : '')} onClick={() => setIsPlayingVisual(!isPlayingVisual)}>
              {isPlayingVisual ? '⏸ Pause motion' : '▶ Animate'}
            </button>
          </div>
        </div>
        <style>{'.mus-page .mus-wave-bar { animation-play-state: ' + (isPlayingVisual ? 'running' : 'paused') + '; }'}</style>
      </section>

      <section id="listening-desk" className="pf-section mus-player-section" aria-labelledby="mus-listen-title">
        <div className="pf-section-head"><div><span className="pf-overline">THE LISTENING DESK</span><h2 id="mus-listen-title">SoundCloud, in the room.</h2></div><p>Full inline playback using SoundCloud’s official player.</p></div>
        <div className="mus-listening-grid">
          <div className="mus-player-card">
            <div className="mus-player-head"><span>● NOW PLAYING</span><span>SOUNDCLOUD EMBED</span></div>
            {featured ? (
              <iframe key={featured} title="SoundCloud audio player" loading="lazy" width="100%" height="270" scrolling="no" allow="autoplay" src={'https://w.soundcloud.com/player/?url=' + encodeURIComponent(featured) + '&color=%23f36d54&auto_play=false&show_artwork=true&show_user=true&sharing=true'} />
            ) : (
              <div className="mus-empty-player"><span aria-hidden="true">♫</span><h3>Your music belongs here.</h3><p>Paste a SoundCloud track or playlist URL to hear it directly on this page. To publish it for all visitors, add the URL to <code>lib/portfolio/content.js</code>.</p></div>
            )}
            {featured && <a className="mus-track-link" href={featured} target="_blank" rel="noopener noreferrer">Open this track on SoundCloud ↗</a>}
            <form className="mus-url-form" onSubmit={savePreview}>
              <label htmlFor="mus-track-url">PREVIEW YOUR OWN SOUNDCLOUD TRACK OR PLAYLIST</label>
              <div><input id="mus-track-url" type="url" placeholder="https://soundcloud.com/your-name/your-track" value={previewInput} onChange={(e) => { setPreviewInput(e.target.value); setBadUrl(false); }} /><button type="submit">Load track ↗</button></div>
              {badUrl && <span role="alert" className="mus-form-error">Enter a valid public soundcloud.com URL.</span>}
              {previewUrl && <button className="mus-reset" type="button" onClick={clearPreview}>Clear my local preview</button>}
              <small>Your preview is saved in this browser, not published for visitors.</small>
            </form>
          </div>
          <aside className="mus-queue">
            <div className="mus-queue-heading"><span className="pf-overline">THE CATALOGUE</span><strong>Releases & sketches</strong></div>
            {MUSIC_CONFIG.tracks.length ? MUSIC_CONFIG.tracks.map((track, i) => (
              <button className={'mus-queue-track ' + (track.url === featured ? 'now' : '')} type="button" key={track.url} onClick={() => showPlayer(track.url)}>
                <span>0{i + 1}</span><span><strong>{track.title}</strong><small>{track.category}</small></span><span>▶</span>
              </button>
            )) : (
              <div className="mus-queue-note"><span>✳</span><strong>WIP — SESSION OPEN</strong><p>Released tracks will appear here when published. The listening desk is ready for your SoundCloud links.</p></div>
            )}
            <div className="mus-queue-signature">made with patience & headphones<br /><span>— dallen.</span></div>
          </aside>
        </div>
      </section>
      <section className="mus-outro"><span className="pf-overline">CURRENTLY INTERESTED IN</span><div><span>Original scores</span><span>Drama sound design</span><span>Chamber strings</span><span>Little sonic worlds</span></div></section>
    </main>
  );
}
