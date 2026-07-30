'use client';
// components/nav/RootRedirect.jsx — `/` has no content of its own anymore;
// it just sends you to whichever site you used last (remembered in
// localStorage by AppNav), defaulting to Math on a first-ever visit.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LAST_SITE_KEY = 'lastSite';

export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let last = null;
    try { last = localStorage.getItem(LAST_SITE_KEY); } catch (e) {}
    router.replace((last === '/japanese' || last === '/bible') ? last : '/math');
  }, [router]);

  return <div className="tk-loading-screen">Loading…</div>;
}
