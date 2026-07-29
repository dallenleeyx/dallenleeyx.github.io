'use client';
// hooks/japanese/useMidnightRollover.js — "today" is only recomputed when
// something re-renders, so a tab left open overnight would keep showing
// yesterday's quota and yesterday's ticked-off rows. Watch for the date
// changing and refresh when it does -- on a timer for a tab that's genuinely
// just sitting there, and on focus/visibility for the far more common case
// of a laptop being woken the next morning.
import { useEffect, useRef, useState } from 'react';
import { todayISO } from '../../lib/japanese/timeline';

export function useMidnightRollover() {
  const [today, setToday] = useState(() => todayISO());
  const lastSeenRef = useRef(today);

  useEffect(() => {
    function refreshIfDayChanged() {
      const now = todayISO();
      if (now === lastSeenRef.current) return;
      lastSeenRef.current = now;
      setToday(now);
    }
    const id = setInterval(refreshIfDayChanged, 60000);
    window.addEventListener('focus', refreshIfDayChanged);
    function onVisibility() { if (!document.hidden) refreshIfDayChanged(); }
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', refreshIfDayChanged);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return today;
}
