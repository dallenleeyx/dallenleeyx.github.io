// Tracker.jsx — The Proof Lab: assignments, revision canon, problem arena,
// margin notes, calendar, quiz mode. State persists to localStorage.
const { useState, useEffect, useMemo, useCallback, useRef } = React;

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

// ── markdown + KaTeX renderer for chapter notes ──
const BLOCK_LABELS = { definition: 'Definition', lemma: 'Lemma', theorem: 'Theorem', proposition: 'Proposition', corollary: 'Corollary', example: 'Example', remark: 'Remark', proof: 'Proof' };
const BLOCK_TYPES = Object.keys(BLOCK_LABELS).map(cmd => ({ cmd, label: BLOCK_LABELS[cmd] }));

function katexHtml(src, displayMode) {
  if (!window.katex) return null;
  try { return katex.renderToString(src, { throwOnError: false, displayMode }); }
  catch (e) { return null; }
}

function renderInline(text, keyPrefix) {
  if (!text) return null;
  const parts = String(text).split(/(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
      const html = katexHtml(part.slice(2, -2), true);
      return html ? <span key={key} dangerouslySetInnerHTML={{ __html: html }} /> : <React.Fragment key={key}>{part}</React.Fragment>;
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
      const html = katexHtml(part.slice(1, -1), false);
      return html ? <span key={key} dangerouslySetInnerHTML={{ __html: html }} /> : <React.Fragment key={key}>{part}</React.Fragment>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 3) {
      return <strong key={key}>{renderInline(part.slice(2, -2), key)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={key} className="t-code">{part.slice(1, -1)}</code>;
    }
    if ((part.startsWith('*') && part.endsWith('*') && part.length > 1) || (part.startsWith('_') && part.endsWith('_') && part.length > 1)) {
      return <em key={key}>{renderInline(part.slice(1, -1), key)}</em>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function renderBlocks(text) {
  const lines = String(text || '').split('\n');
  const out = [];
  let para = [], list = [], quote = [];
  const flushPara = () => { if (para.length) { out.push(<p key={'p' + out.length} className="tk-note-p">{renderInline(para.join(' '), 'p' + out.length)}</p>); para = []; } };
  const flushList = () => { if (list.length) { out.push(<ul key={'ul' + out.length} className="tk-note-ul">{list.map((it, li) => <li key={li}>{renderInline(it, 'li' + out.length + '-' + li)}</li>)}</ul>); list = []; } };
  const flushQuote = () => { if (quote.length) { out.push(<blockquote key={'bq' + out.length} className="tk-note-bq">{renderInline(quote.join(' '), 'bq' + out.length)}</blockquote>); quote = []; } };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    const blockMatch = trimmed.match(/^:::(\w+)\s*(.*)$/);
    if (blockMatch) {
      flushAll();
      const type = blockMatch[1].toLowerCase();
      const name = blockMatch[2].trim();
      const bodyLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') { bodyLines.push(lines[i]); i++; }
      i++;
      const label = BLOCK_LABELS[type] || type;
      out.push(
        <div key={'blk' + out.length} className={`tk-note-block tk-note-block-${type}`}>
          <div className="tk-note-block-head">
            <span className="tk-type">{label}</span>
            {name && <span className="tk-note-block-name">{renderInline(name, 'bn' + out.length)}</span>}
          </div>
          <div className="tk-note-block-body">{renderBlocks(bodyLines.join('\n'))}</div>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 3) {
      flushAll();
      const html = katexHtml(trimmed.slice(2, -2), true);
      out.push(html
        ? <div key={'dm' + out.length} className="tk-note-display-math" dangerouslySetInnerHTML={{ __html: html }} />
        : <p key={'dm' + out.length} className="tk-note-p">{trimmed}</p>);
      i++;
      continue;
    }

    const headMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headMatch) {
      flushAll();
      const level = headMatch[1].length;
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      out.push(React.createElement(Tag, { key: 'h' + out.length, className: `tk-note-h${level}` }, renderInline(headMatch[2], 'h' + out.length)));
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushPara(); flushQuote();
      list.push(trimmed.replace(/^[-*]\s+/, ''));
      i++;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushPara(); flushList();
      quote.push(trimmed.slice(2));
      i++;
      continue;
    }

    if (trimmed === '') { flushAll(); i++; continue; }

    flushList(); flushQuote();
    para.push(trimmed);
    i++;
  }
  flushAll();
  return out;
}

function blockTemplate(cmd) {
  const hasName = cmd !== 'proof';
  const prefix = `:::${cmd}` + (hasName ? ' ' : '');
  const namePlaceholder = hasName ? 'Name' : '';
  const bodyPlaceholder = cmd === 'proof' ? 'Proof.' : 'Statement.';
  const line1 = prefix + namePlaceholder;
  const text = `${line1}\n${bodyPlaceholder}\n:::\n`;
  const selStart = hasName ? prefix.length : line1.length + 1;
  const selEnd = hasName ? prefix.length + namePlaceholder.length : line1.length + 1 + bodyPlaceholder.length;
  return { text, selStart, selEnd };
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
          {!selItems.length && <div className="tk-cal-detail-empty">Nothing due.</div>}
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
  const has = pool.length > 0;
  const current = has ? pool[idx % pool.length] : null;
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
            <span className="tk-quiz-eyebrow">Quiz</span>
            {has && <span className="tk-quiz-course">{current.course.name}</span>}
          </div>
          {has ? (
            <React.Fragment>
              <div className="tk-card-head">
                <span className="tk-type">{current.t.type}</span>
                <span className="tk-quiz-name">{current.t.name}</span>
              </div>
              <div className="tk-quiz-body"><MathTex>{current.t.statement}</MathTex></div>
              {revealed && <div className="tk-reveal"><MathTex>{current.t.proof}</MathTex></div>}
              <div className="tk-quiz-foot">
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => setRevealed(r => !r)}>
                  {revealed ? 'Hide proof' : 'Show proof'}
                </button>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="tk-mono-btn" onClick={next}>Next</button>
                  <button className="tk-mono-btn" onClick={onClose}>Close</button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Empty icon="🔧">No theorems to quiz yet.</Empty>
              <div className="tk-quiz-foot" style={{ justifyContent: 'flex-end' }}>
                <button className="tk-mono-btn" onClick={onClose}>Close</button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

function Flashcards({ courses, scope, onClose }) {
  const pool = useMemo(() => {
    const p = [];
    courses.forEach(c => { if (!scope || c.id === scope) c.theorems.forEach(t => { if (t.type === 'Definition') p.push({ course: c, t }); }); });
    return p;
  }, [courses, scope]);
  const [idx, setIdx] = useState(() => (Math.random() * pool.length) | 0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === ' ') { e.preventDefault(); setFlipped(f => !f); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const has = pool.length > 0;
  const current = has ? pool[idx % pool.length] : null;
  const next = () => {
    if (pool.length > 1) { let n; do { n = (Math.random() * pool.length) | 0; } while (n === idx); setIdx(n); }
    setFlipped(false);
  };
  return (
    <React.Fragment>
      <div className="tk-quiz-backdrop" onClick={onClose} />
      <div className="tk-quiz-wrap">
        <div className="tk-quiz tk-flashcard" onClick={() => has && setFlipped(f => !f)}>
          <div className="tk-quiz-top">
            <span className="tk-quiz-eyebrow">Flashcards</span>
            {has && <span className="tk-quiz-course">{current.course.name}</span>}
          </div>
          {has ? (
            <React.Fragment>
              <div className="tk-flash-face">
                {!flipped ? (
                  <div className="tk-flash-term">{current.t.name}</div>
                ) : (
                  <div className="tk-quiz-body"><MathTex>{current.t.statement}</MathTex></div>
                )}
              </div>
              <div className="tk-quiz-foot" onClick={(e) => e.stopPropagation()}>
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => setFlipped(f => !f)}>
                  {flipped ? 'Show term' : 'Show definition'}
                </button>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="tk-mono-btn" onClick={next}>Next</button>
                  <button className="tk-mono-btn" onClick={onClose}>Close</button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Empty icon="📇">No definitions to review yet.</Empty>
              <div className="tk-quiz-foot" style={{ justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                <button className="tk-mono-btn" onClick={onClose}>Close</button>
              </div>
            </React.Fragment>
          )}
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
  const [flashScope, setFlashScope] = useState(undefined); // undefined = closed, null = all courses
  const [drafts, setDrafts] = useState({});
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('proofLabTheme') || 'light'; } catch (e) { return 'light'; } });
  const [activeChapter, setActiveChapter] = useState({});
  const [slash, setSlash] = useState(null);
  const chapterTaRef = useRef(null);

  useEffect(() => { try { localStorage.setItem(STORE_KEY, JSON.stringify(courses)); } catch (e) {} }, [courses]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('proofLabTheme', theme); } catch (e) {}
  }, [theme]);

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

  const addChapter = (cid, title) => {
    const id = 'ch' + Date.now();
    mutate(cid, c => ({ ...c, chapters: [...(c.chapters || []), { id, title, body: '' }] }));
    setActiveChapter(a => ({ ...a, [cid]: id }));
  };
  const submitAddChapter = (cid) => {
    const title = draft(cid + ':chapterTitle').trim();
    if (!title) return;
    addChapter(cid, title);
    setDraft(cid + ':chapterTitle', '');
  };
  const removeChapter = (cid, id) => {
    mutate(cid, c => ({ ...c, chapters: (c.chapters || []).filter(ch => ch.id !== id) }));
    setActiveChapter(a => { const n = { ...a }; if (n[cid] === id) delete n[cid]; return n; });
  };
  const updateChapterBody = (cid, id, body) => {
    mutate(cid, c => ({ ...c, chapters: (c.chapters || []).map(ch => ch.id === id ? { ...ch, body } : ch) }));
  };
  const handleChapterChange = (cid, chid, e) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    updateChapterBody(cid, chid, val);
    const lineStart = val.lastIndexOf('\n', pos - 1) + 1;
    const line = val.slice(lineStart, pos);
    const m = line.match(/^\/(\w*)$/);
    if (m) setSlash({ courseId: cid, chapterId: chid, query: m[1], start: lineStart, end: pos });
    else setSlash(null);
  };
  const insertBlock = (cid, chid, cmd, replaceRange) => {
    const ta = chapterTaRef.current;
    const course = courses.find(c => c.id === cid);
    const ch = ((course && course.chapters) || []).find(x => x.id === chid);
    const value = ch ? ch.body : '';
    const { text, selStart, selEnd } = blockTemplate(cmd);
    const start = replaceRange ? replaceRange.start : (ta ? ta.selectionStart : value.length);
    const end = replaceRange ? replaceRange.end : (ta ? ta.selectionEnd : value.length);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const pad = before.length && !before.endsWith('\n') ? '\n' : '';
    updateChapterBody(cid, chid, before + pad + text + after);
    const base = before.length + pad.length;
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(base + selStart, base + selEnd);
    });
  };
  const onChapterKeyDown = (e, cid, chid) => {
    if (!slash || slash.courseId !== cid || slash.chapterId !== chid) return;
    if (e.key === 'Escape') { setSlash(null); return; }
    if (e.key === 'Enter' || e.key === 'Tab') {
      const matches = BLOCK_TYPES.filter(b => b.cmd.startsWith(slash.query.toLowerCase()));
      if (matches.length) {
        e.preventDefault();
        insertBlock(cid, chid, matches[0].cmd, slash);
        setSlash(null);
      }
    }
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
        <button className="tk-theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
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
          <li><a className={view === 'margin' ? 'active' : ''} onClick={() => setView('margin')}><span className="dot" />Notes</a></li>
        </ul>
        <Calendar courses={courses} cursor={calCursor} selected={selectedDate} onSelect={setSelectedDate}
          onShift={(d) => { setSelectedDate(null); setCalCursor(({ y, m }) => { let nm = m + d, ny = y; if (nm < 0) { nm = 11; ny--; } if (nm > 11) { nm = 0; ny++; } return { y: ny, m: nm }; }); }} />
        <div className="tk-sidebar-foot">Saved locally in this browser.</div>
      </aside>

      <main className="tk-main">
        {view === 'dashboard' && (
          <section>
            <div className="tk-hero fade-up">
              <div>
                <h1>Dashboard</h1>
                <div className="tk-hero-meta">{String(now.getDate()).padStart(2,'0')} {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
              </div>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button className="tk-btn tk-btn-outline" onClick={() => setFlashScope(null)}>Flashcards</button>
                <button className="tk-btn tk-btn-primary" onClick={() => setQuizScope(null)}>Quiz</button>
              </div>
            </div>
            <div className="tk-stats fade-up d1">
              <div className="tk-stat"><div className="tk-stat-num">{totals.all - totals.done}</div><div className="tk-stat-cap">Pending</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{totals.done}<span>/{totals.all}</span></div><div className="tk-stat-cap">Completed</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{totals.theorems}</div><div className="tk-stat-cap">Theorems</div></div>
            </div>
            <div className="fade-up d2">
              <SectionLabel sub="soonest due first">Assignments</SectionLabel>
              {upcoming.length ? (
                <div className="tk-timeline" style={{ marginBottom: '3.2rem' }}>
                  {upcoming.map(a => (
                    <AssignmentRow key={a.id} a={a} showCourse={`${a.course.glyph} · ${a.course.name}`} onCycle={() => cycle(a.course.id, a.id)} />
                  ))}
                </div>
              ) : <div style={{ marginBottom: '3.2rem' }}><Empty icon="✅">Nothing pending.</Empty></div>}
            </div>
            <div className="fade-up d3">
              <SectionLabel>Courses</SectionLabel>
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
                  <div className="tk-hero-meta">{current.assignments.filter(a => a.status !== 'done').length} open · {current.theorems.length} theorems · {current.notes.length} notes</div>
                </div>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <button className="tk-btn tk-btn-outline" onClick={() => setFlashScope(current.id)}>Flashcards</button>
                  <button className="tk-btn tk-btn-outline" onClick={() => setQuizScope(current.id)}>Quiz</button>
                </div>
              </div>
              <div className="tk-progress" style={{ margin: '1.4rem 0 3rem', maxWidth: 420 }}>
                <div className="tk-progress-fill" style={{ width: (current.assignments.length ? Math.round(current.assignments.filter(a => a.status === 'done').length / current.assignments.length * 100) : 0) + '%' }} />
              </div>
            </div>

            <div className="fade-up d1">
              <SectionLabel>Assignments</SectionLabel>
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
              <SectionLabel sub="write in markdown + KaTeX, organised by chapter">Chapters</SectionLabel>
              {(() => {
                const chapters = current.chapters || [];
                const activeId = activeChapter[current.id] || (chapters[0] && chapters[0].id);
                const chapter = chapters.find(ch => ch.id === activeId) || null;
                const activeSlash = slash && slash.courseId === current.id && chapter && slash.chapterId === chapter.id ? slash : null;
                const slashMatches = activeSlash ? BLOCK_TYPES.filter(b => b.cmd.startsWith(activeSlash.query.toLowerCase())) : [];
                return (
                  <React.Fragment>
                    <div className="tk-chapter-tabs">
                      {chapters.map(ch => (
                        <button key={ch.id} className={`tk-chapter-tab${ch.id === activeId ? ' active' : ''}`}
                          onClick={() => setActiveChapter(a => ({ ...a, [current.id]: ch.id }))}>{ch.title}</button>
                      ))}
                    </div>
                    <div className="tk-form-row">
                      <input className="tk-input" placeholder="new chapter title…" value={draft(current.id + ':chapterTitle')}
                        onChange={e => setDraft(current.id + ':chapterTitle', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submitAddChapter(current.id)} />
                      <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => submitAddChapter(current.id)}>Add chapter</button>
                    </div>
                    {chapter ? (
                      <div className="tk-chapter-editor">
                        <div className="tk-chapter-toolbar">
                          {BLOCK_TYPES.map(b => (
                            <button key={b.cmd} className="tk-mono-btn" onClick={() => insertBlock(current.id, chapter.id, b.cmd)}>/{b.cmd}</button>
                          ))}
                          <button className="tk-x-btn" style={{ marginLeft: 'auto' }} title="delete chapter" onClick={() => removeChapter(current.id, chapter.id)}>×</button>
                        </div>
                        <div className="tk-chapter-panes">
                          <div className="tk-chapter-pane-edit">
                            <textarea
                              ref={chapterTaRef}
                              className="tk-textarea tk-chapter-textarea"
                              placeholder="Write here. Type /definition, /lemma, /theorem… for a template."
                              value={chapter.body}
                              onChange={e => handleChapterChange(current.id, chapter.id, e)}
                              onKeyDown={e => onChapterKeyDown(e, current.id, chapter.id)}
                            />
                            {activeSlash && (
                              <div className="tk-slash-menu">
                                {slashMatches.length ? slashMatches.map(b => (
                                  <button key={b.cmd} className="tk-slash-item"
                                    onClick={() => { insertBlock(current.id, chapter.id, b.cmd, activeSlash); setSlash(null); }}>
                                    /{b.cmd} <span>{b.label}</span>
                                  </button>
                                )) : <div className="tk-slash-empty">no match</div>}
                              </div>
                            )}
                          </div>
                          <div className="tk-chapter-pane-preview">
                            {chapter.body.trim() ? renderBlocks(chapter.body) : <div className="tk-note-p tk-note-empty">Nothing written yet.</div>}
                          </div>
                        </div>
                      </div>
                    ) : <Empty icon="📓">No chapters yet. Add one above.</Empty>}
                  </React.Fragment>
                );
              })()}
            </div>

            <div className="fade-up d3">
              <SectionLabel sub="definitions, lemmas, theorems">Theorems</SectionLabel>
              <div className="tk-stack">
                {current.theorems.map(t => (
                  <RevealCard key={t.id} badge={t.type} name={t.name} body={t.statement} hidden={t.proof}
                    hiddenLabels={['Show proof', 'Hide proof']} revealed={t.revealed} onToggle={() => toggle(current.id, 'theorems', t.id)} />
                ))}
                {!current.theorems.length && <Empty icon="🔧">No theorems yet.</Empty>}
              </div>
            </div>

            <div className="fade-up d4">
              <SectionLabel sub="attempt, then check the solution">Problems</SectionLabel>
              <div className="tk-stack">
                {current.problems.map(p => (
                  <RevealCard key={p.id} name={p.title} body={p.problem} hidden={p.solution}
                    hiddenLabels={['Show solution', 'Hide solution']} revealed={p.revealed} onToggle={() => toggle(current.id, 'problems', p.id)} />
                ))}
                {!current.problems.length && <Empty icon="⚔️">No problems logged yet.</Empty>}
              </div>
            </div>

            <div className="fade-up d4">
              <SectionLabel>Notes</SectionLabel>
              <textarea className="tk-textarea" placeholder="write a note… ($math$ works)" value={draft(current.id + ':note')} onChange={e => setDraft(current.id + ':note', e.target.value)} />
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
              <div className="tk-course-name" style={{ marginBottom: '.4rem' }}>Notes</div>
              <div className="tk-hero-meta" style={{ marginBottom: '2.5rem' }}>All notes, across every course.</div>
            </div>
            <div className="tk-card fade-up d1" style={{ marginBottom: '2.5rem', borderLeft: '1px solid var(--border)' }}>
              <select className="tk-select" style={{ marginBottom: '.7rem' }} value={draft('margin:course') || courses[0].id} onChange={e => setDraft('margin:course', e.target.value)}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.nickname}</option>)}
              </select>
              <textarea className="tk-textarea" placeholder="write a note… ($math$ works)" value={draft('margin:note')} onChange={e => setDraft('margin:note', e.target.value)} />
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
              {!allNotes.length && <Empty icon="✍️">No notes yet.</Empty>}
            </div>
          </section>
        )}
      </main>

      {quizScope !== undefined && <Quiz courses={courses} scope={quizScope} onClose={() => setQuizScope(undefined)} />}
      {flashScope !== undefined && <Flashcards courses={courses} scope={flashScope} onClose={() => setFlashScope(undefined)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
