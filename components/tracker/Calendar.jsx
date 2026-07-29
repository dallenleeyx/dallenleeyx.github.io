'use client';
// components/tracker/Calendar.jsx — month grid with due-date dots + detail panel
import { useMemo } from 'react';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

export function Calendar({ courses, cursor, onShift, selected, onSelect }) {
  const { y, m } = cursor;
  const todayIso = isoOf(new Date());
  const dueMap = useMemo(() => {
    const map = {};
    courses.forEach(c => c.assignments.forEach(a => {
      if (a.due && a.status !== 'done') (map[a.due] = map[a.due] || []).push({ title: a.title, glyph: c.glyph });
    }));
    return map;
  }, [courses]);
  const first = new Date(y, m, 1);
  const startIdx = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m, i - startIdx + 1);
    cells.push({ d, iso: isoOf(d), inMonth: d.getMonth() === m });
  }
  const selItems = selected ? (dueMap[selected] || []) : [];
  const selD = selected ? new Date(selected + 'T00:00:00') : null;
  return (
    <div className="tk-cal">
      <div className="tk-cal-head">
        <span className="tk-cal-label">{MONTHS[m]} {y}</span>
        <div style={{ display: 'flex', gap: '.25rem' }}>
          <button className="tk-cal-btn" onClick={() => onShift(-1)}>‹</button>
          <button className="tk-cal-btn" onClick={() => onShift(1)}>›</button>
        </div>
      </div>
      <div className="tk-cal-grid" style={{ marginBottom: 2 }}>
        {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="tk-cal-dow">{d}</span>)}
      </div>
      <div className="tk-cal-grid">
        {cells.map(({ d, iso, inMonth }) => {
          const cls = ['tk-cal-cell', !inMonth && 'out', iso === todayIso && 'today', iso === selected && 'selected'].filter(Boolean).join(' ');
          return (
            <div key={iso} className={cls} onClick={() => inMonth && onSelect(selected === iso ? null : iso)}>
              {d.getDate()}
              {inMonth && dueMap[iso] && <span className="due-dot" />}
            </div>
          );
        })}
      </div>
      {selected && (
        <div className="tk-cal-detail">
          <div className="tk-cal-detail-date">due {String(selD.getDate()).padStart(2,'0')} {MONTHS[selD.getMonth()]}</div>
          {selItems.map((it, i) => (
            <div key={i} className="tk-cal-detail-row"><span className="glyph">{it.glyph}</span><span className="title">{it.title}</span></div>
          ))}
          {!selItems.length && <div className="tk-cal-detail-empty">Nothing due.</div>}
        </div>
      )}
    </div>
  );
}
