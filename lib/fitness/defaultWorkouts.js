// lib/fitness/defaultWorkouts.js — the starter workout library: a 4-workout
// rotation (A/B/C/D) instead of a fixed Monday-Sunday split, since the
// rotation runs by "whichever workout comes next", not by weekday. Fully
// editable from the Workouts tab -- this is just a reasonable seed.
//
// IDs here are fixed strings, not uid(): normalizeFitnessState() calls
// defaultWorkouts() fresh any time a state blob has no persisted `workouts`
// field (e.g. the very first load, or any read before the first explicit
// edit). If the IDs were random, every one of those calls would mint a new
// set of workout/exercise IDs, silently orphaning any log entry that
// references a previously-seeded workout by id.
function exercise(id, name, sets, reps) {
  return { id, name, sets, reps };
}

export function defaultWorkouts() {
  return [
    {
      id: 'workout-a',
      name: 'Workout A — Upper Pull + Chest',
      exercises: [
        exercise('a-lat-pulldown', 'Lat pulldown', 3, '8-12'),
        exercise('a-seated-cable-row', 'Seated cable row', 3, '8-12'),
        exercise('a-bench-press', 'Bench press or chest press', 3, '6-10'),
        exercise('a-incline-db-press', 'Incline dumbbell press', 2, '8-12'),
        exercise('a-biceps-curls', 'Biceps curls', 2, '10-15'),
        exercise('a-hammer-curls', 'Hammer curls', 2, '10-15'),
      ],
    },
    {
      id: 'workout-b',
      name: 'Workout B — Lower + Abs',
      exercises: [
        exercise('b-squat-leg-press', 'Squat or leg press', 3, '6-10'),
        exercise('b-romanian-deadlift', 'Romanian deadlift', 3, '8-10'),
        exercise('b-leg-curl', 'Leg curl', 2, '10-15'),
        exercise('b-leg-extension', 'Leg extension', 2, '10-15'),
        exercise('b-calf-raises', 'Calf raises', 3, '10-15'),
        exercise('b-cable-crunches', 'Cable crunches', 3, '10-15'),
      ],
    },
    {
      id: 'workout-c',
      name: 'Workout C — Upper Back + Arms + Chest',
      exercises: [
        exercise('c-pullups-pulldown', 'Pull-ups or pulldown', 3, '8-12'),
        exercise('c-chest-supported-row', 'Chest-supported row', 3, '8-12'),
        exercise('c-incline-chest-press', 'Incline chest press', 3, '8-12'),
        exercise('c-shoulder-press', 'Shoulder press', 2, '8-12'),
        exercise('c-triceps-pushdown', 'Triceps pushdown', 3, '10-15'),
        exercise('c-reverse-curls', 'Reverse curls', 2, '10-15'),
        exercise('c-farmer-carries', 'Farmer carries or dead hangs', 2, '2-3 sets'),
      ],
    },
    {
      id: 'workout-d',
      name: 'Workout D — Lower + Core',
      exercises: [
        exercise('d-deadlift-rdl', 'Deadlift or RDL', 2, '5-8'),
        exercise('d-bulgarian-split-squat', 'Bulgarian split squat', 3, '8-12'),
        exercise('d-leg-press', 'Leg press', 3, '8-12'),
        exercise('d-hamstring-curl', 'Hamstring curl', 2, '10-15'),
        exercise('d-hanging-leg-raises', 'Hanging knee/leg raises', 3, '8-15'),
        exercise('d-plank', 'Plank', 2, '2-3 sets'),
      ],
    },
  ];
}
