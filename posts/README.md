# Posts

Each blog post is a Markdown file in this folder. **The site auto-discovers .md files** via the GitHub API — you no longer need to edit `_index.json` manually.

## How to add a post

1. On the live site, click **Write Post** in the Blog section. Fill in title, date, tag, excerpt, and body. Use the live preview.
2. Click **Download Post** — you get a single `.md` file with YAML front-matter already baked in.
3. Upload the `.md` into this `posts/` folder on GitHub, commit. Done — it appears on the site within a few minutes.

## Format

A post is a Markdown file with optional YAML front-matter at the top:

```
---
title: My Post Title
date: May 2026
tag: Notes
excerpt: A 1-2 sentence summary. Supports $math$.
---

The body of the post in **Markdown** with $LaTeX$ support.

## Section heading

$$\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}$$
```

If front-matter is missing, the loader falls back to the filename (slug → title).

## Loader fallback chain

The site tries, in order:
1. **GitHub API** — lists every `.md` in this folder. No `_index.json` needed.
2. `_index.json` — legacy fallback if the API is rate-limited (60 req/hr/IP).
3. Hardcoded seed posts — last resort if both fail (e.g. opened via `file://`).

Hidden files (starting with `_`) and `README.md` are ignored.
