// app.jsx — composes the full CV site
function App() {
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [accent, setAccent] = React.useState(() => localStorage.getItem('accent') || 'mono');
  const [active, setActive] = React.useState('about');

  const { owner, unlock, lock } = window.useOwner();
  const [unlockOpen, setUnlockOpen] = React.useState(false);

  // Blog + projects state, persisted
  const [userPosts, setUserPosts] = window.useLocalStorage('cv_user_posts_v1', []);
  const [userProjects, setUserProjects] = window.useLocalStorage('cv_user_projects_v1', []);
  const allPosts = React.useMemo(() => [...userPosts, ...(window.SEED_BLOG_POSTS||[])], [userPosts]);
  const allProjects = React.useMemo(() => [...userProjects, ...(window.SEED_PROJECTS||[])], [userProjects]);

  const [openSlug, setOpenSlug] = React.useState(null);
  const [composer, setComposer] = React.useState({ open: false, mode: 'blog' });

  const openPost = allPosts.find(p => p.slug === openSlug) || null;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('accent', accent);
  }, [accent]);

  // Hidden owner unlock — click sidebar avatar 5x within 3s
  React.useEffect(() => {
    let clicks = 0; let timer = null;
    const handler = (e) => {
      const el = e.target.closest('.sidebar-avatar');
      if (!el) return;
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 3000);
      if (clicks >= 5) {
        clicks = 0;
        if (owner) lock();
        else setUnlockOpen(true);
      }
    };
    document.addEventListener('click', handler);
    return () => { document.removeEventListener('click', handler); clearTimeout(timer); };
  }, [owner]);

  const onNav = (id) => {
    setActive(id);
    setOpenSlug(null);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  React.useEffect(() => {
    if (openSlug) return;
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [openSlug]);

  const handleSubmit = (item) => {
    if (composer.mode === 'blog') setUserPosts([item, ...userPosts]);
    else setUserProjects([item, ...userProjects]);
  };
  const deletePost = (slug) => { if (confirm('Delete this post?')) setUserPosts(userPosts.filter(p => p.slug !== slug)); };
  const deleteProject = (id) => { if (confirm('Delete this project?')) setUserProjects(userProjects.filter(p => p.id !== id)); };

  const handleExport = () => {
    // Merge user content INTO seed arrays so the exported file is the new source of truth.
    const mergedPosts = [...userPosts.map(p => ({ ...p, userPost: undefined })), ...(window.SEED_BLOG_POSTS||[])];
    const mergedProjects = [...userProjects.map(p => ({ ...p, userProject: undefined })), ...(window.SEED_PROJECTS||[])];
    const js = window.buildDataJs(mergedPosts, mergedProjects, window.COURSES || []);
    window.downloadFile('data.js', js);
  };

  return (
    <React.Fragment>
      <window.AccentPicker accent={accent} onChange={setAccent} />
      <window.ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <window.MathParticles />
      <window.Sidebar active={active} onNav={onNav} />
      <main className="main">
        {openSlug ? (
          <window.BlogReader post={openPost} onBack={() => { setOpenSlug(null); requestAnimationFrame(()=>onNav('blog')); }} />
        ) : (
          <>
            <window.AboutSection onNav={onNav} />
            <window.ResearchSection />
            <window.ProjectsSection
              projects={allProjects}
              owner={owner}
              onAdd={()=>setComposer({open:true, mode:'project'})}
              onDelete={deleteProject}
            />
            <window.CoursesSection />
            <window.BlogSection
              posts={allPosts}
              owner={owner}
              onAdd={()=>setComposer({open:true, mode:'blog'})}
              onOpen={(slug)=>{ setOpenSlug(slug); window.scrollTo({top:0,behavior:'smooth'}); }}
              onDelete={deletePost}
            />
            <window.EducationSection />
            <window.InterestsSection />
            <window.ContactSection />
          </>
        )}
      </main>
      <div className="math-deco">∂²f / ∂xᵢ∂xⱼ · · · ∇²S(θ)</div>

      <window.Composer
        open={composer.open}
        mode={composer.mode}
        onClose={()=>setComposer(c=>({...c, open:false}))}
        onSubmit={handleSubmit}
      />

      {owner ? <window.OwnerBadge onLock={lock} onExport={handleExport} /> : null}
      <window.OwnerUnlock open={unlockOpen} onClose={()=>setUnlockOpen(false)} onUnlock={unlock} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
