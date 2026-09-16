// lib/fitness/equipmentMedia.js — demo media for the EQUIPMENT catalog
// (lib/fitness/equipmentCatalog.js), so the "Add Equipment" picker can show
// what a machine actually looks like before adding it, not just its name.
//
// Same provider as exerciseMedia.js (ExerciseGymGifsDB) and same honesty
// about it: these are real animated GIFs of someone using a similar
// machine, hand-matched by id, not literal product photos of every gym's
// exact model -- close enough to recognize "oh, that one" at a glance,
// which is the actual goal here. Equipment ids without a good match in
// that dataset (e.g. niche/modern machines like a belt squat or glute
// drive) are left unmapped and fall through to the muscle diagram instead
// of forcing a misleading picture.
import { GYMGIFS_CDN_BASE } from './exerciseMedia';
import { buildMuscleImageUrl } from './muscleDiagram';

const EQUIPMENT_GIF_MAP = {
  // ---------- Chest ----------
  'flat-bench-press-machine': 'pectorals/lever-chest-press',
  'incline-chest-press-machine': 'pectorals/lever-incline-chest-press',
  'decline-chest-press-machine': 'pectorals/lever-decline-chest-press',
  'plate-loaded-chest-press': 'pectorals/lever-chest-press',
  'horizontal-chest-press': 'pectorals/lever-chest-press',
  'pec-deck': 'pectorals/lever-seated-fly',
  'chest-fly-machine': 'pectorals/lever-seated-fly',
  'cable-crossover': 'pectorals/cable-cross-over-variation',
  'smith-machine': 'pectorals/smith-bench-press',
  'adjustable-cable-machine': 'pectorals/cable-cross-over-variation',

  // ---------- Back ----------
  'lat-pulldown': 'lats/cable-pulldown',
  'assisted-pullup-machine': 'lats/assisted-standing-pull-up',
  'seated-cable-row': 'upper-back/cable-seated-row',
  'chest-supported-row': 'upper-back/lever-seated-row',
  'high-row': 'upper-back/lever-high-row',
  'low-row': 'upper-back/cable-low-seated-row',
  'iso-lateral-row': 'upper-back/lever-unilateral-row',
  'plate-loaded-row': 'upper-back/lever-bent-over-row',
  't-bar-row': 'upper-back/lever-t-bar-row',
  'pullover-machine': 'lats/lever-pullover',

  // ---------- Shoulders ----------
  'shoulder-press-machine': 'delts/lever-shoulder-press',
  'plate-loaded-shoulder-press': 'delts/lever-shoulder-press',
  'lateral-raise-machine': 'delts/lever-lateral-raise',
  'rear-delt-fly': 'delts/lever-seated-reverse-fly',
  'reverse-pec-deck': 'delts/lever-seated-reverse-fly-parallel-grip',
  'cable-lateral-raise-station': 'delts/cable-lateral-raise',

  // ---------- Biceps ----------
  'preacher-curl-machine': 'biceps/lever-preacher-curl',
  'biceps-curl-machine': 'biceps/lever-bicep-curl',
  'cable-curl-station': 'biceps/cable-curl',
  'preacher-curl-bench': 'biceps/barbell-preacher-curl',

  // ---------- Triceps ----------
  'triceps-extension-machine': 'triceps/lever-triceps-extension',
  'cable-pushdown-station': 'triceps/cable-pushdown',
  'assisted-dip-machine': 'triceps/lever-seated-dip',
  'dip-station': 'triceps/triceps-dip',

  // ---------- Legs ----------
  'leg-press': 'glutes/sled-45-leg-press',
  'horizontal-leg-press': 'glutes/lever-horizontal-one-leg-press',
  '45-degree-leg-press': 'glutes/sled-45-leg-press',
  'hack-squat': 'glutes/sled-hack-squat',
  'leg-extension': 'quads/lever-leg-extension',
  'seated-leg-curl': 'hamstrings/lever-seated-leg-curl',
  'lying-leg-curl': 'hamstrings/lever-lying-leg-curl',
  'standing-leg-curl': 'hamstrings/lever-kneeling-leg-curl',
  'hip-abduction': 'abductors/lever-seated-hip-abduction',
  'hip-adduction': 'adductors/lever-seated-hip-adduction',
  'calf-raise-machine': 'calves/lever-calf-press',
  'seated-calf-raise': 'calves/lever-seated-calf-press',
  'standing-calf-raise': 'calves/lever-standing-calf-raise',

  // ---------- Core ----------
  'ab-crunch-machine': 'abs/lever-seated-crunch',
  'rotary-torso-machine': 'abs/lever-kneeling-twist',
  'cable-station': 'abs/cable-kneeling-crunch',
  'roman-chair': 'spine/hyperextension-on-bench',
  'captains-chair': 'abs/captains-chair-straight-leg-raise',
  'ab-bench': 'abs/flexion-leg-sit-up-bent-knee',
  'decline-situp-bench': 'abs/decline-sit-up',

  // ---------- Free weights ----------
  'dumbbells': 'biceps/dumbbell-biceps-curl',
  'adjustable-dumbbells': 'biceps/dumbbell-biceps-curl',
  'barbells': 'glutes/barbell-full-squat',
  'olympic-barbell': 'glutes/barbell-full-squat',
  'ez-curl-bar': 'biceps/ez-barbell-curl',
  'trap-bar': 'glutes/trap-bar-deadlift',
  'fixed-barbells': 'glutes/barbell-full-squat',
  'power-rack': 'glutes/barbell-full-squat',
  'squat-rack': 'glutes/barbell-full-squat',
  'half-rack': 'glutes/barbell-full-squat',
  'flat-bench': 'pectorals/barbell-bench-press',
  'adjustable-bench': 'pectorals/dumbbell-incline-bench-press',
  'incline-bench': 'pectorals/dumbbell-incline-bench-press',

  // ---------- Functional ----------
  'dual-adjustable-pulley': 'pectorals/cable-cross-over-variation',
  'functional-trainer': 'pectorals/cable-cross-over-variation',
  'kettlebells': 'glutes/kettlebell-goblet-squat',
  'medicine-balls': 'abs/one-arm-slam-with-medicine-ball',
  'resistance-bands': 'abs/band-horizontal-pallof-press',
  'battle-ropes': 'delts/battling-ropes',
  'plyometric-boxes': 'calves/box-jump-down-with-one-leg-stabilization',
  'landmine-attachment': 'delts/landmine-lateral-raise',

  // ---------- Cardio ----------
  'treadmill': 'cardio/walking-on-incline-treadmill',
  'incline-treadmill': 'cardio/walking-on-incline-treadmill',
  'stair-climber': 'cardio/walking-on-stepmill',
  'stairmaster': 'cardio/walking-on-stepmill',
  'elliptical': 'cardio/walk-elliptical-cross-trainer',
  'upright-bike': 'cardio/stationary-bike-run-v-3',
  'recumbent-bike': 'cardio/stationary-bike-run-v-3',
  'spin-bike': 'cardio/stationary-bike-run-v-3',
  'ski-erg': 'triceps/ski-ergometer',
  'assault-bike': 'abs/air-bike',
  'air-bike': 'abs/air-bike',

  // ---------- Bodyweight / calisthenics ----------
  'pullup-bar': 'lats/pull-up',
  'assisted-pullup-dip': 'triceps/lever-seated-dip',
  'parallel-bars': 'triceps/triceps-dip',
};

export const EQUIPMENT_MEDIA_ATTRIBUTION =
  'Equipment demonstrations via ExerciseGymGifsDB (community-aggregated; see that project for media provenance).';

function gymGifsUrl(equipmentId) {
  const gymGifsId = EQUIPMENT_GIF_MAP[equipmentId];
  return gymGifsId ? `${GYMGIFS_CDN_BASE}/${gymGifsId}.gif` : null;
}

// Ordered fallback list for a piece of equipment: real GIF -> a muscle
// diagram built from its tagged primary/secondary muscles -> (the caller
// renders a text-only card once this is exhausted, same pattern as
// ExerciseCard.jsx's thumbnail).
export function equipmentMediaSources(item) {
  const diagram = item
    ? buildMuscleImageUrl({ primary: item.muscles?.primary, secondary: item.muscles?.secondary, width: 480 })
    : null;
  return [gymGifsUrl(item?.id), diagram].filter(Boolean);
}
