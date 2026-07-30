'use client';
// components/tracker/CalendarTab.jsx — full-page tab: upload an .ics export
// of your course timetable (matched to courses by course code), or add/
// remove weekly schedule entries by hand, one block per course.
import { useRef, useState } from 'react';
import { importIcs } from '../../lib/ics';
import { CourseSchedule } from './CourseSchedule';

export function CalendarTab({ courses, onAddEntry, onRemoveEntry, onImport }) {
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const { schedulesByCourseId, unmatchedCount, totalParsed } = importIcs(text, courses);
    onImport(schedulesByCourseId);
    const matchedCount = totalParsed - unmatchedCount;
    setImportMsg(
      totalParsed
        ? `Imported ${matchedCount} of ${totalParsed} events into your courses' schedules` +
          (unmatchedCount ? ` — ${unmatchedCount} skipped (no course code matched the event title).` : '.')
        : 'No events found in that file.'
    );
    e.target.value = '';
  };

  return (
    <section>
      <div className="tk-hero fade-up">
        <div>
          <h1>Calendar</h1>
          <div className="tk-hero-meta">Weekly class schedule for every course</div>
        </div>
        <div>
          <input ref={fileRef} type="file" accept=".ics" style={{ display: 'none' }} onChange={handleFile} />
          <button className="tk-btn tk-btn-outline tk-btn-sm" onClick={() => fileRef.current && fileRef.current.click()}>Upload .ics</button>
        </div>
      </div>
      {importMsg && <div className="tk-import-msg fade-up">{importMsg}</div>}
      <div className="fade-up d1">
        {courses.length ? courses.map(c => (
          <CourseSchedule
            key={c.id}
            course={c}
            onAdd={(entry) => onAddEntry(c.id, entry)}
            onRemove={(id) => onRemoveEntry(c.id, id)}
          />
        )) : (
          <div className="tk-empty"><div className="icon">🗓️</div><div className="title">Add a course first.</div></div>
        )}
      </div>
    </section>
  );
}
