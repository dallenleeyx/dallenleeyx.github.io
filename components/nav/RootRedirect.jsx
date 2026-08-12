'use client';
// components/nav/RootRedirect.jsx — `/` has no content of its own; it just
// sends you to whichever site you used last (remembered in localStorage by
// AppNav), defaulting to Japanese on a first-ever visit (Math is gone --
// moved to Notion).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LAST_SITE_KEY = 'lastSite';

export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let last = null;
    try { last = localStorage.getItem(LAST_SITE_KEY); } catch (e) {}
    router.replace(last === '/fitness' ? last : '/japanese');
  }, [router]);

  return <div className="auth-loading">Loading…</div>;
}
