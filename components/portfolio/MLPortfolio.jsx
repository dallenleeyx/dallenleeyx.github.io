'use client';

import { useEffect, useMemo, useState } from 'react';
import { ML_PROJECTS } from '../../lib/portfolio/content';

const samples = Array.from({ length: 24 }, (_, i) => {
  const x = -1 + i * 2 / 23;
  return { x, y: 1.12 * x + 0.34 + Math.sin(i * 1.69) * 0.13 };
});

const pythonCode = {
  'model.py': `import torch
from torch import nn

class TinyRegressor(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(1, 1)

    def forward(self, x):
        return self.linear(x)

model = TinyRegressor()`,
  'train.py': `import torch
from torch import nn
from model import TinyRegressor

# Prepare X, y from your training dataset
model = TinyRegressor()
optimizer = torch.optim.SGD(model.parameters(), lr=0.08)
loss_fn = nn.MSELoss()

for epoch in range(80):
    prediction = model(X)
    loss = loss_fn(prediction, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    print(f"{epoch=:03d} {loss.item()=:.5f}")`,
};

function computeTrace(rate, epochs) {
  let w = 0;
  let b = 0;
  const trace = [];
  for (let i = 0; i <= epochs; i += 1) {
    const gradients = samples.reduce((s, { x, y }) => {
      const err = w * x + b - y;
      return { dw: s.dw + 2 * err * x / samples.length, db: s.db + 2 * err / samples.length, mse: s.mse + err * err / samples.length };
    }, { dw: 0, db: 0, mse: 0 });
    trace.push({ epoch: i, w, b, loss: gradients.mse });
    w -= rate * gradients.dw;
    b -= rate * gradients.db;
  }
  return trace;
}

function LossChart({ trace, frame }) {
  const history = trace.slice(0, frame + 1);
  const cap = Math.max(0.05, trace[0].loss * 1.04);
  const maxEpoch = Math.max(1, trace.length - 1);
  const points = history.map((p) => (45 + 430 * p.epoch / maxEpoch) + ',' + (189 - 153 * Math.min(1, p.loss / cap))).join(' ');
  const last = history[history.length - 1];
  return (
    <svg viewBox="0 0 520 225" className="ml-chart" role="img" aria-label={'Training loss curve from epoch 0 to epoch ' + frame}>
      <g stroke="currentColor" opacity=".12" strokeWidth="1">{[36, 87, 138, 189].map((y) => <line key={y} x1="45" x2="475" y1={y} y2={y} />)}</g>
      <path d="M45 28 V189 H475" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".55" />
      <g fill="currentColor" fontSize="10" fontFamily="monospace" opacity=".65"><text x="45" y="210">0</text><text x="443" y="210">epoch {maxEpoch}</text><text x="8" y="32">loss</text></g>
      <polyline points={points} fill="none" stroke="#b7ef80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={45 + 430 * last.epoch / maxEpoch} cy={189 - 153 * Math.min(1, last.loss / cap)} r="5" fill="#b7ef80" stroke="#151c18" strokeWidth="2" />
    </svg>
  );
}

function ScatterChart({ w, b }) {
  const project = (x, y) => ({ cx: 32 + (x + 1) * 180, cy: 195 - (y + 1.6) * 65 });
  const a = project(-1, -w + b);
  const c = project(1, w + b);
  return (
    <svg viewBox="0 0 425 248" className="ml-chart" role="img" aria-label="Training data and current linear-regression prediction">
      <g stroke="currentColor" opacity=".1">{[45, 95, 145, 195].map((y) => <line key={y} x1="32" x2="392" y1={y} y2={y} />)}</g>
      <path d="M32 19 V195 H392" fill="none" stroke="currentColor" opacity=".5" />
      {samples.map(({ x, y }, i) => { const p = project(x, y); return <circle key={i} cx={p.cx} cy={p.cy} r="3.3" fill="#a9dfff" opacity=".75" />; })}
      <line x1={a.cx} y1={a.cy} x2={c.cx} y2={c.cy} stroke="#b7ef80" strokeWidth="3.2" strokeLinecap="round" />
      <g fill="currentColor" fontSize="10" fontFamily="monospace" opacity=".6"><text x="36" y="224">● training samples</text><text x="240" y="224" fill="#b7ef80">— prediction</text></g>
    </svg>
  );
}

