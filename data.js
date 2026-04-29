/**
 * ══════════════════════════════════════════════
 *  data.js  —  Edit this file to update your site
 * ══════════════════════════════════════════════
 */


/* ──────────────────────────────────────────────
   COURSES
──────────────────────────────────────────────── */

const COURSES = [
  // ── Mathematics ──
  { code: "MA1100",  name: "Basic Discrete Mathematics",                   dept: "Mathematics" },
  { code: "MA2001",  name: "Linear Algebra I",                             dept: "Mathematics" },
  { code: "MA2002",  name: "Calculus",                                     dept: "Mathematics" },
  { code: "MA2101",  name: "Linear Algebra II",                            dept: "Mathematics" },
  { code: "MA2104",  name: "Multivariable Calculus",                       dept: "Mathematics" },
  { code: "MA2108",  name: "Mathematical Analysis I",                      dept: "Mathematics" },
  { code: "MA2202",  name: "Algebra I",                                    dept: "Mathematics" },
  { code: "MA3210",  name: "Mathematical Analysis II",                     dept: "Mathematics" },
  { code: "MA3201",  name: "Algebra II",                                   dept: "Mathematics" },
  { code: "MA3264",  name: "Mathematical Modelling",                       dept: "Mathematics" },
  { code: "MA3270",  name: "Mathematics for AI",                           dept: "Mathematics" },
  { code: "MA3209",  name: "Metric and Topological Spaces",                dept: "Mathematics" },
  { code: "MA2116",  name: "Probability",                                  dept: "Mathematics" },
  { code: "MA4271",  name: "Differential Geometry of Curves and Surfaces", dept: "Mathematics" },
  { code: "QF1100",  name: "Introduction to Quantitative Finance",         dept: "Quantitative Finance" },

  // ── Statistics ──
  { code: "ST2132",  name: "Mathematical Statistics",                      dept: "Statistics" },

  // ── Computer Science ──
  { code: "CS1010",  name: "Programming Methodology",                      dept: "CS" },
];


/* ──────────────────────────────────────────────
   BLOG POSTS
   ──────────────────────────────────────────────
   HOW TO ADD A NEW POST:

   1. Add an entry here — just slug, title, date, tag, excerpt.

   2. Create the file  posts/YOUR-SLUG.html  and write your post
      in plain HTML. LaTeX works exactly as you'd expect:
        Inline:  $\mathbb{R}^k$   or  \(\mathbb{R}^k\)
        Display: $$\frac{1}{n}$$  or  \[\frac{1}{n}\]
      No escaping needed — it's just an HTML file.

   3. Done. The card appears on the main page automatically and
      links to  post.html?post=YOUR-SLUG
──────────────────────────────────────────────── */

const BLOG_POSTS = [

  {
    slug:    "fisher-rao-metric",
    title:   "The Fisher–Rao Metric: When Probability Spaces Become Curved",
    date:    "Apr 2026",
    tag:     "Information Geometry",
    excerpt: "A statistical model is more than just a family of distributions — it carries a natural Riemannian geometry. We explore how the Fisher information matrix endows the space of probability distributions with curvature, and what this means for statistical inference.",
  },

  // ── TEMPLATE: copy this block for each new post ──────────────────
  /*
  {
    slug:    "my-post-slug",        // must match the filename: posts/my-post-slug.html
    title:   "My Post Title",
    date:    "May 2025",
    tag:     "Probability",
    excerpt: "One or two sentence preview shown on the main page.",
  },
  */

];
