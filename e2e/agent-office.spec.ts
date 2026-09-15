import { test, expect } from "@playwright/test";

// Layout regression tests isolate the canvas from the developer's real task history.
test.beforeEach(async ({ page }) => {
  await page.route("**/__agent-runtime/snapshot", route => route.fulfill({ json: { health: { connected: false, provider: "codex-cli-web-search", searchAvailable: false, message: "Тест без подключения поиска", activeRunId: null }, events: [], tasks: [] } }));
});

test("office is idle, isolated and supports navigation, panels, pan and zoom", async ({ page, request }) => {
  const errors: string[] = [];
  const modelRequests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (/\/api\/(execute|workflow)|generativelanguage|api\.anthropic/.test(request.url())) modelRequests.push(request.url()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/agent-office");
  await expect(page.locator(".ao-node")).toHaveCount(9);
  await expect(page.locator('.ao-node[data-status="idle"]')).toHaveCount(9);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,nofollow");
  await expect(page.getByText("Настройки cookie", { exact: true })).toHaveCount(0);
  await expect(page.locator(".react-flow__edge.animated")).toHaveCount(0);
  await expect(page.getByText("Runtime не подключён", { exact: true })).toBeVisible();
  const scale = page.getByLabel("Масштаб", { exact: true });
  const before = await scale.textContent();
  await page.getByRole("button", { name: "Увеличить масштаб", exact: true }).click();
  await expect(scale).not.toHaveText(before!);
  await page.getByRole("button", { name: "Показать всю карту", exact: true }).click();
  const scout = page.locator('.ao-node[data-agent-id="scout"]');
  await scout.click();
  const panel = page.getByRole("complementary", { name: "Агент Scout", exact: true });
  await expect(panel.getByRole("heading", { name: "Scout", exact: true })).toBeVisible();
  for (const [tab, empty] of [["Activity", "Событий пока нет"], ["Tasks", "Задач пока нет"], ["Files", "Файлов пока нет"]]) {
    await panel.getByRole("button", { name: tab, exact: true }).click();
    await expect(panel.getByRole("heading", { name: empty, exact: true })).toBeVisible();
  }
  await panel.getByRole("button", { name: "Закрыть панель", exact: true }).click();
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Пока нечего воспроизводить", exact: true })).toBeVisible();
  await expect(page.getByRole("slider")).toHaveCount(0);
  await page.getByRole("button", { name: "Закрыть панель", exact: true }).click();
  const wrapper = page.locator('.react-flow__node[data-id="scout"]');
  await wrapper.focus(); await wrapper.press("Enter");
  await expect(panel).toBeVisible();
  await panel.getByRole("heading", { name: "Scout", exact: true }).press("Escape");
  await expect(panel).toHaveCount(0);
  const oldPosition = await wrapper.getAttribute("style");
  const box = await scout.boundingBox();
  await page.mouse.move(box!.x + 25, box!.y + 25);
  await page.mouse.down(); await page.mouse.move(box!.x + 70, box!.y + 55, { steps: 8 }); await page.mouse.up();
  await expect(wrapper).not.toHaveAttribute("style", oldPosition!);
  const viewport = page.locator(".react-flow__viewport");
  const oldViewport = await viewport.getAttribute("style");
  const canvas = await page.locator(".ao-canvas").boundingBox();
  await page.mouse.move(canvas!.x + 40, canvas!.y + 90);
  await page.mouse.down(); await page.mouse.move(canvas!.x + 100, canvas!.y + 140, { steps: 8 }); await page.mouse.up();
  await expect(viewport).not.toHaveAttribute("style", oldViewport!);
  expect(modelRequests).toEqual([]); expect(errors).toEqual([]);
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("agent-office");
  await page.goto("/");
  await expect(page.locator(".agent-office")).toHaveCount(0);
  await expect(page.locator('a[href*="agent-office"]')).toHaveCount(0);
});

for (const width of [375, 768, 1024, 1440]) {
  test(`office layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/agent-office");
    await expect(page.locator(".ao-node")).toHaveCount(9);
    await expect(page.getByRole("button", { name: "Показать всю карту", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`agent-office-${width}.png`) });
    if (width <= 850) await page.getByRole("button", { name: "Открыть список агентов", exact: true }).click();
    await page.locator(".ao-directory-agent").filter({ hasText: "Scout" }).click();
    await expect(page.getByRole("complementary", { name: "Агент Scout", exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`agent-office-panel-${width}.png`) });
    await page.getByRole("button", { name: "Закрыть панель", exact: true }).click();
    await expect(page.getByRole("complementary", { name: "Агент Scout", exact: true })).toHaveCount(0);
  });
}
