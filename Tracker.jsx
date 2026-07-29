// Tracker.jsx — The Proof Lab: course + assignment tracking, calendar, and
// per-course notes (markdown + KaTeX, Overleaf-style full-screen editor).
// State persists to localStorage.
const { useState, useEffect, useMemo, useCallback, useRef } = React;

const STORE_KEY = 'proofLabData';
const STATUS_ORDER = ['todo', 'doing', 'done'];
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ── markdown + KaTeX renderer for the per-course notes document ──
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

// table of contents: only top-level (#) and second-level (##) headings
function extractToc(doc) {
  const lines = String(doc || '').split('\n');
  const toc = [];
  lines.forEach((line, i) => {
    const h1 = line.match(/^#\s+(.*)$/);
    const h2 = !h1 && line.match(/^##\s+(.*)$/);
    if (h1) toc.push({ level: 1, text: h1[1].trim(), id: 'h-' + i });
    else if (h2) toc.push({ level: 2, text: h2[1].trim(), id: 'h-' + i });
  });
  return toc;
}

// environment/callout blocks: ::: theorem | proposition | definition | lemma |
// corollary | example | remark | proof | flag  Name?  …body…  :::
const ENV_LABELS = { theorem: 'Theorem', proposition: 'Proposition', definition: 'Definition', lemma: 'Lemma', corollary: 'Corollary', example: 'Example', remark: 'Remark', proof: 'Proof' };
const ENV_TYPES = Object.keys(ENV_LABELS);
const MATH_CMDS = [
  { cmd: 'mathcal', glyph: '𝒜' },
  { cmd: 'mathfrak', glyph: '𝔄' },
  { cmd: 'mathbb', glyph: '𝔸' },
];

function blockTemplate(type) {
  const hasName = type !== 'proof' && type !== 'flag';
  const prefix = `:::${type}` + (hasName ? ' ' : '');
  const namePlaceholder = hasName ? 'Name' : '';
  const bodyPlaceholder = type === 'proof' ? 'Proof.' : type === 'flag' ? "What don't you understand here?" : 'Statement.';
  const line1 = prefix + namePlaceholder;
  const text = `${line1}\n${bodyPlaceholder}\n:::\n`;
  const selStart = hasName ? prefix.length : line1.length + 1;
  const selEnd = hasName ? prefix.length + namePlaceholder.length : line1.length + 1 + bodyPlaceholder.length;
  return { text, selStart, selEnd };
}

function mathTemplate(cmd) {
  const text = `\\${cmd}{}`;
  return { text, selStart: text.length - 1, selEnd: text.length - 1 };
}

function renderDoc(text) {
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
      const isFlag = type === 'flag';
      const label = isFlag ? '🚩 Flag' : (ENV_LABELS[type] || type);
      out.push(
        <div key={'blk' + out.length} className={`tk-note-block${isFlag ? ' tk-note-flag' : ''}`}>
          <div className="tk-note-block-head">
            <span className="tk-type">{label}</span>
            {name && <span className="tk-note-block-name">{renderInline(name, 'bn' + out.length)}</span>}
          </div>
          <div className="tk-note-block-body">{renderDoc(bodyLines.join('\n'))}</div>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 3) {
      flushAll();
      const html = katexHtml(trimmed.slice(2, -2), true);
      out.push(html
        ? <div key={'dm' + i} className="tk-note-display-math" dangerouslySetInnerHTML={{ __html: html }} />
        : <p key={'dm' + i} className="tk-note-p">{trimmed}</p>);
      i++;
      continue;
    }

    const h = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushAll();
      const level = h[1].length;
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      out.push(React.createElement(Tag, { key: 'h' + i, id: 'h-' + i, className: `tk-note-h${level}` }, renderInline(h[2], 'h' + i)));
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) { flushPara(); flushQuote(); list.push(trimmed.replace(/^[-*]\s+/, '')); i++; continue; }
    if (trimmed.startsWith('> ')) { flushPara(); flushList(); quote.push(trimmed.slice(2)); i++; continue; }
    if (trimmed === '') { flushAll(); i++; continue; }

    flushList(); flushQuote();
    para.push(trimmed);
    i++;
  }
  flushAll();
  return out;
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

// ── full-screen, Overleaf-style notes editor ──
function NotesEditor({ course, doc, onClose, onChange }) {
  const taRef = useRef(null);
  const toc = extractToc(doc);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const insertSnippet = ({ text, selStart, selEnd }, blockLevel) => {
    const ta = taRef.current;
    const value = doc || '';
    const start = ta ? ta.selectionStart : value.length;
    const end = ta ? ta.selectionEnd : value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const pad = blockLevel && before.length && !before.endsWith('\n') ? '\n' : '';
    onChange(before + pad + text + after);
    const base = before.length + pad.length;
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(base + selStart, base + selEnd);
    });
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="tk-editor-overlay">
      <div className="tk-editor-topbar">
        <button className="tk-mono-btn" onClick={onClose}>← Back</button>
        <div className="tk-editor-course">{course.glyph} · {course.name} — Notes</div>
        <div style={{ width: 64 }} />
      </div>
      <div className="tk-doc-toolbar">
        {MATH_CMDS.map(m => (
          <button key={m.cmd} className="tk-mono-btn" onClick={() => insertSnippet(mathTemplate(m.cmd), false)}>{m.glyph} {m.cmd}</button>
        ))}
        <span className="tk-toolbar-sep" />
        {ENV_TYPES.map(t => (
          <button key={t} className="tk-mono-btn" onClick={() => insertSnippet(blockTemplate(t), true)}>{ENV_LABELS[t]}</button>
        ))}
        <span className="tk-toolbar-sep" />
        <button className="tk-mono-btn tk-flag-toolbar-btn" onClick={() => insertSnippet(blockTemplate('flag'), true)}>🚩 Flag</button>
      </div>
      <div className="tk-editor-body">
        <div className="tk-doc-layout">
          <div className="tk-doc-toc">
            <div className="tk-doc-toc-label">Contents</div>
            {toc.length ? toc.map(h => (
              <a key={h.id} className={`tk-doc-toc-item lvl${h.level}`} onClick={() => scrollToHeading(h.id)}>{h.text || 'Untitled'}</a>
            )) : <div className="tk-doc-toc-empty">Add a # heading</div>}
          </div>
          <div className="tk-doc-edit">
            <textarea
              ref={taRef}
              className="tk-doc-textarea"
              value={doc || ''}
              placeholder={'# Heading\n\nWrite here — **bold**, *italic*, $x^2$, $$\\int f\\,dx$$ …\nUse the toolbar for \\mathcal, \\mathbb, theorem/definition blocks, or a flag.'}
              onChange={e => onChange(e.target.value)}
            />
          </div>
          <div className="tk-doc-preview">
            {(doc || '').trim() ? renderDoc(doc) : <div className="tk-note-p tk-note-empty">Nothing written yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── add-course modal ──
function AddCourseModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const submit = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), code: code.trim(), desc: desc.trim() });
  };
  return (
    <React.Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">Add a course</div>
          <div className="tk-modal-field">
            <label>Course title</label>
            <input className="tk-input" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Linear Algebra" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Course code</label>
            <input className="tk-input" value={code} onChange={e => setCode(e.target.value)} placeholder="MA2101" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Description</label>
            <textarea className="tk-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What this course covers…" />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!title.trim()} onClick={submit}>Add course</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// ── delete-course modal: type DELETE to confirm ──
