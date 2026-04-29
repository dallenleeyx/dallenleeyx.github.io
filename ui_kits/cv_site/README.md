# UI Kit — Personal CV Site

Hi-fi recreation of `dallenleeyx/dallenleeyx.github.io`. The kit demonstrates a
working interactive version of the site — sidebar navigation, theme toggle,
animated math-glyph particle background, course search/filter, and the full
research timeline.

## Files
- `index.html` — entry point, full page mock with all sections.
- `app.jsx` — composed React app (sidebar + main + theme + particles).
- `Sidebar.jsx`, `MathParticles.jsx`, `ThemeToggle.jsx`, `Section.jsx`
- `AboutSection.jsx`, `ResearchTimeline.jsx`, `CoursesSection.jsx`,
  `BlogSection.jsx`, `EducationSection.jsx`, `InterestsSection.jsx`,
  `ContactSection.jsx`
- `data.js` — courses & blog posts (lifted from source `data.js`).

## Notes
- All copy lifted verbatim from the source site. Components are cosmetic
  recreations only — no data persistence beyond `localStorage` theme.
- Math particle canvas uses the same `requestAnimationFrame` loop and 28-particle
  budget as the source.
