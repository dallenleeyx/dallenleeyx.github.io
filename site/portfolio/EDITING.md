# Editing the portfolios

Open [Pages CMS](https://app.pagescms.org/dallenleeyx/dallenleeyx.github.io/main) and sign in with GitHub.

Choose **Music projects**, **Engineering projects**, or **ML / AI projects**.

Each project has:

- **Project title** and **Short description** for the public list.
- **Display order**: lower numbers appear first. Use 10, 20, 30 so another entry can fit between them.
- **Show in portfolio**: turn it on to display the entry.
- **Project links**: add a button label and link address for each link. Use a full URL for external websites, or a relative path for an existing page within that portfolio.
- For music, an optional **SoundCloud player URL**, **Artist or performer**, and **Player credit**.

Saving in Pages CMS commits your changes to `main` and starts the GitHub Pages deployment automatically. Allow the deployment to finish before refreshing the public site. You can follow progress in [GitHub Actions](https://github.com/dallenleeyx/dallenleeyx.github.io/actions/workflows/pages.yml).

Add projects with the collection's create button. To remove one, delete it in the editor or turn off **Show in portfolio**. The visibility toggle only hides the public list entry; content files remain in this public GitHub repository.

The editor changes project content, not the CV, page designs, or the separate Next.js app. The GitHub App itself is authorized at repository level; the editor configuration is not a file-permission boundary.

## How publishing works

Each project is a JSON file in `site/portfolio/content/<portfolio>/`. The Pages workflow validates these files and renders the three static HTML lists before deploying `site/`.

Run locally without installing the Next.js app:

```text
node --test site/portfolio/tools/build-projects.test.mjs
node site/portfolio/tools/build-projects.mjs
```

The generated project-list HTML in each portfolio page is replaced during deployment. Edit the JSON files or use Pages CMS for project changes. Layout changes belong outside the `projects:start` / `projects:end` markers.
