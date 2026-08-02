// lib/schedule.js — expands each course's weekly/one-off schedule entries
// into concrete dates for a given week, merged and sorted into one combined
// agenda. Shared by the Dashboard's "this week" widget and the Calendar tab.
import { NUS_HOLIDAYS, isHoliday } from './holidays';

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export { isoDate };

export function getWeekSchedule(courses, referenceDate = new Date()) {
  const monday = startOfWeek(referenceDate);
  const weekEnd = new Date(monday.getTime() + 7 * 86400000);
  const items = [];
  courses.forEach(c => {
    (c.schedule || []).forEach(entry => {
      if (entry.recurring) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + entry.day);
        const iso = isoDate(d);
        if (entry.seriesStart) {
          // Came from an .ics import: its own seriesStart/seriesEnd/exdates
          // (derived from the file's actual RRULE/EXDATE) already reflect
          // the real semester and its holidays -- trust that over the
          // generic list below, which could disagree in either direction.
          if (iso < entry.seriesStart) return;
          if (entry.seriesEnd && iso > entry.seriesEnd) return;
          if (entry.exdates && entry.exdates.includes(iso)) return;
        } else if (isHoliday(iso)) {
          // No bounds of its own (hand-added via drag) -- fall back to the
          // known NUS/SG holiday list so it still skips no-class days.
          return;
        }
        items.push({ ...entry, date: iso, course: c });
      } else {
        const d = new Date(entry.date + 'T00:00:00');
        if (d >= monday && d < weekEnd) items.push({ ...entry, course: c });
      }
    });
  });
  items.sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
  return items;
}

// Pending (not-done) assignments due within the given week -- shown
// alongside the class schedule so a due date doesn't get missed.
export function getWeekDueAssignments(courses, referenceDate = new Date()) {
  const monday = startOfWeek(referenceDate);
  const weekEnd = new Date(monday.getTime() + 7 * 86400000);
  const items = [];
  courses.forEach(c => {
    (c.assignments || []).forEach(a => {
      if (!a.due || a.status === 'done') return;
      const d = new Date(a.due + 'T00:00:00');
      if (d >= monday && d < weekEnd) items.push({ id: a.id, title: a.title, date: a.due, course: c, kind: 'assignment' });
    });
  });
  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

// Known NUS/SG holidays falling within the given week -- shown as a green
// marker alongside classes and due assignments (no classes run these days).
export function getWeekHolidays(referenceDate = new Date()) {
  const monday = startOfWeek(referenceDate);
  const weekEnd = new Date(monday.getTime() + 7 * 86400000);
  return NUS_HOLIDAYS.filter(h => {
    const d = new Date(h.date + 'T00:00:00');
    return d >= monday && d < weekEnd;
  });
}

// The dashboard's schedule widget used to be locked to the current
// calendar week -- which meant importing a whole semester's timetable
// showed literally nothing whenever "this week" fell outside term dates
// (e.g. before term starts, since imported entries carry the real
// seriesStart/seriesEnd from the .ics file, unlike hand-added entries).
// These widen the same expansion logic to a long forward-looking window
// instead, so there's always something to scroll through once a schedule
// exists at all.
export function getUpcomingSchedule(courses, referenceDate = new Date(), daysAhead = 180) {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + daysAhead * 86400000);
  const items = [];
  courses.forEach(c => {
    (c.schedule || []).forEach(entry => {
      if (entry.recurring) {
        const startWd = (start.getDay() + 6) % 7;
        let cursor = new Date(start);
        cursor.setDate(cursor.getDate() + ((entry.day - startWd + 7) % 7));
        while (cursor < end) {
          const iso = isoDate(cursor);
          let skip = false;
          if (entry.seriesStart) {
            if (iso < entry.seriesStart) skip = true;
            if (entry.seriesEnd && iso > entry.seriesEnd) skip = true;
            if (entry.exdates && entry.exdates.includes(iso)) skip = true;
          } else if (isHoliday(iso)) {
            skip = true;
          }
          if (!skip) items.push({ ...entry, date: iso, course: c });
          cursor = new Date(cursor.getTime() + 7 * 86400000);
        }
      } else {
        const d = new Date(entry.date + 'T00:00:00');
        if (d >= start && d < end) items.push({ ...entry, course: c });
      }
    });
  });
  items.sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
  return items;
}

export function getUpcomingDueAssignments(courses, referenceDate = new Date(), daysAhead = 180) {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + daysAhead * 86400000);
  const items = [];
  courses.forEach(c => {
    (c.assignments || []).forEach(a => {
      if (!a.due || a.status === 'done') return;
      const d = new Date(a.due + 'T00:00:00');
      if (d >= start && d < end) items.push({ id: a.id, title: a.title, date: a.due, course: c, kind: 'assignment' });
    });
  });
  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

export function getUpcomingHolidays(referenceDate = new Date(), daysAhead = 180) {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + daysAhead * 86400000);
  return NUS_HOLIDAYS.filter(h => {
    const d = new Date(h.date + 'T00:00:00');
    return d >= start && d < end;
  });
}

// Callers pass a concatenation of several already-individually-sorted
// lists (holidays, due assignments, schedule entries) -- concatenation
// doesn't merge them into one globally date-ordered sequence, so a plain
// Map here would iterate in whatever order dates first appeared across
// those lists, not calendar order. Easy to miss over a single week (only
// a handful of dates in play) but glaring once callers widen the range
// (see getUpcoming*), so the map itself is sorted before returning.
export function groupByDate(items) {
  const map = new Map();
  items.forEach(it => {
    if (!map.has(it.date)) map.set(it.date, []);
    map.get(it.date).push(it);
  });
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export function isoWeekday(iso) {
  return (new Date(iso + 'T00:00:00').getDay() + 6) % 7;
}
