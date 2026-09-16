'use client';
// components/fitness/SubstitutionBanner.jsx — shown under a workout exercise
// when the selected gym doesn't have the equipment it needs. Never changes
// the workout program itself (see programTemplate.js/WorkoutLibrary) --
// this is purely an in-the-moment suggestion for today's session at this
// gym. Operates on canonical Exercise records (see exerciseCatalog.js) and
// recommends alternative EXERCISES, not alternative equipment -- see
// exerciseUtils.js's header comment for why substitution moved up a level
// in the workout-architecture rework.
import { exerciseFitsGym, findSubstituteExercises } from '../../lib/fitness/exerciseUtils';
import { MuscleDiagram } from './MuscleDiagram';

export function SubstitutionBanner({ exercise, gym, allExercises }) {
  if (!exercise || !gym || exerciseFitsGym(exercise, gym)) return null;

  const substitutes = findSubstituteExercises(exercise, gym, allExercises || []);
  const [top, ...rest] = substitutes;

  return (
    <div className="fit-sub-banner">
      <p className="fit-sub-banner-title">Equipment unavailable at this gym.</p>
      {top ? (
        <div className="fit-sub-banner-body">
          <div className="fit-sub-banner-col">
            <span className="fit-sub-banner-label">Recommended substitute (today only)</span>
            <span className="fit-sub-banner-item">{top.canonicalName}</span>
            <MuscleDiagram primary={top.primaryMuscles} secondary={top.secondaryMuscles} label={top.canonicalName} size={72} />
          </div>
          {rest.length > 0 && (
            <div className="fit-sub-banner-col">
              <span className="fit-sub-banner-label">Other alternatives</span>
              <ul className="fit-sub-banner-alt-list">
                {rest.map((r) => <li key={r.id}>{r.canonicalName}</li>)}
              </ul>
            </div>
          )}
          <p className="fit-sub-banner-note">Your actual program is unchanged — this is a same-session swap for this gym only.</p>
        </div>
      ) : (
        <p className="fit-sub-banner-none">No close substitute found in this gym's saved equipment — you may need to skip or adapt this one today.</p>
      )}
    </div>
  );
}
