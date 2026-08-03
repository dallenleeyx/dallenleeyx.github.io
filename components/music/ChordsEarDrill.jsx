'use client';
import { useCallback } from 'react';
import { CHORD_QUALITIES, randomChordForEar } from '../../lib/music/chords';
import { useDrill } from '../../lib/music/useDrill';
import { playChord } from '../../lib/music/audioEngine';
import { ChordAnswerGrid } from './ChordAnswerGrid';
import { DrillFeedback } from './DrillFeedback';
import { ScoreBadge } from './ScoreBadge';

export function ChordsEarDrill() {
  const generate = useCallback(() => randomChordForEar(), []);
  const { question, selected, score, submit, next } = useDrill(generate);
  if (!question) return null; // first question fills in post-mount, see useDrill.js
  const isCorrect = selected === question.quality.id;

  const play = () => playChord(question.midis);

  return (
    <div className="music-drill">
      <div className="music-drill-header">
        <p className="music-drill-prompt">Listen, then identify the chord quality.</p>
        <ScoreBadge score={score} />
      </div>
      <button type="button" className="music-play-btn" onClick={play}>▶ Play chord</button>
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
