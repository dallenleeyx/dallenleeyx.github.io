// Sections.jsx — all the main content sections in one file
function SectionLabel({ children, action }) {
  return (
    <div className="section-label" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
      <span>{children}</span>
      {action}
    </div>
  );
}

function AboutSection({ onNav }) {
  return (
    <section id="about" className="visible">
      <div className="about-greeting">Hi, I'm <em>Dallen</em>.</div>
      <div className="about-body">
        <p>I am an undergraduate student reading Mathematics with a Specialisation in Pure Mathematics at the National University of Singapore.</p>
        <p>My interests lie at the intersection of geometry, probability, and statistics — in particular the <em>geometry of statistical manifolds</em> and the structural properties of high-dimensional mathematical objects.</p>
        <p>I enjoy exploring how tools from pure mathematics — differential geometry, algebra, and analysis — illuminate problems in statistics, data, and beyond.</p>
      </div>
      <div className="about-cta">
        <a className="btn btn-primary" onClick={(e)=>{e.preventDefault();onNav('research');}} href="#research">View Research</a>
        <a className="btn btn-outline" onClick={(e)=>{e.preventDefault();onNav('contact');}} href="#contact">Get in Touch</a>
      </div>
    </section>
  );
}

const RESEARCH = [
  {
    date: 'Jan 2026 – May 2026', badge: 'Completed',
    title: 'Applying Quantifier Elimination to abelian cyclic groups',
    area: 'Mathematical Logic · Model Theory · Algebra',
    bullets: [
      'First exposure to mathematical research',
      'Collaborated with 3 other undergraduates to understand quantifier elimination in Model Theory',
      'Produced an original result — showing that abelian cyclic groups admit quantifier elimination',
      'Challenged to study an advanced math topic independently',
    ],
  },
  {
    date: 'May 2026 – Aug 2026', badge: 'Upcoming',
    title: 'Random Matrix Theory and applications to quantitative finance',
    area: 'Probability · Analysis · Quantitative Finance',
    bullets: [
      'Exact research topic still to be decided',
      'Focus on spectral properties of large random matrices and connections to quantitative finance',
    ],
  },
  {
    date: 'Aug 2026 – Nov 2026', badge: 'Upcoming',
    title: 'Application of Differential Geometry in Wasserstein distributionally robust optimisation (DRO) problems',
    area: 'Differential Geometry · Optimal Transport · Quantitative Finance',
    bullets: [
      'Applying differential geometry ideas to Wasserstein spaces to derive results from Bartl et al. (2021)',
      'Calculating non-parametric vegas for certain examples',
    ],
  },
];

