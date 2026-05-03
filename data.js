// data.js — courses and personal projects.
// Blog posts now live as Markdown files in posts/ — see posts/_index.json.
window.COURSES = [
  { code: "MA1100", name: "Basic Discrete Mathematics", dept: "Mathematics" },
  { code: "MA2001", name: "Linear Algebra I", dept: "Mathematics" },
  { code: "MA2002", name: "Calculus", dept: "Mathematics" },
  { code: "MA2101", name: "Linear Algebra II", dept: "Mathematics" },
  { code: "MA2104", name: "Multivariable Calculus", dept: "Mathematics" },
  { code: "MA2108", name: "Mathematical Analysis I", dept: "Mathematics" },
  { code: "MA2202", name: "Algebra I", dept: "Mathematics" },
  { code: "MA3210", name: "Mathematical Analysis II", dept: "Mathematics" },
  { code: "MA3201", name: "Algebra II", dept: "Mathematics" },
  { code: "MA3264", name: "Mathematical Modelling", dept: "Mathematics" },
  { code: "MA3270", name: "Mathematics for AI", dept: "Mathematics" },
  { code: "MA3209", name: "Metric and Topological Spaces", dept: "Mathematics" },
  { code: "MA2116", name: "Probability", dept: "Mathematics" },
  { code: "MA4271", name: "Differential Geometry of Curves and Surfaces", dept: "Mathematics" },
  { code: "QF1100", name: "Introduction to Quantitative Finance", dept: "Quantitative Finance" },
  { code: "ST2132", name: "Mathematical Statistics", dept: "Statistics" },
  { code: "CS1010", name: "Programming Methodology", dept: "CS" },
];

window.SEED_PROJECTS = [
  {
    id: "p1",
    title: "Riemannian Optimisation Playground",
    area: "Differential Geometry · Python",
    desc: "Interactive notebook that lets you visualise gradient flows on the sphere, the Stiefel manifold, and the Poincaré disc. Compares Euclidean SGD to natural-gradient updates.",
    tags: ["Python", "JAX", "Geometry"],
    link: "https://github.com/",
  },
];

// Loader: reads posts/_index.json and lazy-fetches the .md body when opened.
window.loadPostIndex = async function() {
  try {
    const res = await fetch('posts/_index.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('index ' + res.status);
    const data = await res.json();
    return data.posts || [];
  } catch (e) {
    console.warn('Could not load posts/_index.json — running with no posts.', e);
    return [];
  }
};

window.loadPostBody = async function(file) {
  try {
    const res = await fetch('posts/' + file, { cache: 'no-cache' });
    if (!res.ok) throw new Error('post ' + res.status);
    return await res.text();
  } catch (e) {
    console.warn('Could not load post', file, e);
    return '_Could not load this post (` + file + `). Make sure the file exists in `posts/` and you are serving over http://, not file://._';
  }
};
