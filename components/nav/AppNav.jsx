'use client';
// components/nav/AppNav.jsx — small fixed corner nav between the site's
// routes. Deliberately not part of document flow (fixed, bottom-right) so
// it never shifts any existing page's layout.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/japanese', label: 'Japanese' },
  { href: '/fitness', label: 'Fitness' },
];

export function AppNav() {
  const pathname = usePathname();

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
