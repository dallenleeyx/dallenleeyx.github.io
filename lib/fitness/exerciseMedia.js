// lib/fitness/exerciseMedia.js — turns an Exercise's demoMedia into an
// actual image URL, with the fallback chain the workout UI needs so a
// broken image is never the main thing shown: animated GIF -> static
// muscle diagram -> nothing (the caller then falls back to a text-only
// card). There's no separate "static image" or "video thumbnail" tier here
// because Anatome (the only provider wired up) only exposes the animated
// GIF -- the chain still degrades cleanly to the muscle diagram or text.
//
// Like muscleDiagram.js, this is a pure client-side <img src> hitting
// Anatome's hosted API directly from the viewer's browser -- no server
// fetch, no key, nothing to cache server-side. gifUrl() mirrors Anatome's
// own api/src/lib/exercises.ts `exerciseGifUrl(extId, base)` helper.
const ANATOME_API_BASE = 'https://api.anatome.dev';

export const EXERCISE_MEDIA_ATTRIBUTION = 'Exercise demonstrations via Anatome (anatome.dev), built on free-exercise-db';

// v=4 pins the GIF asset version Anatome currently serves (see their repo's
// exercises.ts) -- bump only if Anatome ships a new asset generation.
export function exerciseGifUrl(exercise) {
  if (exercise?.apiSource === 'anatome' && exercise.apiExerciseId) {
    const params = new URLSearchParams({ id: exercise.apiExerciseId, v: '4' });
    return `${ANATOME_API_BASE}/exerciseGif?${params.toString()}`;
  }
  // A custom exercise the user made themselves may carry its own image/GIF
  // URL (see ExerciseLibrary.jsx's "create custom exercise" form).
  if (exercise?.demoMedia?.source === 'custom' && exercise.demoMedia.url) return exercise.demoMedia.url;
  return null;
}
