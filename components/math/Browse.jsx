'use client';
// components/math/Browse.jsx — the compact view: every entry for a course,
// grouped first by section (user-defined via SectionManager, in their
// order) and then by lecture within each section, collapsible. Proofs and
// remarks stay hidden behind per-item toggles so scanning the list stays
// compact. A TableOfContents sidebar links to each section heading.
import { useMemo, useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { groupItemsBySection } from '../../lib/math/sections';
import { LatexText } from './LatexText';
import { SectionManager } from './SectionManager';
import { TableOfContents } from './TableOfContents';

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

function ItemCard({ it, course, onEdit }) {
  const { deleteItem } = useMath();
  const [proofShown, setProofShown] = useState(false);
  const [remarksShown, setRemarksShown] = useState(false);

  return (
    <li className="math-item-card">
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
          <button className="math-ghost-btn" onClick={() => setProofShown((v) => !v)}>
            {proofShown ? 'hide proof' : 'show proof'}
          </button>
          {proofShown && <LatexText text={it.proof} className="math-proof" course={course} />}
        </div>
      )}
      {it.remarks?.trim() && (
        <div className="math-remarks-toggle-wrap">
          <button className="math-ghost-btn math-ghost-btn-remark" onClick={() => setRemarksShown((v) => !v)}>
            {remarksShown ? 'hide remarks' : 'show remarks'}
          </button>
          {remarksShown && <LatexText text={it.remarks} className="math-remarks" course={course} />}
        </div>
      )}
    </li>
  );
}

function LectureBlock({ lecture, items, course, onEdit }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className="math-lecture-block">
      <button className="math-lecture-heading" onClick={() => setCollapsed((v) => !v)}>
        <span>{collapsed ? '▸' : '▾'} Lecture {lecture}</span>
        <span className="math-lecture-count">{items.length}</span>
      </button>
      {!collapsed && (
        <ul className="math-item-list">
          {items.map((it) => (
            <ItemCard key={it.id} it={it} course={course} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </section>
  );
}

export function Browse({ course, onEdit }) {
  const { state } = useMath();

  const items = useMemo(
    () => Object.values(state.items).filter((it) => !it.deleted && it.course === course),
    [state.items, course]
  );
  const sectionList = state.sections[course]?.list || [];
  const sectionGroups = useMemo(() => groupItemsBySection(items, sectionList), [items, sectionList]);

  return (
    <div className="math-browse-layout">
      <div className="math-browse-content">
        <SectionManager course={course} />
        {!sectionGroups.length && (
          <p className="math-empty">No entries yet for {course} — add your first theorem or definition.</p>
        )}
        <div className="math-browse">
          {sectionGroups.map((sg) => (
            <section key={sg.anchor} id={sg.anchor} className="math-section-block">
              <h3 className="math-section-heading">{sg.name || 'Unsectioned'}</h3>
              {sg.items.length ? (
                groupByLecture(sg.items).map(({ lecture, items: lectureItems }) => (
                  <LectureBlock key={lecture} lecture={lecture} items={lectureItems} course={course} onEdit={onEdit} />
                ))
              ) : (
                <p className="math-empty math-section-empty">No entries yet in this section.</p>
              )}
            </section>
          ))}
        </div>
      </div>
      <TableOfContents groups={sectionGroups} />
    </div>
  );
}