function CommandLine() {
  const [command, setCommand] = useState('');
  const [log, setLog] = useState([{ id: 0, value: 'Welcome to the lab. Type help to explore.', input: false }]);
  const run = (event) => {
    event.preventDefault();
    const query = command.trim().toLowerCase();
    if (!query) return;
    const answers = {
      help: 'Commands: help · whoami · stack · projects · clear',
      whoami: 'Dallen Lee — mathematics, machine learning, control theory, and experiments.',
      stack: 'Python · PyTorch · NumPy · optimization · mathematical modelling · JavaScript',
      projects: 'Explore: gradient descent demo, deep hedging, random matrix theory for portfolios.',
    };
    if (query === 'clear') setLog([]);
    else setLog((current) => [...current, { id: Date.now(), value: '$ ' + command, input: true }, { id: Date.now() + 1, value: answers[query] || 'command not found — type help', input: false }].slice(-12));
    setCommand('');
  };
  return (
    <div className="ml-terminal">
      <div className="ml-terminal-head"><span className="ml-window-dots"><i /><i /><i /></span><span>guest@dallen: ~/portfolio</span><span>● ONLINE</span></div>
      <div className="ml-terminal-log" aria-live="polite">{log.map((line) => <p className={line.input ? 'command' : ''} key={line.id}>{line.value}</p>)}</div>
      <form onSubmit={run} className="ml-terminal-command"><label htmlFor="ml-command">~ $</label><input id="ml-command" autoComplete="off" spellCheck="false" value={command} onChange={(e) => setCommand(e.target.value)} placeholder="type help" /><button type="submit" aria-label="Run terminal command">↵</button></form>
    </div>
  );
}

