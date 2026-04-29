# Fonts

This brand uses **two Google Fonts**, loaded primarily via the Google Fonts CDN:

- **Nunito** — sans, weights 300/400/500/600/700 + italic 400/500
- **DM Mono** — mono, weights 300/400/500

Local backups can be downloaded from:
- https://fonts.google.com/specimen/Nunito
- https://fonts.google.com/specimen/DM+Mono

Place the woff2 files alongside this README and reference them via the `@font-face` block in `colors_and_type.css` if you need offline support. The CDN `@import` at the top of `colors_and_type.css` is the default and is sufficient for online use.

> **Substitution flag.** The `_source/` site loads both fonts directly from Google Fonts CDN — no local files were committed. This system mirrors that approach. If the user wants offline-capable artifacts, they should download the woff2 files and we'll add the `@font-face` declarations.
