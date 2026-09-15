import { expect, test } from "@playwright/test";

const manufacturers = ["platforma", "bygge", "fps-modul", "glavles"];

for (const manufacturerId of manufacturers) {
  test(`${manufacturerId}: Yandex map and review widget receive real URLs`, async ({ page }) => {
    await page.goto(`/proizvoditeli/${manufacturerId}/`);

    const map = page.locator("iframe[title^='Производство компании']");
    const reviews = page.locator("iframe[title^='Официальный виджет отзывов']");
    await expect(map).toHaveAttribute("src", /^https:\/\/yandex\.ru\/map-widget\/v1/);
    await expect(reviews).toHaveAttribute("src", /^https:\/\/yandex\.ru\/maps-reviews-widget\//);

    await expect.poll(async () => {
      const urls = page.frames().map((frame) => frame.url());
      return {
        map: urls.some((url) => url.startsWith("https://yandex.ru/map-widget/")),
        reviews: urls.some((url) => url.startsWith("https://yandex.ru/maps-reviews-widget/")),
      };
    }, { timeout: 15_000 }).toEqual({ map: true, reviews: true });
  });
}
