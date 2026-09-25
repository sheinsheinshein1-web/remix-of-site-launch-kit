import { expect, test, type Page } from "@playwright/test";

const checkSection = async (page: Page) => {
  const heading = page.locator("#related-region-projects-heading");
  const section = page.locator('section[aria-labelledby="related-region-projects-heading"]');
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Другие проекты в Екатеринбурге");
  await expect(section.locator('a[href*="/e-module-stroy-"]')).toHaveCount(0);
  await expect(section.locator("article").first()).toBeVisible();

  const geometry = await section.evaluate((root) => {
    const title = root.querySelector("h2")!;
    const titleRect = title.getBoundingClientRect();
    const hit = document.elementFromPoint(titleRect.left + 8, titleRect.top + titleRect.height / 2);
    const articles = Array.from(root.querySelectorAll("article"));
    return {
      titleUncovered: !!hit && title.contains(hit),
      cardsBelowHeading: articles.every((card) => card.getBoundingClientRect().top >= titleRect.bottom),
      cardsIsolated: articles.every((card) => getComputedStyle(card).isolation === "isolate"),
      galleriesContained: articles.every((card) => {
        const gallery = card.querySelector(".touch-pan-y")!;
        const style = getComputedStyle(gallery);
        return style.contain === "paint" && style.isolation === "isolate";
      }),
      sourceProjectsAbove: document.querySelector("#projects")!.getBoundingClientRect().bottom <= titleRect.top,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(geometry).toEqual({
    titleUncovered: true, cardsBelowHeading: true, cardsIsolated: true,
    galleriesContained: true, sourceProjectsAbove: true, overflow: 0,
  });
};

for (const width of [375, 768, 1024, 1440]) {
  test(`manufacturer recommendations remain separate after return at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    // Exercise layout even when external media is unavailable or delayed.
    await page.route(/^https?:\/\/(?!127\.0\.0\.1(?::\d+)?(?:\/|$))/, (route) => route.abort());
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/proizvoditeli/e-module-stroy/");
    await expect(page.locator("#manufacturer-projects-panel article")).toHaveCount(9);
    await checkSection(page);
    await page.locator('section[aria-labelledby="related-region-projects-heading"] article a').first().click();
    await expect(page).toHaveURL(/\/modulnye-doma\/proekty\//);
    await page.goBack();
    await expect(page.locator("#manufacturer-profile-title")).toHaveText("E.Module-stroy");
    await checkSection(page);
    await expect(page.locator("#manufacturer-projects-panel article")).toHaveCount(9);
  });
}
