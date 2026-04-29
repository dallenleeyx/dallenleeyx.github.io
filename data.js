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

   1. Add an entry here with slug, title, date, tag, excerpt,
      and write the full post HTML in the `content` field.

   2. Use a template literal (backticks) for `content` so you
      can write multi-line HTML freely. LaTeX works as normal:
        Inline:  $\mathbb{R}^k$   or  \(\mathbb{R}^k\)
        Display: $$\frac{1}{n}$$  or  \[\frac{1}{n}\]

   3. Done — no separate files needed. The card appears on the
      main page automatically and the post is fully self-contained.
──────────────────────────────────────────────── */

const BLOG_POSTS = [

  {
    slug:    "fisher-rao-metric",
    title:   "The Fisher–Rao Metric: When Probability Spaces Become Curved",
    date:    "Apr 2025",
    tag:     "Information Geometry",
    excerpt: "A statistical model is more than just a family of distributions — it carries a natural Riemannian geometry. We explore how the Fisher information matrix endows the space of probability distributions with curvature, and what this means for statistical inference.",
    content: `
<p>
  A central question in statistical inference is: <em>how do we measure the distance between two probability distributions?</em>
  The naive answer — pick any $L^p$ distance on the density functions — turns out to be deeply unsatisfying.
  It ignores the statistical structure of the problem entirely.
</p>
<p>
  Information geometry, pioneered by <strong>Rao (1945)</strong> and later systematised by Amari, gives a far more principled answer:
  treat the statistical model itself as a <em>Riemannian manifold</em>, and use the <strong>Fisher information</strong> as the metric tensor.
  The resulting geometry is called the <em>Fisher–Rao metric</em>.
</p>

<h2>Setup: What is a Statistical Manifold?</h2>

<p>
  Let $\\mathcal{M} = \\{ p_\\theta : \\theta \\in \\Theta \\subseteq \\mathbb{R}^k \\}$ be a smooth parametric family of probability distributions
  on some sample space $\\mathcal{X}$, where we write $p_\\theta(x)$ for the density of $p_\\theta$ with respect to some base measure.
  We assume all the usual regularity conditions hold: the densities are positive, smooth in $\\theta$, and we can
  interchange differentiation and integration.
</p>
<p>
  Think of $\\Theta$ as a smooth $k$-dimensional manifold with coordinates $\\theta = (\\theta_1, \\ldots, \\theta_k)$.
  Each point $\\theta \\in \\Theta$ corresponds to a distribution $p_\\theta \\in \\mathcal{M}$.
  This is our <em>statistical manifold</em>.
</p>

<h2>The Fisher Information as a Metric Tensor</h2>

<p>
  The <strong>score function</strong> at $\\theta$ is the gradient of the log-likelihood:
</p>

$$\\ell_i(\\theta; x) \\;=\\; \\frac{\\partial}{\\partial \\theta_i} \\log p_\\theta(x).$$

<p>
  One can verify that the score has mean zero: $\\mathbb{E}_{p_\\theta}[\\ell_i(\\theta; X)] = 0$ for each $i$.
  This follows directly from differentiating the normalisation condition $\\int p_\\theta \\, d\\mu = 1$.
</p>
<p>
  The <strong>Fisher information matrix</strong> $G(\\theta)$ is then defined as the covariance matrix of the score:
</p>

$$g_{ij}(\\theta) \\;=\\; \\mathbb{E}_{p_\\theta}\\!\\left[ \\ell_i(\\theta; X)\\, \\ell_j(\\theta; X) \\right]
  \\;=\\; \\mathbb{E}_{p_\\theta}\\!\\left[ \\frac{\\partial \\log p_\\theta}{\\partial \\theta_i} \\cdot \\frac{\\partial \\log p_\\theta}{\\partial \\theta_j} \\right].$$

<p>Under regularity, this equals the negative expected Hessian of the log-likelihood:</p>

$$g_{ij}(\\theta) \\;=\\; -\\,\\mathbb{E}_{p_\\theta}\\!\\left[ \\frac{\\partial^2 \\log p_\\theta}{\\partial \\theta_i \\,\\partial \\theta_j} \\right].$$

<p>
  The key claim is that $G(\\theta) = (g_{ij}(\\theta))$ is a valid <strong>Riemannian metric tensor</strong> on $\\Theta$:
  it is symmetric, positive semi-definite at every point (positive definite under identifiability), and transforms
  covariantly under reparametrisation. The induced length of a smooth curve $\\theta(t)$, $t \\in [a,b]$, is
</p>

$$L[\\theta] \\;=\\; \\int_a^b \\sqrt{\\dot\\theta(t)^T \\, G(\\theta(t)) \\, \\dot\\theta(t)}\\; dt,$$

<p>and the <strong>geodesic distance</strong> between two models is the infimum of $L[\\theta]$ over all paths connecting them.</p>

<h2>An Explicit Example: the Gaussian Family</h2>

<p>
  Let $p_\\theta = \\mathcal{N}(\\mu, \\sigma^2)$ with $\\theta = (\\mu, \\sigma)$, $\\sigma > 0$.
  The log-density is
</p>

$$\\log p_\\theta(x) \\;=\\; -\\frac{1}{2}\\log(2\\pi) - \\log\\sigma - \\frac{(x-\\mu)^2}{2\\sigma^2}.$$

<p>Computing the score components and taking expectations gives</p>

$$G(\\mu,\\sigma) \\;=\\; \\begin{pmatrix} \\dfrac{1}{\\sigma^2} & 0 \\\\[6pt] 0 & \\dfrac{2}{\\sigma^2} \\end{pmatrix}.$$

<p>
  Up to a constant factor, this is the <strong>Poincaré metric</strong> on the upper half-plane
  $\\mathbb{H}^2 = \\{(\\mu, \\sigma) : \\sigma > 0\\}$:
</p>

$$ds^2 \\;=\\; \\frac{d\\mu^2}{\\sigma^2} + \\frac{2\\,d\\sigma^2}{\\sigma^2}.$$

<p>
  So the family of univariate Gaussians, equipped with the Fisher–Rao metric, is — up to scaling —
  the <em>hyperbolic plane</em>. This reflects a deep link between the geometry of exponential families
  and symmetric spaces.
</p>

<h2>Why Does This Matter?</h2>

<p>
  The Fisher–Rao metric is <em>intrinsic to the statistical problem</em> in a precise sense:
  it is the unique (up to scale) Riemannian metric on $\\mathcal{M}$ that is invariant under sufficient statistics,
  a result due to <strong>Čencov (1982)</strong>.
</p>

<ul>
  <li>
    The <strong>Cramér–Rao bound</strong>, $\\mathrm{Var}_\\theta(\\hat\\theta) \\geq G(\\theta)^{-1}$, becomes a statement
    about the "size" of the metric at $\\theta$.
  </li>
  <li>
    The <strong>natural gradient</strong> replaces $\\nabla_\\theta \\mathcal{L}$ with $G(\\theta)^{-1} \\nabla_\\theta \\mathcal{L}$,
    which is invariant under reparametrisation and converges faster in practice.
  </li>
  <li>
    In <strong>Wasserstein DRO</strong>, the dual geometry (the $\\alpha$-connections of Amari) plays a key role in
    computing sensitivities of optimal transport problems to perturbations of the reference measure.
  </li>
</ul>

<h2>Looking Ahead</h2>

<p>
  The manifold $(\\mathcal{M}, G)$ comes equipped with a family of <em>dual affine connections</em>
  $\\nabla^{(\\alpha)}$ parametrised by $\\alpha \\in \\mathbb{R}$, interpolating between the exponential
  connection ($\\alpha = 1$) and the mixture connection ($\\alpha = -1$). Together,
  $(\\mathcal{M}, G, \\nabla^{(\\alpha)})$ forms a <em>statistical manifold</em> in the sense of Lauritzen.
</p>
<p>
  Understanding this duality is crucial for applications ranging from exponential families in machine learning
  to optimal transport and distributionally robust optimisation.
</p>

<hr>

<p class="post-footnote">
  <strong>References.</strong>
  C. R. Rao (1945), <em>Information and the accuracy attainable in the estimation of statistical parameters</em>, Bull. Calcutta Math. Soc.
  &nbsp;·&nbsp;
  S. Amari &amp; H. Nagaoka (2000), <em>Methods of Information Geometry</em>, AMS.
  &nbsp;·&nbsp;
  N. N. Čencov (1982), <em>Statistical Decision Rules and Optimal Inference</em>, AMS.
</p>
    `,
  },

  // ── TEMPLATE: copy this block for each new post ──────────────────
  /*
  {
    slug:    "my-post-slug",
    title:   "My Post Title",
    date:    "May 2025",
    tag:     "Probability",
    excerpt: "One or two sentence preview shown on the main page.",
    content: `
      <p>Write your post content here in HTML.</p>
      <p>LaTeX inline: $E = mc^2$ and display:</p>
      $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
    `,
  },
  */

];
