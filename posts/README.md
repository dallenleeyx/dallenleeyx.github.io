# Posts

Each blog post is a Markdown file in this folder. The site loads them via `_index.json`.

## How to add a post

1. In the running site, click **Write Post** in the Blog section. Fill in title, date, tag, excerpt, and body (Markdown + LaTeX), then preview.
2. Click **Download Post** — you'll get a `.md` file (the body) and a `_index-snippet.json` (the entry to add to `_index.json`).
3. Copy the `.md` file into this `posts/` folder.
4. Open `_index.json` and paste the snippet into the `posts` array. The newest post should be at the top.
5. Commit and push.

## Markdown + LaTeX

- Inline math: `$x^2 + y^2 = r^2$`
- Display math: `$$ \int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2} $$`
- Headings: `## Heading`, `### Subheading`
- Emphasis: `**bold**`, `*italic*`, `` `code` ``

## Local previewing

`fetch()` won't read local files when you open `index.html` directly via `file://`. Run a local server in the `ui_kits/cv_site/` folder:

```
python -m http.server 8000
```

Then visit `http://localhost:8000`. On GitHub Pages this is automatic.
