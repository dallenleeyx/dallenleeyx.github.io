// lib/fitness/programTemplate.js — the fixed weekly workout program: five
// reusable days (Push / Pull / Legs / Upper / Lower + Core) that stay the
// same week after week, per the "fixed program" requirement -- this
// replaces the old A/B/C/D rotation entirely. Each day is a list of
// WorkoutExercise records that only ever reference a canonical exercise by
// id (see exerciseCatalog.js) plus the training prescription (sets/reps/
// rest); no exercise metadata is duplicated here.
import { uid } from './util';

// Rest time wasn't specified for every day in the source program -- only
// Push gave explicit numbers throughout. Where it's not given, this fills
// in a sensible default by movement pattern rather than leaving it blank.
function defaultRestSeconds(movementPattern) {
  return ['push', 'pull', 'squat', 'hinge', 'compound'].includes(movementPattern) ? 90 : 60;
}

function we(exerciseId, sets, minReps, maxReps, restSeconds, notes = '') {
  return { id: uid(), exerciseId, sets, minReps, maxReps, restSeconds, notes };
}

// weRest looks up the exercise's movement pattern to fill in a default rest
// time; used for the four days that didn't specify one explicitly.
function weAuto(exerciseId, sets, minReps, maxReps, movementPattern, notes = '') {
  return we(exerciseId, sets, minReps, maxReps, defaultRestSeconds(movementPattern), notes);
}

export function defaultProgram() {
  return [
    {
      id: 'push',
      name: 'Push',
      focus: ['chest', 'shoulders', 'triceps'],
      exercises: [
        we('barbell-bench-press', 3, 6, 10, 150),
        we('incline-dumbbell-press', 3, 8, 12, 105),
        we('pec-deck-fly', 3, 10, 15, 75),
        we('shoulder-press', 3, 8, 12, 105),
        we('lateral-raise', 3, 12, 15, 75),
        we('triceps-pushdown', 3, 10, 15, 75),
        we('overhead-triceps-extension', 3, 10, 15, 75),
      ],
    },
    {
      id: 'pull',
      name: 'Pull',
      focus: ['back', 'biceps', 'shoulders'],
      exercises: [
        weAuto('lat-pulldown', 3, 8, 12, 'pull'),
        weAuto('seated-cable-row', 3, 8, 12, 'pull'),
        weAuto('chest-supported-row', 3, 8, 12, 'pull'),
        weAuto('reverse-pec-deck', 3, 12, 15, 'isolation'),
        weAuto('biceps-curl', 3, 8, 12, 'isolation'),
        weAuto('hammer-curl', 3, 10, 12, 'isolation'),
        weAuto('reverse-curl', 3, 12, 15, 'isolation'),
      ],
    },
    {
      id: 'legs',
      name: 'Legs',
      focus: ['quads', 'hamstrings', 'glutes', 'calves'],
      exercises: [
        weAuto('hack-squat', 3, 6, 10, 'squat'),
        weAuto('leg-press', 3, 8, 12, 'squat'),
        weAuto('leg-extension', 3, 10, 15, 'isolation'),
        weAuto('seated-leg-curl', 3, 10, 15, 'isolation'),
        weAuto('hip-abduction', 3, 12, 15, 'isolation'),
        weAuto('calf-raise', 3, 10, 15, 'isolation'),
      ],
    },
    {
      id: 'upper',
      name: 'Upper',
      focus: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
      exercises: [
        weAuto('incline-chest-press-machine-ex', 3, 8, 12, 'push'),
        weAuto('lat-pulldown', 3, 8, 12, 'pull', 'or Pull-Up'),
        weAuto('seated-cable-row', 3, 8, 12, 'pull'),
        weAuto('pec-deck-fly', 3, 10, 15, 'isolation'),
        weAuto('lateral-raise', 3, 12, 15, 'isolation'),
        weAuto('biceps-curl', 3, 10, 12, 'isolation'),
        weAuto('triceps-pushdown', 3, 10, 12, 'isolation'),
      ],
    },
    {
      id: 'lower-core',
      name: 'Lower + Core',
      focus: ['hamstrings', 'quads', 'glutes', 'calves', 'core'],
      exercises: [
        weAuto('romanian-deadlift', 3, 6, 10, 'hinge'),
        weAuto('leg-press', 3, 8, 12, 'squat', 'or Hack Squat'),
        weAuto('seated-leg-curl', 3, 10, 15, 'isolation'),
        weAuto('leg-extension', 3, 10, 15, 'isolation'),
        weAuto('calf-raise', 3, 10, 15, 'isolation'),
        weAuto('cable-crunch', 3, 10, 15, 'core', 'or Ab Crunch'),
        weAuto('hanging-leg-raise', 3, 8, 15, 'core'),
        weAuto('plank', 3, null, null, 'core', 'Timed hold, 2-3 sets'),
      ],
    },
  ];
}

// Bumped whenever defaultProgram()'s content changes in a way that should
// replace already-persisted workout days -- see syncMerge.js's migration,
// which only overwrites `program.list` when the persisted programVersion is
// older than this. Logged history is never touched by this.
export const PROGRAM_VERSION = 1;
