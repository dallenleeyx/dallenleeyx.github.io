'use client';
// components/dashboard/PlanSetupModal.jsx — collects the inputs for
// (re)generating the 6-month goal plan, built on AddCourseModal.jsx's
// template. Regenerating is a full replace (see the generate route), not
// an incremental edit -- this modal is for the initial setup and for
// deliberately redoing the whole plan, not day-to-day tweaks (those go
// straight through useGoalPlanSync's normal setPlan path elsewhere).
import { Fragment, useEffect, useState } from 'react';
import { computeGradeSummary } from '../../lib/gradeMath';

export function PlanSetupModal({ courses, plan, generating, onClose, onGenerate }) {
  const [jlptExamDate, setJlptExamDate] = useState(plan?.jlptExamDate || '');
  const [targets, setTargets] = useState(() => {
    const existing = new Map((plan?.courseTargets || []).map((t) => [t.courseId, t]));
    return (courses || []).map((c) => ({
      courseId: c.id,
      courseTitle: c.name,
      targetGrade: existing.get(c.id)?.targetGrade || '',
    }));
  });
  const [notes, setNotes] = useState('');

  // One-time default from the Japanese Home tab's own exam date, if the
  // user hasn't already set one here -- not a live sync, just a sensible
  // starting point they can override.
  useEffect(() => {
    if (jlptExamDate) return;
    fetch('/api/japanese')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const examDate = data?.state?.planBundle?.plan?.examDate;
        if (examDate) setJlptExamDate(examDate);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTarget = (courseId, value) => {
    setTargets((ts) => ts.map((t) => (t.courseId === courseId ? { ...t, targetGrade: value } : t)));
  };

  const submit = () => {
    onGenerate({
      jlptExamDate: jlptExamDate.trim(),
      courseTargets: targets.filter((t) => t.targetGrade.trim()),
      notes: notes.trim(),
    });
  };

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal dash-plan-modal">
          <div className="tk-modal-title">{plan?.generatedAt ? 'Regenerate' : 'Generate'} your 6-month plan</div>
          <div className="tk-modal-field">
            <label>JLPT exam date</label>
            <input className="tk-input" type="date" value={jlptExamDate} onChange={(e) => setJlptExamDate(e.target.value)} />
          </div>
          <div className="tk-modal-field">
            <label>Target grade per course</label>
            {targets.length === 0 && <p className="tk-modal-field-hint">No courses yet — add one on the Math site first.</p>}
            {targets.map((t) => {
              const course = (courses || []).find((c) => c.id === t.courseId);
              const summary = course ? computeGradeSummary(course.gradeComponents || []) : null;
              return (
                <div key={t.courseId} className="dash-target-row">
                  <span className="dash-target-name">{t.courseTitle}</span>
                  {summary?.currentGrade != null && (
                    <span className="dash-target-current">{summary.currentGrade.toFixed(1)}% now</span>
                  )}
                  <input
                    className="tk-input dash-target-input"
                    placeholder="A++"
                    value={t.targetGrade}
                    onChange={(e) => updateTarget(t.courseId, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
          <div className="tk-modal-field">
            <label>Anything else Claude should know (optional)</label>
            <textarea
              className="tk-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. I struggle most with proof-writing…"
            />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={generating} onClick={submit}>
              {generating ? 'Generating…' : 'Generate plan'}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
