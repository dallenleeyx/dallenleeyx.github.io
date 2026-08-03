'use client';
export function DrillFeedback({ selected, isCorrect, correctLabel, onNext }) {
  if (selected == null) return <div className="music-feedback-spacer" />;
  return (
    <div className={`music-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
      <span className="music-feedback-text">
        {isCorrect ? '✓ Correct!' : `✗ Not quite — that was ${correctLabel}.`}
      </span>
      <button type="button" className="music-next-btn" onClick={onNext}>Next →</button>
    </div>
  );
}
