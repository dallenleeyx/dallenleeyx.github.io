'use client';
// components/math/Flashcards.jsx — cycles through a course's entries one at
// a time. What gets hidden behind the reveal adapts to the entry: if it has
// a proof, the front is the statement and the reveal is the proof (the
// classic "can I prove this" drill); if there's no proof (a plain
// definition/remark), the front is just the name/type and the reveal is
// the statement itself (recall the definition).
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
  const [revealed, setRevealed] = useState(false);

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

  function go(delta) {
    setRevealed(false);
    setIndex((i) => i + delta);
  }
  function reshuffle() {
    setShuffleSeed((s) => s + 1);
    setIndex(0);
    setRevealed(false);
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
          onChange={(e) => { setLectureFilter(e.target.value); setIndex(0); setRevealed(false); }}
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
        <div className="math-fc-card">
          <span className={`math-type-badge math-type-${current.type.toLowerCase()}`}>{current.type}</span>
          {current.lecture != null && <span className="math-fc-lecture">Lecture {current.lecture}</span>}

          {hasProof ? (
            <>
              {current.name && <h4 className="math-fc-name">{current.name}</h4>}
              <LatexText text={current.statement} className="math-fc-statement" />
              <button className="math-ghost-btn math-btn-primary" onClick={() => setRevealed((r) => !r)}>
                {revealed ? 'hide proof' : 'show proof'}
              </button>
              {revealed && <LatexText text={current.proof} className="math-fc-proof" />}
            </>
          ) : (
            <>
              <h4 className="math-fc-name">{current.name || current.type}</h4>
              <button className="math-ghost-btn math-btn-primary" onClick={() => setRevealed((r) => !r)}>
                {revealed ? 'hide' : 'reveal'}
              </button>
              {revealed && <LatexText text={current.statement} className="math-fc-statement" />}
            </>
          )}
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
