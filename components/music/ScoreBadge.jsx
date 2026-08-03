'use client';
export function ScoreBadge({ score }) {
  return <div className="music-score">{score.correct} / {score.total}</div>;
}
