// site/assets/projects-data.js — everything projects.html renders. Edit the
// array below with your real notebooks; nothing else needs to change.
// `colabUrl` should point straight at the notebook ("Share" -> "Copy link"
// in Colab). `category` is freeform -- the filter list on projects.html is
// generated automatically from whatever values appear here.
//
// The entries below are placeholders loosely tied to the research/coursework
// on the CV (random band matrices, Markowitz portfolios, model theory,
// algebraic geometry, topology) -- swap in your real notebooks and links.
var COLAB_PROJECTS = [
  {
    title: 'Numerical Eigenvector Localisation in Random Band Matrices',
    description: 'Simulating band matrices at varying bandwidth-to-size ratios and estimating the localisation threshold of their eigenvectors numerically.',
    category: 'Random Matrix Theory',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Spectral Shrinkage for Markowitz Portfolio Covariance Matrices',
    description: 'Comparing eigenvalue clipping, linear, and non-linear shrinkage estimators for denoising empirical covariance matrices in a Markowitz optimisation.',
    category: 'Numerical Linear Algebra',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Quantifier Elimination for Cyclic Abelian Groups — Worked Examples',
    description: 'Implementing the reduction strategy from the capstone project to eliminate quantifiers in small example systems over cyclic abelian groups.',
    category: 'Logic & Model Theory',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Visualising Algebraic Curves and Surfaces',
    description: 'Plotting affine and projective varieties defined by low-degree polynomials to build intuition for singular points and rational parametrisations.',
    category: 'Algebraic Geometry',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Computing Persistent Homology of Point Clouds',
    description: 'A short exploration of persistent homology as a tool for detecting topological features (loops, voids) in noisy sampled data.',
    category: 'Topology',
    colabUrl: 'https://colab.research.google.com/',
  },
];
