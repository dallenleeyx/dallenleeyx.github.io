/**
 * ══════════════════════════════════════════════
 *  data.js  —  Edit this file to update your site
 * ══════════════════════════════════════════════
 *
 *  HOW TO UPDATE:
 *  1. Open this file in any text editor (VS Code, Notepad++, etc.)
 *  2. Add/edit entries in the arrays below
 *  3. Save the file and refresh your browser
 *  4. That's it!
 */


/* ──────────────────────────────────────────────
   COURSES
   ──────────────────────────────────────────────
   Each course needs:
     code  : the NUSMods module code (e.g. "MA1100")
     name  : full module name
     dept  : short department label for filtering
             (keep consistent: "Mathematics", "CS", etc.)

   The link to NUSMods is built automatically:
   https://nusmods.com/courses/[code]
──────────────────────────────────────────────── */

const COURSES = [
  // ── Mathematics ──
  { code: "MA1100",  name: "Basic Discrete Mathematics",               dept: "Mathematics" },
  { code: "MA1101R", name: "Linear Algebra I",                         dept: "Mathematics" },
  { code: "MA1102R", name: "Calculus",                                 dept: "Mathematics" },
  { code: "MA2101",  name: "Linear Algebra II",                        dept: "Mathematics" },
  { code: "MA2104",  name: "Multivariable Calculus",                   dept: "Mathematics" },
  { code: "MA2108",  name: "Mathematical Analysis I",                  dept: "Mathematics" },
  { code: "MA2202",  name: "Algebra I",                                dept: "Mathematics" },
  { code: "MA3110",  name: "Mathematical Analysis II",                 dept: "Mathematics" },
  { code: "MA3201",  name: "Algebra II",                               dept: "Mathematics" },
  { code: "MA3209",  name: "Mathematical Analysis III",                dept: "Mathematics" },
  { code: "MA3220",  name: "Ordinary Differential Equations",          dept: "Mathematics" },
  { code: "MA3238",  name: "Probability Theory I",                     dept: "Mathematics" },
  { code: "MA4261",  name: "Coding Theory and Cryptography",           dept: "Mathematics" },
  { code: "MA4271",  name: "Differential Geometry of Curves and Surfaces", dept: "Mathematics" },
  { code: "MA4262",  name: "Measure and Integration",                  dept: "Mathematics" },
  { code: "MA4268",  name: "Mathematics in Finance",                   dept: "Mathematics" },

  // ── Statistics ──
  { code: "ST1131",  name: "Introduction to Statistics",               dept: "Statistics" },
  { code: "ST2131",  name: "Probability",                              dept: "Statistics" },
  { code: "ST2132",  name: "Mathematical Statistics",                  dept: "Statistics" },
  { code: "ST3131",  name: "Regression Analysis",                      dept: "Statistics" },

  // ── Computer Science ──
  { code: "CS1010",  name: "Programming Methodology",                  dept: "CS" },
  { code: "CS2040",  name: "Data Structures and Algorithms",           dept: "CS" },

  // ── General Education / Others ──
  // Add more courses here following the same format!
];


/* ──────────────────────────────────────────────
   BLOG POSTS
   ──────────────────────────────────────────────
   Each post needs:
     title   : post title
     date    : display date (e.g. "Jan 2025")
     tag     : category label
     excerpt : one or two sentence preview
     url     : link to the full post (can be a
               Google Doc, Notion page, Medium,
               PDF, or any URL)

   If url is null or "", the card won't be clickable.
──────────────────────────────────────────────── */

const BLOG_POSTS = [
  // Example (remove the /* and */ to enable):
  /*
  {
    title:   "On the Geometry of Statistical Manifolds",
    date:    "Mar 2025",
    tag:     "Mathematics",
    excerpt: "A brief exploration of how Fisher information endows the space of probability distributions with a Riemannian structure, and what this means for statistical inference.",
    url:     "https://example.com/your-post",
  },
  {
    title:   "Notes on Wigner's Semicircle Law",
    date:    "Jan 2025",
    tag:     "Probability",
    excerpt: "A self-contained proof sketch of the semicircle law for the empirical spectral distribution of Wigner matrices.",
    url:     null,
  },
  */
];
