'use client';
export function IntervalAnswerGrid({ options, correctShort, selected, onSelect }) {
  return (
    <div className="music-answer-grid">
      {options.map((iv) => {
        const showState = selected != null;
        const isCorrectBtn = iv.short === correctShort;
        const isSelected = selected === iv.short;
        const cls = ['music-answer-btn'];
        if (showState && isCorrectBtn) cls.push('correct');
        if (showState && isSelected && !isCorrectBtn) cls.push('wrong');
        return (
          <button
            key={iv.short}
            type="button"
            className={cls.join(' ')}
            disabled={showState}
            title={iv.label}
            onClick={() => onSelect(iv)}
          >
            {iv.short}
          </button>
        );
      })}
    </div>
  );
}
