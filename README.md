# PK Alakaapuri Nidhi — Website

A one-page React site for a mutual fund distribution & demat account
advisory practice, built with Vite + React + Tailwind CSS.

## Before you publish

Open `src/App.jsx` and replace the placeholder details:

- Phone, email, and address (search for `+91 90000 00000`)
- ARN number and registration dates in the footer disclaimer
  (search for `ARN: ______`)

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Deploy to GitHub Pages

There are two common setups — pick the one that matches your repo name.

### Option A — Project page (repo named anything, e.g. `pk-alakaapuri-nidhi`)

Your site will be published at
`https://<your-username>.github.io/pk-alakaapuri-nidhi/`.

1. In `vite.config.js`, keep (or set) `base: "/pk-alakaapuri-nidhi/"`
   — this **must match your repo name exactly**, including case.
2. Push this project to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/pk-alakaapuri-nidhi.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Source → GitHub Actions.**
   The included workflow (`.github/workflows/deploy.yml`) will build and
   deploy automatically on every push to `main`.
4. After the first successful run (check the **Actions** tab), your site
   is live at the URL above.

### Option B — User/organization page (repo must be named `<your-username>.github.io`)

Your site will be published at `https://<your-username>.github.io/`.

1. In `vite.config.js`, change `base` to `"/"`.
2. Name the GitHub repo exactly `<your-username>.github.io`.
3. Same push + Actions steps as Option A.

### Manual alternative (no GitHub Actions)

```bash
npm install -g gh-pages   # one-time
npm run deploy
```

This builds the site and pushes the `dist` folder to a `gh-pages`
branch. Then in **Settings → Pages → Source**, choose the `gh-pages`
branch instead of GitHub Actions.

## Tech notes

- Icons: `lucide-react`
- Styling: Tailwind CSS (utility classes) + a small `<style>` block in
  `App.jsx` for fonts (Playfair Display, Manrope, IBM Plex Mono via
  Google Fonts) and the ledger card's reveal animation
- No backend: the contact form is currently a static form (`onSubmit`
  is prevented). Wire it up to Formspree, a Google Form, or your own
  endpoint before relying on it to capture leads.
