'use client';
// components/dashboard/TodayTasks.jsx — renders useTodayTasks()'s two
// separate lists. Click-throughs go to /math or /japanese; this card is
// display-only, see the hook's own comment for why.
import { useRouter } from 'next/navigation';
import { useTodayTasks } from '../../hooks/dashboard/useTodayTasks';

const LEVEL_LABEL = { N4: 'N4', N3: 'N3' };

function formatLesson(t) {
  return `${t.kind === 'vocab' ? 'Vocab' : 'Grammar'} — ${LEVEL_LABEL[t.level] || t.level} Lesson ${t.lesson}`;
}

export function TodayTasks() {
  const { mathItems, japaneseToday, loading } = useTodayTasks();
  const router = useRouter();

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">Today &amp; upcoming</span>
      </div>

      <div className="dash-task-group">
        <div className="dash-task-group-label">Math — due soon</div>
        {loading ? (
          <p className="tk-note-p tk-note-empty">Loading…</p>
        ) : mathItems.length === 0 ? (
          <p className="tk-note-p tk-note-empty">Nothing due in the next two weeks.</p>
        ) : (
          mathItems.slice(0, 8).map((item) => (
            <div key={item.id} className="dash-task-item" onClick={() => router.push('/math')}>
              <span className="dash-task-date">{item.date.slice(5)}</span>
              <span className="dash-task-title">{item.title}</span>
              <span className="dash-task-course">{item.course.glyph}</span>
            </div>
          ))
        )}
      </div>

      <div className="dash-task-group">
        <div className="dash-task-group-label">Japanese — today</div>
        {loading || !japaneseToday ? (
          <p className="tk-note-p tk-note-empty">Loading…</p>
        ) : japaneseToday.phase === 'learn' ? (
          [...japaneseToday.nextVocab, ...japaneseToday.nextGrammar].length === 0 ? (
            <p className="tk-note-p tk-note-empty">All caught up.</p>
          ) : (
            [...japaneseToday.nextVocab, ...japaneseToday.nextGrammar].map((t, i) => (
              <div key={i} className="dash-task-item" onClick={() => router.push('/japanese')}>
                <span className="dash-task-title">{formatLesson(t)}</span>
              </div>
            ))
          )
        ) : japaneseToday.phase === 'review' ? (
          japaneseToday.habits.map((h) => (
            <div key={h.id} className="dash-task-item" onClick={() => router.push('/japanese')}>
              <span className="dash-task-title">{h.label}</span>
            </div>
          ))
        ) : (
          <p className="tk-note-p tk-note-empty">Study plan finished — nice work.</p>
        )}
      </div>
    </div>
  );
}
