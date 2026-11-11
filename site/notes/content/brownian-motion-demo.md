---
title: "Brownian motion — a small demo"
date: "2026-11-11"
kind: Simulation
summary: "A simple random walk simulation and the idea behind Brownian motion."
tags: "Probability, Stochastic processes"
published: true
---

This is a **demo entry** showing how mathematical notes and interactive simulations can live together. You can replace or unpublish it in Pages CMS.

## A scaling idea

Let the increments $X_1,X_2,\ldots$ be independent, with mean zero and variance one. A scaled random walk is

$$
S_n(t)=\frac{1}{\sqrt{n}}\sum_{k=1}^{\lfloor nt\rfloor}X_k.
$$

As $n$ grows, its paths begin to resemble Brownian motion (in the appropriate sense). The limiting process \(B_t\) satisfies

$$
B_0=0,\qquad B_t-B_s\sim\mathcal{N}(0,t-s),\quad 0\le s<t.
$$

## Try it

Draw several sample paths, then increase the number of steps. The simulation uses normal increments with variance \(\Delta t\).

::simulation[Interactive Brownian motion paths](/simulations/brownian-motion/)

## Adding your own animations

A Manim scene can be rendered to an MP4, uploaded in **Pages CMS → Manim videos**, and embedded in any article with a one-line shortcode:

~~~text
::manim[Caption for your animation](/notes/media/videos/your-animation.mp4)
~~~

Images work as ordinary Markdown images, and inline or display LaTeX uses dollar-sign delimiters.
