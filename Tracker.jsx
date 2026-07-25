// Tracker.jsx — The Proof Lab: assignments, revision canon, problem arena,
// margin notes, calendar, quiz mode. State persists to localStorage.
const { useState, useEffect, useMemo, useCallback } = React;

const STORE_KEY = 'proofLabData';
const STATUS_ORDER = ['todo', 'doing', 'done'];
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

// ── KaTeX inline: render $…$ spans without touching the surrounding DOM ──
function MathTex({ children }) {
  const str = String(children == null ? '' : children);
  if (!window.katex || str.indexOf('$') === -1) return str;
  const parts = str.split(/\$([^$]+)\$/g);
  return parts.map((p, i) => {
    if (i % 2 === 0) return p;
    let html;
    try { html = katex.renderToString(p, { throwOnError: false }); } catch (e) { return '$' + p + '$'; }
    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

function daysInfo(due, status) {
  if (!due || status === 'done') return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((new Date(due + 'T00:00:00') - today) / 86400000);
  if (diff < 0) return { label: `overdue ${-diff}d`, cls: 'overdue' };
  if (diff === 0) return { label: 'due today', cls: 'today' };
  return { label: `${diff}d left`, cls: diff <= 3 ? 'soon' : '' };
}

function SectionLabel({ children, sub }) {
  return <div className="tk-section-label">{children}{sub && <span className="sub">— {sub}</span>}</div>;
}

function Empty({ icon, children }) {
  return <div className="tk-empty"><div className="icon">{icon}</div><div className="title">{children}</div></div>;
}

function StatusPill({ status, onCycle }) {
  const label = { todo: 'TODO', doing: 'WIP', done: 'DONE' }[status];
  return <button className={`tk-pill ${status}`} onClick={onCycle} title="click to cycle status">{label}</button>;
}

function AssignmentRow({ a, showCourse, onCycle, onRemove }) {
  const di = daysInfo(a.due, a.status);
  return (
    <div className="tk-tl-item">
      <div className="tk-row-card">
        <div style={{ minWidth: 0 }}>
          <div className={`tk-row-title${a.status === 'done' ? ' done' : ''}`}>{a.title}</div>
          <div className="tk-row-meta">{showCourse ? `${showCourse} · ` : ''}{a.due || 'no due date'}</div>
        </div>
        <div className="tk-row-actions">
          {di && <span className={`tk-days ${di.cls}`}>{di.label}</span>}
          <StatusPill status={a.status} onCycle={onCycle} />
          {onRemove && <button className="tk-x-btn" onClick={onRemove}>×</button>}
        </div>
      </div>
    </div>
  );
}

function RevealCard({ badge, name, body, hidden, hiddenLabels, revealed, onToggle }) {
  return (
    <div className="tk-card">
      <div className="tk-card-head">
        {badge && <span className="tk-type">{badge}</span>}
        <span className="tk-card-name"><MathTex>{name}</MathTex></span>
      </div>
      <div className="tk-card-body"><MathTex>{body}</MathTex></div>
      <button className="tk-mono-btn" style={{ marginTop: '.85rem' }} onClick={onToggle}>
        {revealed ? hiddenLabels[1] : hiddenLabels[0]}
      </button>
      {revealed && <div className="tk-reveal"><MathTex>{hidden}</MathTex></div>}
    </div>
  );
}

function Calendar({ courses, cursor, onShift, selected, onSelect }) {
  const { y, m } = cursor;
  const todayIso = isoOf(new Date());
  const dueMap = useMemo(() => {
    const map = {};
    courses.forEach(c => c.assignments.forEach(a => {
      if (a.due && a.status !== 'done') (map[a.due] = map[a.due] || []).push({ title: a.title, glyph: c.glyph });
    }));
    return map;
  }, [courses]);
  const first = new Date(y, m, 1);
  const startIdx = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m, i - startIdx + 1);
    cells.push({ d, iso: isoOf(d), inMonth: d.getMonth() === m });
  }
  const selItems = selected ? (dueMap[selected] || []) : [];
  const selD = selected ? new Date(selected + 'T00:00:00') : null;
  return (
    <div className="tk-cal">
      <div className="tk-cal-head">
        <span className="tk-cal-label">{MONTHS[m]} {y}</span>
        <div style={{ display: 'flex', gap: '.25rem' }}>
          <button className="tk-cal-btn" onClick={() => onShift(-1)}>‹</button>
          <button className="tk-cal-btn" onClick={() => onShift(1)}>›</button>
        </div>
      </div>
      <div className="tk-cal-grid" style={{ marginBottom: 2 }}>
        {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="tk-cal-dow">{d}</span>)}
      </div>
      <div className="tk-cal-grid">
        {cells.map(({ d, iso, inMonth }) => {
          const cls = ['tk-cal-cell', !inMonth && 'out', iso === todayIso && 'today', iso === selected && 'selected'].filter(Boolean).join(' ');
          return (
            <div key={iso} className={cls} onClick={() => inMonth && onSelect(selected === iso ? null : iso)}>
              {d.getDate()}
              {inMonth && dueMap[iso] && <span className="due-dot" />}
            </div>
          );
        })}
      </div>
      {selected && (
        <div className="tk-cal-detail">
          <div className="tk-cal-detail-date">due {String(selD.getDate()).padStart(2,'0')} {MONTHS[selD.getMonth()]}</div>
          {selItems.map((it, i) => (
            <div key={i} className="tk-cal-detail-row"><span className="glyph">{it.glyph}</span><span className="title">{it.title}</span></div>
          ))}
          {!selItems.length && <div className="tk-cal-detail-empty">Nothing due. A gift.</div>}
        </div>
      )}
    </div>
  );
}

