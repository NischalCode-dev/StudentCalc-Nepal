const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith(".html") ? [target] : [];
  });
}

test("all static local HTML, stylesheet, and script links resolve", () => {
  const pages = htmlFiles(root);
  for (const page of pages) {
    const source = fs.readFileSync(page, "utf8");
    for (const [, href] of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(href)) continue;
      const localPath = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      const target = localPath.startsWith("/")
        ? path.join(root, localPath.slice(1))
        : path.resolve(path.dirname(page), localPath);
      assert.ok(fs.existsSync(target), `${path.relative(root, page)} links to missing ${href}`);
    }
  }
});

test("every calculator catalog entry has a page and sitemap entry", () => {
  const app = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");
  const slugs = [...app.matchAll(/slug: "([^"]+)"/g)].map(([, slug]) => slug);
  assert.equal(slugs.length, 16);
  for (const slug of slugs) assert.ok(fs.existsSync(path.join(root, "calculators", `${slug}.html`)), `${slug} page is missing`);

  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const pathname = new URL(url).pathname;
    const relative = pathname.endsWith("/") ? `${pathname.slice(1)}index.html` : pathname.slice(1) || "index.html";
    assert.ok(fs.existsSync(path.join(root, relative)), `Sitemap path ${pathname} is missing`);
  }
});

test("every page has unique metadata for the preferred www domain", () => {
  const pages = htmlFiles(root);
  const titles = [];
  const descriptions = [];
  const canonicals = [];
  for (const page of pages) {
    const source = fs.readFileSync(page, "utf8");
    const title = source.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = source.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
    const canonical = source.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const ogTitle = source.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1];
    const ogDescription = source.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)?.[1];
    const ogType = source.match(/<meta\s+property="og:type"\s+content="([^"]+)"/i)?.[1];
    const ogUrl = source.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i)?.[1];
    const name = path.relative(root, page);

    assert.ok(title, `${name} is missing a title`);
    assert.ok(description, `${name} is missing a description`);
    assert.ok(canonical, `${name} is missing a canonical URL`);
    assert.ok(ogTitle && ogDescription && ogType && ogUrl, `${name} is missing Open Graph metadata`);
    assert.equal(new URL(canonical).hostname, "www.kaflenischal1.com.np", `${name} uses the wrong canonical host`);
    assert.equal(ogUrl, canonical, `${name} Open Graph URL must match its canonical URL`);
    titles.push(title);
    descriptions.push(description);
    canonicals.push(canonical);
  }

  assert.equal(new Set(titles).size, titles.length, "Page titles should be unique");
  assert.equal(new Set(descriptions).size, descriptions.length, "Page descriptions should be unique");
  assert.equal(new Set(canonicals).size, canonicals.length, "Canonical URLs should be unique");
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.deepEqual(new Set(sitemapUrls), new Set(canonicals), "Sitemap should list every canonical page exactly once");
});

test("every calculator has its own complete educational guide", () => {
  const app = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");
  const catalogIds = [...app.matchAll(/\{ id: "([^"]+)", slug:/g)].map(([, id]) => id);
  const guideBody = app.match(/const calculatorGuides = \{([\s\S]*?)\n  \};/)?.[1];
  assert.ok(guideBody, "Calculator guide data is missing");
  const guideIds = [...guideBody.matchAll(/^\s+(?:"([^"]+)"|([a-z][\w-]*)):\s+\{/gm)]
    .map(([, quoted, plain]) => quoted || plain);

  assert.deepEqual(new Set(guideIds), new Set(catalogIds), "Every calculator needs a guide entry");
  for (const section of ["example:", "steps:", "mistakes:", "limitation:", "faqs:"]) {
    assert.equal([...guideBody.matchAll(new RegExp(`\\b${section}`, "g"))].length, catalogIds.length,
      `Every calculator guide needs ${section.slice(0, -1)}`);
  }
  assert.match(guideBody, /does not apply subject credit hours/);
  assert.match(guideBody, /applies its encoded 3- or 5-credit values/);
});