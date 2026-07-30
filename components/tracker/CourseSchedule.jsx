'use client';
// components/tracker/CourseSchedule.jsx — one course's weekly class schedule:
// add a recurring slot by hand, or see what an .ics import matched to it.
import { useState } from 'react';
import { DAY_NAMES } from '../../lib/schedule';

export function CourseSchedule({ course, onAdd, onRemove }) {
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [day, setDay] = useState('0');
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('12:00');

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), venue: venue.trim(), day: Number(day), start, end, recurring: true });
    setTitle('');
    setVenue('');
  };

  const entries = [...(course.schedule || [])].sort((a, b) => {
    const da = a.recurring ? a.day : 7;
    const db = b.recurring ? b.day : 7;
    return da === db ? a.start.localeCompare(b.start) : da - db;
  });

  return (
    <div className="tk-cal-course-block">
      <div className="tk-cal-course-head">
        <span className="tk-course-glyph">{course.glyph}</span>
        <span className="tk-cal-course-name">{course.name}</span>
      </div>
      {entries.length ? (
        <div className="tk-cal-entries">
          {entries.map(e => (
            <div key={e.id} className="tk-cal-entry">
              <span className="tk-cal-entry-day">{e.recurring ? DAY_NAMES[e.day] : e.date}</span>
              <span className="tk-cal-entry-time">{e.start}–{e.end}</span>
              <span className="tk-cal-entry-title">{e.title}</span>
              {e.venue && <span className="tk-cal-entry-venue">{e.venue}</span>}
              <button className="tk-x-btn" onClick={() => onRemove(e.id)}>×</button>
            </div>
          ))}
        </div>
      ) : <div className="tk-cal-entries-empty">No schedule entries yet.</div>}
      <div className="tk-cal-add-row">
        <input className="tk-input" placeholder="Lecture" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        <select className="tk-input tk-cal-day-select" value={day} onChange={e => setDay(e.target.value)}>
          {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
        <input className="tk-input tk-cal-time-input" type="time" value={start} onChange={e => setStart(e.target.value)} />
        <input className="tk-input tk-cal-time-input" type="time" value={end} onChange={e => setEnd(e.target.value)} />
        <input className="tk-input" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={submit}>Add</button>
      </div>
    </div>
  );
}
