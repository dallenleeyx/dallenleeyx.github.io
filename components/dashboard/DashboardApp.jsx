'use client';
// components/dashboard/DashboardApp.jsx — the "/" Dashboard. No more AI
// assistant (cut, not worth the recurring spend) -- this is the combined
// home base instead: this week's academic calendar position, every
// important date across math and Japanese, an interactive checklist for
// both, this week's class schedule, and a courses jump grid (the last two
// moved here from /math's own now-removed in-app Dashboard tab).
//
// Mounts Japanese's own JapaneseSyncProvider + PlanProvider so the
// checklist can read/toggle Japanese tasks through the exact same
// usePlan() calls /japanese itself uses -- same merge semantics, same
// synced document, not a separate copy (see TaskChecklist.jsx).
import { useCoursesSync } from '../../lib/useCoursesSync';
import { JapaneseSyncProvider } from '../../lib/japanese/SyncContext';
import { PlanProvider } from '../../lib/japanese/PlanContext';
import { AcademicWeekBanner } from './AcademicWeekBanner';
import { ImportantDates } from './ImportantDates';
import { TaskChecklist } from './TaskChecklist';
import { WeekSchedule } from './WeekSchedule';
import { CoursesGrid } from './CoursesGrid';

function DashboardInner() {
  const { courses, setCourses, loading } = useCoursesSync();

  return (
    <div className="dash-shell">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <div className="sub">Everything you need to do, in one place</div>
      </div>

      <AcademicWeekBanner />

      {loading || !courses ? (
        <p className="tk-note-p tk-note-empty">Loading…</p>
      ) : (
        <div className="dash-grid">
          <ImportantDates courses={courses} />
          <TaskChecklist courses={courses} setCourses={setCourses} />
          <WeekSchedule courses={courses} />
          <CoursesGrid courses={courses} />
        </div>
      )}
    </div>
  );
}

export function DashboardApp() {
  return (
    <JapaneseSyncProvider>
      <PlanProvider>
        <DashboardInner />
      </PlanProvider>
    </JapaneseSyncProvider>
  );
}
