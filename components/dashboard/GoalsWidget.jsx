'use client';
// components/dashboard/GoalsWidget.jsx — named target dates (midterms,
// finals, JLPT exams) with a countdown, sorted soonest-first. Deliberately
// separate from the combined task list: a goal isn't something you "do
// today", it's a deadline the day-to-day tasks are building toward.
import { useState } from 'react';
import { sortGoals, countdownLabel, daysUntil, newGoalId } from '../../lib/goals';
import { AddGoalModal } from './AddGoalModal';

function countdownClass(dateISO) {
  const n = daysUntil(dateISO);
  if (n < 0) return 'overdue';
  if (n === 0) return 'today';
  if (n <= 7) return 'soon';
  return '';
}

export function GoalsWidget({ goals, setGoals }) {
  const [addOpen, setAddOpen] = useState(false);
  const sorted = sortGoals(goals);

  const addGoal = ({ label, date }) => {
    setGoals((prev) => [...(prev || []), { id: newGoalId(), label, date }]);
    setAddOpen(false);
  };

  const removeGoal = (id) => {
    if (!window.confirm('Remove this goal?')) return;
    setGoals((prev) => (prev || []).filter((g) => g.id !== id));
  };

  return (
    <div className="fade-up">
      <div className="tk-section-label">
        <span>Goals</span>
        <button className="tk-mono-btn" onClick={() => setAddOpen(true)}>+ add goal</button>
      </div>
      {sorted.length ? (
        <div className="tk-timeline" style={{ marginBottom: '3.2rem' }}>
          {sorted.map((g) => (
            <div className="tk-tl-item" key={g.id}>
              <div className="tk-row-card">
                <div style={{ minWidth: 0 }}>
                  <div className="tk-row-title">{g.label}</div>
                  <div className="tk-row-meta">{g.date}</div>
                </div>
                <div className="tk-row-actions">
                  <span className={`tk-days ${countdownClass(g.date)}`}>{countdownLabel(g.date)}</span>
                  <button className="tk-x-btn" onClick={() => removeGoal(g.id)}>×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: '3.2rem' }}>
          <div className="tk-empty">
            <div className="icon">🎯</div>
            <div className="title">No goals yet — add a midterm, final, or exam date.</div>
          </div>
        </div>
      )}
      {addOpen && <AddGoalModal onClose={() => setAddOpen(false)} onCreate={addGoal} />}
    </div>
  );
}
