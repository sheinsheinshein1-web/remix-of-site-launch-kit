import { expect, test } from "@playwright/test";

for (const width of [375, 768, 1024, 1440, 5120]) {
  test(`catalog shares the page grid at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1(?::\d+)?(?:\/|$))/, (route) => route.abort());

    for (const path of ["/modulnye-bani/", "/modulnye-doma/ekaterinburg/"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const firstCard = page.locator("article").first();
      await expect(firstCard).toBeVisible();
      const geometry = await page.evaluate(() => {
        const title = document.querySelector("h1")!.getBoundingClientRect();
        const search = Array.from(document.querySelectorAll<HTMLElement>('[aria-label="Поиск по сайту"], [aria-label="Открыть поиск"]'))
          .find((control) => control.getBoundingClientRect().width > 0)!;
        const searchRect = search.getBoundingClientRect();
        const cards = Array.from(document.querySelectorAll("article")).map((card) => card.getBoundingClientRect());
        return {
          titleLeft: title.left,
          searchLeft: searchRect.left,
          cardsLeft: Math.min(...cards.map((card) => card.left)),
          cardsRight: Math.max(...cards.map((card) => card.right)),
          cardWidth: cards[0].width,
          firstGalleryHeight: document.querySelector("article .touch-pan-y")!.getBoundingClientRect().height,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const contentLeft = Math.max(0, (width - 1400) / 2) + (width >= 1024 ? 48 : width >= 640 ? 32 : 16);
      const contentRight = width - contentLeft;
      expect(geometry.titleLeft).toBeCloseTo(contentLeft, 0);
      expect(geometry.searchLeft).toBeGreaterThanOrEqual(contentLeft);
      expect(geometry.searchLeft).toBeLessThan(contentLeft + 2);
      expect(geometry.cardsLeft).toBeGreaterThanOrEqual(contentLeft);
      expect(geometry.cardsRight).toBeCloseTo(contentRight, 0);
      expect(geometry.cardWidth).toBeLessThanOrEqual(510);
      expect(geometry.firstGalleryHeight / geometry.cardWidth).toBeCloseTo(width < 768 ? 3 / 4 : 4 / 5, 2);
      expect(geometry.overflow).toBe(0);
    }
  });
}