function Quiz({ courses, scope, onClose }) {
  const pool = useMemo(() => {
    const p = [];
    courses.forEach(c => { if (!scope || c.id === scope) c.theorems.forEach(t => p.push({ course: c, t })); });
    return p;
  }, [courses, scope]);
  const [idx, setIdx] = useState(() => (Math.random() * pool.length) | 0);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (!pool.length) return null;
  const { course, t } = pool[idx % pool.length];
  const next = () => {
    if (pool.length > 1) { let n; do { n = (Math.random() * pool.length) | 0; } while (n === idx); setIdx(n); }
    setRevealed(false);
  };
  return (
    <React.Fragment>
      <div className="tk-quiz-backdrop" onClick={onClose} />
      <div className="tk-quiz-wrap">
        <div className="tk-quiz">
          <div className="tk-quiz-top">
            <span className="tk-quiz-eyebrow">Prove it.</span>
            <span className="tk-quiz-course">{course.name}</span>
          </div>
          <div className="tk-card-head">
            <span className="tk-type">{t.type}</span>
            <span className="tk-quiz-name">{t.name}</span>
          </div>
          <div className="tk-quiz-body"><MathTex>{t.statement}</MathTex></div>
          {revealed && <div className="tk-reveal"><MathTex>{t.proof}</MathTex></div>}
          <div className="tk-quiz-foot">
            <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => setRevealed(r => !r)}>
              {revealed ? 'hide it again' : 'reveal the idea'}
            </button>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button className="tk-mono-btn" onClick={next}>next draw ▸</button>
              <button className="tk-mono-btn" onClick={onClose}>esc</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function App() {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved) return saved;
    } catch (e) {}
    return window.TRACKER_SEED;
  });
  const [view, setView] = useState('dashboard');
  const [calCursor, setCalCursor] = useState({ y: new Date().getFullYear(), m: new Date().getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [quizScope, setQuizScope] = useState(undefined); // undefined = closed, null = all courses
  const [drafts, setDrafts] = useState({});

  useEffect(() => { try { localStorage.setItem(STORE_KEY, JSON.stringify(courses)); } catch (e) {} }, [courses]);

  const mutate = useCallback((courseId, fn) => {
    setCourses(cs => cs.map(c => c.id === courseId ? fn(c) : c));
  }, []);
  const cycle = (cid, id) => mutate(cid, c => ({ ...c, assignments: c.assignments.map(a => a.id !== id ? a : { ...a, status: STATUS_ORDER[(STATUS_ORDER.indexOf(a.status) + 1) % 3] }) }));
  const removeA = (cid, id) => mutate(cid, c => ({ ...c, assignments: c.assignments.filter(a => a.id !== id) }));
  const toggle = (cid, kind, id) => mutate(cid, c => ({ ...c, [kind]: c[kind].map(x => x.id !== id ? x : { ...x, revealed: !x.revealed }) }));
  const addNote = (cid, text) => {
    const t = (text || '').trim();
    if (!t) return;
    mutate(cid, c => ({ ...c, notes: [{ id: 'n' + Date.now(), text: t, date: isoOf(new Date()) }, ...c.notes] }));
  };
  const removeNote = (cid, id) => mutate(cid, c => ({ ...c, notes: c.notes.filter(n => n.id !== id) }));
  const draft = (k) => drafts[k] || '';
  const setDraft = (k, v) => setDrafts(d => ({ ...d, [k]: v }));
  const addAssignment = (cid) => {
    const title = draft(cid + ':title').trim();
    if (!title) return;
    mutate(cid, c => ({ ...c, assignments: [...c.assignments, { id: 'a' + Date.now(), title, due: draft(cid + ':due'), status: 'todo' }] }));
    setDrafts(d => ({ ...d, [cid + ':title']: '', [cid + ':due']: '' }));
  };

  const current = courses.find(c => c.id === view);
  const totals = {
    all: courses.reduce((s, c) => s + c.assignments.length, 0),
    done: courses.reduce((s, c) => s + c.assignments.filter(a => a.status === 'done').length, 0),
    theorems: courses.reduce((s, c) => s + c.theorems.length, 0),
  };
  const upcoming = courses
    .flatMap(c => c.assignments.filter(a => a.status !== 'done').map(a => ({ ...a, course: c })))
    .sort((x, y) => (x.due || '9999').localeCompare(y.due || '9999'));
  const allNotes = courses
    .flatMap(c => c.notes.map(n => ({ ...n, course: c })))
    .sort((a, b) => b.date.localeCompare(a.date));
  const now = new Date();

  return (
    <div className="tk-app">
      <MathParticles />
      <div className="math-deco">∂(due)/∂t &gt; 0 · · · ∮ proofs dγ</div>

      <aside className="tk-sidebar">
        <div className="tk-brand">
          <div className="tk-avatar">
            <span className="tk-avatar-glyph">∮</span>
            <div className="tk-avatar-ring" />
          </div>
          <div>
            <div className="tk-brand-name">The Proof Lab</div>
            <div className="tk-brand-sub">NUS · Mathematics</div>
          </div>
        </div>
        <ul className="tk-nav">
          <li><a className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><span className="dot" />Dashboard</a></li>
          {courses.map(c => (
            <li key={c.id}>
              <a className={view === c.id ? 'active' : ''} onClick={() => setView(c.id)}>
                <span className="dot" />{c.nickname}
                <span className="count">{c.assignments.filter(a => a.status !== 'done').length}</span>
              </a>
            </li>
          ))}
          <li><a className={view === 'margin' ? 'active' : ''} onClick={() => setView('margin')}><span className="dot" />The Margin</a></li>
        </ul>
        <Calendar courses={courses} cursor={calCursor} selected={selectedDate} onSelect={setSelectedDate}
          onShift={(d) => { setSelectedDate(null); setCalCursor(({ y, m }) => { let nm = m + d, ny = y; if (nm < 0) { nm = 11; ny--; } if (nm > 11) { nm = 0; ny++; } return { y: ny, m: nm }; }); }} />
        <div className="tk-sidebar-foot">saved to this browser ·<br/>wire Firebase for cross-device sync</div>
      </aside>

      <main className="tk-main">
        {view === 'dashboard' && (
          <section>
            <div className="tk-hero fade-up">
              <div>
                <h1>Right then — <em>what's due.</em></h1>
                <div className="tk-hero-meta">{String(now.getDate()).padStart(2,'0')} {MONTHS[now.getMonth()]} {now.getFullYear()} · semester: chaos, mostly organised</div>
              </div>
              <button className="tk-btn tk-btn-primary" onClick={() => setQuizScope(null)}>∴ Quiz me</button>
            </div>
            <div className="tk-stats fade-up d1">
              <div className="tk-stat"><div className="tk-stat-num">{totals.all - totals.done}</div><div className="tk-stat-cap">Owed to the universe</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{totals.done}<span>/{totals.all}</span></div><div className="tk-stat-cap">Cleared</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{totals.theorems}</div><div className="tk-stat-cap">Results in the canon</div></div>
            </div>
            <div className="fade-up d2">
              <SectionLabel sub="every course, soonest first">The Queue</SectionLabel>
              {upcoming.length ? (
                <div className="tk-timeline" style={{ marginBottom: '3.2rem' }}>
                  {upcoming.map(a => (
                    <AssignmentRow key={a.id} a={a} showCourse={`${a.course.glyph} · ${a.course.name}`} onCycle={() => cycle(a.course.id, a.id)} />
                  ))}
                </div>
              ) : <div style={{ marginBottom: '3.2rem' }}><Empty icon="✅">Nothing pending. Suspicious.</Empty></div>}
            </div>
            <div className="fade-up d3">
              <SectionLabel>Jump in</SectionLabel>
              <div className="tk-jump-grid">
                {courses.map(c => {
                  const done = c.assignments.filter(a => a.status === 'done').length;
                  const pct = c.assignments.length ? Math.round(done / c.assignments.length * 100) : 0;
                  return (
                    <div key={c.id} className="tk-jump" onClick={() => setView(c.id)}>
                      <div className="tk-jump-glyph">{c.glyph}</div>
                      <div className="tk-jump-name">{c.name}</div>
                      <div className="tk-jump-meta">{c.assignments.length - done} open · {c.theorems.length} results · {c.notes.length} notes</div>
                      <div className="tk-progress"><div className="tk-progress-fill" style={{ width: pct + '%' }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {current && (
          <section key={current.id}>
            <div className="fade-up">
              <div className="tk-hero">
                <div>
                  <div className="tk-course-head">
                    <span className="tk-course-glyph">{current.glyph}</span>
                    <span className="tk-course-name">{current.name}</span>
                  </div>
                  <div className="tk-hero-meta">{current.assignments.filter(a => a.status !== 'done').length} open · {current.theorems.length} in the canon · {current.notes.length} margin notes</div>
                </div>
                <button className="tk-btn tk-btn-outline" onClick={() => setQuizScope(current.id)}>∴ Quiz me</button>
              </div>
              <div className="tk-progress" style={{ margin: '1.4rem 0 3rem', maxWidth: 420 }}>
                <div className="tk-progress-fill" style={{ width: (current.assignments.length ? Math.round(current.assignments.filter(a => a.status === 'done').length / current.assignments.length * 100) : 0) + '%' }} />
              </div>
            </div>

            <div className="fade-up d1">
              <SectionLabel>The Queue</SectionLabel>
              <div className="tk-timeline">
                {current.assignments.map(a => (
                  <AssignmentRow key={a.id} a={a} onCycle={() => cycle(current.id, a.id)} onRemove={() => removeA(current.id, a.id)} />
                ))}
              </div>
              <div className="tk-form-row">
                <input className="tk-input" placeholder="new assignment…" value={draft(current.id + ':title')} onChange={e => setDraft(current.id + ':title', e.target.value)} onKeyDown={e => e.key === 'Enter' && addAssignment(current.id)} />
                <input className="tk-input tk-input-date" type="date" value={draft(current.id + ':due')} onChange={e => setDraft(current.id + ':due', e.target.value)} />
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => addAssignment(current.id)}>Add</button>
              </div>
            </div>

            <div className="fade-up d2">
              <SectionLabel sub="key facts, theorems, lemmas">The Canon</SectionLabel>
              <div className="tk-stack">
                {current.theorems.map(t => (
                  <RevealCard key={t.id} badge={t.type} name={t.name} body={t.statement} hidden={t.proof}
                    hiddenLabels={['reveal proof ▸', 'hide proof ▾']} revealed={t.revealed} onToggle={() => toggle(current.id, 'theorems', t.id)} />
                ))}
                {!current.theorems.length && <Empty icon="🔧">Canon is empty. Add results as you meet them.</Empty>}
              </div>
            </div>

            <div className="fade-up d3">
              <SectionLabel sub="problems, then the reveal">The Arena</SectionLabel>
              <div className="tk-stack">
                {current.problems.map(p => (
                  <RevealCard key={p.id} name={p.title} body={p.problem} hidden={p.solution}
                    hiddenLabels={['show worked solution ▸', 'hide solution ▾']} revealed={p.revealed} onToggle={() => toggle(current.id, 'problems', p.id)} />
                ))}
                {!current.problems.length && <Empty icon="⚔️">No problems logged yet.</Empty>}
              </div>
            </div>

            <div className="fade-up d4">
              <SectionLabel>The Margin</SectionLabel>
              <textarea className="tk-textarea" placeholder="scribble a thought before it evaporates… ($math$ works)" value={draft(current.id + ':note')} onChange={e => setDraft(current.id + ':note', e.target.value)} />
              <div className="tk-note-actions">
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => { addNote(current.id, draft(current.id + ':note')); setDraft(current.id + ':note', ''); }}>Pin note</button>
              </div>
              <div className="tk-stack" style={{ marginBottom: 0 }}>
                {current.notes.map(n => (
                  <div key={n.id} className="tk-note">
                    <div className="tk-note-date">{n.date}</div>
                    <div className="tk-note-text"><MathTex>{n.text}</MathTex></div>
                    <button className="tk-x-btn" onClick={() => removeNote(current.id, n.id)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {view === 'margin' && (
          <section>
            <div className="fade-up">
              <div className="tk-course-name" style={{ marginBottom: '.4rem' }}>The Margin</div>
              <div className="tk-hero-meta" style={{ marginBottom: '2.5rem' }}>every scribble, across every course · "I have discovered a truly marvellous proof of this…"</div>
            </div>
            <div className="tk-card fade-up d1" style={{ marginBottom: '2.5rem', borderLeft: '1px solid var(--border)' }}>
              <select className="tk-select" style={{ marginBottom: '.7rem' }} value={draft('margin:course') || courses[0].id} onChange={e => setDraft('margin:course', e.target.value)}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.nickname}</option>)}
              </select>
              <textarea className="tk-textarea" placeholder="scribble a thought before it evaporates… ($math$ works)" value={draft('margin:note')} onChange={e => setDraft('margin:note', e.target.value)} />
              <div className="tk-note-actions" style={{ margin: '.7rem 0 0' }}>
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => { addNote(draft('margin:course') || courses[0].id, draft('margin:note')); setDraft('margin:note', ''); }}>Pin note</button>
              </div>
            </div>
            <div className="tk-stack fade-up d2" style={{ marginBottom: 0 }}>
              {allNotes.map(n => (
                <div key={n.id} className="tk-note">
                  <div className="tk-note-head">
                    <span className="glyph">{n.course.glyph}</span>
                    <span className="course">{n.course.name}</span>
                    <span className="date">· {n.date}</span>
                  </div>
                  <div className="tk-note-text"><MathTex>{n.text}</MathTex></div>
                  <button className="tk-x-btn" onClick={() => removeNote(n.course.id, n.id)}>×</button>
                </div>
              ))}
              {!allNotes.length && <Empty icon="✍️">Margins are blank. For now.</Empty>}
            </div>
          </section>
        )}
      </main>

      {quizScope !== undefined && <Quiz courses={courses} scope={quizScope} onClose={() => setQuizScope(undefined)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
