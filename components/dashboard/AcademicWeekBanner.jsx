'use client';
// components/dashboard/AcademicWeekBanner.jsx — "which NUS week is it right
// now" strip at the top of the Dashboard, plus any holiday inside it.
import { currentAcademicBlock, nextAcademicBlock } from '../../lib/academicCalendar';
import { NUS_HOLIDAYS } from '../../lib/holidays';
import { todayISO } from '../../lib/japanese/timeline';

const DATE_OPTS = { day: 'numeric', month: 'short' };
function fmtOne(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', DATE_OPTS);
}
function fmtRange(startISO, endISO) {
  return `${fmtOne(startISO)} – ${fmtOne(endISO)}`;
}

export function AcademicWeekBanner() {
  const today = todayISO();
  const block = currentAcademicBlock(today);
  const next = !block ? nextAcademicBlock(today) : null;
  const holidaysThisWeek = block ? NUS_HOLIDAYS.filter((h) => h.date >= block.start && h.date <= block.end) : [];

  return (
    <div className="dash-week-banner">
      {block ? (
        <>
          <div className="dash-week-title">{block.label}</div>
          <div className="dash-week-range">{fmtRange(block.start, block.end)}</div>
        </>
      ) : next ? (
        <>
          <div className="dash-week-title">Term break</div>
          <div className="dash-week-range">{next.label} starts {fmtOne(next.start)}</div>
        </>
      ) : (
        <div className="dash-week-title">No term dates on file for this date</div>
      )}
      {holidaysThisWeek.map((h) => (
        <span key={h.date} className="dash-week-holiday">{h.label}</span>
      ))}
    </div>
  );
}
