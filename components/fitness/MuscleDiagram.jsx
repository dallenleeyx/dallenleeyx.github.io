'use client';
// components/fitness/MuscleDiagram.jsx — a small highlighted-muscle body
// diagram for "which muscles does this train?", backed by Anatome's hosted
// image API (see lib/fitness/muscleDiagram.js). Renders nothing if the
// muscle names given don't map to anything drawable, rather than showing a
// broken image.
import { buildMuscleImageUrl } from '../../lib/fitness/muscleDiagram';

export function MuscleDiagram({ primary, secondary, label, size = 120 }) {
  const src = buildMuscleImageUrl({ primary, secondary, width: size * 2 });
  if (!src) return null;
  return (
    <img
      className="fit-muscle-diagram"
      src={src}
      width={size}
      height={size}
      alt={label ? `Muscles trained by ${label}` : 'Targeted muscle groups'}
      loading="lazy"
    />
  );
}
