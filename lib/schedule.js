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
        // seriesStart/seriesEnd/exdates are set on entries imported from an
        // .ics RRULE (a real semester run, not "repeat forever") -- absent
        // on manually-added entries, which stay unbounded. A known NUS/SG
        // holiday always suppresses a recurring class, even one added by
        // hand or from stale/pre-fix import data with no bounds of its own.
        if (entry.seriesStart && iso < entry.seriesStart) return;
        if (entry.seriesEnd && iso > entry.seriesEnd) return;
        if (entry.exdates && entry.exdates.includes(iso)) return;
        if (isHoliday(iso)) return;
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

export function groupByDate(items) {
  const map = new Map();
  items.forEach(it => {
    if (!map.has(it.date)) map.set(it.date, []);
    map.get(it.date).push(it);
  });
  return map;
}

export function isoWeekday(iso) {
  return (new Date(iso + 'T00:00:00').getDay() + 6) % 7;
}
