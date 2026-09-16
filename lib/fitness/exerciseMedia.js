// lib/fitness/exerciseMedia.js — turns an Exercise's demo-media fields into
// an actual image URL, with the fallback chain the workout UI needs so a
// broken image is never the main thing shown: real animated GIF (via
// ExerciseGymGifsDB) -> Anatome's demo GIF -> custom exercise media ->
// nothing (the caller then falls back to the muscle diagram, then a
// text-only card -- see ExerciseCard.jsx/ExerciseDetails.jsx).
//
// Two GIF providers are wired in, and they are NOT interchangeable quality:
// Anatome's `/exerciseGif` is, per Anatome's own source
// (api/src/lib/exercises.ts / scripts/generate-exercise-gifs.py), just a
// 2-frame flip between two static free-exercise-db photos -- not a real
// motion demo. ExerciseGymGifsDB (github.com/JahelCuadrado/
// ExerciseGymGifsDB) hosts ~1,300 real multi-frame animated exercise GIFs,
// served free with no key straight off jsDelivr's GitHub CDN, so it's tried
// first whenever an exercise has a mapped `gymGifsId`. Its own README
// disclaims holding copyright over the media it aggregates ("cannot grant
// rights to third parties") -- an accepted tradeoff for this personal site,
// not something to widen to a commercial context without re-checking.
//
// Both are pure client-side <img src> requests hitting each provider's own
// CDN/API directly from the viewer's browser -- no server fetch, no key,
// nothing to cache server-side.
const ANATOME_API_BASE = 'https://api.anatome.dev';

// Pinned to a released tag (not @main) so jsDelivr serves a stable,
// cacheable asset set -- the upstream repo has reorganized file paths
// between releases before, which would otherwise silently break `gymGifsId`
// mappings in exerciseCatalog.js. Exported so equipmentMedia.js (equipment
// catalog demo media -- a related but separate id space) can build the same
// kind of URL without duplicating or drifting from this version pin.
export const GYMGIFS_CDN_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.2.0';

export const EXERCISE_MEDIA_ATTRIBUTION =
  'Exercise animations via ExerciseGymGifsDB (community-aggregated; see that project for media provenance). Muscle diagrams via Anatome (anatome.dev).';

function gymGifsUrl(exercise) {
  return exercise?.gymGifsId ? `${GYMGIFS_CDN_BASE}/${exercise.gymGifsId}.gif` : null;
}

// v=4 pins the GIF asset version Anatome currently serves (see their repo's
// exercises.ts) -- bump only if Anatome ships a new asset generation.
function anatomeGifUrl(exercise) {
  if (exercise?.apiSource !== 'anatome' || !exercise.apiExerciseId) return null;
  const params = new URLSearchParams({ id: exercise.apiExerciseId, v: '4' });
  return `${ANATOME_API_BASE}/exerciseGif?${params.toString()}`;
}

function customMediaUrl(exercise) {
  // A custom exercise the user made themselves may carry its own image/GIF
  // URL (see ExerciseLibrary.jsx's "create custom exercise" form).
  return exercise?.demoMedia?.source === 'custom' ? exercise.demoMedia.url || null : null;
}

// The ordered list of demo-GIF sources to try for this exercise, most
// realistic-motion first. Callers that can only show one image (search
// results, etc.) can just take exerciseGifUrl()'s first result; components
// with an <img onError> retry chain (ExerciseCard/ExerciseDetails) walk the
// whole list so a single provider being down or missing an asset doesn't
// take out the demo entirely.
export function exerciseGifSources(exercise) {
  return [gymGifsUrl(exercise), anatomeGifUrl(exercise), customMediaUrl(exercise)].filter(Boolean);
}

export function exerciseGifUrl(exercise) {
  return exerciseGifSources(exercise)[0] || null;
}
