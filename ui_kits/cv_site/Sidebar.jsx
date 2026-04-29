// Sidebar.jsx
const NAV = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Personal Projects' },
  { id: 'courses', label: 'Courses' },
  { id: 'blog', label: 'Blog' },
  { id: 'education', label: 'Education' },
  { id: 'interests', label: 'Interests' },
  { id: 'contact', label: 'Contact' },
];

function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-avatar">
        <span className="avatar-initials">DL</span>
        <div className="avatar-ring"></div>
      </div>
      <div className="sidebar-name">Dallen Lee</div>
      <div className="sidebar-title">Undergraduate</div>
      <div className="sidebar-institution">National University of Singapore</div>

      <ul className="sidebar-nav">
        {NAV.map(n => (
          <li key={n.id}>
            <a
              className={active === n.id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onNav(n.id); }}
              href={`#${n.id}`}
            >
              <span className="nav-dot"></span>{n.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-links">
        <a href="mailto:dallenleeyuxuan123@gmail.com">
          <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
          Personal Email
        </a>
        <a href="mailto:e0969261@u.nus.edu">
          <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          NUS Email
        </a>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
