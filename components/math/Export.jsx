'use client';
// components/math/Export.jsx — export a lecture range to PDF. Renders a
// print-only sheet (hidden on screen, shown via @media print in math.css)
// with every toggle already unfolded -- a PDF reader can't click "show
// proof" -- then hands off to the browser's own print dialog so "Save as
// PDF" produces a real, selectable-text PDF without a client-side PDF
// library or a server render step.
import { useEffect, useMemo, useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { groupByLecture } from '../../lib/math/groupByLecture';
import { LatexText } from './LatexText';

export function Export({ course }) {
  const { state } = useMath();

  const items = useMemo(
    () => Object.values(state.items).filter((it) => !it.deleted && it.course === course),
    [state.items, course]
  );
  const groups = useMemo(() => groupByLecture(items), [items]);
  const lectureNumbers = useMemo(() => groups.map((g) => g.lecture), [groups]);
  const min = lectureNumbers[0] ?? 1;
  const max = lectureNumbers[lectureNumbers.length - 1] ?? 1;

  const [from, setFrom] = useState(min);
  const [to, setTo] = useState(max);

  // If the course changes (or entries load in), snap the range back to the
  // full set of lectures actually available -- an out-of-range leftover
  // selection would otherwise silently export nothing.
  useEffect(() => {
    setFrom(min);
    setTo(max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, lectureNumbers.length]);

  if (!groups.length) {
    return <p className="math-empty">No entries yet for {course} — nothing to export.</p>;
  }

  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const selectedGroups = groups.filter((g) => g.lecture >= lo && g.lecture <= hi);
  const entryCount = selectedGroups.reduce((n, g) => n + g.items.length, 0);

  function handleExport() {
    const prevTitle = document.title;
    document.title = `${course} — Lecture ${lo}${hi !== lo ? `-${hi}` : ''}`;
    function restore() {
      document.title = prevTitle;
      window.removeEventListener('afterprint', restore);
    }
    window.addEventListener('afterprint', restore);
    window.print();
  }

  return (
    <div className="math-export">
      <div className="math-export-controls">
        <label className="math-export-field">
          From lecture
          <select value={from} onChange={(e) => setFrom(Number(e.target.value))}>
            {lectureNumbers.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="math-export-field">
          To lecture
          <select value={to} onChange={(e) => setTo(Number(e.target.value))}>
            {lectureNumbers.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button
          className="math-ghost-btn math-btn-primary math-export-btn"
          onClick={handleExport}
          disabled={!entryCount}
        >
          Export to PDF
        </button>
      </div>
      <p className="math-export-hint">
        {entryCount
          ? `Exporting ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} across Lecture${lo === hi ? ` ${lo}` : `s ${lo}–${hi}`}.`
          : 'No entries in that range.'}
        {' '}Opens your browser's print dialog — choose "Save as PDF" as the destination. Each lecture is laid out compactly, aiming for about one page; a very long lecture may spill onto a second.
      </p>

      {/* Print-only sheet: unfolds every proof/remark and skips all the
          interactive chrome (badges' hover states, edit/delete buttons,
          reorder controls) since a PDF reader can't click anything. */}
      <div className="math-print-sheet" aria-hidden="true">
        {selectedGroups.map(({ lecture, items: lectureItems }) => (
          <section key={lecture} className="math-print-lecture">
            <h2 className="math-print-lecture-title">{course} — Lecture {lecture}</h2>
            {lectureItems.map((it) => (
              <div key={it.id} className="math-print-item">
                <div className="math-print-item-head">
                  <span className="math-print-badge">{it.type}</span>
                  {it.number && <span className="math-print-number">{it.number}</span>}
                  {it.name && <span className="math-print-name">{it.name}</span>}
                </div>
                <LatexText text={it.statement} className="math-print-statement" course={course} interactive={false} />
                {it.proof?.trim() && (
                  <div className="math-print-proof">
                    <span className="math-print-label">Proof.</span>
                    <LatexText text={it.proof} className="math-print-proof-text" course={course} interactive={false} />
                  </div>
                )}
                {it.remarks?.trim() && (
                  <div className="math-print-remarks">
                    <span className="math-print-label">Remark.</span>
                    <LatexText text={it.remarks} className="math-print-remarks-text" course={course} interactive={false} />
                  </div>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
