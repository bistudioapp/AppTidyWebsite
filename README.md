# AppTidy Landing Page

This is a static landing page for `app-tidy.com`.

Open `index.html` directly in a browser, or preview locally with:

```bash
python3 -m http.server 8765 --directory website
```

Then visit `http://localhost:8765`.

## Pages

- `index.html` - Main AppTidy landing page.
- `how-it-works.html` - AppTidy workflow walkthrough page.
- `features.html` - AppTidy feature overview page.
- `help.html` - AppTidy help and setup guide.
- `tips.html` - Support Dev / Ko-fi tips page.
- `privacy.html` - Privacy policy.
- `terms.html` - Terms of use.
- `copyright-trademark.html` - Copyright, trademark, and attribution notices.

The footer credits both the app development and website design to `bistudio.app`.

## Downloads

Download buttons point to `/download?v=0.1.2` so browsers do not reuse a stale
cached `latest` response. In Cloudflare Pages / Workers & Pages,
`functions/download.js` streams that route from a private R2 bucket.

Configure the Pages Function with an R2 bucket binding:

```text
APPTIDY_DOWNLOADS
```

By default, `/download` reads the current versioned DMG from R2 and sends users
a versioned filename such as `AppTidy-0.1.2.dmg`. You can override the object key
with a production environment variable:

```text
APPTIDY_DOWNLOAD_KEY=AppTidy-0.1.2.dmg
```

Optional metadata environment variables keep the browser filename, response
headers, and `/download/checksum` endpoint aligned with the release in R2:

```text
APPTIDY_DOWNLOAD_VERSION=0.1.2
APPTIDY_DOWNLOAD_FILENAME=AppTidy-0.1.2.dmg
APPTIDY_DOWNLOAD_SHA256=68959d3532266389ea69c84d6ca174334f1268805c81bb2553cd78654778687e
```

Keep DMG files out of the website repository. Upload versioned builds to R2 and
point `APPTIDY_DOWNLOAD_KEY`, or the default object key in `functions/download.js`,
at the current release when a new version ships.

## Cloudflare Deployment

This folder is meant to live in its own GitHub repository, separate from the
AppTidy macOS source repository.

Recommended Cloudflare setup:

- Product: Workers & Pages / Pages project connected to GitHub.
- Repository: `AppTidyWebsite`.
- Framework preset: None / static site.
- Build command: leave empty.
- Build output directory: `/`.
- Functions directory: `functions`.
- R2 bucket binding: `APPTIDY_DOWNLOADS`.
- Optional production environment variable:
  `APPTIDY_DOWNLOAD_KEY=AppTidy-0.1.2.dmg`
- Optional release metadata variables:
  `APPTIDY_DOWNLOAD_VERSION`, `APPTIDY_DOWNLOAD_FILENAME`, and
  `APPTIDY_DOWNLOAD_SHA256`

After the GitHub repo is connected, every push to the default branch can deploy
the website automatically. The DMG should be uploaded separately to Cloudflare
R2 and served through the `/download` function.

## Screenshot Assets

The page is designed to use real AppTidy workflow screenshots from `website/assets/`.
Until those files exist, the page renders polished built-in fallback mock panels.

Expected filenames:

- `assets/01-drop.png`
- `assets/02-app-list.png`
- `assets/03-scanning.png`
- `assets/04-results.png`
- `assets/04-results-recommended.png`
- `assets/05-removing.png`
- `assets/06-success.png`
- `assets/07-leftovers.png`
- `assets/08-settings.png`
- `assets/09-dark-mode.png`
- `assets/10-menu.png`

Keep captures consistent, ideally around `1600x1000` or `1800x1100`, showing only the AppTidy window.
