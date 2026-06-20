# AppTidy Landing Page

This is a static landing page for `app-tidy.com`.

Open `index.html` directly in a browser, or preview locally with:

```bash
python3 -m http.server 8765 --directory website
```

Then visit `http://localhost:8765`.

## Pages

- `index.html` - Main AppTidy landing page.
- `help.html` - AppTidy help and setup guide.
- `tips.html` - Support the developer / Ko-fi tips page.
- `privacy.html` - Privacy policy.
- `terms.html` - Terms of use.
- `copyright-trademark.html` - Copyright, trademark, and attribution notices.

The footer credits both the app development and website design to `bistudio.app`.

## Downloads

Download buttons point to `/download`. In Cloudflare Pages / Workers & Pages,
`functions/download.js` streams that route from a private R2 bucket.

Configure the Pages Function with an R2 bucket binding:

```text
APPTIDY_DOWNLOADS
```

By default, `/download` serves `AppTidy-latest.dmg`. You can override the object
key with a production environment variable:

```text
APPTIDY_DOWNLOAD_KEY=releases/AppTidy-0.1.0.dmg
```

Keep DMG files out of the website repository. Upload versioned builds to R2 and
copy or alias the current release to `AppTidy-latest.dmg` when a new release
ships.

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
  `APPTIDY_DOWNLOAD_KEY=AppTidy-latest.dmg`

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
