# Notes and simulations: editing guide

## Publish an entry

1. Open [Pages CMS](https://app.pagescms.org/dallenleeyx/dallenleeyx.github.io/main).
2. Choose **Notes & simulations** → Create. Add a title, date, type (Note/Simulation), short summary, and optional tags.
3. Write the article in the **Markdown + LaTeX** code editor. Set **Publish** to true.
4. Save. GitHub Actions rebuilds the note index and individual posts. The article URL is \`/notes/<filename-without-md>/\`.

Each entry is a Markdown file under \`site/notes/content/\` with YAML frontmatter. The filename becomes its URL; rename it cautiously because external links would change. Unpublished entries are excluded from generated pages, but **they are not private**: source files live in this public repository.

### Markdown and LaTeX

Use ordinary Markdown for paragraphs, headings, links, lists, tables, code fences and images. Write inline math as \`$E=mc^2$\` or \\(E=mc^2\\); display equations as:

~~~text
$$
dX_t=b(X_t,u_t)\,dt+\sigma(X_t,u_t)\,dW_t.
$$
~~~

The published pages are built with Marked and KaTeX, so readers see typeset equations without a client-side math parser. The builder also accepts LaTeX's \\( ... \\) and \\[ ... \\] delimiters; dollar signs are simplest in Pages CMS.

### Images

Use the **Article images** media source in Pages CMS and insert an image with Markdown:

~~~text
![Caption describing the figure](/notes/media/images/figure.png)
~~~

### Manim and other video

1. Render a scene from Manim as MP4 or WebM, for example \`manim -pqh scene.py ExampleScene\`.
2. Upload the video to the **Manim videos** media source in Pages CMS.
3. Put this shortcode on its own line in the article:

~~~text
::manim[An animated linear transformation](/notes/media/videos/linear-transform.mp4)
~~~

The builder will create an accessible HTML5 video player. Videos in Git repositories can make the repository large, and GitHub has per-file size limits; compress longer animations or host them externally and link instead.

### Interactive simulations

Add a self-contained HTML/JavaScript demo in \`site/simulations/<name>/index.html\`, then use:

~~~text
::simulation[Interactive Brownian motion](/simulations/brownian-motion/)
~~~

Simulations are sandboxed in an iframe, and must be hosted under \`/simulations/\`. The starter example in \`site/simulations/brownian-motion/\` needs no build step. Pages CMS edits article content; new custom simulation code still requires committing its HTML/JS to GitHub.

### Editing music

Use the existing **Music projects** collection. Add a title, summary, optional SoundCloud URL and links, and enable **Show in portfolio**. The original third-party sample recording is retained as an unpublished example, so it won't appear on the site.

## Deployment

The GitHub Actions workflow validates the existing music project lists, installs small note-build dependencies, and runs \`node site/notes/tools/build-notes.mjs\` to produce static pages and copy KaTeX CSS/fonts. No Next.js build is needed for the public GitHub Pages site.
