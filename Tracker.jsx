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

// ── chapter notes: one flat list of typed blocks per chapter (Notion-ish) ──
const ADMONITION_TYPES = new Set(Object.keys(BLOCK_LABELS));
const SLASH_TYPES = [
  { cmd: 'h1', type: 'h1', label: 'Heading 1' },
  { cmd: 'h2', type: 'h2', label: 'Heading 2' },
  { cmd: 'h3', type: 'h3', label: 'Heading 3' },
  { cmd: 'bullet', type: 'ul', label: 'Bullet' },
  { cmd: 'quote', type: 'quote', label: 'Quote' },
  { cmd: 'definition', type: 'definition', label: 'Definition' },
  { cmd: 'lemma', type: 'lemma', label: 'Lemma' },
  { cmd: 'theorem', type: 'theorem', label: 'Theorem' },
  { cmd: 'proposition', type: 'proposition', label: 'Proposition' },
  { cmd: 'corollary', type: 'corollary', label: 'Corollary' },
  { cmd: 'example', type: 'example', label: 'Example' },
  { cmd: 'remark', type: 'remark', label: 'Remark' },
  { cmd: 'proof', type: 'proof', label: 'Proof' },
];

function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function newBlock(type) { return { id: 'b' + newId(), type: type || 'p', name: '', text: '' }; }

// best-effort one-time migration from the old raw-markdown chapter body
function parseBodyToBlocks(body) {
  const lines = String(body || '').split('\n');
  const blocks = [];
  let para = [];
  const flush = () => { if (para.length) { blocks.push({ id: 'b' + newId(), type: 'p', name: '', text: para.join(' ') }); para = []; } };
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    const bm = trimmed.match(/^:::(\w+)\s*(.*)$/);
    if (bm) {
      flush();
      const type = bm[1].toLowerCase();
      const name = bm[2].trim();
      const bodyLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') { bodyLines.push(lines[i]); i++; }
      i++;
      blocks.push({ id: 'b' + newId(), type: ADMONITION_TYPES.has(type) ? type : 'p', name, text: bodyLines.join(' ').trim() });
      continue;
    }
    const hm = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (hm) { flush(); blocks.push({ id: 'b' + newId(), type: 'h' + hm[1].length, name: '', text: hm[2] }); i++; continue; }
    if (/^[-*]\s+/.test(trimmed)) { flush(); blocks.push({ id: 'b' + newId(), type: 'ul', name: '', text: trimmed.replace(/^[-*]\s+/, '') }); i++; continue; }
    if (trimmed.startsWith('> ')) { flush(); blocks.push({ id: 'b' + newId(), type: 'quote', name: '', text: trimmed.slice(2) }); i++; continue; }
    if (trimmed === '') { flush(); i++; continue; }
    para.push(trimmed);
    i++;
  }
  flush();
  return blocks;
}

function normalizeCourses(list) {
  return (list || []).map(c => ({
    ...c,
    chapters: (c.chapters || []).map(ch => ch.blocks ? ch : { id: ch.id, title: ch.title, blocks: parseBodyToBlocks(ch.body) }),
  }));
}

function renderBlockView(block) {
  if (ADMONITION_TYPES.has(block.type)) {
    const label = BLOCK_LABELS[block.type] || block.type;
    return (
      <div className="tk-note-block">
        <div className="tk-note-block-head">
          <span className="tk-type">{label}</span>
          {block.name && <span className="tk-note-block-name">{renderInline(block.name, block.id + '-n')}</span>}
        </div>
        <div className="tk-note-block-body">
          {block.text ? <p className="tk-note-p">{renderInline(block.text, block.id + '-b')}</p> : <span className="tk-note-empty">Empty</span>}
        </div>
      </div>
    );
  }
  if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
    const Tag = block.type === 'h1' ? 'h3' : block.type === 'h2' ? 'h4' : 'h5';
    return React.createElement(Tag, { className: `tk-note-${block.type}` }, block.text ? renderInline(block.text, block.id) : <span className="tk-note-empty">Heading</span>);
  }
  if (block.type === 'ul') {
    return <div className="tk-note-ul-row"><span className="bullet">•</span><span>{block.text ? renderInline(block.text, block.id) : <span className="tk-note-empty">List item</span>}</span></div>;
  }
  if (block.type === 'quote') {
    return <blockquote className="tk-note-bq">{block.text ? renderInline(block.text, block.id) : <span className="tk-note-empty">Quote</span>}</blockquote>;
  }
  return <p className="tk-note-p">{block.text ? renderInline(block.text, block.id) : <span className="tk-note-empty">Type something, or "/" for a block type…</span>}</p>;
}

