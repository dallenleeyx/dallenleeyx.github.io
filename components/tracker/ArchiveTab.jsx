'use client';
// components/tracker/ArchiveTab.jsx — full-page tab listing archived
// (done-with) courses. Archiving just sets a boolean on the course object
// (see TrackerApp.jsx's `archived` field) so nothing here ever deletes
// data -- it's purely a "keep this out of the active dashboard/sidebar"
// filter, reversible with one click.
function Empty({ icon, children }) {
  return <div className="tk-empty"><div className="icon">{icon}</div><div className="title">{children}</div></div>;
}

export function ArchiveTab({ courses, onOpen, onUnarchive }) {
  return (
    <section>
      <div className="tk-hero fade-up">
        <div>
          <h1>Archive</h1>
          <div className="tk-hero-meta">Courses you've marked done -- hidden from the sidebar and dashboard, but still here</div>
        </div>
      </div>
      {courses.length ? (
        <div className="tk-jump-grid fade-up d1">
          {courses.map(c => {
            const done = c.assignments.filter(a => a.status === 'done').length;
            return (
              <div key={c.id} className="tk-jump tk-jump-archived" onClick={() => onOpen(c.id)}>
                <div className="tk-jump-glyph">{c.glyph}</div>
                <div className="tk-jump-name">{c.name}</div>
                <div className="tk-jump-meta">{done}/{c.assignments.length} done</div>
                <button
                  className="tk-mono-btn"
                  onClick={(e) => { e.stopPropagation(); onUnarchive(c.id); }}
                >
                  Unarchive
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="fade-up d1"><Empty icon="🗄️">No archived courses yet -- use the "Archive" button on a course page once you're done with it.</Empty></div>
      )}
    </section>
  );
}
