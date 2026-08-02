// lib/gradeMath.js — weighted-grade math shared between GradeComponents.jsx
// (the editor overlay) and the course page's grade-progress bar, so the two
// can never drift on how "current grade" is computed.

// A component only counts once both a possible total and an earned score
// are entered -- a possible of 0 would divide by zero, so that's treated
// the same as "not scored yet".
export function hasScore(gc) {
  return typeof gc.earned === 'number' && typeof gc.possible === 'number' && gc.possible > 0;
}

export function computeGradeSummary(components) {
  const totalWeight = components.reduce((s, gc) => s + (gc.weight || 0), 0);
  const graded = components.filter(hasScore);
  const gradedWeight = graded.reduce((s, gc) => s + (gc.weight || 0), 0);
  // "Points" secured out of the total weight -- e.g. scoring 36/40 on a
  // 30%-weighted component secures 27 of those 30 points.
  const securedPoints = graded.reduce((s, gc) => s + (gc.earned / gc.possible) * gc.weight, 0);
  const currentGrade = gradedWeight > 0 ? (securedPoints / gradedWeight) * 100 : null;
  return { totalWeight, gradedWeight, ungradedWeight: totalWeight - gradedWeight, securedPoints, currentGrade };
}
