'use client';
// hooks/dashboard/useDashboardReports.js — read-only client hook for the
// morning/evening reports. Simpler than useCoursesSync/useGoalPlanSync:
// this data is never edited from the browser (only the two cron routes
// write it), so there's no push/debounce path, just fetch + a slow poll
// (this changes at most twice a day, unlike courses/plan) + a refresh on
// tab focus so a report generated while the tab was backgrounded shows up
// without a manual reload.
import { useCallback, useEffect, useState } from 'react';

const POLL_MS = 5 * 60 * 1000;

export function useDashboardReports() {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/reports');
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setReports(data.reports || {});
      setOffline(false);
    } catch (e) {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, POLL_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchReports(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [fetchReports]);

  return { reports, loading, offline, refresh: fetchReports };
}
