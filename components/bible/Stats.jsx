'use client';
// components/bible/Stats.jsx — a QT streak, same motivating role as any
// habit tracker's streak counter. "Current" survives until a day is
// skipped entirely (today not yet logged doesn't break yesterday's streak,
// same as most habit apps), computed from the day-keyed qt log.
import { useMemo } from 'react';
import { useBible } from '../../lib/bible/BibleSyncContext';
import { toISO, addDays, todayISO } from '../../lib/bible/util';

function computeStats(qt) {
  const loggedDates = new Set(
    Object.entries(qt).filter(([, e]) => e.passage?.trim() || e.comments?.trim()).map(([d]) => d)
  );
  const today = todayISO();
  const yesterday = toISO(addDays(new Date(`${today}T00:00:00`), -1));

  let anchor = null;
  if (loggedDates.has(today)) anchor = today;
  else if (loggedDates.has(yesterday)) anchor = yesterday;

  let currentStreak = 0;
  if (anchor) {
    let cursor = anchor;
    while (loggedDates.has(cursor)) {
      currentStreak++;
      cursor = toISO(addDays(new Date(`${cursor}T00:00:00`), -1));
    }
  }

  const sorted = [...loggedDates].sort();
  let longestStreak = 0;
  let run = 0;
  let prev = null;
  for (const d of sorted) {
    run = prev && toISO(addDays(new Date(`${prev}T00:00:00`), 1)) === d ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    prev = d;
  }

  return { currentStreak, longestStreak, totalDays: loggedDates.size };
}

export function Stats() {
  const { state } = useBible();
  const { currentStreak, longestStreak, totalDays } = useMemo(() => computeStats(state.qt), [state.qt]);
  const commentaryCount = useMemo(
    () => Object.values(state.commentary).filter((e) => !e.deleted).length,
    [state.commentary]
  );

  return (
    <div className="bible-stats">
      <div className="bible-stat-tiles">
        <div className="bible-stat-tile">
          <span className="bible-stat-value">{currentStreak}</span>
          <span className="bible-stat-label">day streak</span>
        </div>
        <div className="bible-stat-tile">
          <span className="bible-stat-value">{longestStreak}</span>
          <span className="bible-stat-label">longest streak</span>
        </div>
        <div className="bible-stat-tile">
          <span className="bible-stat-value">{totalDays}</span>
          <span className="bible-stat-label">QT days logged</span>
        </div>
        <div className="bible-stat-tile">
          <span className="bible-stat-value">{commentaryCount}</span>
          <span className="bible-stat-label">commentary entries</span>
        </div>
      </div>
    </div>
  );
}