export function MLPortfolio() {
  const [rate, setRate] = useState(0.08);
  const [epochs, setEpochs] = useState(80);
  const [trace, setTrace] = useState(() => computeTrace(0.08, 80));
  const [frame, setFrame] = useState(0);
  const [running, setRunning] = useState(false);
  const [file, setFile] = useState('train.py');
  const [copied, setCopied] = useState(false);
  const observation = trace[Math.min(frame, trace.length - 1)] || trace[0];
  const progress = Math.round(frame * 100 / (trace.length - 1));

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setFrame((prev) => {
        if (prev >= trace.length - 1) { setRunning(false); return prev; }
        return prev + 1;
      });
    }, 42);
    return () => window.clearInterval(timer);
  }, [running, trace]);

  const runTraining = () => { setRunning(false); setTrace(computeTrace(rate, epochs)); setFrame(0); setRunning(true); };
  const reset = () => { setRunning(false); setTrace(computeTrace(rate, epochs)); setFrame(0); };
  const currentCode = pythonCode[file];
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="pf-container ml-page">
      <section className="ml-hero">
        <div><span className="pf-overline ml-kicker"><span className="ml-blink">▌</span> SYSTEM / THE LEARNING LAB</span><h1>Build the model.<br /><em>Question the output.</em></h1><p>I like the point where mathematics becomes an algorithm. This is a living notebook of machine-learning experiments, quantitative ideas and things worth understanding from first principles.</p><a className="pf-button ml-primary" href="#ml-training">▶ Run an experiment <span>↘</span></a></div>
        <div className="ml-hero-screen" aria-hidden="true"><div className="ml-window-top"><span>● ● ●</span><span>hello_world.py</span></div><pre><span>import</span> torch{'
'}<span>import</span> curiosity{'

'}<b>class</b> Researcher:{'
'}  question = <em>&quot;what if?&quot;</em>{'
'}  persistence = <em>float('inf')</em>{'

'}<span># keep experimenting</span>{'
'}train(model, imagination)</pre><div className="ml-screen-pulse" /></div>
      </section>

      <section id="ml-training" className="pf-section ml-train-section">
        <div className="pf-section-head"><div><span className="pf-overline">EXPERIMENT 001 / GRADIENT DESCENT</span><h2>Train a model. Watch it learn.</h2></div><p>A real, tiny linear-regression optimizer running in JavaScript — with the equivalent PyTorch code to inspect.</p></div>
        <div className="ml-dashboard">
          <div className="ml-workbench">
            <div className="ml-panel-head"><span>LIVE TRAINING / LOSS GRAPH</span><span className={'ml-run-label ' + (running ? 'working' : '')}>{running ? '● TRAINING' : '● READY'}</span></div>
            <LossChart trace={trace} frame={frame} />
            <div className="ml-metrics"><div><span>EPOCH</span><strong>{String(frame).padStart(3, '0')}<small> / {epochs}</small></strong></div><div><span>MSE LOSS</span><strong>{observation.loss.toFixed(5)}</strong></div><div><span>WEIGHT</span><strong>{observation.w.toFixed(3)}</strong></div><div><span>BIAS</span><strong>{observation.b.toFixed(3)}</strong></div></div>
            <div className="ml-progress-bar" role="progressbar" aria-label="Training progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: progress + '%' }} /></div>
            <div className="ml-tune-controls">
              <label>LEARNING RATE <strong>{rate.toFixed(2)}</strong><input type="range" value={rate} min={0.01} max={0.3} step={0.01} onChange={(e) => setRate(Number(e.target.value))} disabled={running} /></label>
              <label>EPOCHS <strong>{epochs}</strong><input type="range" value={epochs} min={10} max={140} step={10} onChange={(e) => setEpochs(Number(e.target.value))} disabled={running} /></label>
            </div>
            <div className="ml-run-actions"><button type="button" className="ml-run-button" onClick={runTraining} disabled={running}>{running ? 'TRAINING…' : '▶ RUN TRAINING'}</button><button type="button" className="ml-reset-button" onClick={reset}>↺ RESET</button></div>
          </div>
          <div className="ml-right-panels">
            <div className="ml-dataset"><div className="ml-panel-head"><span>DATASET / LINEAR FIT</span><span>24 SAMPLES</span></div><ScatterChart w={observation.w} b={observation.b} /><p>Adjust the optimizer, hit run, and watch the fitted line move. This illustrates a toy least-squares problem, not a benchmark model.</p></div>
            <div className="ml-code-editor"><div className="ml-code-top"><div className="ml-code-tabs">{Object.keys(pythonCode).map((k) => <button type="button" key={k} className={k === file ? 'active' : ''} onClick={() => { setFile(k); setCopied(false); }}>{k}</button>)}</div><button type="button" className="ml-copy" onClick={copyCode}>{copied ? '✓ COPIED' : '⎘ COPY'}</button></div><pre><code>{currentCode}</code></pre><div className="ml-code-foot">PYTORCH EXAMPLE · Requires a prepared X and y dataset · The live chart above runs in the browser</div></div>
          </div>
        </div>
      </section>

      <section className="pf-section ml-research"><div className="pf-section-head"><div><span className="pf-overline">NOTEBOOK / WHAT I AM EXPLORING</span><h2>Ideas behind the code.</h2></div><p>Research interests and a working demonstration — no inflated project claims.</p></div><div className="ml-project-grid">{ML_PROJECTS.map((project, i) => <article className="ml-project" key={project.title}><div className="ml-project-top"><span>PROJECT_{String(i + 1).padStart(2, '0')}</span><span>{project.state}</span></div><span className="pf-overline">{project.type}</span><h3>{project.title}</h3><p>{project.summary}</p><div className="pf-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div></section>
      <section className="pf-section ml-command-section"><div className="pf-section-head"><div><span className="pf-overline">A LITTLE EASTER EGG</span><h2>The lab has a terminal.</h2></div><p>Go ahead, type <code>help</code>. The commands actually work.</p></div><CommandLine /></section>
      <section className="ml-outro"><span className="pf-overline">SEE THE SOURCE / FOLLOW THE EXPERIMENTS</span><a href="https://github.com/dallenleeyx" target="_blank" rel="noopener noreferrer">git clone curiosity.git <span>↗</span></a></section>
    </main>
  );
}
