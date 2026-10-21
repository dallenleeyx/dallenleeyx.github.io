'use client';
// components/nav/AppNav.jsx — small fixed corner toggle between sites.
// Deliberately not part of document flow (fixed, bottom-right) so it
// never shifts any existing page's layout. Also remembers whichever site was
// last visited (localStorage), so the root route can send you straight back
// to it -- see app/page.js.
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/japanese', label: 'Japanese' },
  { href: '/fitness', label: 'Fitness' },
  { href: '/math', label: 'Math' },
  { href: '/bible', label: 'Bible' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/portfolio', label: 'Portfolio' },
];

const LAST_SITE_KEY = 'lastSite';

export function AppNav() {
  const pathname = usePathname();

  useEffect(() => {
    const current = pathname?.startsWith('/portfolio/') ? '/portfolio' : pathname;
    if (LINKS.some((l) => l.href === current)) {
      try { localStorage.setItem(LAST_SITE_KEY, current); } catch (e) {}
    }
  }, [pathname]);

  return (
    <nav className="app-nav">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`app-nav-link${pathname === href || (href === '/portfolio' && pathname?.startsWith('/portfolio/')) ? ' active' : ''}` }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
