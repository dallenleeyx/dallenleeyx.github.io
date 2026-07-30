'use client';
// components/tracker/EventModal.jsx — opened by dragging/clicking an empty
// slot on the WeekGrid (create), or by clicking an existing event (view +
// delete). Editing an existing event isn't supported yet -- delete and
// re-add covers it for now.
import { Fragment, useState } from 'react';
import { DAY_NAMES } from '../../lib/schedule';

export function EventModal({ initial, courses, onClose, onSave, onDelete }) {
  const isExisting = !!initial.id;
  const [courseId, setCourseId] = useState(initial.courseId || (courses[0] && courses[0].id) || '');
  const [title, setTitle] = useState(initial.title || '');
  const [venue, setVenue] = useState(initial.venue || '');
  const [recurring, setRecurring] = useState(initial.recurring !== false);

  const submit = () => {
    if (!title.trim() || !courseId) return;
    const entry = recurring
      ? { title: title.trim(), venue: venue.trim(), start: initial.start, end: initial.end, recurring: true, day: initial.day }
      : { title: title.trim(), venue: venue.trim(), start: initial.start, end: initial.end, recurring: false, date: initial.date };
    onSave(courseId, entry);
  };

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">{isExisting ? 'Event' : 'New event'}</div>
          <div className="tk-hero-meta" style={{ marginBottom: '1rem' }}>
            {(isExisting ? (initial.recurring ? DAY_NAMES[initial.day] : initial.date) : (recurring ? DAY_NAMES[initial.day] : initial.date))} · {initial.start}–{initial.end}
          </div>
          <div className="tk-modal-field">
            <label>Course</label>
            <select className="tk-input" value={courseId} onChange={e => setCourseId(e.target.value)} disabled={isExisting}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.glyph} · {c.name}</option>)}
            </select>
          </div>
          <div className="tk-modal-field">
            <label>Title</label>
            <input className="tk-input" autoFocus={!isExisting} value={title} onChange={e => setTitle(e.target.value)} readOnly={isExisting} onKeyDown={e => e.key === 'Enter' && !isExisting && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Venue</label>
            <input className="tk-input" value={venue} onChange={e => setVenue(e.target.value)} readOnly={isExisting} onKeyDown={e => e.key === 'Enter' && !isExisting && submit()} />
          </div>
          {!isExisting && (
            <label className="tk-modal-checkbox">
              <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
              Repeat weekly on {DAY_NAMES[initial.day]} (untick for just this once)
            </label>
          )}
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>{isExisting ? 'Close' : 'Cancel'}</button>
            {!isExisting && <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!title.trim()} onClick={submit}>Add event</button>}
          </div>
          {isExisting && (
            <div className="tk-modal-danger-zone">
              <button className="tk-btn tk-btn-danger tk-btn-sm" onClick={() => onDelete(initial.courseId, initial.id)}>Delete event</button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
