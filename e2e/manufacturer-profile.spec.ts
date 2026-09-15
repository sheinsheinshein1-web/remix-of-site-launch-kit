import { expect, test } from "@playwright/test";

const profiles = [
  { id: "platforma", name: "Платформа", production: "Производство" },
  { id: "bygge", name: "Bygge", production: "Офис" },
  { id: "fps-modul", name: "ФПС Модуль", production: "Производство" },
  { id: "glavles", name: "Главлес", production: "Производство" },
  { id: "budushiy-dom", name: "Будущий Дом", production: "Офис" },
  { id: "vek-trad", name: "Вековые Традиции", production: "Офис" },
  { id: "bm-dom", name: "БМ-ДОМ", production: "Производство" },
  { id: "sq-modyl", name: "SQ-MODYL", production: "Производство" },
  { id: "exmodule", name: "ExModule", production: "Офис" },
  { id: "russian-modular-house", name: "Русский Модульный Дом", production: "Производство" },
  { id: "da-home", name: "DA-HOME", production: "Производство" },
  { id: "moduldom-ural", name: "МОДУЛЬДОМ-УРАЛ", production: "Производство" },
  { id: "lesprom96", name: "ЛЕСПРОМ96", production: "Производство" },
  { id: "e-module-stroy", name: "E.Module-stroy", production: "Производство" },
  { id: "prefabia", name: "PREFABIA", production: "Производство" },
  { id: "zhar-parych", name: "Жар Парыч", production: "Производство" },
] as const;

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1(?::\d+)?(?:\/|$))/, (route) => route.abort());
});

for (const profile of profiles) {
  test(`${profile.name}: one responsive production template`, async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`/proizvoditeli/${profile.id}/`);

      await expect(page.locator("#manufacturer-profile-title")).toContainText(profile.name);
      await expect(page.locator("h2").filter({ hasText: `О компании «${profile.name}»` }).first()).toBeVisible();
      await expect(page.locator("nav[aria-label='Разделы страницы производителя']")).toBeVisible();

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(0);

      await expect(
        page
          .getByRole("navigation", { name: "Разделы страницы производителя" })
          .getByRole("link", { name: "Юридическая информация", exact: true }),
      ).toBeVisible();
      await expect(page.locator("#manufacturer-legal-heading")).toHaveText("Юридическая информация");

      const socialNavLink = page
        .getByRole("navigation", { name: "Разделы страницы производителя" })
        .getByRole("link", { name: "Соцсети", exact: true });
      await expect(socialNavLink).toBeVisible();

      for (const sectionName of ["О компании", "Проекты", "Юридическая информация", "Объекты", profile.production, "Отзывы", "Соцсети"]) {
        await expect(
          page
            .getByRole("navigation", { name: "Разделы страницы производителя" })
            .getByRole("link", { name: sectionName, exact: true }),
        ).toBeVisible();
      }

      const reviewSourceTabs = page.locator("[role='tablist'][aria-label^='Источник отзывов'] [role='tab']");
      await expect(reviewSourceTabs).toHaveText(["Яндекс", "Много места"]);
    }
  });

  test(`${profile.name}: project tabs contain only non-empty unique groups`, async ({ page }) => {
    await page.goto(`/proizvoditeli/${profile.id}/`);
    const tabs = page.locator("[role='tablist'][aria-label^='Тип проектов'] [role='tab']");

    const tabCount = await tabs.count();
    if (tabCount === 0) {
      await expect(page.locator("#manufacturer-projects-panel a").first()).toBeVisible();
      return;
    }
    for (let index = 0; index < tabCount; index += 1) {
      const tab = tabs.nth(index);
      expect(Number((await tab.textContent())?.match(/\d+/)?.[0] ?? 0)).toBeGreaterThan(0);
      await tab.click();
      await expect(page.locator("#manufacturer-projects-panel a").first()).toBeVisible();
    }
  });
}

test("Будущий Дом: absent external sources stay visible as explicit states", async ({ page }) => {
  await page.goto("/proizvoditeli/budushiy-dom/");

  await expect(page.getByRole("tab", { name: "Яндекс", exact: true })).toBeVisible();
  await expect(page.getByText("Отзывы на Яндексе пока не найдены", { exact: true })).toBeVisible();

  await page.getByRole("tab", { name: "Telegram", exact: true }).click();
  await expect(page.getByText("Telegram-канал пока не подтверждён", { exact: true })).toBeVisible();
});

