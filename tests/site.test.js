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