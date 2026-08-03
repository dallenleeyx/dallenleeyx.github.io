'use client';
import { useCallback } from 'react';
import { INTERVALS, randomIntervalForStaff } from '../../lib/music/intervals';
import { useDrill } from '../../lib/music/useDrill';
import { StaffView } from './StaffView';
import { IntervalAnswerGrid } from './IntervalAnswerGrid';
import { DrillFeedback } from './DrillFeedback';
import { ScoreBadge } from './ScoreBadge';

export function IntervalsStaffDrill() {
  const generate = useCallback(() => randomIntervalForStaff(), []);
  const { question, selected, score, submit, next } = useDrill(generate);
  if (!question) return null; // first question fills in post-mount, see useDrill.js
  const isCorrect = selected === question.interval.short;

  return (
    <div className="music-drill">
      <div className="music-drill-header">
        <p className="music-drill-prompt">What interval is this?</p>
        <ScoreBadge score={score} />
      </div>
      <StaffView notes={[question.low, question.high]} />
      <IntervalAnswerGrid
        options={INTERVALS}
        correctShort={question.interval.short}
        selected={selected}
        onSelect={(iv) => submit(iv.short, iv.short === question.interval.short)}
      />
      <DrillFeedback selected={selected} isCorrect={isCorrect} correctLabel={question.interval.label} onNext={next} />
    </div>
  );
}
