'use client';
// components/nav/AppNav.jsx — small fixed corner toggle between the two
// sites. Deliberately not part of document flow (fixed, bottom-right) so it
// never shifts any existing page's layout. Also remembers whichever site was
// last visited (localStorage), so the root route can send you straight back
// to it -- see app/page.js.
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/math', label: 'Math' },
  { href: '/japanese', label: 'Japanese' },
  { href: '/music', label: 'Music' },
];

const LAST_SITE_KEY = 'lastSite';

export function AppNav() {
  const pathname = usePathname();

  useEffect(() => {
    if (LINKS.some((l) => l.href === pathname)) {
      try { localStorage.setItem(LAST_SITE_KEY, pathname); } catch (e) {}
    }
  }, [pathname]);

  return (
    <nav className="app-nav">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`app-nav-link${pathname === href ? ' active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
