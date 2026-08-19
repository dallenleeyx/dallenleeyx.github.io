'use client';
// components/projects/ProjectsExplorer.jsx — searchable/filterable grid of
// Google Colab projects. Category pills are derived from whatever
// categories appear in lib/cv/data.js, so adding a new category there is
// enough to get a new filter pill here for free.
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { COLAB_PROJECTS } from '../../lib/cv/data';

const ALL = 'All';

export function ProjectsExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(COLAB_PROJECTS.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COLAB_PROJECTS.filter((p) => {
      const matchesCategory = category === ALL || p.category === category;
      const matchesQuery = !q
        || p.title.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="proj">
      <header className="proj-header">
        <Link href="/" className="proj-back">← Home</Link>
        <p className="t-eyebrow proj-eyebrow">Projects</p>
        <h1 className="t-h1 proj-title">My Colab Projects</h1>
        <p className="proj-subtitle">
          A running, searchable collection of notebooks and experiments — mostly built and
          run in Google Colab.
        </p>
      </header>

      <div className="proj-controls">
        <label className="proj-search">
          <svg className="proj-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
          />
        </label>

        <div className="proj-filters" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`proj-filter${category === c ? ' active' : ''}`}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="proj-count">
        {filtered.length} project{filtered.length === 1 ? '' : 's'}
      </p>

      {filtered.length > 0 ? (
        <div className="proj-grid">
          {filtered.map((p) => (
            <a
              key={p.title}
              className="proj-card"
              href={p.colabUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <div className="proj-card-head">
                <span className="proj-card-category">{p.category}</span>
                <span className="proj-card-icon" aria-hidden="true">↗</span>
              </div>
              <h3 className="proj-card-title">{p.title}</h3>
              <p className="proj-card-desc">{p.description}</p>
              <span className="proj-card-cta">Open in Colab</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="proj-empty">
          No projects match {query ? `“${query}”` : 'this category'}.
        </p>
      )}
    </div>
  );
}
