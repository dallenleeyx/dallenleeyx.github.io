'use client';
// components/fitness/ExerciseDetails.jsx — the "Exercise Details" modal:
// everything the compact ExerciseCard deliberately leaves out, so the main
// workout screen stays uncluttered. Larger GIF, concise how-to steps, a
// primary/secondary muscle diagram, movement pattern, every equipment
// option (not just the canonical one), and last/best training history.
import { useState } from 'react';
import { exerciseGifUrl, EXERCISE_MEDIA_ATTRIBUTION } from '../../lib/fitness/exerciseMedia';
import { buildMuscleImageUrl, MUSCLE_DIAGRAM_ATTRIBUTION } from '../../lib/fitness/muscleDiagram';
import { findEquipment } from '../../lib/fitness/equipmentCatalog';
import { findPreviousPerformance, findBestPerformance } from '../../lib/fitness/exerciseUtils';

function GifOrDiagram({ exercise }) {
  const [broken, setBroken] = useState(false);
  const gif = exerciseGifUrl(exercise);
  const diagram = buildMuscleImageUrl({ primary: exercise.primaryMuscles, secondary: exercise.secondaryMuscles, width: 480 });
  const src = !broken && gif ? gif : diagram;
  if (!src) return <div className="fit-ex-details-media fit-ex-details-media-empty">No demo media available</div>;
  return (
    <img
      className="fit-ex-details-media"
      src={src}
      alt={`${exercise.canonicalName} demonstration`}
      onError={() => setBroken(true)}
    />
  );
}

export function ExerciseDetails({ exercise, logs, customExercises, onClose }) {
  if (!exercise) return null;
  const diagram = buildMuscleImageUrl({ primary: exercise.primaryMuscles, secondary: exercise.secondaryMuscles, width: 240 });
  const previous = findPreviousPerformance(exercise.id, logs, { customExercises });
  const best = findBestPerformance(exercise.id, logs, { customExercises });

  return (
    <div className="fit-modal-backdrop" onClick={onClose}>
      <div className="fit-modal fit-ex-details" onClick={(e) => e.stopPropagation()}>
        <div className="fit-modal-head">
          <h3>{exercise.canonicalName}</h3>
          <button type="button" className="fit-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <GifOrDiagram exercise={exercise} />

        <div className="fit-ex-details-row">
          <div className="fit-ex-details-col">
            <h4>Muscles</h4>
            <p><strong>Primary:</strong> {exercise.primaryMuscles.join(', ') || '—'}</p>
            {exercise.secondaryMuscles.length > 0 && <p><strong>Secondary:</strong> {exercise.secondaryMuscles.join(', ')}</p>}
            {diagram && <img className="fit-ex-details-diagram" src={diagram} alt="Muscle diagram" width={140} height={140} loading="lazy" />}
          </div>
          <div className="fit-ex-details-col">
            <h4>Equipment</h4>
            {(exercise.equipmentSlots || []).length === 0 && <p>Bodyweight — no equipment needed</p>}
            {(exercise.equipmentSlots || []).map((slot, i) => (
              <p key={i}>
                {slot.map((id) => findEquipment(id)?.name || id).join(' or ')}
              </p>
            ))}
            {exercise.movementPattern && <p><strong>Movement pattern:</strong> {exercise.movementPattern}</p>}
          </div>
        </div>

        {exercise.instructions?.length > 0 && (
          <div className="fit-ex-details-instructions">
            <h4>How to</h4>
            <ol>
              {exercise.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}

        <div className="fit-ex-details-history">
          <h4>Training history</h4>
          {previous ? (
            <p>Last: {previous.date} — {previous.sets.map((s) => `${s.weight ?? '?'}×${s.reps ?? '?'}`).join(', ')}</p>
          ) : <p>No logged history yet.</p>}
          {best ? <p>Best: {best.weight}kg × {best.reps} ({best.date})</p> : null}
        </div>

        <p className="fit-attribution">{EXERCISE_MEDIA_ATTRIBUTION}. {MUSCLE_DIAGRAM_ATTRIBUTION}.</p>
      </div>
    </div>
  );
}
