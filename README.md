# BlenderCap Lender Search Demo

A self-contained demo site for matching borrower scenarios with lender
options. The demo is a static web app configured for Vercel hosting.

## Pages

| Page | File | Description |
|---|---|---|
| Lender Search | `index.html` | Residential/commercial scenario builder, ranked results, shortlist |
| Admin Dashboard | `admin.html` | Upload PDF lender guidelines, manage uploaded lenders |

## Run the demo

Open `index.html` directly in a browser, or serve the folder locally:

```bash
npm start
```

Then visit `http://localhost:8080`.

## Run with Vercel

Use Vercel's local development server to preview the deployed environment:

```bash
npm run dev
```

To validate the static site before deployment:

```bash
npm run verify
```

Create a Vercel preview deployment:

```bash
npm run deploy:preview
```

Deploy to production:

```bash
npm run deploy:production
```

Vercel runs `npm run build`, which verifies JavaScript syntax for both
`app.js` and `admin.js`, then checks that all required static page assets
and DOM hooks are present in both `index.html` and `admin.html`.

## Vercel configuration

The `vercel.json` file configures:

- **Clean URLs**: `/admin` serves `admin.html` without the `.html` extension.
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, and
  `Referrer-Policy` on all responses.
- **Cache control**: JavaScript, CSS, and HTML files use
  `must-revalidate` to ensure fresh content after each deploy.

## Authenticate Vercel in CI

The GitHub Actions workflow in `.github/workflows/vercel.yml` validates the
demo on pull requests and deploys to Vercel on pushes to `main` or manual
workflow runs. Configure these repository secrets before running the
deployment jobs:

- `VERCEL_TOKEN`: Vercel access token.
- `VERCEL_ORG_ID`: Vercel team or user ID that owns the project.
- `VERCEL_PROJECT_ID`: Vercel project ID for this demo.

### CI jobs

| Job | Trigger | Description |
|---|---|---|
| **Validate** | All PRs and pushes | Runs `npm run build` to verify syntax and assets |
| **Deploy preview** | Pull requests | Creates a Vercel preview deployment and comments the URL on the PR |
| **Deploy production** | Push to `main` or manual dispatch | Deploys to production Vercel environment |

## Demo flow

1. Choose Residential or Commercial from the homepage.
2. Select a scenario preset or edit the product, amount, region, timeline,
   and collateral fields.
3. Review the recommended next lender and ranked results.
4. Open lender details to inspect why a lender fits the scenario.
5. Save lenders to the shortlist and copy the generated handoff summary.

### Admin flow

1. Navigate to the Admin Dashboard from the top navigation.
2. Upload PDF lender guideline documents.
3. Review extracted lender details (product, rate, amount, region).
4. Uploaded lenders appear in the main search alongside built-in lenders.
