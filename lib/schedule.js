// lib/schedule.js — expands each course's weekly/one-off schedule entries
// into concrete dates for a given week, merged and sorted into one combined
// agenda. Shared by the Dashboard's "this week" widget and the Calendar tab.
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
        items.push({ ...entry, date: isoDate(d), course: c });
      } else {
        const d = new Date(entry.date + 'T00:00:00');
        if (d >= monday && d < weekEnd) items.push({ ...entry, course: c });
      }
    });
  });
  items.sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date)));
  return items;
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
