'use client';
// components/math/Browse.jsx — the compact view: every entry for a course,
// grouped by lecture, collapsible. Proofs stay hidden behind a per-item
// "show proof" toggle so scanning the list stays compact.
import { useMemo, useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { LatexText } from './LatexText';

function groupByLecture(items) {
  const groups = {};
  items.forEach((it) => {
    const key = it.lecture ?? 0;
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  });
  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({ lecture: n, items: groups[n] }));
}

export function Browse({ course, onEdit }) {
  const { state, deleteItem } = useMath();
  const [revealed, setRevealed] = useState({});
  const [remarksRevealed, setRemarksRevealed] = useState({});
  const [collapsed, setCollapsed] = useState({});

  const items = useMemo(
    () => Object.values(state.items).filter((it) => !it.deleted && it.course === course),
    [state.items, course]
  );
  const groups = useMemo(() => groupByLecture(items), [items]);

  if (!items.length) {
    return <p className="math-empty">No entries yet for {course} — add your first theorem or definition.</p>;
  }

  return (
    <div className="math-browse">
      {groups.map(({ lecture, items: lectureItems }) => {
        const isCollapsed = !!collapsed[lecture];
        return (
          <section key={lecture} className="math-lecture-block">
            <button
              className="math-lecture-heading"
              onClick={() => setCollapsed((p) => ({ ...p, [lecture]: !p[lecture] }))}
            >
              <span>{isCollapsed ? '▸' : '▾'} Lecture {lecture}</span>
              <span className="math-lecture-count">{lectureItems.length}</span>
            </button>
            {!isCollapsed && (
              <ul className="math-item-list">
                {lectureItems.map((it) => (
                  <li key={it.id} className="math-item-card">
                    <div className="math-item-head">
                      <span className={`math-type-badge math-type-${it.type.toLowerCase()}`}>{it.type}</span>
                      {it.number && <span className="math-item-number">{it.number}</span>}
                      {it.name && <span className="math-item-name">{it.name}</span>}
                      <span className="math-item-actions">
                        <button className="math-icon-btn" onClick={() => onEdit(it.id)} aria-label="Edit">✎</button>
                        <button className="math-icon-btn" onClick={() => deleteItem(it.id)} aria-label="Delete">✕</button>
                      </span>
                    </div>
                    <LatexText text={it.statement} className="math-statement" course={course} />
                    {it.proof?.trim() && (
                      <div className="math-proof-toggle-wrap">
                        <button
                          className="math-ghost-btn"
                          onClick={() => setRevealed((p) => ({ ...p, [it.id]: !p[it.id] }))}
                        >
                          {revealed[it.id] ? 'hide proof' : 'show proof'}
                        </button>
                        {revealed[it.id] && <LatexText text={it.proof} className="math-proof" course={course} />}
                      </div>
                    )}
                    {it.remarks?.trim() && (
                      <div className="math-remarks-toggle-wrap">
                        <button
                          className="math-ghost-btn math-ghost-btn-remark"
                          onClick={() => setRemarksRevealed((p) => ({ ...p, [it.id]: !p[it.id] }))}
                        >
                          {remarksRevealed[it.id] ? 'hide remarks' : 'show remarks'}
                        </button>
                        {remarksRevealed[it.id] && <LatexText text={it.remarks} className="math-remarks" course={course} />}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
