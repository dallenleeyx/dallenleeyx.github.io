'use client';
export function ChordAnswerGrid({ options, correctId, selected, onSelect }) {
  return (
    <div className="music-answer-grid music-answer-grid-chords">
      {options.map((q) => {
        const showState = selected != null;
        const isCorrectBtn = q.id === correctId;
        const isSelected = selected === q.id;
        const cls = ['music-answer-btn'];
        if (showState && isCorrectBtn) cls.push('correct');
        if (showState && isSelected && !isCorrectBtn) cls.push('wrong');
        return (
          <button
            key={q.id}
            type="button"
            className={cls.join(' ')}
            disabled={showState}
            onClick={() => onSelect(q)}
          >
            {q.label}
          </button>
        );
      })}
    </div>
  );
}
