// lib/fitness/equipmentCatalog.js — the built-in equipment catalog: ~100
// common gym machines/tools across 11 categories, each tagged with enough
// structured metadata (muscles, mechanical type, movement pattern) to power
// search/filtering in EquipmentPicker.jsx and the substitution scoring in
// gymUtils.js. A gym's inventory references these by id; gyms can also add
// fully custom equipment that isn't in this list (see GymEquipment.jsx),
// which is why this is a *seed* catalog rather than the only source of truth.
//
// The muscle/type/movement tags are a reasonable-use approximation, not
// exercise-science gospel -- they only need to be good enough to rank
// substitutes sensibly (e.g. "what else trains quads with a squat pattern").
export const CATEGORIES = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'triceps', label: 'Triceps' },
  { id: 'legs', label: 'Legs' },
  { id: 'core', label: 'Core' },
  { id: 'free-weights', label: 'Free Weights' },
  { id: 'functional', label: 'Functional' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'bodyweight', label: 'Bodyweight / Calisthenics' },
];

export const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quads', 'hamstrings',
  'glutes', 'calves', 'adductors', 'core', 'lower-back', 'full-body', 'cardio',
];

export const EQUIPMENT_TYPES = [
  { id: 'machine', label: 'Machine' },
  { id: 'free-weight', label: 'Free weights' },
  { id: 'cable', label: 'Cable' },
  { id: 'plate-loaded', label: 'Plate-loaded' },
  { id: 'selectorized', label: 'Selectorized' },
  { id: 'bodyweight', label: 'Bodyweight' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'functional', label: 'Functional training' },
];

export const MOVEMENTS = ['push', 'pull', 'squat', 'hinge', 'isolation', 'compound', 'core', 'cardio'];

function eq(id, name, categories, primary, secondary, types, movement) {
  return {
    id,
    name,
    categories: Array.isArray(categories) ? categories : [categories],
    muscles: { primary, secondary: secondary || [] },
    types,
    movement,
  };
}

