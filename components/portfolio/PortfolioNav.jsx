'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { href: '/portfolio/music', label: 'Music', icon: '♫', number: '01' },
  { href: '/portfolio/engineering', label: 'Engineering', icon: '⌁', number: '02' },
  { href: '/portfolio/ml', label: 'ML / AI', icon: '⌘', number: '03' },
];

export function PortfolioNav() {
  const pathname = usePathname();
  return (
    <header className="pf-header">
      <Link href="/portfolio" className="pf-wordmark" aria-label="Portfolio home">
        <span className="pf-mark">D<span>.</span></span>
        <span className="pf-brand-copy">DALLEN LEE<span> / PORTFOLIO</span></span>
      </Link>
      <nav className="pf-topnav" aria-label="Portfolio categories">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={'pf-toplink ' + (pathname === section.href ? 'is-active' : '')}
            aria-current={pathname === section.href ? 'page' : undefined}
          >
            <span className="pf-toplink-icon" aria-hidden="true">{section.icon}</span>
            {section.label}
          </Link>
        ))}
      </nav>
      <a className="pf-github" href="https://github.com/dallenleeyx" target="_blank" rel="noopener noreferrer">
        <span>GITHUB</span> ↗
      </a>
    </header>
  );
}
