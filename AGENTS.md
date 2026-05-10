# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-dependency static web app (vanilla JS/HTML/CSS). There is no build step beyond syntax checking and no package installation required at runtime.

### Running the app

- **Dev server:** `npm start` runs `python3 -m http.server 8080` — visit `http://localhost:8080`.
- **Build/verify:** `npm run build` runs `node --check app.js` (syntax check) and `node scripts/verify-static-site.js` (asset/DOM-hook verification). This is the only lint/test command; there is no separate test suite or linter.
- All lender data is hardcoded in `app.js`; there are no databases, APIs, or external services.

### Gotchas

- The `npm run dev` command invokes Vercel CLI (`npx vercel dev`) and requires Vercel authentication — use `npm start` for local development instead.
- **Install/no-op:** no install step is required. Treat dependency installation as a no-op; running `npm install` may create a local `package-lock.json`, so skip it unless you intentionally want to generate one.
- CI uses Node.js 22 (see `.github/workflows/vercel.yml`).
