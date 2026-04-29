// data.js — courses, blog posts, personal projects
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

window.SEED_BLOG_POSTS = [
  {
    slug: "fisher-rao-metric",
    title: "The Fisher–Rao Metric: When Probability Spaces Become Curved",
    date: "Apr 2025",
    tag: "Information Geometry",
    excerpt: "A statistical model is more than just a family of distributions — it carries a natural Riemannian geometry. We explore how the Fisher information matrix endows the space of probability distributions with curvature.",
    body: `A central question in statistical inference is: *how do we measure the distance between two probability distributions?* The naive answer — pick any $L^p$ distance on the density functions — turns out to be deeply unsatisfying.

## Setup: What is a Statistical Manifold?

Let $\\mathcal{M} = \\{ p_\\theta : \\theta \\in \\Theta \\subseteq \\mathbb{R}^k \\}$ be a smooth parametric family of probability distributions on some sample space $\\mathcal{X}$.

## The Fisher Information as a Metric Tensor

The **score function** at $\\theta$ is the gradient of the log-likelihood:

$$\\ell_i(\\theta; x) \\;=\\; \\frac{\\partial}{\\partial \\theta_i} \\log p_\\theta(x).$$

The **Fisher information matrix** $G(\\theta)$ is the covariance of the score:

$$g_{ij}(\\theta) \\;=\\; \\mathbb{E}_{p_\\theta}\\!\\left[ \\frac{\\partial \\log p_\\theta}{\\partial \\theta_i} \\cdot \\frac{\\partial \\log p_\\theta}{\\partial \\theta_j} \\right].$$

For a Gaussian family $p_\\theta = \\mathcal{N}(\\mu, \\sigma^2)$, this gives — up to scale — the Poincaré metric on the upper half-plane.`,
  },
  {
    slug: "gaussian-curvature-intuition",
    title: "Gaussian Curvature, the Hard Way",
    date: "Mar 2025",
    tag: "Differential Geometry",
    excerpt: "Why $K = \\det(II) / \\det(I)$ is the *only* sensible definition of curvature for a surface — a short tour through Gauss's Theorema Egregium.",
    body: `Given a smooth surface $S \\subset \\mathbb{R}^3$, the **first fundamental form** $I$ measures lengths intrinsically, and the **second fundamental form** $II$ measures how $S$ bends in the ambient space.

The **Gaussian curvature** is

$$K \\;=\\; \\frac{\\det II}{\\det I}.$$

What's remarkable — Gauss's *Theorema Egregium* — is that $K$ depends only on $I$, even though $II$ is extrinsic. Bend a piece of paper and $K$ stays zero.`,
  },
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
