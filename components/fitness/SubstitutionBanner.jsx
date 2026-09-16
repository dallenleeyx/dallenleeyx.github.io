'use client';
// components/fitness/SubstitutionBanner.jsx — shown under a logged exercise
// when the selected gym doesn't have any of its usual equipment. Never
// changes the workout program itself (see defaultWorkouts.js/WorkoutLibrary)
// -- this is purely an in-the-moment suggestion for today's session.
import { exerciseFitsGym, suggestSubstitutes } from '../../lib/fitness/gymUtils';
import { MuscleDiagram } from './MuscleDiagram';

export function SubstitutionBanner({ exercise, gym }) {
  if (!gym || exerciseFitsGym(exercise, gym)) return null;

  const substitutes = suggestSubstitutes(exercise, gym);
  const [top, ...rest] = substitutes;

  return (
    <div className="fit-sub-banner">
      <p className="fit-sub-banner-title">Equipment unavailable at this gym.</p>
      {top ? (
        <div className="fit-sub-banner-body">
          <div className="fit-sub-banner-col">
            <span className="fit-sub-banner-label">Recommended substitute</span>
            <span className="fit-sub-banner-item">{top.name}</span>
            <MuscleDiagram primary={top.muscles.primary} secondary={top.muscles.secondary} label={top.name} size={72} />
          </div>
          {rest.length > 0 && (
            <div className="fit-sub-banner-col">
              <span className="fit-sub-banner-label">Other alternatives</span>
              <ul className="fit-sub-banner-alt-list">
                {rest.map((r) => <li key={r.id}>{r.name}</li>)}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="fit-sub-banner-none">No close substitute found in this gym's saved equipment — you may need to skip or adapt this one today.</p>
      )}
    </div>
  );
}
