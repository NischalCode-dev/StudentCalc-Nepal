# StudentCalc Nepal

StudentCalc Nepal is a static, framework-free student calculator website. It uses HTML, CSS, and vanilla JavaScript; calculator inputs are evaluated in the browser without an account or application backend.

## Run locally

Open `index.html` directly in a modern browser, or serve this folder with any static HTTP server. For example, from this folder:

```sh
npx serve .
```

No build step or runtime dependency is required. Direct-file opening supports the current static pages; an HTTP server is recommended for checking canonical URLs and deployment behavior.

Run the calculator unit tests with Node.js 18 or newer:

```sh
node --test
```

## Deploy with GitHub and Cloudflare Pages

1. Create a GitHub repository and push the contents of this folder to its default branch.
2. In Cloudflare, open **Workers & Pages**, create a Pages project, and connect the GitHub repository.
3. Choose the production branch. Leave the build command empty and set the build output directory to `/` (the repository root). This is a static site and has no generated build output.
4. Deploy. Cloudflare Pages will publish each commit pushed to the configured branch.
5. In the Pages project, add `kaflenischal1.com.np` as a custom domain and follow Cloudflare's DNS instructions. Confirm both the apex domain and `www` behavior if you plan to use both.
6. After DNS is active, check the deployed homepage, calculator routes, `robots.txt`, and `sitemap.xml`. Submit the sitemap to Google Search Console if desired.

## Before public launch

- Confirm the contact mailbox `contact@kaflenischal1.com.np` exists and is monitored, or replace it in the Contact, Privacy, and Terms pages.
- Review the privacy policy and terms for the actual hosting, analytics, and advertising services you choose. This version has no ad or analytics code; update disclosures and consent handling before adding third-party advertising.
- Verify any school-specific grade boundaries with current official sources. The NEB, SEE, university GPA tools intentionally use user-entered grade points and credits and do not claim official equivalence.
- Check the domain and canonical URLs, then test on real mobile and desktop browsers.

## Project layout

- `index.html`: homepage, calculator discovery, and search.
- `calculators/`: individual calculator pages and the full tool directory.
- `assets/js/calculators.js`: validated calculation functions and formulas.
- `assets/js/app.js`: shared navigation, search, calculator forms, and results.
- `assets/css/style.css`: responsive layout and visual system.
- `guides/`: original educational explanations and worked examples.
- `robots.txt` and `sitemap.xml`: crawl guidance and canonical URL inventory.