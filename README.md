# BlenderCap Lender Search Demo

A self-contained, usable demo site for matching borrower scenarios with lender
options. The demo is a static web app, so it does not require a build step or
package installation.

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
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Demo flow

1. Choose a scenario preset or edit the product, amount, region, timeline, and
   collateral fields.
2. Review the recommended next lender and ranked results.
3. Open lender details to inspect why a lender fits the scenario.
4. Save lenders to the shortlist and copy the generated handoff summary.
