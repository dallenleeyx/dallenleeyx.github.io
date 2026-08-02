'use client';
// components/tracker/GradeComponents.jsx — optional per-course grade
// breakdown: weighted components (e.g. "Homework 30%"), a running score on
// each, and a goal calculator ("what do I need on the rest to hit X%").
// Entirely optional -- a course with no components just shows the empty
// state; nothing here is required for the rest of the app to work.
import { Fragment, useEffect, useState } from 'react';
import { computeGradeSummary } from '../../lib/gradeMath';

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function Empty({ icon, children }) {
  return <div className="tk-empty"><div className="icon">{icon}</div><div className="title">{children}</div></div>;
}

function GradeComponentRow({ gc, onUpdate, onRemove }) {
  const numOrNull = (v) => (v === '' ? null : Number(v));
  return (
    <div className="tk-row-card tk-grade-row">
      <input
        className="tk-input tk-grade-name"
        value={gc.name}
        placeholder="Component name"
        onChange={e => onUpdate({ name: e.target.value })}
      />
      <div className="tk-grade-weight">
        <input
          className="tk-input tk-grade-weight-input"
          type="number" min="0" max="100" step="any"
          value={gc.weight === 0 ? 0 : gc.weight || ''}
          onChange={e => onUpdate({ weight: Number(e.target.value) || 0 })}
        />
        <span>%</span>
      </div>
      <div className="tk-grade-score">
        <input
          className="tk-input tk-grade-score-input"
          type="number" min="0" step="any"
          placeholder="—"
          value={gc.earned ?? ''}
          onChange={e => onUpdate({ earned: numOrNull(e.target.value) })}
        />
        <span>/</span>
        <input
          className="tk-input tk-grade-score-input"
          type="number" min="0" step="any"
          placeholder="—"
          value={gc.possible ?? ''}
          onChange={e => onUpdate({ possible: numOrNull(e.target.value) })}
        />
      </div>
      <button className="tk-x-btn" onClick={onRemove}>×</button>
    </div>
  );
}

export function GradeComponents({ course, onClose, onChange }) {
  const components = course.gradeComponents || [];
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [goalOpen, setGoalOpen] = useState(false);
  const [targetGrade, setTargetGrade] = useState(90);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateComponent = (id, fields) => onChange(components.map(gc => gc.id === id ? { ...gc, ...fields } : gc));
  const removeComponent = (id) => onChange(components.filter(gc => gc.id !== id));
  const addComponent = () => {
    const name = newName.trim();
    if (!name) return;
    onChange([...components, { id: 'gc' + newId(), name, weight: Number(newWeight) || 0, earned: null, possible: null }]);
    setNewName('');
    setNewWeight('');
  };

  const { totalWeight, ungradedWeight, securedPoints, currentGrade } = computeGradeSummary(components);

  let goal = null;
  if (goalOpen && totalWeight > 0) {
    if (ungradedWeight <= 0) {
      goal = { allGraded: true, met: securedPoints >= targetGrade };
    } else {
      const needed = ((targetGrade - securedPoints) / ungradedWeight) * 100;
      goal = { allGraded: false, needed, impossible: needed > 100, guaranteed: needed <= 0 };
    }
  }

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-grades-card">
          <div className="tk-revision-top">
            <span className="tk-revision-eyebrow">Grade components</span>
            <span className="tk-revision-course">{course.name}</span>
          </div>

          {components.length > 0 && (
            <div className="tk-grade-stats">
              <div className="tk-stat"><div className="tk-stat-num">{totalWeight}<span>%</span></div><div className="tk-stat-cap">Weight entered</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{currentGrade == null ? '—' : `${currentGrade.toFixed(1)}%`}</div><div className="tk-stat-cap">Grade so far</div></div>
            </div>
          )}

          {components.length ? (
            <div className="tk-stack tk-grade-list">
              {components.map(gc => (
                <GradeComponentRow
                  key={gc.id}
                  gc={gc}
                  onUpdate={(fields) => updateComponent(gc.id, fields)}
                  onRemove={() => removeComponent(gc.id)}
                />
              ))}
            </div>
          ) : (
            <Empty icon="📊">No grade components yet — optional. Add them below if this course has a graded breakdown you want to track.</Empty>
          )}

          <div className="tk-form-row tk-grade-add-row">
            <input
              className="tk-input"
              placeholder="Component name (e.g. Homework)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addComponent()}
            />
            <div className="tk-grade-weight">
              <input
                className="tk-input tk-grade-weight-input"
                type="number" min="0" max="100" step="any"
                placeholder="wt."
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComponent()}
              />
              <span>%</span>
            </div>
            <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={addComponent}>Add</button>
          </div>

          <div className="tk-grade-goal-toggle-row">
            <button className={`tk-mono-btn${goalOpen ? ' active' : ''}`} onClick={() => setGoalOpen(g => !g)}>
              🎯 Goal calculator
            </button>
          </div>

          {goalOpen && (
            <div className="tk-grade-goal-panel">
              <div className="tk-modal-field">
                <label>Target overall grade</label>
                <div className="tk-grade-weight">
                  <input
                    className="tk-input tk-grade-weight-input"
                    type="number" min="0" max="100" step="any"
                    value={targetGrade}
                    onChange={e => setTargetGrade(Number(e.target.value) || 0)}
                  />
                  <span>%</span>
                </div>
              </div>
              {totalWeight === 0 ? (
                <p className="tk-modal-field-hint">Add components with weights first.</p>
              ) : goal.allGraded ? (
                <p className={`tk-grade-goal-result ${goal.met ? 'good' : 'bad'}`}>
                  {goal.met
                    ? `Every component is graded -- final grade is ${securedPoints.toFixed(1)}%, target met.`
                    : `Every component is graded -- final grade is ${securedPoints.toFixed(1)}%, short of the ${targetGrade}% target.`}
                </p>
              ) : goal.impossible ? (
                <p className="tk-grade-goal-result bad">
                  Not achievable -- you'd need {goal.needed.toFixed(1)}% on the remaining {ungradedWeight}% of the grade, more than a perfect score.
                </p>
              ) : goal.guaranteed ? (
                <p className="tk-grade-goal-result good">
                  Already guaranteed -- even 0% on everything left keeps you at or above {targetGrade}%.
                </p>
              ) : (
                <p className="tk-grade-goal-result">
                  You need an average of <strong>{goal.needed.toFixed(1)}%</strong> on the remaining components (worth {ungradedWeight}% of the grade) to reach {targetGrade}%.
                </p>
              )}
            </div>
          )}

          <div className="tk-revision-foot" style={{ justifyContent: 'flex-end' }}>
            <button className="tk-mono-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
