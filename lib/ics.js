// lib/ics.js — minimal ICS (iCalendar) parser for course-timetable exports.
// Not a general RFC 5545 implementation: handles the subset real timetable
// exports use (VEVENT blocks with SUMMARY/LOCATION/DTSTART/DTEND, folded
// lines, and \, \; \n escapes). University timetables typically export one
// VEVENT per session (13 separate lecture events for a 13-week semester)
// rather than a single RRULE — so occurrences are collapsed here into a
// single weekly slot whenever the same weekday/time/title/venue repeats,
// and kept as a one-off dated entry when it only happens once.

function unfoldLines(text) {
  // RFC 5545 line folding: a continuation line starts with a single space/tab
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
}

function unescapeText(s) {
  return s.replace(/\\n/gi, ' ').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\').trim();
}

function parseDate(value) {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, h = '00', mi = '00', s = '00'] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
}

function parseLine(line) {
  const idx = line.indexOf(':');
  if (idx < 0) return null;
  const name = line.slice(0, idx).split(';')[0].toUpperCase();
  return { name, value: line.slice(idx + 1) };
}

export function parseIcsEvents(text) {
  const lines = unfoldLines(String(text || '')).split('\n');
  const events = [];
  let cur = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const parsed = parseLine(line);
    if (!parsed) continue;
    if (parsed.name === 'SUMMARY') cur.title = unescapeText(parsed.value);
    else if (parsed.name === 'LOCATION') cur.venue = unescapeText(parsed.value);
    else if (parsed.name === 'DTSTART') cur.start = parseDate(parsed.value);
    else if (parsed.name === 'DTEND') cur.end = parseDate(parsed.value);
  }
  return events.filter(e => e.start && e.end && e.title);
}

const toHM = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const weekdayIdx = (d) => (d.getDay() + 6) % 7; // 0=Mon..6=Sun

// Groups raw parsed events into weekly-recurring slots (>=2 occurrences on
// the same weekday+time+title+venue) or a one-off dated entry (exactly 1).
export function collapseToSchedule(events) {
  const groups = new Map();
  for (const e of events) {
    const key = [weekdayIdx(e.start), toHM(e.start), toHM(e.end), e.title, e.venue || ''].join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  const entries = [];
  for (const occurrences of groups.values()) {
    const first = occurrences.sort((a, b) => a.start - b.start)[0];
    const base = { title: first.title, venue: first.venue || '', start: toHM(first.start), end: toHM(first.end) };
    if (occurrences.length > 1) entries.push({ ...base, recurring: true, day: weekdayIdx(first.start) });
    else entries.push({ ...base, recurring: false, date: isoDate(first.start) });
  }
  return entries;
}

// Matches an event title against each course's code (stored as glyph and/or
// nickname), preferring the longest matching code so e.g. "MA2101" wins
// over a shorter false-positive substring.
export function matchCourseForTitle(title, courses) {
  const upper = title.toUpperCase();
  let best = null;
  for (const c of courses) {
    const codes = [c.glyph, c.nickname].filter(Boolean);
    for (const code of codes) {
      const upperCode = code.toUpperCase();
      if (upperCode.length >= 2 && upper.includes(upperCode)) {
        if (!best || upperCode.length > best.code.length) best = { course: c, code: upperCode };
      }
    }
  }
  return best ? best.course : null;
}

// Parses an .ics file's text, matches each event to a course by code, and
// collapses each course's events into weekly/one-off schedule entries.
export function importIcs(text, courses) {
  const rawEvents = parseIcsEvents(text);
  const byCourseId = {};
  let unmatchedCount = 0;
  for (const e of rawEvents) {
    const course = matchCourseForTitle(e.title, courses);
    if (!course) { unmatchedCount++; continue; }
    (byCourseId[course.id] = byCourseId[course.id] || []).push(e);
  }
  const schedulesByCourseId = {};
  for (const [cid, evs] of Object.entries(byCourseId)) {
    schedulesByCourseId[cid] = collapseToSchedule(evs);
  }
  return { schedulesByCourseId, unmatchedCount, totalParsed: rawEvents.length };
}
