'use client';
// components/tracker/CalendarTab.jsx — full-page tab: an actual week-view
// calendar grid for every course's schedule combined. Drag (or click) an
// empty slot to create an event, click an existing event to view/delete
// it, or upload an .ics export of your timetable to populate it in bulk.
import { useRef, useState } from 'react';
import { importIcs } from '../../lib/ics';
import { getWeekSchedule, getWeekDueAssignments, getWeekHolidays, startOfWeek, isoDate, DAY_NAMES } from '../../lib/schedule';
import { WeekGrid } from './WeekGrid';
import { EventModal } from './EventModal';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CalendarTab({ courses, onAddEntry, onRemoveEntry, onImport }) {
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [draft, setDraft] = useState(null); // pending create/view modal, or null

  const weekStart = startOfWeek(new Date(Date.now() + weekOffset * 7 * 86400000));
  const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
  const items = getWeekSchedule(courses, weekStart);
  const dueItems = getWeekDueAssignments(courses, weekStart);
  const holidayItems = getWeekHolidays(weekStart);

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

  const openCreate = (day, start, end) => {
    if (!courses.length) return;
    const date = isoDate(new Date(weekStart.getTime() + day * 86400000));
    setDraft({ day, start, end, date, recurring: true });
  };

  const openView = (item) => {
    setDraft({
      id: item.id, courseId: item.course.id, title: item.title, venue: item.venue,
      start: item.start, end: item.end, recurring: item.recurring, day: item.day, date: item.date,
    });
  };

  return (
    <section>
      <div className="tk-hero fade-up">
        <div>
          <h1>Calendar</h1>
          <div className="tk-hero-meta">Drag an empty slot to add an event, or click an existing one to delete it</div>
        </div>
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <input ref={fileRef} type="file" accept=".ics" style={{ display: 'none' }} onChange={handleFile} />
          <button className="tk-btn tk-btn-outline tk-btn-sm" onClick={() => fileRef.current && fileRef.current.click()}>Upload .ics</button>
        </div>
      </div>
      {importMsg && <div className="tk-import-msg fade-up">{importMsg}</div>}
      <div className="wg-nav fade-up">
        <button className="tk-cal-btn" onClick={() => setWeekOffset(w => w - 1)}>‹</button>
        <span className="wg-nav-label">
          {String(weekStart.getDate()).padStart(2, '0')} {MONTHS[weekStart.getMonth()]} – {String(weekEnd.getDate()).padStart(2, '0')} {MONTHS[weekEnd.getMonth()]}
        </span>
        <button className="tk-cal-btn" onClick={() => setWeekOffset(w => w + 1)}>›</button>
        {weekOffset !== 0 && <button className="tk-mono-btn" onClick={() => setWeekOffset(0)}>This week</button>}
      </div>
      {courses.length ? (
        <div className="fade-up d1">
          <WeekGrid weekStart={weekStart} items={items} dueItems={dueItems} holidayItems={holidayItems} onEmptySlot={openCreate} onEventClick={openView} />
        </div>
      ) : (
        <div className="tk-empty"><div className="icon">🗓️</div><div className="title">Add a course first.</div></div>
      )}
      {draft && (
        <EventModal
          initial={draft}
          courses={courses}
          onClose={() => setDraft(null)}
          onSave={(courseId, entry) => { onAddEntry(courseId, entry); setDraft(null); }}
          onDelete={(courseId, id) => { onRemoveEntry(courseId, id); setDraft(null); }}
        />
      )}
    </section>
  );
}
