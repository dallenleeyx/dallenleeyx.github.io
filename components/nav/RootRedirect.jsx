'use client';
// components/nav/RootRedirect.jsx — `/` has no content of its own; it just
// sends you to whichever site you used last (remembered in localStorage by
// AppNav), defaulting to Japanese on a first-ever visit.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LAST_SITE_KEY = 'lastSite';
const KNOWN_SITES = ['/japanese', '/fitness', '/math'];

export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let last = null;
    try { last = localStorage.getItem(LAST_SITE_KEY); } catch (e) {}
    router.replace(KNOWN_SITES.includes(last) ? last : '/japanese');
  }, [router]);

  return <div className="auth-loading">Loading…</div>;
}
