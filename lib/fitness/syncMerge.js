// lib/fitness/syncMerge.js — pure merge logic shared by the client sync
// provider and the PUT route, same rationale as japanese/syncMerge.js: two
// writers can touch this record independently (the web UI editing the
// program/schedule/log/gyms, and the Apple Shortcut posting Health data
// straight to /api/fitness/health-sync) and both updates must survive a
// merge, not clobber each other.
//
// State shape: { workouts: { updatedAt, list, programVersion },
// customExercises: { updatedAt, list }, gyms: { updatedAt, list },
// schedule: { updatedAt, days }, logs: { [dateISO]: { manual, health } } }.
//
// `workouts` is the fixed weekly program (Push/Pull/Legs/Upper/Lower+Core --
// see programTemplate.js); each day's exercises only ever reference a
// canonical Exercise by id (see exerciseCatalog.js), never duplicate its
// metadata. `customExercises` holds user-created exercises and anything
// auto-migrated from the pre-rework format (see migrateLegacyState below).
// `workouts`, `customExercises`, `gyms` and `schedule` are each a single
// last-write-wins blob -- all are edited rarely, from one place at a time,
// so there's no need to diff/merge them field-by-field.
//
// Each day's `logs` entry keeps `manual` (web UI: weight, actual sets/reps
// logged, cardio, which gym you trained at) and `health` (Shortcut: Apple
// Health workout data) as SEPARATE last-write-wins sub-objects, each
// carrying its own updatedAt -- so a Health sync push can never overwrite a
// manual log edit, or vice versa, even if they land in the same merge.
// Logged history is never touched by the workout-architecture migration
// below, by design -- only the *template* (`workouts.list`) changes shape.
import { defaultProgram, PROGRAM_VERSION } from './programTemplate';
import { EXERCISE_CATALOG } from './exerciseCatalog';

function findCatalogMatch(name) {
  const n = String(name || '').trim().toLowerCase();
  if (!n) return null;
  return EXERCISE_CATALOG.find(
    (e) => e.canonicalName.toLowerCase() === n || (e.aliases || []).some((a) => a.toLowerCase() === n)
  ) || null;
}

// Converts one pre-rework exercise (a bare name + hand-picked
// equipmentIds/muscleGroup) into a custom Exercise catalog record, so a
// customization from the old system isn't silently lost when the workout
// template gets replaced by the fixed program. The id is deterministic
// (derived from the old exercise's own id, not a fresh random one) so
// calling this repeatedly -- e.g. on every poll before the migration has
// been pushed to the server -- never creates duplicates.
function legacyExerciseToCustom(oldEx) {
  return {
    id: `legacy-${oldEx.id}`,
    canonicalName: oldEx.name || 'Custom exercise',
    aliases: [],
    bodyParts: [],
    primaryMuscles: oldEx.muscleGroup ? [oldEx.muscleGroup] : [],
    secondaryMuscles: [],
    movementPattern: null,
    equipmentSlots: (oldEx.equipmentIds || []).length ? [oldEx.equipmentIds] : [],
    instructions: [],
    demoMedia: null,
    apiSource: 'custom',
    apiExerciseId: null,
    custom: true,
  };
}

function dedupeById(list) {
  const seen = new Map();
  list.forEach((item) => seen.set(item.id, item));
  return [...seen.values()];
}

// Runs once per stale (pre-version) workouts blob: preserves any exercise
// that isn't a recognized catalog match as a custom Exercise, then hands
// back the current fixed program to replace the template with. Pure and
// idempotent -- same input always yields the same custom-exercise ids.
function migrateLegacyWorkouts(oldList) {
  const preserved = [];
  (oldList || []).forEach((w) => {
    (w.exercises || []).forEach((oldEx) => {
      if (oldEx.exerciseId) return; // already new-shape, nothing to migrate
      if (findCatalogMatch(oldEx.name)) return; // resolves to a real catalog exercise, no custom needed
      preserved.push(legacyExerciseToCustom(oldEx));
    });
  });
  return { list: defaultProgram(), customExercises: preserved };
}

