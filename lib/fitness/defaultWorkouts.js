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
//
// `equipmentIds` lists the equipmentCatalog.js ids that would satisfy this
// exercise (an exercise like "Squat or leg press" already covers two
// options); `muscleGroup` is its primary target. Both are optional -- an
// exercise without them (or a custom one you add later) is just never
// flagged for a gym substitution, never blocked. See gymUtils.js for how
// these two fields get used once a gym is selected for the day.
function exercise(id, name, sets, reps, equipmentIds, muscleGroup) {
  return { id, name, sets, reps, equipmentIds: equipmentIds || [], muscleGroup: muscleGroup || null };
}

export function defaultWorkouts() {
  return [
    {
      id: 'workout-a',
      name: 'Workout A — Upper Pull + Chest',
      exercises: [
        exercise('a-lat-pulldown', 'Lat pulldown', 3, '8-12', ['lat-pulldown'], 'back'),
        exercise('a-seated-cable-row', 'Seated cable row', 3, '8-12', ['seated-cable-row'], 'back'),
        exercise('a-bench-press', 'Bench press or chest press', 3, '6-10', ['flat-bench', 'barbells', 'flat-bench-press-machine', 'plate-loaded-chest-press'], 'chest'),
        exercise('a-incline-db-press', 'Incline dumbbell press', 2, '8-12', ['adjustable-dumbbells', 'incline-bench', 'dumbbells'], 'chest'),
        exercise('a-biceps-curls', 'Biceps curls', 2, '10-15', ['dumbbells', 'adjustable-dumbbells', 'ez-curl-bar', 'cable-curl-station', 'biceps-curl-machine'], 'biceps'),
        exercise('a-hammer-curls', 'Hammer curls', 2, '10-15', ['dumbbells', 'adjustable-dumbbells'], 'biceps'),
      ],
    },
    {
      id: 'workout-b',
      name: 'Workout B — Lower + Abs',
      exercises: [
        exercise('b-squat-leg-press', 'Squat or leg press', 3, '6-10', ['squat-rack', 'power-rack', 'barbells', 'leg-press', 'horizontal-leg-press', '45-degree-leg-press'], 'quads'),
        exercise('b-romanian-deadlift', 'Romanian deadlift', 3, '8-10', ['barbells', 'olympic-barbell', 'trap-bar', 'dumbbells'], 'hamstrings'),
        exercise('b-leg-curl', 'Leg curl', 2, '10-15', ['seated-leg-curl', 'lying-leg-curl', 'standing-leg-curl'], 'hamstrings'),
        exercise('b-leg-extension', 'Leg extension', 2, '10-15', ['leg-extension'], 'quads'),
        exercise('b-calf-raises', 'Calf raises', 3, '10-15', ['calf-raise-machine', 'seated-calf-raise', 'standing-calf-raise'], 'calves'),
        exercise('b-cable-crunches', 'Cable crunches', 3, '10-15', ['cable-station', 'cable-crossover', 'adjustable-cable-machine'], 'core'),
      ],
    },
    {
      id: 'workout-c',
      name: 'Workout C — Upper Back + Arms + Chest',
      exercises: [
        exercise('c-pullups-pulldown', 'Pull-ups or pulldown', 3, '8-12', ['pullup-bar', 'assisted-pullup-machine', 'lat-pulldown'], 'back'),
        exercise('c-chest-supported-row', 'Chest-supported row', 3, '8-12', ['chest-supported-row', 't-bar-row', 'iso-lateral-row', 'plate-loaded-row'], 'back'),
        exercise('c-incline-chest-press', 'Incline chest press', 3, '8-12', ['incline-chest-press-machine', 'incline-bench', 'adjustable-dumbbells'], 'chest'),
        exercise('c-shoulder-press', 'Shoulder press', 2, '8-12', ['shoulder-press-machine', 'plate-loaded-shoulder-press', 'dumbbells'], 'shoulders'),
        exercise('c-triceps-pushdown', 'Triceps pushdown', 3, '10-15', ['cable-pushdown-station'], 'triceps'),
        exercise('c-reverse-curls', 'Reverse curls', 2, '10-15', ['ez-curl-bar', 'dumbbells', 'cable-curl-station'], 'biceps'),
        exercise('c-farmer-carries', 'Farmer carries or dead hangs', 2, '2-3 sets', ['dumbbells', 'kettlebells', 'pullup-bar'], 'full-body'),
      ],
    },
    {
      id: 'workout-d',
      name: 'Workout D — Lower + Core',
      exercises: [
        exercise('d-deadlift-rdl', 'Deadlift or RDL', 2, '5-8', ['barbells', 'olympic-barbell', 'trap-bar'], 'hamstrings'),
        exercise('d-bulgarian-split-squat', 'Bulgarian split squat', 3, '8-12', ['dumbbells', 'adjustable-bench', 'flat-bench'], 'quads'),
        exercise('d-leg-press', 'Leg press', 3, '8-12', ['leg-press', 'horizontal-leg-press', '45-degree-leg-press'], 'quads'),
        exercise('d-hamstring-curl', 'Hamstring curl', 2, '10-15', ['seated-leg-curl', 'lying-leg-curl', 'standing-leg-curl'], 'hamstrings'),
        exercise('d-hanging-leg-raises', 'Hanging knee/leg raises', 3, '8-15', ['pullup-bar', 'captains-chair', 'roman-chair'], 'core'),
        exercise('d-plank', 'Plank', 2, '2-3 sets', [], 'core'),
      ],
    },
  ];
}
