---
name: dallen-lee-design
description: Use this skill to generate well-branded interfaces and assets for Dallen Lee's personal CV brand — a monochromatic, mathematics-first academic-portfolio aesthetic. Suitable for production work on his site or for throwaway prototypes/mocks/slides that should look like they belong to him. Contains color + type tokens, the Nunito/DM Mono pairing, the math-glyph particle motif, and a UI kit recreating the live site.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (especially `colors_and_type.css`, `ui_kits/cv_site/`, and `preview/` for the visual vocabulary).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy the relevant assets out of `assets/` and `fonts/`, link `colors_and_type.css`, and create static HTML files for the user to view. The signature motifs are: monochrome palette only, Nunito + DM Mono, animated math-glyph particle background, vertical math-deco string in the bottom-left, italic *term-emphasis* via `<em>`, em-dashes as bullet markers and clause joiners.

If working on production code for the personal site, copy `colors_and_type.css` in and read `README.md` to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a new section for the CV? a slide deck about their research? a blog-post template? a new project card?), ask a few clarifying questions about content + length, and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

**Hard constraints — do not violate without asking.**
- No color outside the grayscale tokens defined in `colors_and_type.css`.
- No emoji except in empty-state placeholders and the theme toggle.
- No icon font; SVGs are hand-rolled, 2 px stroke, `currentColor`.
- British spelling. First-person singular. Em-dash, not hyphen.
- Math symbols (∂, ∇, ∑, ℝ, etc.) are the brand's *only* permitted ornament.