export const EQUIPMENT_CATALOG = [
  // ---------- Chest ----------
  eq('flat-bench-press-machine', 'Flat bench press machine', 'chest', ['chest'], ['triceps', 'shoulders'], ['machine', 'selectorized'], 'push'),
  eq('incline-chest-press-machine', 'Incline chest press machine', 'chest', ['chest'], ['shoulders', 'triceps'], ['machine', 'selectorized'], 'push'),
  eq('decline-chest-press-machine', 'Decline chest press machine', 'chest', ['chest'], ['triceps'], ['machine', 'selectorized'], 'push'),
  eq('plate-loaded-chest-press', 'Plate-loaded chest press', 'chest', ['chest'], ['shoulders', 'triceps'], ['machine', 'plate-loaded'], 'push'),
  eq('horizontal-chest-press', 'Horizontal chest press', 'chest', ['chest'], ['triceps', 'shoulders'], ['machine', 'selectorized'], 'push'),
  eq('pec-deck', 'Pec deck', 'chest', ['chest'], ['shoulders'], ['machine', 'selectorized'], 'isolation'),
  eq('chest-fly-machine', 'Chest fly machine', 'chest', ['chest'], ['shoulders'], ['machine', 'selectorized'], 'isolation'),
  eq('cable-crossover', 'Cable crossover', ['chest', 'functional'], ['chest'], ['shoulders', 'triceps'], ['cable'], 'isolation'),
  eq('smith-machine', 'Smith machine', ['chest', 'legs'], ['chest', 'quads'], ['triceps', 'shoulders', 'glutes'], ['machine'], 'compound'),
  eq('adjustable-cable-machine', 'Adjustable cable machine', ['chest', 'functional'], ['chest', 'back', 'shoulders'], ['biceps', 'triceps'], ['cable'], 'compound'),

  // ---------- Back ----------
  eq('lat-pulldown', 'Lat pulldown', 'back', ['back'], ['biceps'], ['machine', 'cable', 'selectorized'], 'pull'),
  eq('assisted-pullup-machine', 'Assisted pull-up machine', ['back', 'bodyweight'], ['back'], ['biceps'], ['machine', 'bodyweight'], 'pull'),
  eq('seated-cable-row', 'Seated cable row', 'back', ['back'], ['biceps'], ['cable'], 'pull'),
  eq('chest-supported-row', 'Chest-supported row', 'back', ['back'], ['biceps', 'shoulders'], ['machine', 'plate-loaded'], 'pull'),
  eq('high-row', 'High row', 'back', ['back'], ['biceps'], ['machine', 'selectorized'], 'pull'),
  eq('low-row', 'Low row', 'back', ['back'], ['biceps'], ['machine', 'selectorized', 'cable'], 'pull'),
  eq('iso-lateral-row', 'Iso-lateral row', 'back', ['back'], ['biceps'], ['machine', 'plate-loaded'], 'pull'),
  eq('plate-loaded-row', 'Plate-loaded row', 'back', ['back'], ['biceps'], ['machine', 'plate-loaded'], 'pull'),
  eq('t-bar-row', 'T-bar row', 'back', ['back'], ['biceps'], ['free-weight', 'plate-loaded'], 'pull'),
  eq('pullover-machine', 'Pullover machine', 'back', ['back'], ['chest'], ['machine', 'selectorized'], 'pull'),

  // ---------- Shoulders ----------
  eq('shoulder-press-machine', 'Shoulder press machine', 'shoulders', ['shoulders'], ['triceps'], ['machine', 'selectorized'], 'push'),
  eq('plate-loaded-shoulder-press', 'Plate-loaded shoulder press', 'shoulders', ['shoulders'], ['triceps'], ['machine', 'plate-loaded'], 'push'),
  eq('lateral-raise-machine', 'Lateral raise machine', 'shoulders', ['shoulders'], [], ['machine', 'selectorized'], 'isolation'),
  eq('rear-delt-fly', 'Rear delt fly', 'shoulders', ['shoulders'], ['back'], ['machine', 'selectorized'], 'isolation'),
  eq('reverse-pec-deck', 'Reverse pec deck', 'shoulders', ['shoulders'], ['back'], ['machine', 'selectorized'], 'isolation'),
  eq('cable-lateral-raise-station', 'Cable lateral raise station', 'shoulders', ['shoulders'], [], ['cable'], 'isolation'),

  // ---------- Biceps ----------
  eq('preacher-curl-machine', 'Preacher curl machine', 'biceps', ['biceps'], [], ['machine', 'selectorized'], 'isolation'),
  eq('biceps-curl-machine', 'Biceps curl machine', 'biceps', ['biceps'], [], ['machine', 'selectorized'], 'isolation'),
  eq('cable-curl-station', 'Cable curl station', 'biceps', ['biceps'], [], ['cable'], 'isolation'),
  eq('preacher-curl-bench', 'Preacher curl bench', ['biceps', 'free-weights'], ['biceps'], [], ['free-weight'], 'isolation'),

  // ---------- Triceps ----------
  eq('triceps-extension-machine', 'Triceps extension machine', 'triceps', ['triceps'], [], ['machine', 'selectorized'], 'isolation'),
  eq('cable-pushdown-station', 'Cable pushdown station', 'triceps', ['triceps'], [], ['cable'], 'isolation'),
  eq('assisted-dip-machine', 'Assisted dip machine', 'triceps', ['triceps'], ['chest', 'shoulders'], ['machine'], 'push'),
  eq('dip-station', 'Dip station', ['triceps', 'bodyweight'], ['triceps'], ['chest', 'shoulders'], ['bodyweight'], 'push'),

  // ---------- Legs ----------
  eq('leg-press', 'Leg press', 'legs', ['quads'], ['glutes', 'hamstrings'], ['machine', 'plate-loaded', 'selectorized'], 'squat'),
  eq('horizontal-leg-press', 'Horizontal leg press', 'legs', ['quads'], ['glutes', 'hamstrings'], ['machine', 'plate-loaded'], 'squat'),
  eq('45-degree-leg-press', '45-degree leg press', 'legs', ['quads'], ['glutes', 'hamstrings'], ['machine', 'plate-loaded'], 'squat'),
  eq('hack-squat', 'Hack squat', 'legs', ['quads'], ['glutes'], ['machine', 'plate-loaded'], 'squat'),
  eq('pendulum-squat', 'Pendulum squat', 'legs', ['quads'], ['glutes'], ['machine', 'plate-loaded'], 'squat'),
  eq('belt-squat', 'Belt squat', 'legs', ['quads', 'glutes'], [], ['machine'], 'squat'),
  eq('v-squat', 'V-squat', 'legs', ['quads'], ['glutes'], ['machine', 'plate-loaded'], 'squat'),
  eq('leg-extension', 'Leg extension', 'legs', ['quads'], [], ['machine', 'selectorized'], 'isolation'),
  eq('seated-leg-curl', 'Seated leg curl', 'legs', ['hamstrings'], [], ['machine', 'selectorized'], 'isolation'),
  eq('lying-leg-curl', 'Lying leg curl', 'legs', ['hamstrings'], [], ['machine', 'selectorized'], 'isolation'),
  eq('standing-leg-curl', 'Standing leg curl', 'legs', ['hamstrings'], [], ['machine', 'selectorized'], 'isolation'),
  eq('hip-abduction', 'Hip abduction', 'legs', ['glutes'], [], ['machine', 'selectorized'], 'isolation'),
  eq('hip-adduction', 'Hip adduction', 'legs', ['adductors'], [], ['machine', 'selectorized'], 'isolation'),
  eq('glute-kickback-machine', 'Glute kickback machine', 'legs', ['glutes'], [], ['machine', 'selectorized'], 'isolation'),
  eq('hip-thrust-machine', 'Hip thrust machine', 'legs', ['glutes'], ['hamstrings'], ['machine', 'plate-loaded'], 'hinge'),
  eq('glute-drive-machine', 'Glute drive machine', 'legs', ['glutes'], ['hamstrings'], ['machine', 'plate-loaded'], 'hinge'),
  eq('calf-raise-machine', 'Calf raise machine', 'legs', ['calves'], [], ['machine', 'selectorized'], 'isolation'),
  eq('seated-calf-raise', 'Seated calf raise', 'legs', ['calves'], [], ['machine', 'selectorized'], 'isolation'),
  eq('standing-calf-raise', 'Standing calf raise', 'legs', ['calves'], [], ['machine', 'selectorized', 'plate-loaded'], 'isolation'),

  // ---------- Core ----------
  eq('ab-crunch-machine', 'Ab crunch machine', 'core', ['core'], [], ['machine', 'selectorized'], 'core'),
  eq('rotary-torso-machine', 'Rotary torso machine', 'core', ['core'], [], ['machine', 'selectorized'], 'core'),
  eq('cable-station', 'Cable station', ['core', 'functional'], ['core'], [], ['cable'], 'core'),
  eq('roman-chair', 'Roman chair', 'core', ['core'], ['glutes', 'hamstrings'], ['bodyweight', 'machine'], 'core'),
  eq('captains-chair', "Captain's chair", ['core', 'bodyweight'], ['core'], [], ['bodyweight'], 'core'),
  eq('ab-bench', 'Ab bench', 'core', ['core'], [], ['free-weight', 'bodyweight'], 'core'),
  eq('decline-situp-bench', 'Decline sit-up bench', 'core', ['core'], [], ['free-weight', 'bodyweight'], 'core'),

  // ---------- Free weights ----------
  eq('dumbbells', 'Dumbbells', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('adjustable-dumbbells', 'Adjustable dumbbells', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('barbells', 'Barbells', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('olympic-barbell', 'Olympic barbell', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('ez-curl-bar', 'EZ curl bar', 'free-weights', ['biceps', 'triceps'], [], ['free-weight'], 'isolation'),
  eq('trap-bar', 'Trap bar', 'free-weights', ['quads', 'glutes', 'back'], ['hamstrings'], ['free-weight'], 'hinge'),
  eq('fixed-barbells', 'Fixed barbells', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('weight-plates', 'Weight plates', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('power-rack', 'Power rack', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('squat-rack', 'Squat rack', 'free-weights', ['quads', 'glutes'], [], ['free-weight'], 'squat'),
  eq('half-rack', 'Half rack', 'free-weights', ['full-body'], [], ['free-weight'], 'compound'),
  eq('flat-bench', 'Flat bench', 'free-weights', ['chest'], ['triceps', 'shoulders'], ['free-weight'], 'push'),
  eq('adjustable-bench', 'Adjustable bench', 'free-weights', ['chest', 'shoulders'], [], ['free-weight'], 'push'),
  eq('incline-bench', 'Incline bench', 'free-weights', ['chest', 'shoulders'], [], ['free-weight'], 'push'),

  // ---------- Functional ----------
  eq('dual-adjustable-pulley', 'Dual adjustable pulley', 'functional', ['full-body'], [], ['cable', 'functional'], 'compound'),
  eq('functional-trainer', 'Functional trainer', 'functional', ['full-body'], [], ['cable', 'functional'], 'compound'),
  eq('kettlebells', 'Kettlebells', 'functional', ['full-body'], [], ['free-weight', 'functional'], 'compound'),
  eq('medicine-balls', 'Medicine balls', 'functional', ['core', 'full-body'], [], ['free-weight', 'functional'], 'compound'),
  eq('resistance-bands', 'Resistance bands', 'functional', ['full-body'], [], ['functional', 'bodyweight'], 'compound'),
  eq('battle-ropes', 'Battle ropes', 'functional', ['shoulders', 'core'], [], ['functional', 'cardio'], 'compound'),
  eq('trx-suspension-trainer', 'TRX / suspension trainer', 'functional', ['full-body'], [], ['functional', 'bodyweight'], 'compound'),
  eq('plyometric-boxes', 'Plyometric boxes', 'functional', ['quads', 'glutes'], [], ['functional'], 'compound'),
  eq('sled', 'Sled', 'functional', ['quads', 'full-body'], [], ['functional'], 'compound'),
  eq('landmine-attachment', 'Landmine attachment', 'functional', ['full-body'], [], ['functional', 'free-weight'], 'compound'),

  // ---------- Cardio ----------
  eq('treadmill', 'Treadmill', 'cardio', ['cardio'], [], ['cardio'], 'cardio'),
  eq('incline-treadmill', 'Incline treadmill', 'cardio', ['cardio'], ['glutes'], ['cardio'], 'cardio'),
  eq('stair-climber', 'Stair climber', 'cardio', ['cardio', 'quads'], ['glutes'], ['cardio'], 'cardio'),
  eq('stairmaster', 'StairMaster', 'cardio', ['cardio', 'quads'], ['glutes'], ['cardio'], 'cardio'),
  eq('elliptical', 'Elliptical', 'cardio', ['cardio'], [], ['cardio'], 'cardio'),
  eq('upright-bike', 'Upright bike', 'cardio', ['cardio', 'quads'], [], ['cardio'], 'cardio'),
  eq('recumbent-bike', 'Recumbent bike', 'cardio', ['cardio', 'quads'], [], ['cardio'], 'cardio'),
  eq('spin-bike', 'Spin bike', 'cardio', ['cardio', 'quads'], [], ['cardio'], 'cardio'),
  eq('rowing-machine', 'Rowing machine', 'cardio', ['cardio', 'back'], ['biceps'], ['cardio'], 'cardio'),
  eq('ski-erg', 'Ski erg', 'cardio', ['cardio', 'shoulders'], ['back'], ['cardio'], 'cardio'),
  eq('assault-bike', 'Assault bike', 'cardio', ['cardio'], ['full-body'], ['cardio'], 'cardio'),
  eq('air-bike', 'Air bike', 'cardio', ['cardio'], ['full-body'], ['cardio'], 'cardio'),

  // ---------- Bodyweight / calisthenics ----------
  eq('pullup-bar', 'Pull-up bar', ['bodyweight', 'back'], ['back'], ['biceps'], ['bodyweight'], 'pull'),
  eq('assisted-pullup-dip', 'Assisted pull-up/dip', 'bodyweight', ['back', 'triceps'], [], ['machine', 'bodyweight'], 'compound'),
  eq('parallel-bars', 'Parallel bars', 'bodyweight', ['triceps', 'chest'], [], ['bodyweight'], 'push'),
];

export function findEquipment(id) {
  return EQUIPMENT_CATALOG.find((e) => e.id === id) || null;
}
