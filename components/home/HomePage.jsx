// components/home/HomePage.jsx — public CV landing page. Server component
// (no interactivity needed here — the search/filter UI lives on /projects).
import Link from 'next/link';
import { PROFILE, WRITING, COURSES } from '../../lib/cv/data';

export function HomePage() {
  return (
    <div className="home">
      <header className="home-hero">
        <p className="t-eyebrow home-eyebrow">Portfolio</p>
        <h1 className="t-display home-name">{PROFILE.name}</h1>
        <p className="home-tagline">{PROFILE.tagline}</p>
        <div className="home-actions">
          <Link href="/projects" className="home-btn home-btn-primary">View Projects</Link>
          <a href={`mailto:${PROFILE.email}`} className="home-btn home-btn-ghost">Get in Touch</a>
        </div>
        <ul className="home-links">
          {PROFILE.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer noopener">{l.label}</a>
            </li>
          ))}
        </ul>
      </header>

      <section className="home-section" aria-labelledby="about-heading">
        <p className="t-section-label home-section-label">About</p>
        <div className="home-about">
          <p className="home-about-text">{PROFILE.aboutLong}</p>
          <ul className="home-focus-list">
            {PROFILE.focusAreas.map((f) => (
              <li key={f} className="home-focus-chip">{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section" aria-labelledby="writing-heading">
        <div className="home-section-head">
          <p className="t-section-label home-section-label">Papers &amp; Projects</p>
          <h2 id="writing-heading" className="t-h2 home-section-title">Selected Work</h2>
        </div>
        <div className="home-writing-grid">
          {WRITING.map((w) => (
            <article key={w.title} className="home-writing-card">
              <span className="home-writing-tag">{w.tag}</span>
              <h3 className="home-writing-title">{w.title}</h3>
              <p className="home-writing-desc">{w.description}</p>
              {w.href ? (
                <a className="home-writing-link" href={w.href} target="_blank" rel="noreferrer noopener">
                  Read more →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="courses-heading">
        <div className="home-section-head">
          <p className="t-section-label home-section-label">Coursework</p>
          <h2 id="courses-heading" className="t-h2 home-section-title">Courses I&rsquo;ve Taken</h2>
        </div>
        <div className="home-course-groups">
          {COURSES.map((group) => (
            <div key={group.category} className="home-course-group">
              <h3 className="home-course-group-title">{group.category}</h3>
              <ul className="home-course-list">
                {group.items.map((c) => (
                  <li key={c} className="home-course-pill">{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-projects-cta">
        <div>
          <p className="t-section-label home-section-label">More</p>
          <h2 className="t-h2 home-section-title">Notebooks &amp; Experiments</h2>
          <p className="home-about-text">
            A running, searchable collection of the projects I build in Google Colab.
          </p>
        </div>
        <Link href="/projects" className="home-btn home-btn-primary">Browse Projects →</Link>
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
      </footer>
    </div>
  );
}
