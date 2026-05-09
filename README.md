# BlenderCap Lender Search Demo

A self-contained, usable demo site for matching borrower scenarios with lender
options. The demo is a static web app configured for Vercel hosting.

## What is included

- Guided borrower scenario builder with presets for property, equipment, and
  growth-capital requests.
- Scenario-based lender fit scoring with ranked results and match reasons.
- Search, product, amount, and sort controls for exploring the lender network.
- Lender detail dialog with underwriting strengths and deal-fit context.
- Persistent shortlist with copyable summary for a borrower or relationship
  manager handoff.
- Responsive styling for desktop and mobile demo walkthroughs.

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

Vercel runs `npm run build`, which verifies JavaScript syntax and required
static page assets before serving the root directory.

## Authenticate Vercel in CI

The GitHub Actions workflow in `.github/workflows/vercel.yml` validates the demo
on pull requests and deploys to Vercel on pushes to `main` or manual workflow
runs. Configure these repository secrets before running the deployment job:

- `VERCEL_TOKEN`: Vercel access token.
- `VERCEL_ORG_ID`: Vercel team or user ID that owns the project.
- `VERCEL_PROJECT_ID`: Vercel project ID for this demo.

The deployment job uses those secrets to run:

```bash
npx vercel@latest pull --yes --environment=production --token="$VERCEL_TOKEN"
npx vercel@latest build --prod --token="$VERCEL_TOKEN"
npx vercel@latest deploy --prebuilt --prod --token="$VERCEL_TOKEN"
```

## Demo flow

1. Choose a scenario preset or edit the product, amount, region, timeline, and
   collateral fields.
2. Review the recommended next lender and ranked results.
3. Open lender details to inspect why a lender fits the scenario.
4. Save lenders to the shortlist and copy the generated handoff summary.
