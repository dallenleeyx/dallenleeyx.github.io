'use client';
// components/math/Flashcards.jsx — cycles through a course's entries one at
// a time. Tap the card to flip it (same 3D rotateY animation as the
// Japanese vocab flashcards). What's hidden behind the flip adapts to the
// entry: if it has a proof, the front is the statement and the back is the
// proof (the classic "can I prove this" drill); if there's no proof (a
// plain definition/remark), the front is just the name/type and the back is
// the statement itself (recall the definition). Remarks -- your own gloss
// on the entry -- always show on the back, under whichever of those it is.
import { useMemo, useState } from 'react';
import { useMath } from '../../lib/math/MathSyncContext';
import { LatexText } from './LatexText';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcards({ course }) {
  const { state } = useMath();
  const [lectureFilter, setLectureFilter] = useState('all');
  const [shuffleOn, setShuffleOn] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const allItems = useMemo(
    () => Object.values(state.items).filter((it) => !it.deleted && it.course === course),
    [state.items, course]
  );
  const lectureNums = useMemo(
    () => [...new Set(allItems.map((it) => it.lecture))].sort((a, b) => a - b),
    [allItems]
  );
  const filtered = useMemo(() => {
    const base = lectureFilter === 'all' ? allItems : allItems.filter((it) => it.lecture === Number(lectureFilter));
    const sorted = base.slice().sort((a, b) => a.lecture - b.lecture);
    return shuffleOn ? shuffle(sorted) : sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, lectureFilter, shuffleOn, shuffleSeed]);

  const safeIndex = filtered.length ? ((index % filtered.length) + filtered.length) % filtered.length : 0;
  const current = filtered[safeIndex] || null;
  const hasProof = !!current?.proof?.trim();
  const hasRemarks = !!current?.remarks?.trim();

  function go(delta) {
    setFlipped(false);
    setIndex((i) => i + delta);
  }
  function reshuffle() {
    setShuffleSeed((s) => s + 1);
    setIndex(0);
    setFlipped(false);
  }
  function handleFlip(e) {
    if (e.target.closest('.math-ref-chip')) return;
    setFlipped((f) => !f);
  }

  if (!allItems.length) {
    return <p className="math-empty">No entries yet for {course} — add some first.</p>;
  }

  return (
    <div className="math-flashcards">
      <div className="math-fc-controls">
        <select
          className="math-fc-select"
          value={lectureFilter}
          onChange={(e) => { setLectureFilter(e.target.value); setIndex(0); setFlipped(false); }}
        >
          <option value="all">All lectures</option>
          {lectureNums.map((n) => (
            <option key={n} value={n}>Lecture {n}</option>
          ))}
        </select>
        <button
          className={`math-ghost-btn${shuffleOn ? ' active' : ''}`}
          onClick={() => { setShuffleOn((v) => !v); reshuffle(); }}
        >
          🔀 shuffle
        </button>
        {shuffleOn && <button className="math-ghost-btn" onClick={reshuffle}>reshuffle</button>}
        <span className="math-fc-progress">{filtered.length ? safeIndex + 1 : 0} / {filtered.length}</span>
      </div>

      {current ? (
        <div className="math-fc-stage">
          <button
            type="button"
            className={`math-fc-card${flipped ? ' flipped' : ''}`}
            onClick={handleFlip}
            aria-live="polite"
          >
            <div className="math-fc-face math-fc-front">
              <span className={`math-type-badge math-type-${current.type.toLowerCase()}`}>{current.type}</span>
              {current.number && <span className="math-item-number">{current.number}</span>}
              {current.lecture != null && <span className="math-fc-lecture">Lecture {current.lecture}</span>}
              {hasProof ? (
                <>
                  {current.name && <h4 className="math-fc-name">{current.name}</h4>}
                  <LatexText text={current.statement} className="math-fc-statement" course={course} />
                </>
              ) : (
                <h4 className="math-fc-name">{current.name || current.type}</h4>
              )}
            </div>
            <div className="math-fc-face math-fc-back">
              {hasProof ? (
                <LatexText text={current.proof} className="math-fc-proof" course={course} />
              ) : (
                <LatexText text={current.statement} className="math-fc-statement" course={course} />
              )}
              {hasRemarks && (
                <div className="math-fc-remarks">
                  <span className="math-fc-remarks-label">Remarks</span>
                  <LatexText text={current.remarks} className="math-remarks" course={course} />
                </div>
              )}
            </div>
          </button>
          <p className="math-fc-hint">tap the card to flip</p>
        </div>
      ) : (
        <p className="math-empty">No cards for this filter.</p>
      )}

      <div className="math-fc-nav">
        <button className="math-ghost-btn" onClick={() => go(-1)} disabled={!filtered.length}>← prev</button>
        <button className="math-ghost-btn" onClick={() => go(1)} disabled={!filtered.length}>next →</button>
      </div>
    </div>
  );
}
