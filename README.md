# StudentCalc Nepal

StudentCalc Nepal is a static educational website for students in Nepal. It is built with HTML, CSS, and vanilla
JavaScript and is designed for GitHub Pages. Calculator values are processed in the visitor's browser; the project
does not include an application backend or account system.

## Project layout

- `index.html`: homepage, featured calculators, categories, and calculator search.
- `calculators/`: individual calculator pages and the complete tool directory.
- `assets/js/calculators.js`: calculation functions, input checks, and result formulas.
- `assets/js/app.js`: shared navigation, calculator forms, explanations, and search.
- `assets/css/style.css`: responsive visual styles and accessibility states.
- `guides/`: original explanations and worked educational examples.
- `about.html`, `contact.html`, `privacy-policy.html`, `terms.html`, and `disclaimer.html`: site information and policies.
- `robots.txt` and `sitemap.xml`: crawler instructions and canonical URL inventory.
- `tests/`: Node.js tests for calculator behavior and static site links.

## Run locally

Open `index.html` in a browser, or use a local static web server to test relative links and calculator pages.
No package installation or build step is required.

## Run tests

With Node.js installed, run:

```powershell
node --test tests\site.test.js tests\calculators.test.js
```

## Calculation and privacy notes

The calculator pages explain their formulas and assumptions. Grading scales, credit hours, and school policies can
change; NEB and SEE results are estimates, not official records. Review the current `privacy-policy.html` before
adding analytics, embedded services, or advertising code, and update it to reflect the actual implementation.