'use client';
// components/jobs/JobsAppShell.jsx — top-level client wrapper for the Jobs
// section. Just a header over the board -- no course/tab switching needed,
// unlike Math/Bible, since this is a single flat pipeline.
import { JobsSyncProvider } from '../../lib/jobs/JobsSyncContext';
import { Board } from './Board';

export function JobsAppShell() {
  return (
    <JobsSyncProvider>
      <div className="job-shell">
        <header className="job-header">
          <span className="job-brand">
            <span className="job-brand-icon" aria-hidden="true">◆</span>
            <span className="job-brand-text">Jobs</span>
          </span>
          <span className="job-subtitle">company, role, status — add as you go</span>
        </header>
        <main className="job-main">
          <Board />
        </main>
      </div>
    </JobsSyncProvider>
  );
}
