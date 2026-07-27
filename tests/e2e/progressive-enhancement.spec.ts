import { expect, test } from "@playwright/test";

/**
 * The rules that keep motion an enhancement rather than a dependency. Each of
 * these has a matching rule in CLAUDE.md, and each is the kind of thing that
 * only breaks in the configuration nobody develops in.
 */

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every scene still renders", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("[data-scene]")).toHaveCount(8);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("content is visible rather than waiting on a from-state", async ({ page }) => {
    await page.goto("/");

    // GSAP applies its from-states at runtime with gsap.from(). Static CSS
    // from-states would look identical with JavaScript on and render the whole
    // page blank with it off, which is exactly the failure this catches.
    for (const scene of await page.locator("[data-scene]").all()) {
      await expect(scene).toBeVisible();
      await expect(scene).toHaveCSS("opacity", "1");
    }
  });

  test("the locale switch still works", async ({ page }) => {
    await page.goto("/");

    await page.locator('a[href="/en/"]').first().click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("with reduced motion", () => {
  // page.emulateMedia rather than test.use({ reducedMotion }): the fixture form
  // did not reach the page from inside a describe — matchMedia still reported
  // no-preference and the hero booted, which is the opposite of what the test
  // claimed to be checking. Emulating explicitly before navigating leaves no
  // room for that. It has to happen before goto, or the CSS and the boot guard
  // have both already read the old value.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("registers no ScrollTrigger and pins nothing", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // ScrollTrigger creates a .pin-spacer whenever it pins. The motion table
    // forbids pinning outright, so one appearing means something reached for a
    // technique this project ruled out.
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("[data-scene]")).toHaveCount(8);
  });

  test("the hero canvases stay out of the way", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Same scenes, same photographs, same order — the WebGL props simply do
    // not boot.
    await expect(page.locator("[data-hero-ball]")).toBeHidden();
  });
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