test("Bygge: legal identity and completed objects are published", async ({ page }) => {
  await page.goto("/proizvoditeli/bygge/");

  const legal = page.locator("#legal");
  await expect(legal).toContainText("ИП Ивашов Михаил Сергеевич");
  await expect(legal).toContainText("ИНН 661701160979");

  const objects = page.locator("#built-objects");
  await expect(objects).toContainText("Выполненные объекты");
  await expect(objects.getByRole("img")).toHaveCount(6);
  await expect(objects.getByRole("button", { name: /Показать все/u })).toHaveCount(0);
});

test("legacy view query parameters cannot switch the production template", async ({ page }) => {
  for (const view of ["classic", "analytic"]) {
    await page.goto(`/proizvoditeli/platforma/?view=${view}`);
    await expect(page.locator("#manufacturer-profile-title")).toHaveClass(/text-\[34px\]/);
    await expect(
      page
        .getByRole("navigation", { name: "Разделы страницы производителя" })
        .getByRole("link", { name: "Юридическая информация", exact: true }),
    ).toBeVisible();
  }
});

test("verified badge stays attached to the manufacturer name", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/proizvoditeli/platforma/");

  const hero = page.locator("[aria-labelledby='manufacturer-profile-title']");
  const heading = hero.locator("#manufacturer-profile-title");
  const verifiedBadge = hero.getByText("Проверено", { exact: true });
  const subtitle = hero.getByText(/модульные дома и бани под ключ/, { exact: false });

  await expect(heading).toHaveText("Платформа");
  await expect(verifiedBadge).toBeVisible();
  await expect(subtitle).toBeVisible();

  const [headingBox, badgeBox, subtitleBox] = await Promise.all([
    heading.boundingBox(),
    verifiedBadge.boundingBox(),
    subtitle.boundingBox(),
  ]);

  expect(headingBox).not.toBeNull();
  expect(badgeBox).not.toBeNull();
  expect(subtitleBox).not.toBeNull();
  expect(badgeBox!.x - (headingBox!.x + headingBox!.width)).toBeLessThanOrEqual(16);
  expect(subtitleBox!.y).toBeGreaterThanOrEqual(headingBox!.y + headingBox!.height);
});

test("regional recommendations mount one bounded batch", async ({ page }) => {
  await page.goto("/proizvoditeli/platforma/");

  const relatedSection = page.locator("[aria-labelledby='related-region-projects-heading']");
  await expect(relatedSection.locator("article")).toHaveCount(6);
  await expect(relatedSection.getByTestId("other-projects-load-more")).toBeAttached();
});

test("local section navigation and project tabs share the same active-state color", async ({ page }) => {
  await page.goto("/proizvoditeli/platforma/");

  const activeSectionLink = page
    .getByRole("navigation", { name: "Разделы страницы производителя" })
    .getByRole("link", { name: "О компании", exact: true });
  const activeProjectTab = page.getByRole("tab", { name: /^Дома\s/ });

  await expect(activeSectionLink).toHaveAttribute("aria-current", "location");
  await expect(activeProjectTab).toHaveAttribute("aria-selected", "true");

  const [sectionColor, projectTabColor] = await Promise.all([
    activeSectionLink.evaluate((element) => getComputedStyle(element).color),
    activeProjectTab.evaluate((element) => getComputedStyle(element).color),
  ]);

  expect(sectionColor).toBe(projectTabColor);
});

test("Bygge logo uses the same cover rule in the list and profile", async ({ page }) => {
  await page.goto("/proizvoditeli/");
  const listLogo = page.locator("a[href='/proizvoditeli/bygge/'] img");
  await expect(listLogo).toHaveClass(/object-cover/);
  await expect(listLogo).not.toHaveClass(/p-/);

  await page.goto("/proizvoditeli/bygge/");
  const profileLogo = page.locator("[aria-labelledby='manufacturer-profile-title'] img");
  await expect(profileLogo).toHaveClass(/object-cover/);
  await expect(profileLogo).not.toHaveClass(/p-/);
});
