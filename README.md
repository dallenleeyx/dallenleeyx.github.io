# Dallen Lee — Design System

> A monochromatic, mathematics-first personal-CV design system.
> Distilled from the source site at `dallenleeyx/dallenleeyx.github.io`
> ([github.com/dallenleeyx/dallenleeyx.github.io](https://github.com/dallenleeyx/dallenleeyx.github.io)).

**Subject.** Dallen Lee — undergraduate reading **Mathematics** with a Specialisation in **Pure Mathematics** at the National University of Singapore. The site is a *personal CV* whose primary job is to communicate research interests at the intersection of **information geometry**, **probability**, and **quantitative finance** — not to sell, not to entertain.

**Sources used.**
- GitHub repo: `dallenleeyx/dallenleeyx.github.io@main` (see `_source/` for an inlined snapshot of the files used to build this system).

---

## Index

| Path | Purpose |
|---|---|
| `README.md` | This file — overview, content + visual fundamentals, iconography. |
| `SKILL.md` | Agent-Skill front matter, so this folder is invocable from Claude Code. |
| `colors_and_type.css` | Color tokens (dark + light), type scale, semantic type classes. |
| `fonts/` | Local font files (Nunito, DM Mono) — backups for the Google Fonts CDN. |
| `assets/` | Logos / favicons / wordmarks / illustrative SVGs used on cards. |
| `preview/` | Self-contained design-system *cards* registered in the Design System tab. |
| `ui_kits/cv_site/` | High-fidelity recreation of the personal-CV site. |
| `_source/` | Read-only mirror of the original repo files for reference. |

---

## Content fundamentals

The voice is that of a **mathematics undergraduate writing for other mathematicians**. It is precise, slightly formal, and unembellished — but warmly human in the introduction.

**Voice & person.**
- First-person singular ("I am an undergraduate…", "I enjoy exploring how…"). Never *we*, never *our team*.
- Direct address only in the contact section ("Feel free to reach out!").
- No marketing language, no buzzwords, no exclamation marks (one tolerated, in the contact CTA).

**Casing.**
- Sentence case in body copy.
- **UPPERCASE + wide tracking** for section labels (`ABOUT`, `RESEARCH`, `PERSONAL PROJECTS`).
- Title Case for page/post titles ("The Fisher–Rao Metric: When Probability Spaces Become Curved").
- British spelling throughout: *specialisation*, *modelling*, *systematised*. Match this when adding copy.

**Diction.**
- *Italicise key terms* (rendered with `<em>` and the secondary accent color) when introducing them — e.g. "the *geometry of statistical manifolds*", "the *Fisher–Rao metric*". This is a substitute for hyperlinks.
- The em-dash ( — ) is the canonical clause-joiner. Used liberally; ~1 per paragraph in the source.
- Names of theorems/people in **bold** ("**Rao (1945)**", "**Cramér–Rao bound**").

**Tone examples (lifted from the live site).**
> Hi, I'm *Dallen*.
>
> I am an undergraduate student reading Mathematics with a Specialisation in Pure Mathematics at the National University of Singapore.
>
> My interests lie at the intersection of geometry, probability, and statistics — in particular the *geometry of statistical manifolds* and the structural properties of high-dimensional mathematical objects.

**Empty/placeholder state.**
> Projects coming soon
> Personal projects will appear here. Add them in `data.js`.

A single emoji icon (🔧, ✍️) heads each empty state. **These are the only emoji in the entire system** — outside of the dark/light theme toggle (☀️ 🌙). Treat emoji as decoration confined to *empty states* and *the toggle*; never use them in body copy, section labels, or buttons.

**Math glyphs as decoration.** Unicode mathematical symbols (∂, ∇, ∑, ℝ, ℂ, ∞, π, ∫, √, θ, λ, μ, σ, ⊕, ∈) drift across a fixed background canvas. A vertical "math-deco" string runs up the left edge: `∂²f / ∂xᵢ∂xⱼ · · · ∇²S(θ)`. These are *quietly* present (low opacity, slow drift) — never foregrounded.

**Punctuation.**
- Em-dash (—) for clause joins. Not a hyphen, not an en-dash.
- Middle-dot (·) separates fields in dense meta lines, e.g. "Mathematical Logic · Model Theory · Algebra".
- The bullet character is the em-dash (`—`), set in `--fg-muted` before each `<li>`.

---

## Visual foundations

The design is **monochromatic, restrained, and academic**. It reads like a well-typeset mathematics paper that happens to live on the web. Color is reserved for emphasis; the math motifs and typography do all the heavy lifting.

### Color
- **Two themes only**: dark (default) and light. Toggle via `[data-theme="dark"|"light"]` on `<html>`. The user's choice persists in `localStorage`.
- The palette is **pure-grayscale** in both themes — no blues, no purples, no warm or cool casts. White on near-black, or near-black on near-white.
- Five surface tiers: `--bg → --surface → --surface-2`, with `--border` as the only divider.
- Three foreground tiers (`--fg-1` primary → `--fg-2` body → `--fg-muted` meta) and three accent tiers (`--accent → --accent-2 → --accent-3`).
- `--glow` is a 6%-opacity wash of the accent color, used for shadow tints and focus rings.

### Type
- Two families only: **Nunito** (sans, all UI/body) and **DM Mono** (mono, used for *anything quantitative or coordinate-like*: dates, course codes, breadcrumbs, the math-deco string, KaTeX inline math).
- Italic Nunito is reserved for the `<em>` accent treatment ("term-italics").
- Wide tracking (`0.07em`–`0.18em`) on uppercase labels is a recurring rhythm — it pairs with the tightly-tracked display sizes (`-0.025em` to `-0.03em`) to give the layout its characteristic "wide caps over tight title" cadence.

### Spacing & layout
- Fixed sidebar (280 px) anchors the page; main content max-width 860 px.
- Sections separated by **5 rem** of vertical breathing room.
- Cards: padding `1.25rem 1.5rem` for timeline cards, `1.5rem 1.7rem` for project cards, `1.8rem 2rem` for the contact block. Radii are 14 px on cards, 10 px on smaller surfaces, 20 px on pills.
- A **research timeline** with a subtle 1px gradient rail and 9px dotted nodes is the signature layout component.

### Backgrounds
- A `<canvas id="particles">` covers the entire viewport at 30–45% opacity, drifting math glyphs upward at a near-imperceptible rate. **This is the brand.**
- A vertical "math-deco" string (`∂²f / ∂xᵢ∂xⱼ · · · ∇²S(θ)`, mono, in `--border` color) is anchored at the bottom-left, written sideways via `writing-mode: vertical-rl`. Decorative, never interactive.
- No gradients on surfaces. No imagery. No textures. The math glyphs are the *only* background ornament.

### Animation
- **Easing.** Almost everything uses `0.22s ease` or `0.18s ease`. Never spring-y, never bounce-y.
- **Section reveal.** Each `section[id]` enters with `opacity 0 → 1` and `translateY(20px) → 0` over `0.6s ease`, triggered by an `IntersectionObserver` (threshold 0.12).
- **Hover lift.** Cards lift by `translateY(-2px)` and gain a `0 6–8px 28–32px var(--glow)` shadow.
- **Avatar ring.** The sidebar avatar has a `conic-gradient` border that rotates `360deg` over 6 s, masked into a 2 px ring. Subtle, ambient.
- No fades on text. No staggered list reveals. No Lottie. No scroll-jacking.

### Hover, press, focus
- **Hover** raises by 2 px, swaps `--border` to `--accent`, and adds a soft glow. Text-only links shift from `--fg-muted` to `--accent-2` (link) or `--accent` (active nav).
- **Press / active.** No explicit press state in the source — buttons rely on the lift-on-hover; tapping just inverts back.
- **Focus.** `outline: none` on inputs; instead, a `0 0 0 3px var(--glow)` ring on the search input, and `border-color: var(--accent)`.

### Borders & shadows
- Border weight: **1 px** everywhere. No thicker, no thinner.
- Dashed borders only on the empty-state placeholders (`1px dashed var(--border)`).
- A 2-3 px **left accent bar** appears (opacity 0 → 0.6/1) on hover for both project cards and timeline cards, drawn with an absolute pseudo-element. This is the *one* permitted gradient: `linear-gradient(180deg, var(--accent), var(--accent-2))` on project-card hover.
- Shadow system is the `--glow`-tinted family above. There are no inset shadows.

### Transparency & blur
- The post-page top bar uses `backdrop-filter: blur(12px)` over a `color-mix(in srgb, var(--bg) 85%, transparent)` background — a sticky, frosted strip.
- Otherwise no blur, no glassy panels.

### Corner radii
- 4 px on inline `code`. 8 px on small buttons / nav items. 10 px on inputs / small cards / course cards. 14 px on large cards (project, timeline, blog, contact, empty state). 20 px on pills/tags. 50 px / `50%` on the avatar and theme-toggle pill.

### Card recipe
A canonical card is `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 14px`, `padding: 1.25–1.7rem`, plus the hover lift and accent-bar treatment described above.

### Color vibe of imagery
There is **no photographic imagery in the system**. Brand imagery is replaced by:
1. The animated math-glyph particle field.
2. The vertical math-deco string.
3. The avatar's animated conic ring.

If imagery were ever added, it should be **black-and-white, high-contrast, faintly grainy** to match the surrounding monochrome palette. Never warm, never saturated.

---

## Iconography

This system has **almost no icons**. The choices made are deliberate and very small:

1. **Inline SVGs, hand-rolled, currentColor-stroked.** Three appear in the source:
   - An envelope (personal email) — 24×24, 2px stroke.
   - A house with a pitched roof (NUS email) — 24×24, 2px stroke.
   - A magnifier (course search field) — 24×24, 2.5px stroke.

   All use `fill="none" stroke="currentColor" stroke-width="2"` (or `2.5`). They inherit color from the surrounding text, default to `opacity: 0.55` in the sidebar links, and never carry their own color.

2. **A single back-arrow** (chevron-left) on the post page top bar — same SVG style.

3. **Two emoji** in the theme toggle (☀️ 🌙) and **one emoji per empty state** (🔧 projects, ✍️ blog, ⏳ post-loading, 🔍 not-found, ⚠️ error). These are the only emoji.

4. **No icon font, no Lucide / Heroicons / Phosphor / FontAwesome import.** Adding one would be a deviation; if you need a new icon, draw it inline with the same style: 24×24 viewBox, 2 px stroke, `currentColor`, no fill.

5. **No PNG raster icons.** No favicon ships in the source repo — `assets/wordmark.svg` and `assets/avatar-mark.svg` in this design system fill that gap (both monochrome, currentColor).

If a CDN icon set is *required* for a future surface, **Lucide** is the closest match in stroke style (2 px, round caps, geometric). Flag any introduction of a third-party icon font as a deviation from the source.

---

## Quick start

```html
<!doctype html>
<html data-theme="dark">
  <head>
    <link rel="stylesheet" href="colors_and_type.css">
  </head>
  <body>
    <div class="t-section-label">About</div>
    <h1 class="t-display">Hi, I'm <em class="t-em">Dallen</em>.</h1>
    <p class="t-body">My interests lie at the intersection of <em class="t-em">geometry</em>, <em class="t-em">probability</em>, and <em class="t-em">statistics</em>.</p>
  </body>
</html>
```

For a richer starting point, copy `ui_kits/cv_site/index.html` and edit content.