export function normalizeFitnessState(state) {
  const s = state && typeof state === 'object' ? state : {};

  const hasPersistedWorkouts = s.workouts && typeof s.workouts === 'object' && Array.isArray(s.workouts.list);
  const isCurrentVersion = hasPersistedWorkouts && (s.workouts.programVersion || 0) >= PROGRAM_VERSION;

  let workouts;
  let migratedCustom = [];
  if (isCurrentVersion) {
    workouts = { updatedAt: s.workouts.updatedAt || 0, list: s.workouts.list, programVersion: s.workouts.programVersion };
  } else if (hasPersistedWorkouts) {
    const { list, customExercises } = migrateLegacyWorkouts(s.workouts.list);
    migratedCustom = customExercises;
    workouts = { updatedAt: Date.now(), list, programVersion: PROGRAM_VERSION };
  } else {
    workouts = { updatedAt: 0, list: defaultProgram(), programVersion: PROGRAM_VERSION };
  }

  const existingCustom = s.customExercises && Array.isArray(s.customExercises.list) ? s.customExercises.list : [];
  const customExercises = {
    updatedAt: migratedCustom.length ? Date.now() : (s.customExercises?.updatedAt || 0),
    list: dedupeById([...existingCustom, ...migratedCustom]),
  };

  const gyms = s.gyms && typeof s.gyms === 'object' && Array.isArray(s.gyms.list)
    ? { updatedAt: s.gyms.updatedAt || 0, list: s.gyms.list }
    : { updatedAt: 0, list: [] };
  const schedule = s.schedule && typeof s.schedule === 'object' && s.schedule.days
    ? { updatedAt: s.schedule.updatedAt || 0, days: s.schedule.days }
    : { updatedAt: 0, days: {} };
  const logs = s.logs && typeof s.logs === 'object' ? s.logs : {};
  return { workouts, customExercises, gyms, schedule, logs };
}

function pickNewer(a, b) {
  if (!a) return b || undefined;
  if (!b) return a;
  return (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
}

export function mergeFitnessState(a, b) {
  const na = normalizeFitnessState(a);
  const nb = normalizeFitnessState(b);

  const workouts = (nb.workouts.updatedAt || 0) > (na.workouts.updatedAt || 0) ? nb.workouts : na.workouts;
  const gyms = (nb.gyms.updatedAt || 0) > (na.gyms.updatedAt || 0) ? nb.gyms : na.gyms;
  const schedule = (nb.schedule.updatedAt || 0) > (na.schedule.updatedAt || 0) ? nb.schedule : na.schedule;

  // customExercises merges its list by union+dedupe rather than picking one
  // side wholesale -- both sides may have independently migrated/added
  // different custom exercises since the last sync.
  const customExercises = {
    updatedAt: Math.max(na.customExercises.updatedAt || 0, nb.customExercises.updatedAt || 0),
    list: dedupeById([...na.customExercises.list, ...nb.customExercises.list]),
  };

  const logs = {};
  for (const date of new Set([...Object.keys(na.logs), ...Object.keys(nb.logs)])) {
    const la = na.logs[date] || {};
    const lb = nb.logs[date] || {};
    const manual = pickNewer(la.manual, lb.manual);
    const health = pickNewer(la.health, lb.health);
    if (manual || health) {
      logs[date] = {};
      if (manual) logs[date].manual = manual;
      if (health) logs[date].health = health;
    }
  }

  return { workouts, customExercises, gyms, schedule, logs };
}

// Deterministic stringify (sorted keys) so two equivalent states compare
// equal regardless of key insertion order -- used to decide whether a
// client-side merge actually changed anything and needs pushing back.
export function stableStringify(value) {
  return JSON.stringify(value, (key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val).sort().reduce((acc, k) => { acc[k] = val[k]; return acc; }, {});
    }
    return val;
  });
}
