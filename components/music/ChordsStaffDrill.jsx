'use client';
import { useCallback } from 'react';
import { CHORD_QUALITIES, randomChordForStaff } from '../../lib/music/chords';
import { useDrill } from '../../lib/music/useDrill';
import { StaffView } from './StaffView';
import { ChordAnswerGrid } from './ChordAnswerGrid';
import { DrillFeedback } from './DrillFeedback';
import { ScoreBadge } from './ScoreBadge';

export function ChordsStaffDrill() {
  const generate = useCallback(() => randomChordForStaff(), []);
  const { question, selected, score, submit, next } = useDrill(generate);
  if (!question) return null; // first question fills in post-mount, see useDrill.js
  const isCorrect = selected === question.quality.id;

  return (
    <div className="music-drill">
      <div className="music-drill-header">
        <p className="music-drill-prompt">What chord quality is this?</p>
        <ScoreBadge score={score} />
      </div>
      <StaffView notes={[question.root, question.third, question.fifth]} />
      <ChordAnswerGrid
        options={CHORD_QUALITIES}
        correctId={question.quality.id}
        selected={selected}
        onSelect={(q) => submit(q.id, q.id === question.quality.id)}
      />
      <DrillFeedback selected={selected} isCorrect={isCorrect} correctLabel={question.quality.label} onNext={next} />
    </div>
  );
}
