// lib/ics.js — minimal ICS (iCalendar) parser for course-timetable exports.
// Not a general RFC 5545 implementation: handles the subset real timetable
// exports use (VEVENT blocks with SUMMARY/LOCATION/DTSTART/DTEND/RRULE,
// folded lines, and \, \; \n escapes). Two different export styles both
// need to turn into the same weekly-recurring shape:
//  - most calendar apps (Outlook, Google Calendar) export ONE VEVENT per
//    repeating series with an RRULE (e.g. FREQ=WEEKLY;BYDAY=MO,WE) --
//    handled directly by expandRRule below.
//  - some university timetable tools instead export one VEVENT per
//    session (13 separate lecture events for a 13-week semester), no
//    RRULE at all -- handled by collapsing same weekday/time/title/venue
//    occurrences into a single weekly slot.
// A single occurrence with no RRULE is kept as a one-off dated entry.

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
    else if (parsed.name === 'RRULE') cur.rrule = parsed.value;
  }
  return events.filter(e => e.start && e.end && e.title);
}

const BYDAY_TO_IDX = { MO: 0, TU: 1, WE: 2, TH: 3, FR: 4, SA: 5, SU: 6 };

function parseRRule(value) {
  const parts = {};
  value.split(';').forEach(p => {
    const [k, v] = p.split('=');
    if (k) parts[k.toUpperCase()] = v;
  });
  return parts;
}

const toHM = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const weekdayIdx = (d) => (d.getDay() + 6) % 7; // 0=Mon..6=Sun

// Groups raw parsed events into weekly-recurring slots (>=2 occurrences on
// the same weekday+time+title+venue, or an explicit RRULE) or a one-off
// dated entry (exactly 1, no RRULE).
export function collapseToSchedule(events) {
  const entries = [];
  const plain = [];

  for (const e of events) {
    if (!e.rrule) { plain.push(e); continue; }
    const rule = parseRRule(e.rrule);
    const freq = (rule.FREQ || '').toUpperCase();
    if (freq !== 'WEEKLY') { plain.push(e); continue; } // unsupported freq -- fall back to a one-off
    const base = { title: e.title, venue: e.venue || '', start: toHM(e.start), end: toHM(e.end) };
    const days = rule.BYDAY
      ? rule.BYDAY.split(',').map(code => BYDAY_TO_IDX[code.trim().slice(-2).toUpperCase()]).filter(d => d !== undefined)
      : [weekdayIdx(e.start)];
    (days.length ? days : [weekdayIdx(e.start)]).forEach(day => entries.push({ ...base, recurring: true, day }));
  }

  const groups = new Map();
  for (const e of plain) {
    const key = [weekdayIdx(e.start), toHM(e.start), toHM(e.end), e.title, e.venue || ''].join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
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
