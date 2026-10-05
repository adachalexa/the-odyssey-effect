# The Odyssey Effect (draft)

Static site, no build step. Five chapter pages + a home page linking them.

## Getting this live on GitHub Pages

1. Create a new repo on GitHub (e.g. `the-odyssey-effect`).
2. Upload every file in this folder to the repo root. There are no subfolders: all pages, `style.css` and `charts.js` sit together at the top level.
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
6. GitHub gives you a live URL a minute or two later, usually `https://<your-username>.github.io/<repo-name>/`.

## Adding content later

Each chapter page (`technical-craft.html`, `gen-z-audience.html`, `cast-celebrity.html`, `viral-social.html`, `marketing-distribution.html`) follows the same layout: Overview, Key numbers
(3 to 5), numbered findings, Things to keep in mind, and Sources. Charts use the
helpers in `charts.js`. The footer on every page reads "SMACC Fall 2026 research".

To add an image, upload it next to the pages and reference it by file name, e.g. `<img src="poster.jpg">`.