function DeleteCourseModal({ course, onClose, onConfirm }) {
  const [text, setText] = useState('');
  const ready = text.trim().toUpperCase() === 'DELETE';
  return (
    <React.Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">Delete "{course.name}"?</div>
          <p className="tk-note-p" style={{ marginBottom: '1rem' }}>This removes the course, its assignments, and its notes for good. This can't be undone.</p>
          <div className="tk-modal-field">
            <label>Type DELETE to confirm</label>
            <input className="tk-input" autoFocus value={text} onChange={e => setText(e.target.value)} placeholder="DELETE" onKeyDown={e => e.key === 'Enter' && ready && onConfirm()} />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!ready} onClick={onConfirm}>Delete course</button>
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
      if (saved) return saved.map(c => ({ ...c, doc: c.doc || '' }));
    } catch (e) {}
    return window.TRACKER_SEED;
  });
  const [view, setView] = useState('dashboard');
  const [calCursor, setCalCursor] = useState({ y: new Date().getFullYear(), m: new Date().getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('proofLabTheme') || 'light'; } catch (e) { return 'light'; } });
  const [notesOpenFor, setNotesOpenFor] = useState(null); // course id | null
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [deleteCourseFor, setDeleteCourseFor] = useState(null); // course id | null

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
  const updateDoc = (cid, text) => mutate(cid, c => ({ ...c, doc: text }));
  const draft = (k) => drafts[k] || '';
  const setDraft = (k, v) => setDrafts(d => ({ ...d, [k]: v }));
  const addAssignment = (cid) => {
    const title = draft(cid + ':title').trim();
    if (!title) return;
    mutate(cid, c => ({ ...c, assignments: [...c.assignments, { id: 'a' + Date.now(), title, due: draft(cid + ':due'), status: 'todo' }] }));
    setDrafts(d => ({ ...d, [cid + ':title']: '', [cid + ':due']: '' }));
  };
  const addCourse = ({ title, code, desc }) => {
    const id = 'c' + newId();
    const label = code || title.slice(0, 2).toUpperCase();
    setCourses(cs => [...cs, { id, name: title, glyph: label, nickname: label, description: desc, assignments: [], doc: '' }]);
    setAddCourseOpen(false);
    setView(id);
  };
  const removeCourse = (cid) => {
    setCourses(cs => cs.filter(c => c.id !== cid));
    if (view === cid) setView('dashboard');
    if (notesOpenFor === cid) setNotesOpenFor(null);
    setDeleteCourseFor(null);
  };

  const current = courses.find(c => c.id === view);
  const totals = {
    all: courses.reduce((s, c) => s + c.assignments.length, 0),
    done: courses.reduce((s, c) => s + c.assignments.filter(a => a.status === 'done').length, 0),
  };
  const upcoming = courses
    .flatMap(c => c.assignments.filter(a => a.status !== 'done').map(a => ({ ...a, course: c })))
    .sort((x, y) => (x.due || '9999').localeCompare(y.due || '9999'));
  const now = new Date();
  const courseToDelete = deleteCourseFor ? courses.find(c => c.id === deleteCourseFor) : null;

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
          <li><a className="tk-nav-add" onClick={() => setAddCourseOpen(true)}><span className="dot" />+ Add course</a></li>
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
            </div>
            <div className="tk-stats fade-up d1">
              <div className="tk-stat"><div className="tk-stat-num">{totals.all - totals.done}</div><div className="tk-stat-cap">Pending</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{totals.done}<span>/{totals.all}</span></div><div className="tk-stat-cap">Completed</div></div>
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
                      <div className="tk-jump-meta">{c.assignments.length - done} open</div>
                      <div className="tk-progress"><div className="tk-progress-fill" style={{ width: pct + '%' }} /></div>
                    </div>
                  );
                })}
                <div className="tk-jump tk-jump-add" onClick={() => setAddCourseOpen(true)}>
                  <div className="tk-jump-add-plus">+</div>
                  <div className="tk-jump-name">Add course</div>
                </div>
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
                  {current.description && <div className="tk-course-desc">{current.description}</div>}
                  <div className="tk-hero-meta">{current.assignments.filter(a => a.status !== 'done').length} open</div>
                </div>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <button className="tk-btn tk-btn-outline" onClick={() => setNotesOpenFor(current.id)}>Notes</button>
                  <button className="tk-x-btn" title="delete course" onClick={() => setDeleteCourseFor(current.id)}>×</button>
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
          </section>
        )}
      </main>

      {notesOpenFor && (() => {
        const c = courses.find(x => x.id === notesOpenFor);
        if (!c) return null;
        return <NotesEditor course={c} doc={c.doc} onClose={() => setNotesOpenFor(null)} onChange={(text) => updateDoc(c.id, text)} />;
      })()}

      {addCourseOpen && <AddCourseModal onClose={() => setAddCourseOpen(false)} onCreate={addCourse} />}
      {courseToDelete && <DeleteCourseModal course={courseToDelete} onClose={() => setDeleteCourseFor(null)} onConfirm={() => removeCourse(courseToDelete.id)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
