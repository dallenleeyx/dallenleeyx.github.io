'use client';
import { useCallback } from 'react';
import { INTERVALS, randomIntervalForEar } from '../../lib/music/intervals';
import { useDrill } from '../../lib/music/useDrill';
import { playSequence } from '../../lib/music/audioEngine';
import { IntervalAnswerGrid } from './IntervalAnswerGrid';
import { DrillFeedback } from './DrillFeedback';
import { ScoreBadge } from './ScoreBadge';

export function IntervalsEarDrill() {
  const generate = useCallback(() => randomIntervalForEar(), []);
  const { question, selected, score, submit, next } = useDrill(generate);
  if (!question) return null; // first question fills in post-mount, see useDrill.js
  const isCorrect = selected === question.interval.short;

  // Playback only ever starts from a click (never on question load) --
  // browsers block audio that isn't triggered by a user gesture, and a
  // silent first note would just look broken rather than muted.
  const play = () => playSequence([question.lowMidi, question.highMidi]);

  return (
    <div className="music-drill">
      <div className="music-drill-header">
        <p className="music-drill-prompt">Listen, then identify the interval.</p>
        <ScoreBadge score={score} />
      </div>
      <button type="button" className="music-play-btn" onClick={play}>▶ Play interval</button>
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
