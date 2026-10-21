'use client';

import { useMemo, useState } from 'react';
import { ENGINEERING_PROJECTS } from '../../lib/portfolio/content';

const RHO = 1.225;
const GRAVITY = 9.81;
const defaultSettings = { airspeed: 9, wingArea: 0.38, mass: 480, angle: 10 };

function rounded(value, decimals = 1) {
  return Number(value).toFixed(decimals);
}

function WorkshopSlider({ id, label, value, unit, min, max, step, onChange }) {
  return (
    <label className="eng-control" htmlFor={id}>
      <span className="eng-control-top"><span>{label}</span><strong>{value} <small>{unit}</small></strong></span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function PaperGlider({ settings, margin }) {
  const tilt = Math.max(-16, Math.min(12, margin * 3));
  return (
    <svg className="eng-glider-svg" viewBox="0 0 600 320" role="img" aria-label="Animated conceptual paper-plane robotic bird with airflow streamlines">
      <defs>
        <linearGradient id="engWing" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fafffc" /><stop offset="1" stopColor="#96e9cc" />
        </linearGradient>
        <filter id="engGlow"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <g className="eng-air-lines" stroke="#9af3da" fill="none" strokeWidth="1.5" strokeDasharray="10 14" opacity=".45">
        <path d="M-10 76 C130 40 210 46 610 78" />
        <path d="M-10 139 C140 116 280 117 610 147" />
        <path d="M-10 207 C130 190 255 191 610 204" />
        <path d="M-10 270 C140 240 275 251 610 267" />
      </g>
      <circle cx="305" cy="161" r="92" fill="#80dfc0" opacity=".06" filter="url(#engGlow)" />
      <g className="eng-paper-flight" style={{ transform: 'translateY(' + (-tilt) + 'px) rotate(' + (-tilt / 4) + 'deg)' }}>
        <path d="M104 168 L486 146 L299 185 Z" fill="#6cbeaa" opacity=".32" />
        <path d="M104 168 L491 145 L317 185 L235 229 Z" fill="url(#engWing)" stroke="#eafff6" strokeWidth="2" strokeLinejoin="round" />
        <path d="M491 145 L305 185 L368 212 Z" fill="#59c9a4" />
        <path d="M235 229 L305 185 L265 201 Z" fill="#368f86" />
        <path d="M104 168 L305 185 L491 145" fill="none" stroke="#376b70" strokeWidth="2" />
        <circle cx="279" cy="185" r="6" fill="#182c2f" stroke="#e2ffe9" strokeWidth="2" />
        <path d="M279 173 L279 162 M272 168 L286 168" stroke="#baffdb" strokeWidth="2" />
        <rect x="279" y="188" width="25" height="10" rx="3" fill="#17343b" transform="rotate(5 279 188)" />
        <circle cx="294" cy="192" r="3" fill="#7af0cf" />
      </g>
      <g fontFamily="monospace" fontSize="10" letterSpacing="1" fill="#9cc9c4">
        <text x="20" y="24">CAM 01  ●  ONBOARD</text>
        <text x="430" y="298">AIRFLOW {settings.airspeed} m/s →</text>
        <text x="21" y="299">CONCEPT VISUAL / NOT A FLIGHT SIMULATOR</text>
      </g>
    </svg>
  );
}

export function EngineeringPortfolio() {
  const [settings, setSettings] = useState(defaultSettings);
  const [openProject, setOpenProject] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const update = (key) => (value) => setSettings((old) => ({ ...old, [key]: value }));
  const flight = useMemo(() => {
    const alpha = settings.angle * Math.PI / 180;
    const cl = Math.min(1.1, 2 * Math.PI * alpha);
    const lift = 0.5 * RHO * settings.airspeed ** 2 * settings.wingArea * cl;
    const weight = settings.mass / 1000 * GRAVITY;
    return { lift, weight, margin: lift / weight - 1 };
  }, [settings]);
  const inAir = flight.lift >= flight.weight;

  return (
    <main className="pf-container eng-page">
      <section className="eng-hero">
        <div>
          <span className="pf-overline eng-kicker"><span className="eng-led" /> THE WORKSHOP · LAB 002</span>
          <h1>Curiosity, <em>with moving parts.</em></h1>
          <p>Things that fly, sense, move, and occasionally refuse to cooperate. This is where my robotics concepts and engineering experiments take shape — not just polished outcomes.</p>
          <a href="#flight-lab" className="pf-button eng-cta">Try the flight lab <span>↘</span></a>
        </div>
        <div className="eng-hero-graphic" aria-hidden="true"><div className="eng-gear eng-gear-big">⚙</div><div className="eng-gear eng-gear-small">⚙</div><span className="eng-sticker">BUILT<br />TO TINKER ✳</span></div>
      </section>

      <section id="flight-lab" className="pf-section">
        <div className="pf-section-head">
          <div><span className="pf-overline">INTERACTIVE BENCH / AERODYNAMICS</span><h2>Can this paper bird fly?</h2></div>
          <p>Change the numbers. Watch the forces. This simplified lift model is for intuition, not flight approval.</p>
        </div>
        <div className="eng-simulator">
          <div className="eng-display">
            <div className="eng-display-top"><span><i /> CAM / BIRD-001</span><button type="button" aria-pressed={showGrid} onClick={() => setShowGrid((x) => !x)}>{showGrid ? '▦ Hide grid' : '▦ Show grid'}</button></div>
            <div className={'eng-viewport' + (showGrid ? ' with-grid' : '')}><PaperGlider settings={settings} margin={flight.margin} /></div>
            <div className="eng-telemetry">
              <div><span>LIFT</span><strong>{rounded(flight.lift)} <small>N</small></strong></div>
              <div><span>WEIGHT</span><strong>{rounded(flight.weight)} <small>N</small></strong></div>
              <div><span>EST. BALANCE</span><strong className={inAir ? 'eng-positive' : 'eng-negative'}>{inAir ? '↑ LIFT ≥ WEIGHT' : '↓ NEEDS MORE LIFT'}</strong></div>
            </div>
          </div>
          <div className="eng-controls-panel">
            <div className="eng-controls-heading"><span>FLIGHT CONTROL PANEL</span><span>● SIM LIVE</span></div>
            <WorkshopSlider id="eng-speed" label="Airspeed" value={settings.airspeed} unit="m/s" min={3} max={16} step={1} onChange={update('airspeed')} />
            <WorkshopSlider id="eng-wing" label="Wing area" value={settings.wingArea} unit="m²" min={0.08} max={0.9} step={0.02} onChange={update('wingArea')} />
            <WorkshopSlider id="eng-mass" label="Craft mass" value={settings.mass} unit="g" min={150} max={1200} step={10} onChange={update('mass')} />
            <WorkshopSlider id="eng-angle" label="Angle of attack" value={settings.angle} unit="°" min={2} max={16} step={1} onChange={update('angle')} />
            <div className="eng-equation"><span>OUR LITTLE MODEL</span><code>L = ½ρv²S Cₗ</code><small>Steady-air approximation; stall, drag, stability and real wing effects are not modelled.</small></div>
            <button className="eng-reset" type="button" onClick={() => setSettings(defaultSettings)}>↺ Reset flight experiment</button>
          </div>
        </div>
      </section>

      <section className="pf-section eng-project-section">
        <div className="pf-section-head"><div><span className="pf-overline">FROM THE WORKBENCH</span><h2>Projects, sketches &amp; rabbit holes.</h2></div><p>Live notes from ideas at different stages. Click a project to inspect the build sheet.</p></div>
        <div className="eng-project-list">
          {ENGINEERING_PROJECTS.map((project, i) => (
            <article key={project.number} className={'eng-project ' + (openProject === i ? 'expanded' : '')}>
              <button type="button" className="eng-project-trigger" aria-expanded={openProject === i} onClick={() => setOpenProject(openProject === i ? -1 : i)}>
                <span className="eng-project-num">{project.number}</span><span className="eng-project-main"><span className="pf-overline">{project.category}</span><strong>{project.title}</strong><small>{project.summary}</small></span><span className="eng-project-status">{project.status}</span><span className="eng-project-arrow">{openProject === i ? '−' : '+'}</span>
              </button>
              {openProject === i && <div className="eng-project-body"><p>{project.detail}</p><div className="pf-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p className="eng-project-disclaimer">BUILD LOG / Work in progress — demonstrations and links will appear here as projects mature.</p></div>}
            </article>
          ))}
        </div>
      </section>
      <section className="eng-bottom-banner"><span aria-hidden="true">✳</span><div><span className="pf-overline">FIELD NOTES</span><strong>Build. Test. Crash (gently). Learn. Repeat.</strong><p>Interested in robotics, motion, and mathematical control? Say hello through GitHub.</p></div><a href="https://github.com/dallenleeyx" target="_blank" rel="noopener noreferrer">VISIT GITHUB ↗</a></section>
    </main>
  );
}
