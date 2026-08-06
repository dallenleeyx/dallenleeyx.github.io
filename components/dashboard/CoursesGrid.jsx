'use client';
// components/dashboard/CoursesGrid.jsx — moved here from /math's old
// in-app Dashboard tab: a jump grid to each course, with an open-item
// progress bar. Links to /math?course=<id>, which TrackerApp reads on
// mount to open straight to that course.
import { useRouter } from 'next/navigation';

export function CoursesGrid({ courses }) {
  const router = useRouter();
  const activeCourses = courses.filter((c) => !c.archived);

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">Courses</span>
      </div>
      <div className="tk-jump-grid">
        {activeCourses.map((c) => {
          const done = c.assignments.filter((a) => a.status === 'done').length;
          const pct = c.assignments.length ? Math.round((done / c.assignments.length) * 100) : 0;
          return (
            <div key={c.id} className="tk-jump" onClick={() => router.push(`/math?course=${c.id}`)}>
              <div className="tk-jump-glyph">{c.glyph}</div>
              <div className="tk-jump-name">{c.name}</div>
              <div className="tk-jump-meta">{c.assignments.length - done} open</div>
              <div className="tk-progress"><div className="tk-progress-fill" style={{ width: pct + '%' }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
