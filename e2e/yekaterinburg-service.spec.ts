import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1(?::\d+)?(?:\/|$))/, (route) => route.abort());
});

test("Yekaterinburg hub uses current data and mounts one catalog batch", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/modulnye-doma/ekaterinburg/");

  await expect(page.locator("h1")).toHaveText("Модульные дома в Екатеринбурге и Свердловской области");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    "https://многоместа.рф/modulnye-doma/ekaterinburg/",
  );
  await expect(page.getByText(/238 проектов от 16 производителей/).first()).toBeVisible();
  await expect(page.getByText(/Найдено:\s*238 проектов в Екатеринбурге/).first()).toBeVisible();
  await expect(page.locator("article")).toHaveCount(24);
  await expect(page.getByTestId("catalog-projects-load-more")).toBeAttached();
  await expect(page.locator("#region-makers-heading a")).toHaveAttribute(
    "href",
    "/proizvoditeli/?region=ekaterinburg",
  );
});

test("mobile catalog does not mount a hidden duplicate project grid", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/modulnye-doma/ekaterinburg/");

  await expect(page.locator("article")).toHaveCount(24);
  await expect(page.getByText(/Найдено:\s*238 проектов в Екатеринбурге/).first()).toBeVisible();
});

test("Sverdlovsk region keeps its own canonical and filter identity", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/modulnye-doma/sverdlovskaya-oblast/");

  await expect(page.locator("h1")).toHaveText("Модульные дома в Свердловской области");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    "https://многоместа.рф/modulnye-doma/sverdlovskaya-oblast/",
  );
  await expect(page.getByText(/Найдено:\s*238 проектов в Свердловской области/).first()).toBeVisible();
  await expect(page.locator("#region-makers-heading a")).toHaveAttribute(
    "href",
    /region=sverdlovskaya-oblast/,
  );
});

test("manufacturer rating is identical in the region hub, list and profile", async ({ page }) => {
  await page.goto("/modulnye-doma/ekaterinburg/");
  await expect(
    page.locator("section[aria-labelledby='region-makers-heading']").getByRole("link", { name: /Платформа: 4\.3 из 5/ }),
  ).toBeVisible();

  await page.goto("/proizvoditeli/?region=ekaterinburg");
  await expect(page.getByRole("link", { name: /Платформа: 4\.3 из 5/ }).first()).toBeVisible();

  await page.goto("/proizvoditeli/platforma/");
  await expect(page.getByRole("link", { name: /Рейтинг 4\.3 из 5/ })).toBeVisible();
});

test("unverified manufacturer defaults do not enter catalog filters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/modulnye-doma/ekaterinburg/");

  await page.getByLabel("Производитель").selectOption({ label: "Главлес" });
  await expect(page.getByText(/Найдено:\s*13 проектов в Екатеринбурге/).first()).toBeVisible();

  await page.getByRole("button", { name: "Под ключ", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Проекты не найдены" })).toBeVisible();
});

test("a non-reference project uses the same evidence rules as Platforma and Bygge", async ({ page }) => {
  await page.goto("/modulnye-doma/proekty/glavles-proekt-8-17-3-m-17-m2-469/");

  const characteristics = page.locator("#project-characteristics-content");
  const valueFor = (label: string) => characteristics.locator("dt", { hasText: label }).locator("xpath=following-sibling::dd");

  await expect(valueFor("Технология")).toHaveText("Модульная");
  await expect(valueFor("Утепление")).toHaveText("Уточнить у производителя");
  await expect(valueFor("Срок производства")).toHaveText("Уточнить у производителя");
  await expect(valueFor("Место производства")).not.toHaveText("Екатеринбург");
});

test("source-synced project cards expose multi-image galleries instead of company fallbacks", async ({ page }) => {
  for (const manufacturerId of ["sq-modyl", "exmodule"]) {
    await page.goto(`/proizvoditeli/${manufacturerId}/#projects`);
    const cards = page.locator("#manufacturer-projects-panel article");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(cards.nth(index).getByTestId("gallery-pagination")).toBeVisible();
      const firstImageSource = await cards.nth(index).locator("img").first().getAttribute("src");
      expect(firstImageSource).not.toMatch(/(?:logo|promocode|empty|looo)/iu);
    }
  }
});
