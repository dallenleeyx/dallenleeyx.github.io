'use client';
// components/fitness/ExerciseCard.jsx — the shared compact exercise card,
// reused by the workout editor (WorkoutLibrary.jsx) and the logging screen
// (DailyLog.jsx) so both present the same automatic name/GIF/muscles/
// equipment/availability -- the exact fields the workout-architecture
// rework requires never be hand-entered per exercise again. Anything
// specific to *editing* (reorder/replace/remove) or *logging* (set inputs,
// previous performance) is passed in as `children`/`actions` by the caller
// rather than duplicated here.
//
// Media fallback chain (real GIF -> Anatome's GIF -> muscle diagram ->
// text-only card) lives here via onError, so a broken image is never what
// the user sees -- and a single provider being down or missing one
// exercise's asset falls through to the next rather than straight to a
// static diagram. See exerciseMedia.js's header comment for why there are
// two GIF providers.
import { useState } from 'react';
import { exerciseGifSources } from '../../lib/fitness/exerciseMedia';
import { buildMuscleImageUrl } from '../../lib/fitness/muscleDiagram';
import { exerciseFitsGym, primaryEquipmentNames } from '../../lib/fitness/exerciseUtils';

function ExerciseThumb({ exercise, onClick, size = 56 }) {
  const diagram = buildMuscleImageUrl({ primary: exercise.primaryMuscles, secondary: exercise.secondaryMuscles, width: size * 2 });
  // Walks every source in order on each failure; once the list is
  // exhausted `src` is undefined and the text-only fallback below renders
  // instead of an <img> at all, so onError can't loop forever retrying a
  // dead final source.
  const sources = [...exerciseGifSources(exercise), diagram].filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = sources[index];

  if (!src) {
    return (
      <button type="button" className="fit-ex-thumb fit-ex-thumb-text" onClick={onClick} aria-label={`${exercise.canonicalName} details`}>
        {exercise.canonicalName.slice(0, 2).toUpperCase()}
      </button>
    );
  }

  return (
    <button type="button" className="fit-ex-thumb" onClick={onClick} aria-label={`${exercise.canonicalName} details`}>
      <img
        src={src}
        width={size}
        height={size}
        alt=""
        loading="lazy"
        onError={() => setIndex((i) => i + 1)}
      />
    </button>
  );
}

export function ExerciseCard({
  exercise, minReps, maxReps, sets, restSeconds, gym, allExercises, onOpenDetails, actions, children, className = '',
}) {
  if (!exercise) return null;
  const fits = gym ? exerciseFitsGym(exercise, gym) : null;
  const equipmentNames = primaryEquipmentNames(exercise);
  const repRange = minReps && maxReps ? `${minReps}–${maxReps}` : (minReps || maxReps || '');

  return (
    <div className={`fit-ex-card ${className}`}>
      <div className="fit-ex-card-head">
        <ExerciseThumb exercise={exercise} onClick={() => onOpenDetails?.(exercise)} />
        <div className="fit-ex-card-title">
          <button type="button" className="fit-ex-card-name" onClick={() => onOpenDetails?.(exercise)}>
            {exercise.canonicalName}
          </button>
          <div className="fit-ex-card-muscles">
            {exercise.primaryMuscles.map((m) => <span key={m} className="fit-muscle-tag primary">{m}</span>)}
            {exercise.secondaryMuscles.map((m) => <span key={m} className="fit-muscle-tag secondary">{m}</span>)}
          </div>
        </div>
        {actions}
      </div>

      <div className="fit-ex-card-meta">
        {sets != null && <span className="fit-ex-meta-chip">{sets} × {repRange || 'reps'}</span>}
        {restSeconds != null && <span className="fit-ex-meta-chip">rest {restSeconds}s</span>}
        {equipmentNames.length > 0 && (
          <span className="fit-ex-meta-chip fit-ex-equipment-chip-ro">{equipmentNames.join(' + ')}</span>
        )}
        {fits === true && <span className="fit-ex-avail fit-ex-avail-ok">✓ Available</span>}
        {fits === false && <span className="fit-ex-avail fit-ex-avail-warn">⚠ Equipment unavailable</span>}
      </div>

      {children}
    </div>
  );
}

export { ExerciseThumb };
