'use client';
// components/math/TableOfContents.jsx — jump links to each section heading
// rendered by Browse. Plain anchor links rather than scroll-spy: the app
// already sets scroll-behavior: smooth globally (see app/layout.js), so a
// click glides to the section instead of jumping, without needing to track
// which one is currently in view.
export function TableOfContents({ groups }) {
  if (!groups.length) return null;
  return (
    <nav className="math-toc" aria-label="Section contents">
      <span className="math-toc-title">Contents</span>
      <ul className="math-toc-list">
        {groups.map((g) => (
          <li key={g.anchor}>
            <a href={`#${g.anchor}`} className={`math-toc-link${g.id === '' ? ' math-toc-link-unsectioned' : ''}`}>
              {g.name || 'Unsectioned'}
              <span className="math-toc-count">{g.items.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
