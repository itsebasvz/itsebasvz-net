import { expect, test } from "@playwright/test";

/**
 * The two locale routes and the metadata that makes them one site rather than
 * two that happen to overlap. Everything here is asserted against the built
 * output, because the sitemap and the hashed og:image only exist after a build.
 */

const routes = [
  { path: "/", lang: "es", canonical: "https://itsebasvz.net/", ogLocale: "es_MX" },
  { path: "/en/", lang: "en", canonical: "https://itsebasvz.net/en/", ogLocale: "en_US" }
] as const;

for (const route of routes) {
  test.describe(route.path, () => {
    test("declares its language and canonical URL", async ({ page }) => {
      await page.goto(route.path);

      await expect(page.locator("html")).toHaveAttribute("lang", route.lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", route.canonical);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        route.ogLocale
      );
    });

    test("points at both locales and a default", async ({ page }) => {
      await page.goto(route.path);

      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
        "href",
        "https://itsebasvz.net/"
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        "href",
        "https://itsebasvz.net/en/"
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        "href",
        "https://itsebasvz.net/"
      );
    });

    test("carries a link preview card at an absolute URL", async ({ page }) => {
      await page.goto(route.path);

      // Relative og:image silently yields no preview at all, because the
      // crawlers fetching it have no page context to resolve against.
      const image = page.locator('meta[property="og:image"]');
      await expect(image).toHaveAttribute("content", /^https:\/\/itsebasvz\.net\//);
    });

    test("renders all eight scenes and one main landmark", async ({ page }) => {
      await page.goto(route.path);

      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("[data-scene]")).toHaveCount(8);
    });

    test("switches to the other locale through a real anchor", async ({ page }) => {
      await page.goto(route.path);

      const other = route.path === "/" ? "/en/" : "/";
      const link = page.locator(`a[href="${other}"]`).first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${other.replace("/", "\\/")}$`));
    });
  });
}

test("publishes a sitemap the robots file can point at", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("sitemap-index.xml");

  const sitemap = await request.get("/sitemap-index.xml");
  expect(sitemap.ok()).toBeTruthy();
});
