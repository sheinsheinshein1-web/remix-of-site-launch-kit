import { test, expect } from "@playwright/test";

for (const path of [
  "/proizvoditeli/da-home/",
  "/proizvoditeli/exmodule/",
  "/proizvoditeli/bygge/",
  "/modulnye-doma/proekty/da-home-dachnyy-dom-15-15-m2-555/",
  "/modulnye-doma/proekty/platforma-bear-house-86-69-m2-36/",
]) {
  test(`catalog media stays on our host: ${path}`, async ({ page, baseURL }) => {
    const remoteImages: string[] = [];
    page.on("request", request => {
      if (request.resourceType() === "image" && request.frame() === page.mainFrame()
          && new URL(request.url()).origin !== new URL(baseURL!).origin) remoteImages.push(request.url());
    });
    await page.route("**/*", route => {
      const url = new URL(route.request().url());
      return url.origin === new URL(baseURL!).origin ? route.continue() : route.abort();
    });
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    const images = page.locator("main img");
    const visibleImage = page.locator("main img:visible").first();
    await expect(visibleImage).toBeVisible();
    await expect.poll(() => visibleImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const foreignSources = await images.evaluateAll(nodes => nodes
      .map(node => (node as HTMLImageElement).src)
      .filter(src => !src.startsWith("data:") && new URL(src).origin !== location.origin));
    expect(foreignSources).toEqual([]);
    expect(remoteImages).toEqual([]);
  });
}
