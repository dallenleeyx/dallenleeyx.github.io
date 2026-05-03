A central question in statistical inference is: *how do we measure the distance between two probability distributions?* The naive answer — pick any $L^p$ distance on the density functions — turns out to be deeply unsatisfying.

## Setup: What is a Statistical Manifold?

Let $\mathcal{M} = \{ p_\theta : \theta \in \Theta \subseteq \mathbb{R}^k \}$ be a smooth parametric family of probability distributions on some sample space $\mathcal{X}$.

## The Fisher Information as a Metric Tensor

The **score function** at $\theta$ is the gradient of the log-likelihood:

$$\ell_i(\theta; x) \;=\; \frac{\partial}{\partial \theta_i} \log p_\theta(x).$$

The **Fisher information matrix** $G(\theta)$ is the covariance of the score:

$$g_{ij}(\theta) \;=\; \mathbb{E}_{p_\theta}\!\left[ \frac{\partial \log p_\theta}{\partial \theta_i} \cdot \frac{\partial \log p_\theta}{\partial \theta_j} \right].$$

For a Gaussian family $p_\theta = \mathcal{N}(\mu, \sigma^2)$, this gives — up to scale — the Poincaré metric on the upper half-plane.