function ResearchSection() {
  return (
    <section id="research" className="visible">
      <SectionLabel>Research</SectionLabel>
      <div className="research-timeline">
        {RESEARCH.map((r,i)=>(
          <div className="tl-item" key={i}>
            <div className="tl-dot"></div>
            <div className="tl-card">
              <div className="tl-meta">
                <span className="tl-date">{r.date}</span>
                <span className={`tl-badge ${r.badge==='Completed'?'badge-done':'badge-upcoming'}`}>{r.badge}</span>
              </div>
              <p className="tl-title">{r.title}</p>
              <p className="tl-area">{r.area}</p>
              <ul className="tl-bullets">{r.bullets.map((b,j)=><li key={j}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button className="blog-reader-back" onClick={onClick} style={{margin:0}}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {label}
    </button>
  );
}

function ProjectsSection({ projects, onAdd, onDelete, owner }) {
  return (
    <section id="projects" className="visible">
      <SectionLabel action={owner ? <AddBtn onClick={onAdd} label="New Project"/> : null}>Personal Projects</SectionLabel>
      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <div className="empty-title">No projects yet</div>
          <div className="empty-sub">{owner ? <>Click <strong>New Project</strong> to add one.</> : <>Projects will appear here.</>}</div>
        </div>
      ) : (
        <div>
          {projects.map(p => (
            <div className="project-card" key={p.id}>
              <div className="project-header">
                <div>
                  <div className="project-title">{p.title}</div>
                  <div className="project-area">{p.area}</div>
                </div>
                <div className="project-card-actions">
                  {p.link ? <a className="project-link" href={p.link} target="_blank" rel="noreferrer">View →</a> : null}
                  {owner && p.userProject ? (
                    <button className="icon-btn" title="Delete" onClick={()=>onDelete(p.id)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="project-desc" dangerouslySetInnerHTML={{__html: window.renderMarkdown(p.desc || '').replace(/^<p>|<\/p>\s*$/g,'')}}/>
              <div className="project-tags">
                {(p.tags||[]).map((t,i)=>(<span key={i} className="tag">{t}</span>))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CoursesSection() {
  const COURSES = window.COURSES || [];
  const [q, setQ] = React.useState('');
  const [dept, setDept] = React.useState('All');
  const depts = React.useMemo(() => ['All', ...new Set(COURSES.map(c=>c.dept))], []);
  const filtered = COURSES.filter(c => {
    const md = dept === 'All' || c.dept === dept;
    const ql = q.toLowerCase().trim();
    const mq = !ql || c.code.toLowerCase().includes(ql) || c.name.toLowerCase().includes(ql) || c.dept.toLowerCase().includes(ql);
    return md && mq;
  });
  return (
    <section id="courses" className="visible">
      <SectionLabel>Courses Taken</SectionLabel>
      <div className="courses-search-wrap">
        <div className="search-icon-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input
          className="courses-search"
          placeholder="Search by code or name…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
        <div className="search-filter-pills">
          {depts.map(d => (
            <button key={d} className={`filter-pill ${dept===d?'active':''}`} onClick={()=>setDept(d)}>{d}</button>
          ))}
        </div>
      </div>
      <div className="courses-meta">Showing {filtered.length} of {COURSES.length} courses</div>
      <div className="courses-grid">
        {filtered.length === 0 ? (
          <div className="course-no-results" style={{gridColumn:'1/-1',textAlign:'center',padding:'2.5rem 0',color:'var(--fg-muted)',fontSize:'.85rem'}}>No courses match your search.</div>
        ) : filtered.map(c => (
          <a key={c.code} className="course-card" href={`https://nusmods.com/courses/${c.code}`} target="_blank" rel="noreferrer">
            <div className="course-code">{c.code}</div>
            <div className="course-name">{c.name}</div>
            <div className="course-dept">{c.dept}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function BlogSection({ posts, onAdd, onOpen }) {
  return (
    <section id="blog" className="visible">
      <SectionLabel action={<AddBtn onClick={onAdd} label="Write Post"/>}>Blog</SectionLabel>
      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✍️</div>
          <div className="empty-title">No posts yet</div>
          <div className="empty-sub">Click <strong>Write Post</strong> to draft one — you'll get a <code>.md</code> file to drop into <code>posts/</code>.</div>
        </div>
      ) : (
        <div className="blog-list">
          {posts.map(p => (
            <a key={p.slug} className="blog-post" href="#" onClick={(e)=>{e.preventDefault();onOpen(p.slug);}}>
              <div className="blog-post-meta">
                <span className="blog-date">{p.date}</span>
                <span className="blog-tag">{p.tag}</span>
              </div>
              <div className="blog-title">{p.title}</div>
              <div className="blog-excerpt" dangerouslySetInnerHTML={{__html: window.renderMarkdown(p.excerpt||'').replace(/^<p>|<\/p>\s*$/g,'')}}/>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function BlogReader({ post, body, loading, onBack }) {
  if (!post) return null;
  return (
    <section id="blog" className="visible">
      <button className="blog-reader-back" onClick={onBack}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Blog
      </button>
      <article>
        <header className="post-header">
          <div className="post-meta">
            <span className="post-date">{post.date}</span>
            <span className="post-tag-big">{post.tag}</span>
          </div>
          <h1 className="post-title-big">{post.title}</h1>
          {post.excerpt ? <div className="post-excerpt-big" dangerouslySetInnerHTML={{__html: window.renderMarkdown(post.excerpt).replace(/^<p>|<\/p>\s*$/g,'')}}/> : null}
        </header>
        <hr className="post-divider"/>
        {loading ? (
          <div style={{color:'var(--fg-muted)',fontFamily:'var(--font-mono)',fontSize:'.78rem',padding:'2rem 0'}}>Loading post…</div>
        ) : (
          <div className="post-body" dangerouslySetInnerHTML={{__html: window.renderMarkdown(body || '')}}/>
        )}
      </article>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education" className="visible">
      <SectionLabel>Education</SectionLabel>
      <div className="edu-entry">
        <div className="edu-date">2023 – Present</div>
        <div>
          <div className="edu-degree">B.Sc. (Hons) in Mathematics</div>
          <div className="edu-institution">National University of Singapore</div>
          <div className="edu-note">Specialisation in Pure Mathematics</div>
        </div>
      </div>
    </section>
  );
}

function InterestsSection() {
  return (
    <section id="interests" className="visible">
      <SectionLabel>Research Interests</SectionLabel>
      <div className="interests-grid">
        <div className="interest-chip">
          <div className="interest-name">High-Geometry Statistics</div>
          <div className="interest-sub">Information Geometry</div>
        </div>
        <div className="interest-chip">
          <div className="interest-name">Quantitative Finance</div>
          <div className="interest-sub">Application of Machine Learning to QF</div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="visible">
      <SectionLabel>Contact</SectionLabel>
      <div className="contact-block">
        <p>Feel free to reach out!</p>
        <div className="contact-emails">
          <div className="contact-email-row">
            <span className="contact-email-label">Personal</span>
            <a href="mailto:dallenleeyuxuan123@gmail.com">dallenleeyuxuan123@gmail.com</a>
          </div>
          <div className="contact-email-row">
            <span className="contact-email-label">NUS</span>
            <a href="mailto:e0969261@u.nus.edu">e0969261@u.nus.edu</a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  AboutSection, ResearchSection, ProjectsSection, CoursesSection,
  BlogSection, BlogReader, EducationSection, InterestsSection, ContactSection,
});
