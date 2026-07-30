'use client';
// components/tracker/WeekGrid.jsx — an actual week-view calendar grid
// (Outlook/Google-Calendar style): hour rows, day columns, existing
// schedule entries drawn as positioned blocks, and click-or-drag on an
// empty slot to open a quick-add form prefilled with that day/time.
import { useEffect, useRef, useState } from 'react';
import { DAY_NAMES, isoDate } from '../../lib/schedule';

const START_HOUR = 7;
const END_HOUR = 22; // grid covers [START_HOUR, END_HOUR)
const TOTAL_MIN = (END_HOUR - START_HOUR) * 60;
const HOUR_PX = 48;
const GRID_HEIGHT = (END_HOUR - START_HOUR) * HOUR_PX;
const SNAP_MIN = 15;
const DEFAULT_DURATION_MIN = 60;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const pxToMinutes = (px) => clamp(Math.round((START_HOUR * 60 + (px / GRID_HEIGHT) * TOTAL_MIN) / SNAP_MIN) * SNAP_MIN, START_HOUR * 60, END_HOUR * 60);
const minToTopPct = (min) => ((min - START_HOUR * 60) / TOTAL_MIN) * 100;
export const minutesToHM = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const hmToMinutes = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };

export function WeekGrid({ weekStart, items, onEmptySlot, onEventClick }) {
  const [drag, setDrag] = useState(null); // { day, startMin, curMin }
  const dragRef = useRef(null);
  const colRectsRef = useRef({});

  useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const rect = colRectsRef.current[dragRef.current.day];
      if (!rect) return;
      const curMin = pxToMinutes(e.clientY - rect.top);
      dragRef.current = { ...dragRef.current, curMin };
      setDrag({ ...dragRef.current });
    };
    const onUp = () => {
      const d = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      if (!d) return;
      const lo = Math.min(d.startMin, d.curMin);
      const hi = Math.max(d.startMin, d.curMin);
      const start = lo;
      const end = hi - lo >= SNAP_MIN ? hi : lo + DEFAULT_DURATION_MIN;
      onEmptySlot(d.day, minutesToHM(start), minutesToHM(Math.min(end, END_HOUR * 60)));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, onEmptySlot]);

  const startDrag = (day, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    colRectsRef.current[day] = rect;
    const startMin = pxToMinutes(e.clientY - rect.top);
    dragRef.current = { day, startMin, curMin: startMin };
    setDrag({ day, startMin, curMin: startMin });
  };

  const hours = [];
  for (let h = START_HOUR; h < END_HOUR; h++) hours.push(h);

  const dayDates = DAY_NAMES.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const itemsByDay = Array.from({ length: 7 }, () => []);
  items.forEach(it => {
    const dayIdx = it.recurring ? it.day : dayDates.findIndex(d => isoDate(d) === it.date);
    if (dayIdx >= 0 && dayIdx < 7) itemsByDay[dayIdx].push(it);
  });

  return (
    <div className="wg-wrap">
      <div className="wg-header">
        <div className="wg-gutter" />
        {DAY_NAMES.map((name, i) => (
          <div key={name} className="wg-day-head">
            <span className="wg-day-name">{name}</span>
            <span className="wg-day-date">{String(dayDates[i].getDate()).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      <div className="wg-body" style={{ height: GRID_HEIGHT }}>
        <div className="wg-gutter">
          {hours.map(h => (
            <div key={h} className="wg-hour-label" style={{ height: HOUR_PX }}>{String(h).padStart(2, '0')}:00</div>
          ))}
        </div>
        {DAY_NAMES.map((_, day) => (
          <div
            key={day}
            className="wg-day-col"
            onMouseDown={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('wg-hour-line')) startDrag(day, e); }}
          >
            {hours.map((h, i) => (
              <div key={h} className="wg-hour-line" style={{ top: i * HOUR_PX }} />
            ))}
            {itemsByDay[day].map((it, i) => {
              const top = minToTopPct(hmToMinutes(it.start));
              const height = minToTopPct(hmToMinutes(it.end)) - top;
              return (
                <div
                  key={i}
                  className="wg-event"
                  style={{ top: `${top}%`, height: `${Math.max(height, 4)}%` }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => onEventClick(it)}
                >
                  <span className="wg-event-course">{it.course.glyph}</span>
                  <span className="wg-event-title">{it.title}</span>
                  <span className="wg-event-time">{it.start}–{it.end}</span>
                  {it.venue && <span className="wg-event-venue">{it.venue}</span>}
                </div>
              );
            })}
            {drag && drag.day === day && (
              <div
                className="wg-drag-ghost"
                style={{
                  top: `${minToTopPct(Math.min(drag.startMin, drag.curMin))}%`,
                  height: `${Math.max(minToTopPct(Math.max(drag.startMin, drag.curMin)) - minToTopPct(Math.min(drag.startMin, drag.curMin)), 2)}%`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
