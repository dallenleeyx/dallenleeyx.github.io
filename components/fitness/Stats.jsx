'use client';
// components/fitness/Stats.jsx — derives simple, useful trends from your
// logs: how often you're actually training, your weight over time, and
// your cardio volume, plus a quick tally of which workout you reach for
// most. All computed client-side from state.logs -- no separate stats
// storage to keep in sync.
import { useMemo } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { toISO, addDays } from '../../lib/fitness/util';
import { LineChart, BarChart } from './charts';

const LOOKBACK_DAYS = 60;
const WEEKS_SHOWN = 8;

function isGymDay(manual) {
  return !!manual?.workoutId || (manual?.exercises || []).some((ex) => ex.sets.some((s) => s != null));
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function Stats() {
  const { state, loading } = useFitness();

  const { weightPoints, weeklyBars, cardioPoints, workoutTally, weekCount, latestWeight, weightDelta30, cardioThisMonth } = useMemo(() => {
    const today = new Date();
    const entries = [];
    for (let i = 0; i < LOOKBACK_DAYS; i++) {
      const date = addDays(today, -i);
      const iso = toISO(date);
      const log = state.logs[iso];
      entries.push({ iso, date, manual: log?.manual || null, health: log?.health || null });
    }
    entries.reverse(); // chronological

    // Weight over time
    const weightPoints = entries
      .filter((e) => e.manual?.weightKg != null)
      .map((e) => ({ y: e.manual.weightKg, xLabel: e.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }));

    // Weekly gym frequency, last WEEKS_SHOWN weeks
    const weekBuckets = [];
    for (let w = WEEKS_SHOWN - 1; w >= 0; w--) {
      const weekStart = startOfWeek(addDays(today, -7 * w));
      const weekEnd = addDays(weekStart, 6);
      const count = entries.filter((e) => e.date >= weekStart && e.date <= weekEnd && isGymDay(e.manual)).length;
      weekBuckets.push({ y: count, xLabel: weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) });
    }

    // Cardio duration per session (manual + Apple Health synced)
    const cardioPoints = [];
    entries.forEach((e) => {
      const label = e.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (e.manual?.cardio?.durationMin != null) cardioPoints.push({ y: e.manual.cardio.durationMin, xLabel: label });
      else if (e.health?.durationMin != null) cardioPoints.push({ y: e.health.durationMin, xLabel: label });
    });

    // Workout tally
    const tally = {};
    entries.forEach((e) => {
      if (e.manual?.workoutId) {
        const w = state.workouts.list.find((wk) => wk.id === e.manual.workoutId);
        const name = w ? w.name : 'Deleted workout';
        tally[name] = (tally[name] || 0) + 1;
      } else if (e.manual?.cardio?.type) {
        tally[`Cardio (${e.manual.cardio.type})`] = (tally[`Cardio (${e.manual.cardio.type})`] || 0) + 1;
      }
    });
    const workoutTally = Object.entries(tally).sort((a, b) => b[1] - a[1]);

    const weekCount = weekBuckets[weekBuckets.length - 1]?.y ?? 0;
    const latestWeight = weightPoints.length ? weightPoints[weightPoints.length - 1].y : null;
    const weightEntry30Ago = entries.find((e) => e.manual?.weightKg != null && (today - e.date) / 86400000 >= 28);
    const weightDelta30 = latestWeight != null && weightEntry30Ago ? Math.round((latestWeight - weightEntry30Ago.manual.weightKg) * 10) / 10 : null;
    const cardioThisMonth = entries.filter((e) => (today - e.date) / 86400000 <= 30 && (e.manual?.cardio?.type || e.health?.workoutType)).length;

    return { weightPoints, weeklyBars: weekBuckets, cardioPoints, workoutTally, weekCount, latestWeight, weightDelta30, cardioThisMonth };
  }, [state.logs, state.workouts.list]);

  if (loading) return <p className="fit-empty">Loading…</p>;

  return (
    <div className="fit-stats">
      <div className="fit-stat-tiles">
        <div className="fit-stat-tile">
          <span className="fit-stat-value">{weekCount}</span>
          <span className="fit-stat-label">workouts this week</span>
        </div>
        <div className="fit-stat-tile">
          <span className="fit-stat-value">{latestWeight != null ? `${latestWeight} kg` : '—'}</span>
          <span className="fit-stat-label">
            current weight{weightDelta30 != null && (
              <> · <span className={weightDelta30 <= 0 ? 'fit-stat-down' : 'fit-stat-up'}>{weightDelta30 > 0 ? '+' : ''}{weightDelta30} kg / 30d</span></>
            )}
          </span>
        </div>
        <div className="fit-stat-tile">
          <span className="fit-stat-value">{cardioThisMonth}</span>
          <span className="fit-stat-label">cardio sessions this month</span>
        </div>
      </div>

      <section className="fit-stat-section">
        <h4>Weight over time</h4>
        <LineChart points={weightPoints} color="var(--fit-accent)" unit=" kg" emptyText="Log your weight from Today to see this chart." />
      </section>

      <section className="fit-stat-section">
        <h4>Workouts per week</h4>
        <BarChart bars={weeklyBars} color="var(--fit-accent)" emptyText="Log a workout from Today to see this chart." />
      </section>

      <section className="fit-stat-section">
        <h4>Cardio duration per session</h4>
        <LineChart points={cardioPoints} color="var(--fit-active)" unit=" min" emptyText="Log cardio (or sync Apple Health) to see this chart." />
      </section>

      <section className="fit-stat-section">
        <h4>Last {LOOKBACK_DAYS} days by workout</h4>
        {workoutTally.length ? (
          <ul className="fit-tally-list">
            {workoutTally.map(([name, count]) => (
              <li key={name} className="fit-tally-row">
                <span className="fit-tally-name">{name}</span>
                <span className="fit-tally-count">{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fit-chart-empty">Nothing logged yet.</p>
        )}
      </section>
    </div>
  );
}
