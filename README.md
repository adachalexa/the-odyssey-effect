# The Odyssey Effect (draft)

Static site, no build step. Five chapter pages + a home page linking them.

## Getting this live on GitHub Pages

1. Create a new repo on GitHub (e.g. `the-odyssey-effect`).
2. Upload everything in this folder to the repo root — `index.html`, `css/`, and `chapters/` should all sit at the top level, not nested inside another folder.
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
6. GitHub gives you a live URL a minute or two later, usually `https://<your-username>.github.io/<repo-name>/`.

## Adding content later

Each chapter page (`chapters/*.html`) has the same four placeholder sections:
Overview, Key Findings, Evidence & Sources, Media. Replace the italic
placeholder text in each `<p class="placeholder">…</p>` with real content —
the styling will carry over automatically.

To add a new file (e.g. an image), drop it in an `assets/` folder and
reference it as `../assets/filename.jpg` from a chapter page.
