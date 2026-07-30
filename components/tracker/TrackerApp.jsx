'use client';
// components/tracker/TrackerApp.jsx — course + assignment tracking, calendar,
// and per-course notes. Courses sync cross-device via useCoursesSync; theme
// and sidebar-collapsed state stay local-only.
import { useCallback, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { extractToc, renderDoc } from '../../lib/markdown';
import { useCoursesSync } from '../../lib/useCoursesSync';
import { getWeekSchedule, getWeekDueAssignments, getWeekHolidays, groupByDate, isoWeekday, DAY_NAMES } from '../../lib/schedule';
import { MathParticles } from './MathParticles';
import { Calendar } from './Calendar';
import { NotesEditor } from './NotesEditor';
import { Revision } from './Revision';
import { AddCourseModal } from './AddCourseModal';
import { EditCourseModal } from './EditCourseModal';
import { CalendarTab } from './CalendarTab';
import { ImportBanner } from './ImportBanner';

const STATUS_ORDER = ['todo', 'doing', 'done'];
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function daysInfo(due, status) {
  if (!due || status === 'done') return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((new Date(due + 'T00:00:00') - today) / 86400000);
  if (diff < 0) return { label: `overdue ${-diff}d`, cls: 'overdue' };
  if (diff === 0) return { label: 'due today', cls: 'today' };
  return { label: `${diff}d left`, cls: diff <= 3 ? 'soon' : '' };
}

function SectionLabel({ children, sub, actions }) {
  return (
    <div className="tk-section-label">
      <span>{children}{sub && <span className="sub">— {sub}</span>}</span>
      {actions}
    </div>
  );
}

function Empty({ icon, children }) {
  return <div className="tk-empty"><div className="icon">{icon}</div><div className="title">{children}</div></div>;
}

function StatusPill({ status, onCycle }) {
  const label = { todo: 'TODO', doing: 'WIP', done: 'DONE' }[status];
  return <button className={`tk-pill ${status}`} onClick={onCycle} title="click to cycle status">{label}</button>;
}

function AssignmentRow({ a, showCourse, onCycle, onRemove }) {
  const di = daysInfo(a.due, a.status);
  return (
    <div className="tk-tl-item">
      <div className="tk-row-card">
        <div style={{ minWidth: 0 }}>
          <div className={`tk-row-title${a.status === 'done' ? ' done' : ''}`}>{a.title}</div>
          <div className="tk-row-meta">{showCourse ? `${showCourse} · ` : ''}{a.due || 'no due date'}</div>
        </div>
        <div className="tk-row-actions">
          {di && <span className={`tk-days ${di.cls}`}>{di.label}</span>}
          <StatusPill status={a.status} onCycle={onCycle} />
          {onRemove && <button className="tk-x-btn" onClick={onRemove}>×</button>}
        </div>
      </div>
    </div>
  );
}

export function TrackerApp() {
  const { courses, setCourses, loading, offline, seeded, importData } = useCoursesSync();
  const [importDismissed, setImportDismissed] = useState(false);
  const [view, setView] = useState('dashboard');
  const [calCursor, setCalCursor] = useState({ y: new Date().getFullYear(), m: new Date().getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('proofLabTheme') || 'light'; } catch (e) { return 'light'; } });
  const [sidebarOpen, setSidebarOpen] = useState(() => { try { return localStorage.getItem('proofLabSidebar') !== 'closed'; } catch (e) { return true; } });
  const [notesOpenFor, setNotesOpenFor] = useState(null); // course id | null
  const [revisionOpenFor, setRevisionOpenFor] = useState(null); // course id | null
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourseFor, setEditCourseFor] = useState(null); // course id | null

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = (next) => {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('proofLabTheme', next); } catch (e) {}
  };
  const applySidebar = (open) => {
    setSidebarOpen(open);
    try { localStorage.setItem('proofLabSidebar', open ? 'open' : 'closed'); } catch (e) {}
  };

  const mutate = useCallback((courseId, fn) => {
    setCourses(cs => cs.map(c => c.id === courseId ? fn(c) : c));
  }, [setCourses]);
  const cycle = (cid, id) => mutate(cid, c => ({ ...c, assignments: c.assignments.map(a => a.id !== id ? a : { ...a, status: STATUS_ORDER[(STATUS_ORDER.indexOf(a.status) + 1) % 3] }) }));
  const removeA = (cid, id) => mutate(cid, c => ({ ...c, assignments: c.assignments.filter(a => a.id !== id) }));
  const updateDoc = (cid, text) => mutate(cid, c => ({ ...c, doc: text }));
  const draft = (k) => drafts[k] || '';
  const setDraft = (k, v) => setDrafts(d => ({ ...d, [k]: v }));
  const addAssignment = (cid) => {
    const title = draft(cid + ':title').trim();
    if (!title) return;
    mutate(cid, c => ({ ...c, assignments: [...c.assignments, { id: 'a' + Date.now(), title, due: draft(cid + ':due'), status: 'todo' }] }));
    setDrafts(d => ({ ...d, [cid + ':title']: '', [cid + ':due']: '' }));
  };
  const addCourse = ({ title, code, desc }) => {
    const id = 'c' + newId();
    const label = code || title.slice(0, 2).toUpperCase();
    setCourses(cs => [...cs, { id, name: title, glyph: label, nickname: label, description: desc, assignments: [], doc: '', schedule: [] }]);
    setAddCourseOpen(false);
    setView(id);
  };
  const updateCourseMeta = (cid, fields) => mutate(cid, c => ({ ...c, ...fields }));
  const removeCourse = (cid) => {
    setCourses(cs => cs.filter(c => c.id !== cid));
    if (view === cid) setView('dashboard');
    if (notesOpenFor === cid) setNotesOpenFor(null);
    if (revisionOpenFor === cid) setRevisionOpenFor(null);
    setEditCourseFor(null);
  };

  // an entry "matches" an existing one if title/venue/time and either the
  // same weekday (recurring) or the same date (one-off) agree -- used to
  // skip duplicates on manual add and on repeated .ics imports.
  const sameEntry = (a, b) =>
    a.title === b.title && (a.venue || '') === (b.venue || '') && a.start === b.start && a.end === b.end &&
    a.recurring === b.recurring && (a.recurring ? a.day === b.day : a.date === b.date);
  const addSchedule = (cid, entry) => mutate(cid, c => {
    const existing = c.schedule || [];
    if (existing.some(e => sameEntry(e, entry))) return c;
    return { ...c, schedule: [...existing, { ...entry, id: 'sc' + newId() }] };
  });
  const removeSchedule = (cid, id) => mutate(cid, c => ({ ...c, schedule: (c.schedule || []).filter(e => e.id !== id) }));
  const importSchedules = (schedulesByCourseId) => {
    setCourses(cs => cs.map(c => {
      const incoming = schedulesByCourseId[c.id];
      if (!incoming || !incoming.length) return c;
      const existing = c.schedule || [];
      // Re-importing the same class refreshes its seriesStart/seriesEnd/
      // exdates from the file instead of silently keeping whatever was
      // stored on the first import -- otherwise a term-bounds fix (or a
      // corrected .ics) would never actually reach already-imported data.
      const merged = existing.map(e => {
        const match = incoming.find(entry => sameEntry(e, entry));
        return match ? { ...e, ...match, id: e.id } : e;
      });
      incoming.forEach(entry => {
        if (!merged.some(e => sameEntry(e, entry))) merged.push({ ...entry, id: 'sc' + newId() });
      });
      return { ...c, schedule: merged };
    }));
  };

  if (loading || !courses) {
    return <div className="tk-loading-screen">Loading your courses…</div>;
  }

  const current = courses.find(c => c.id === view);
  const totals = {
    all: courses.reduce((s, c) => s + c.assignments.length, 0),
    done: courses.reduce((s, c) => s + c.assignments.filter(a => a.status === 'done').length, 0),
  };
  const upcoming = courses
    .flatMap(c => c.assignments.filter(a => a.status !== 'done').map(a => ({ ...a, course: c })))
    .sort((x, y) => (x.due || '9999').localeCompare(y.due || '9999'));
  const now = new Date();
  const courseToEdit = editCourseFor ? courses.find(c => c.id === editCourseFor) : null;
  const courseToc = current ? extractToc(current.doc, 'ih-') : [];
  const weekSchedule = getWeekSchedule(courses, now);
  const weekDue = getWeekDueAssignments(courses, now);
  const weekHolidays = getWeekHolidays(now).map(h => ({ date: h.date, title: h.label, kind: 'holiday' }));
  const weekByDate = groupByDate([...weekHolidays, ...weekDue, ...weekSchedule]);
  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`tk-app${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <MathParticles />

      {!sidebarOpen && (
        <button className="tk-sidebar-expand-btn" onClick={() => applySidebar(true)} title="Expand sidebar">☰</button>
      )}

      <aside className="tk-sidebar">
        <button className="tk-sidebar-collapse-btn" onClick={() => applySidebar(false)} title="Collapse sidebar">‹</button>
        <div className="tk-brand">
          <div className="tk-avatar">
            <span className="tk-avatar-glyph">∮</span>
            <div className="tk-avatar-ring" />
          </div>
          <div>
            <div className="tk-brand-name">Dallen's Math Notes</div>
            <div className="tk-brand-sub">NUS · Mathematics</div>
          </div>
        </div>
        <button className="tk-theme-toggle" onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <ul className="tk-nav">
          <li><a className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><span className="dot" />Dashboard</a></li>
          {courses.map(c => (
            <li key={c.id}>
              <a className={view === c.id ? 'active' : ''} onClick={() => setView(c.id)}>
                <span className="dot" />{c.nickname}
                <span className="count">{c.assignments.filter(a => a.status !== 'done').length}</span>
              </a>
            </li>
          ))}
          <li><a className="tk-nav-add" onClick={() => setAddCourseOpen(true)}><span className="dot" />+ Add course</a></li>
        </ul>
        <Calendar courses={courses} cursor={calCursor} selected={selectedDate} onSelect={setSelectedDate}
          onShift={(d) => { setSelectedDate(null); setCalCursor(({ y, m }) => { let nm = m + d, ny = y; if (nm < 0) { nm = 11; ny--; } if (nm > 11) { nm = 0; ny++; } return { y: ny, m: nm }; }); }} />
        <button className={`tk-nav-cal-btn${view === 'calendar' ? ' active' : ''}`} onClick={() => setView('calendar')}>
          <span className="dot" />Calendar
        </button>
        <div className="tk-sidebar-foot">
          {offline ? 'Offline — changes saved on this device.' : 'Synced.'}
          <button className="tk-mono-btn" style={{ marginTop: '.6rem', width: '100%' }} onClick={() => signOut()}>Sign out</button>
        </div>
      </aside>

      <main className="tk-main">
        {view === 'dashboard' && (
          <section>
            {seeded && !importDismissed && (
              <ImportBanner
                onImport={(imported) => { importData(imported); setImportDismissed(true); }}
                onDismiss={() => setImportDismissed(true)}
              />
            )}
            <div className="tk-hero fade-up">
              <div>
                <h1>Dashboard</h1>
                <div className="tk-hero-meta">{String(now.getDate()).padStart(2,'0')} {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
              </div>
            </div>
            <div className="tk-stats fade-up d1">
              <div className="tk-stat"><div className="tk-stat-num">{totals.all - totals.done}</div><div className="tk-stat-cap">Pending</div></div>
              <div className="tk-stat"><div className="tk-stat-num">{totals.done}<span>/{totals.all}</span></div><div className="tk-stat-cap">Completed</div></div>
            </div>
            <div className="fade-up d2">
              <SectionLabel sub="soonest due first">Assignments</SectionLabel>
              {upcoming.length ? (
                <div className="tk-timeline" style={{ marginBottom: '3.2rem' }}>
                  {upcoming.map(a => (
                    <AssignmentRow key={a.id} a={a} showCourse={`${a.course.glyph} · ${a.course.name}`} onCycle={() => cycle(a.course.id, a.id)} />
                  ))}
                </div>
              ) : <div style={{ marginBottom: '3.2rem' }}><Empty icon="✅">Nothing pending.</Empty></div>}
            </div>
            <div className="fade-up d2">
              <SectionLabel sub="this week, all courses combined — due assignments in blue, holidays in green">Schedule</SectionLabel>
              {(weekSchedule.length || weekDue.length || weekHolidays.length) ? (
                <div className="tk-week-schedule" style={{ marginBottom: '3.2rem' }}>
                  {[...weekByDate.entries()].map(([date, items]) => (
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
              ) : <div style={{ marginBottom: '3.2rem' }}><Empty icon="🗓️">No classes scheduled — add one from the Calendar tab.</Empty></div>}
            </div>
            <div className="fade-up d3">
              <SectionLabel>Courses</SectionLabel>
              <div className="tk-jump-grid">
                {courses.map(c => {
                  const done = c.assignments.filter(a => a.status === 'done').length;
                  const pct = c.assignments.length ? Math.round(done / c.assignments.length * 100) : 0;
                  return (
                    <div key={c.id} className="tk-jump" onClick={() => setView(c.id)}>
                      <div className="tk-jump-glyph">{c.glyph}</div>
                      <div className="tk-jump-name">{c.name}</div>
                      <div className="tk-jump-meta">{c.assignments.length - done} open</div>
                      <div className="tk-progress"><div className="tk-progress-fill" style={{ width: pct + '%' }} /></div>
                    </div>
                  );
                })}
                <div className="tk-jump tk-jump-add" onClick={() => setAddCourseOpen(true)}>
                  <div className="tk-jump-add-plus">+</div>
                  <div className="tk-jump-name">Add course</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {current && (
          <section key={current.id}>
            <div className="fade-up no-print">
              <div className="tk-hero">
                <div>
                  <div className="tk-course-head">
                    <span className="tk-course-glyph">{current.glyph}</span>
                    <span className="tk-course-name">{current.name}</span>
                  </div>
                  {current.description && <div className="tk-course-desc">{current.description}</div>}
                  <div className="tk-hero-meta">{current.assignments.filter(a => a.status !== 'done').length} open</div>
                </div>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <button className="tk-btn tk-btn-outline" onClick={() => setRevisionOpenFor(current.id)}>Revision</button>
                  <button className="tk-btn tk-btn-outline" onClick={() => setEditCourseFor(current.id)}>Edit</button>
                </div>
              </div>
              <div className="tk-progress" style={{ margin: '1.4rem 0 3rem', maxWidth: 420 }}>
                <div className="tk-progress-fill" style={{ width: (current.assignments.length ? Math.round(current.assignments.filter(a => a.status === 'done').length / current.assignments.length * 100) : 0) + '%' }} />
              </div>
            </div>

            <div className="fade-up d1 no-print">
              <SectionLabel>Assignments</SectionLabel>
              <div className="tk-timeline">
                {current.assignments.map(a => (
                  <AssignmentRow key={a.id} a={a} onCycle={() => cycle(current.id, a.id)} onRemove={() => removeA(current.id, a.id)} />
                ))}
              </div>
              <div className="tk-form-row">
                <input className="tk-input" placeholder="new assignment…" value={draft(current.id + ':title')} onChange={e => setDraft(current.id + ':title', e.target.value)} onKeyDown={e => e.key === 'Enter' && addAssignment(current.id)} />
                <input className="tk-input tk-input-date" type="date" value={draft(current.id + ':due')} onChange={e => setDraft(current.id + ':due', e.target.value)} />
                <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => addAssignment(current.id)}>Add</button>
              </div>
            </div>

            <div className="fade-up d2">
              <SectionLabel sub="hover a red tab to read a flag" actions={
                <div className="tk-notes-actions no-print" style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => setNotesOpenFor(current.id)}>Edit</button>
                  <button className="tk-btn tk-btn-outline tk-btn-sm" onClick={() => window.print()}>Export to PDF</button>
                </div>
              }>Notes</SectionLabel>
              <div className="tk-doc-preview-layout">
                <div className="tk-doc-toc no-print">
                  <div className="tk-doc-toc-label">Contents</div>
                  {courseToc.length ? courseToc.map(h => (
                    <a key={h.id} className={`tk-doc-toc-item lvl${h.level}`} onClick={() => scrollToHeading(h.id)}>{h.text || 'Untitled'}</a>
                  )) : <div className="tk-doc-toc-empty">Add a # heading</div>}
                </div>
                <div className="tk-doc-preview">
                  {(current.doc || '').trim() ? renderDoc(current.doc, 'ih-') : <div className="tk-note-p tk-note-empty">Nothing written yet. Click "Edit" to start.</div>}
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'calendar' && (
          <CalendarTab courses={courses} onAddEntry={addSchedule} onRemoveEntry={removeSchedule} onImport={importSchedules} />
        )}
      </main>

      {notesOpenFor && (() => {
        const c = courses.find(x => x.id === notesOpenFor);
        if (!c) return null;
        return <NotesEditor course={c} doc={c.doc} onClose={() => setNotesOpenFor(null)} onChange={(text) => updateDoc(c.id, text)} />;
      })()}

      {revisionOpenFor && (() => {
        const c = courses.find(x => x.id === revisionOpenFor);
        if (!c) return null;
        return <Revision course={c} onClose={() => setRevisionOpenFor(null)} />;
      })()}

      {addCourseOpen && <AddCourseModal onClose={() => setAddCourseOpen(false)} onCreate={addCourse} />}
      {courseToEdit && (
        <EditCourseModal
          course={courseToEdit}
          onClose={() => setEditCourseFor(null)}
          onSave={(fields) => { updateCourseMeta(courseToEdit.id, fields); setEditCourseFor(null); }}
          onDelete={() => removeCourse(courseToEdit.id)}
        />
      )}
    </div>
  );
}
