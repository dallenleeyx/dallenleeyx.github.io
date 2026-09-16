'use client';
// components/fitness/MuscleHeatmap.jsx — Level 1 of the two-level muscle
// diagram system (see exerciseUtils.js's aggregateWorkoutMuscles): one
// dual-body diagram for a WHOLE workout day or completed session, showing
// every muscle trained across all its exercises. Level 2 (per-exercise) is
// just ExerciseCard/ExerciseDetails' smaller diagram -- this is the bigger,
// whole-day picture with a qualitative high/moderate/low legend, since a
// single primary/secondary color pair can't show three levels on its own.
import { buildMuscleImageUrl, MUSCLE_DIAGRAM_ATTRIBUTION } from '../../lib/fitness/muscleDiagram';
import { aggregateWorkoutMuscles } from '../../lib/fitness/exerciseUtils';

const LEVEL_LABEL = { high: 'High', moderate: 'Moderate', low: 'Low' };

export function MuscleHeatmap({ exercises, title = 'Muscles trained' }) {
  const { coverage, primary, secondary } = aggregateWorkoutMuscles(exercises || []);
  if (!coverage.length) return null;
  const src = buildMuscleImageUrl({ primary, secondary, width: 320 });

  return (
    <div className="fit-heatmap">
      <span className="fit-heatmap-title">{title}</span>
      <div className="fit-heatmap-body">
        {src && <img className="fit-heatmap-diagram" src={src} alt="Muscles trained" loading="lazy" />}
        <ul className="fit-heatmap-legend">
          {coverage.map(({ muscle, level }) => (
            <li key={muscle} className={`fit-heatmap-legend-item level-${level}`}>
              <span className="fit-heatmap-dot" aria-hidden="true" />
              {muscle} <span className="fit-heatmap-level">{LEVEL_LABEL[level]}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="fit-attribution">{MUSCLE_DIAGRAM_ATTRIBUTION}</p>
    </div>
  );
}
