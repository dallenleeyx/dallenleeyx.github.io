'use client';
// components/music/StaffNotesDrill.jsx — the two directions of the
// sight-reading drill (a shown note -> you name it, or a named note -> you
// place it) share one component since "mixed" mode needs to flip between
// them per question; splitting into two components would just mean this
// same mode-picking logic living in a third wrapper instead.
import { useEffect, useState } from 'react';
import { naturalNotesInStepRange } from '../../lib/music/staffLayout';
import { StaffView } from './StaffView';
import { DrillFeedback } from './DrillFeedback';
import { ScoreBadge } from './ScoreBadge';

// From a couple of ledger lines below middle C to a couple above the
// staff -- enough range to be a real reading workout without burying notes
// under half a dozen ledger lines.
const NOTE_POOL = naturalNotesInStepRange(-4, 12);
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function randomNote() {
  return NOTE_POOL[Math.floor(Math.random() * NOTE_POOL.length)];
}

function sameNote(a, b) {
  return !!a && !!b && a.letter === b.letter && a.octave === b.octave;
}

export function StaffNotesDrill({ mode }) {
  const pickRoundMode = () => (mode === 'mixed' ? (Math.random() < 0.5 ? 'noteToName' : 'nameToNote') : mode);

  // roundMode and target both start unset and are only filled in by the
  // effect below (post-mount, client-only) -- both depend on Math.random()
  // for 'mixed' mode / any note pick, and computing them straight from
  // useState's initializer would make the server and the client's first
  // hydration pass pick different values for the same node, a hydration
  // mismatch (see useDrill.js for the same issue in the other drills).
  const [roundMode, setRoundMode] = useState(mode === 'mixed' ? null : mode);
  const [target, setTarget] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setRoundMode(pickRoundMode());
    setTarget(randomNote());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!roundMode || !target) return null;

  const isCorrect =
    selected != null &&
    (roundMode === 'noteToName' ? selected === target.letter : sameNote(selected, target));

  const submit = (value) => {
    if (selected != null) return;
    setSelected(value);
    const correct = roundMode === 'noteToName' ? value === target.letter : sameNote(value, target);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setRoundMode(pickRoundMode());
    setTarget(randomNote());
    setSelected(null);
  };

  return (
    <div className="music-drill">
      <div className="music-drill-header">
        <p className="music-drill-prompt">
          {roundMode === 'noteToName' ? 'What note is this?' : `Find: ${target.letter}${target.octave}`}
        </p>
        <ScoreBadge score={score} />
      </div>

      {roundMode === 'noteToName' ? (
        <>
          <StaffView notes={[target]} />
          <div className="music-answer-grid music-answer-grid-letters">
            {LETTERS.map((letter) => {
              const showState = selected != null;
              const cls = ['music-answer-btn'];
              if (showState && letter === target.letter) cls.push('correct');
              if (showState && selected === letter && letter !== target.letter) cls.push('wrong');
              return (
                <button key={letter} type="button" className={cls.join(' ')} disabled={showState} onClick={() => submit(letter)}>
                  {letter}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <StaffView
          notes={[]}
          interactive={selected == null}
          onStaffClick={submit}
          markers={
            selected == null
              ? []
              : isCorrect
              ? [{ ...target, variant: 'correct' }]
              : [{ ...target, variant: 'correct' }, { ...selected, variant: 'wrong' }]
          }
        />
      )}

      <DrillFeedback
        selected={selected}
        isCorrect={isCorrect}
        correctLabel={roundMode === 'noteToName' ? target.letter : `${target.letter}${target.octave}`}
        onNext={next}
      />
    </div>
  );
}
