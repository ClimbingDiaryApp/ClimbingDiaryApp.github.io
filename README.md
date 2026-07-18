# Climbing Diary website

Public website, help and legal documents for the Climbing Diary Android app.

Live site: <https://climbingdiaryapp.github.io/>

## Languages

- Polish: `/`
- English: `/en/`
- German: `/de/`
- Spanish: `/es/`

Each language includes the landing page, privacy policy, account deletion instructions and terms of use.

## Publishing

GitHub Pages publishes the `main` branch from the repository root. The site is plain HTML, CSS and JavaScript and does not need a build step.

## Verification

Run `node .site-check.cjs` before publishing. The script checks all language versions, required legal pages, images and local links without external packages.

The shared application artwork is stored in `assets/ikonacd.png`; optimized web and Google Play variants are generated from that source.
