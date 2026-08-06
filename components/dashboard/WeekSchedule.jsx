'use client';
// components/dashboard/WeekSchedule.jsx — moved here from /math's old
// in-app Dashboard tab (now removed, see TrackerApp.jsx): this week's (or
// a long upcoming window's) class schedule, due assignments, and holidays,
// all courses combined.
import { useState } from 'react';
import {
  getWeekSchedule, getWeekDueAssignments, getWeekHolidays,
  getUpcomingSchedule, getUpcomingDueAssignments, getUpcomingHolidays,
  groupByDate, isoWeekday, DAY_NAMES,
} from '../../lib/schedule';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function WeekSchedule({ courses }) {
  const [scheduleView, setScheduleView] = useState(() => {
    try { return localStorage.getItem('dashScheduleView') || 'week'; } catch (e) { return 'week'; }
  });
  const applyScheduleView = (next) => {
    setScheduleView(next);
    try { localStorage.setItem('dashScheduleView', next); } catch (e) {}
  };

  const activeCourses = courses.filter((c) => !c.archived);
  const now = new Date();
  const source = scheduleView === 'upcoming'
    ? {
        schedule: getUpcomingSchedule(activeCourses, now),
        due: getUpcomingDueAssignments(activeCourses, now),
        holidays: getUpcomingHolidays(now).map((h) => ({ date: h.date, title: h.label, kind: 'holiday' })),
      }
    : {
        schedule: getWeekSchedule(activeCourses, now),
        due: getWeekDueAssignments(activeCourses, now),
        holidays: getWeekHolidays(now).map((h) => ({ date: h.date, title: h.label, kind: 'holiday' })),
      };
  const byDate = groupByDate([...source.holidays, ...source.due, ...source.schedule]);

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">Schedule</span>
        <select
          className="tk-input dash-schedule-select"
          value={scheduleView}
          onChange={(e) => applyScheduleView(e.target.value)}
        >
          <option value="week">This week</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
      {(source.schedule.length || source.due.length || source.holidays.length) ? (
        <div className="dash-week-schedule">
          {[...byDate.entries()].map(([date, items]) => (
            <div key={date} className="tk-week-day">
              <div className="tk-week-day-label">{DAY_NAMES[isoWeekday(date)]} · {date.slice(8, 10)} {MONTHS[Number(date.slice(5, 7)) - 1]}</div>
              {items.map((it, i) => (
                it.kind === 'holiday' ? (
                  <div key={i} className="tk-week-item is-holiday">
                    <span className="tk-week-time">Holiday</span>
                    <span className="tk-week-title">{it.title}</span>
                  </div>
                ) : it.kind === 'assignment' ? (
                  <div key={i} className="tk-week-item is-assignment">
                    <span className="tk-week-time">Due</span>
                    <span className="tk-week-course">{it.course.glyph}</span>
                    <span className="tk-week-title">{it.title}</span>
                  </div>
                ) : (
                  <div key={i} className="tk-week-item">
                    <span className="tk-week-time">{it.start}–{it.end}</span>
                    <span className="tk-week-course">{it.course.glyph}</span>
                    <span className="tk-week-title">{it.title}</span>
                    {it.venue && <span className="tk-week-venue">{it.venue}</span>}
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="tk-note-p tk-note-empty">
          {scheduleView === 'upcoming'
            ? 'No classes scheduled — add one from Math → Calendar.'
            : <>Nothing this week — try <a onClick={() => applyScheduleView('upcoming')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Upcoming</a>.</>}
        </p>
      )}
    </div>
  );
}