function ChapterEditor({ course, chapter, onClose, onDeleteChapter, addBlock, updateBlock, removeBlock }) {
  const [editingId, setEditingId] = useState(null);
  const [slash, setSlash] = useState(null); // { blockId, query }
  const editRef = useRef(null);
  const nameRef = useRef(null);
  const blocks = chapter.blocks || [];
  const editingBlock = blocks.find(b => b.id === editingId) || null;
  const editingIsAdmon = editingBlock ? ADMONITION_TYPES.has(editingBlock.type) : false;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !editingId) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, editingId]);

  useEffect(() => {
    if (!editingId) return;
    if (editingIsAdmon && nameRef.current) {
      nameRef.current.focus();
    } else if (!editingIsAdmon && editRef.current) {
      editRef.current.focus();
      const L = editRef.current.value.length;
      editRef.current.setSelectionRange(L, L);
    }
  }, [editingId, editingIsAdmon]);

  useEffect(() => {
    const last = blocks[blocks.length - 1];
    if (last && !last.text && !last.name) setEditingId(last.id);
    // run once when this chapter opens (component remounts per chapter via key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusBlock = (id) => { setSlash(null); setEditingId(id); };

  const commitAndAdvance = (block) => {
    const id = addBlock(block.id, newBlock('p'));
    focusBlock(id);
  };

  const handleBackspaceEmpty = (block) => {
    const idx = blocks.findIndex(b => b.id === block.id);
    if (blocks.length <= 1) return;
    removeBlock(block.id);
    if (idx > 0) focusBlock(blocks[idx - 1].id);
  };

  const handleTextChange = (block, val) => {
    if (block.type === 'p') {
      const h = val.match(/^(#{1,3}) (.*)$/);
      if (h) { updateBlock(block.id, { type: 'h' + h[1].length, text: h[2] }); setSlash(null); return; }
      if (/^[-*] /.test(val)) { updateBlock(block.id, { type: 'ul', text: val.slice(2) }); setSlash(null); return; }
      if (/^>\s/.test(val)) { updateBlock(block.id, { type: 'quote', text: val.replace(/^>\s/, '') }); setSlash(null); return; }
      const sm = val.match(/^\/(\w*)$/);
      if (sm) { setSlash({ blockId: block.id, query: sm[1] }); updateBlock(block.id, { text: val }); return; }
    }
    setSlash(null);
    updateBlock(block.id, { text: val });
  };

  const pickSlash = (block, entry) => {
    updateBlock(block.id, { type: entry.type, text: '', name: '' });
    setSlash(null);
  };

  return (
    <div className="tk-editor-overlay">
      <div className="tk-editor-topbar">
        <button className="tk-mono-btn" onClick={onClose}>← Back</button>
        <div className="tk-editor-course">{course.glyph} · {course.name}</div>
        <button className="tk-x-btn" title="delete chapter" onClick={() => { onDeleteChapter(); onClose(); }}>×</button>
      </div>
      <div className="tk-editor-body" onClick={() => setEditingId(null)}>
        <h2 className="tk-editor-title">{chapter.title}</h2>
        <div className="tk-editor-blocks">
          {blocks.map(block => {
            const isEditing = editingId === block.id;
            const isAdmon = ADMONITION_TYPES.has(block.type);
            const activeSlash = slash && slash.blockId === block.id ? slash : null;
            const matches = activeSlash ? SLASH_TYPES.filter(t => t.cmd.startsWith(activeSlash.query.toLowerCase())) : [];
            return (
              <div key={block.id} className={`tk-block${isEditing ? ' editing' : ''}`}
                onClick={e => { e.stopPropagation(); if (!isEditing) focusBlock(block.id); }}>
                {isEditing ? (
                  isAdmon ? (
                    <div className="tk-block-admon-edit">
                      <div className="tk-block-admon-label">{BLOCK_LABELS[block.type]}</div>
                      <input ref={nameRef} className="tk-block-name-input" placeholder="Name…" value={block.name}
                        onChange={e => updateBlock(block.id, { name: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); editRef.current && editRef.current.focus(); } else if (e.key === 'Escape') setEditingId(null); }} />
                      <textarea ref={editRef} className="tk-block-text-input" placeholder="Statement…" value={block.text}
                        onChange={e => updateBlock(block.id, { text: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Escape') setEditingId(null);
                          else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitAndAdvance(block); }
                          else if (e.key === 'Backspace' && !block.text && !block.name) { e.preventDefault(); handleBackspaceEmpty(block); }
                        }} />
                    </div>
                  ) : (
                    <div className={`tk-block-row${block.type === 'ul' ? ' ul' : ''}${block.type === 'quote' ? ' quote' : ''}`}>
                      {block.type === 'ul' && <span className="bullet">•</span>}
                      <textarea ref={editRef} className={`tk-block-text-input ${block.type}`} placeholder='Type, or "/" for a block type…' value={block.text}
                        onChange={e => handleTextChange(block, e.target.value)}
                        onKeyDown={e => {
                          if (activeSlash) {
                            if (e.key === 'Escape') { setSlash(null); return; }
                            if (e.key === 'Enter' || e.key === 'Tab') {
                              if (matches.length) { e.preventDefault(); pickSlash(block, matches[0]); return; }
                            }
                          }
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitAndAdvance(block); }
                          else if (e.key === 'Escape') { setEditingId(null); setSlash(null); }
                          else if (e.key === 'Backspace' && !block.text) { e.preventDefault(); handleBackspaceEmpty(block); }
                        }} />
                    </div>
                  )
                ) : renderBlockView(block)}
                {activeSlash && (
                  <div className="tk-slash-menu">
                    {matches.length ? matches.map(t => (
                      <button key={t.cmd} className="tk-slash-item" onMouseDown={e => e.preventDefault()} onClick={() => pickSlash(block, t)}>
                        /{t.cmd} <span>{t.label}</span>
                      </button>
                    )) : <div className="tk-slash-empty">no match</div>}
                  </div>
                )}
              </div>
            );
          })}
          <button className="tk-block-add" onClick={e => { e.stopPropagation(); const id = addBlock(blocks.length ? blocks[blocks.length - 1].id : null, newBlock('p')); focusBlock(id); }}>
            + Click to keep writing…
          </button>
        </div>
      </div>
    </div>
  );
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
      if (saved) return normalizeCourses(saved);
    } catch (e) {}
    return normalizeCourses(window.TRACKER_SEED);
  });
  const [view, setView] = useState('dashboard');
  const [calCursor, setCalCursor] = useState({ y: new Date().getFullYear(), m: new Date().getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [quizScope, setQuizScope] = useState(undefined); // undefined = closed, null = all courses
  const [flashScope, setFlashScope] = useState(undefined); // undefined = closed, null = all courses
  const [drafts, setDrafts] = useState({});
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('proofLabTheme') || 'light'; } catch (e) { return 'light'; } });
  const [openChapter, setOpenChapter] = useState(null); // { courseId, chapterId } | null

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
    const id = 'ch' + newId();
    mutate(cid, c => ({ ...c, chapters: [...(c.chapters || []), { id, title, blocks: [newBlock('p')] }] }));
    setOpenChapter({ courseId: cid, chapterId: id });
  };
  const submitAddChapter = (cid) => {
    const title = draft(cid + ':chapterTitle').trim();
    if (!title) return;
    addChapter(cid, title);
    setDraft(cid + ':chapterTitle', '');
  };
  const removeChapter = (cid, id) => {
    mutate(cid, c => ({ ...c, chapters: (c.chapters || []).filter(ch => ch.id !== id) }));
  };
  const addBlock = (cid, chid, afterId, block) => {
    mutate(cid, c => ({
      ...c,
      chapters: (c.chapters || []).map(ch => {
        if (ch.id !== chid) return ch;
        const blocks = ch.blocks || [];
        const idx = afterId ? blocks.findIndex(b => b.id === afterId) : blocks.length - 1;
        const at = idx < 0 ? blocks.length : idx + 1;
        return { ...ch, blocks: [...blocks.slice(0, at), block, ...blocks.slice(at)] };
      }),
    }));
    return block.id;
  };
  const updateBlock = (cid, chid, blockId, patch) => {
    mutate(cid, c => ({
      ...c,
      chapters: (c.chapters || []).map(ch => ch.id !== chid ? ch : { ...ch, blocks: (ch.blocks || []).map(b => b.id === blockId ? { ...b, ...patch } : b) }),
    }));
  };
  const removeBlock = (cid, chid, blockId) => {
    mutate(cid, c => ({
      ...c,
      chapters: (c.chapters || []).map(ch => ch.id !== chid ? ch : { ...ch, blocks: (ch.blocks || []).filter(b => b.id !== blockId) }),
    }));
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
              <SectionLabel sub="click a chapter to write in it — markdown + KaTeX, /definition for a template">Chapters</SectionLabel>
              <div className="tk-chapter-list">
                {(current.chapters || []).map(ch => (
                  <div key={ch.id} className="tk-chapter-row" onClick={() => setOpenChapter({ courseId: current.id, chapterId: ch.id })}>
                    <div className="tk-chapter-row-title">{ch.title}</div>
                    <div className="tk-chapter-row-meta">{(ch.blocks || []).filter(b => b.text || b.name).length} block(s)</div>
                    <button className="tk-x-btn" title="delete chapter" onClick={e => { e.stopPropagation(); removeChapter(current.id, ch.id); }}>×</button>
                  </div>
                ))}
                {!(current.chapters || []).length && <Empty icon="📓">No chapters yet. Add one below.</Empty>}
              </div>
              <div className="tk-form-row">
                <input className="tk-input" placeholder="new chapter title…" value={draft(current.id + ':chapterTitle')}
                  onChange={e => setDraft(current.id + ':chapterTitle', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitAddChapter(current.id)} />
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => submitAddChapter(current.id)}>Add chapter</button>
              </div>
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
      {openChapter && (() => {
        const oc = courses.find(c => c.id === openChapter.courseId);
        const ch = oc && (oc.chapters || []).find(x => x.id === openChapter.chapterId);
        if (!oc || !ch) return null;
        return (
          <ChapterEditor
            key={ch.id}
            course={oc}
            chapter={ch}
            onClose={() => setOpenChapter(null)}
            onDeleteChapter={() => removeChapter(oc.id, ch.id)}
            addBlock={(afterId, block) => addBlock(oc.id, ch.id, afterId, block)}
            updateBlock={(blockId, patch) => updateBlock(oc.id, ch.id, blockId, patch)}
            removeBlock={(blockId) => removeBlock(oc.id, ch.id, blockId)}
          />
        );
      })()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
