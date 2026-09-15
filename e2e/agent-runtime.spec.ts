import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";

test("local API records an unavailable provider honestly, survives reload and supports Replay", async ({ page, request }) => {
  const id = randomUUID();
  const response = await request.post("/__agent-runtime/tasks", { data: { city: "Екатеринбург", requestId: id } });
  expect(response.status()).toBe(202);
  const created = await response.json();
  await expect.poll(async () => {
    const data = await (await request.get("/__agent-runtime/snapshot")).json();
    return data.tasks.find(task => task.id === created.taskId)?.status;
  }).toBe("error");
  const snapshot = await (await request.get("/__agent-runtime/snapshot")).json();
  const events = snapshot.events.filter(event => event.runId === created.runId);
  expect(events.some(event => event.type === "task.handoff")).toBe(true);
  expect(events.filter(event => event.type === "task.failed")).toHaveLength(2);
  expect(events.some(event => event.type === "source.found" || event.type === "task.completed")).toBe(false);
  const duplicate = await request.post("/__agent-runtime/tasks", { data: { city: "Екатеринбург", requestId: id } });
  expect((await duplicate.json()).runId).toBe(created.runId);
  const badOrigin = await request.post("/__agent-runtime/tasks", { headers: { Origin: "https://external.example" }, data: { city: "Москва", requestId: randomUUID() } });
  expect(badOrigin.status()).toBe(403);
  const invalid = await request.post("/__agent-runtime/tasks", { data: { city: "../bad", requestId: randomUUID() } });
  expect(invalid.status()).toBe(400);
  expect((await request.get(`/__agent-runtime/runs/${created.runId}/result`)).status()).toBe(404);
  const runtimeDirectory = process.env.AGENT_RUNTIME_TEST_DIR ?? "/tmp/mnogomesta-agent-runtime-playwright";
  expect((await request.get(`/@fs${runtimeDirectory}/runs/${created.runId}.json`)).status()).toBe(403);
  await page.goto("/agent-office");
  await expect(page.locator('.ao-node[data-agent-id="scout"]')).toHaveAttribute("data-status", "error");
  await expect(page.locator('.ao-node[data-agent-id="publisher"]')).toHaveAttribute("data-status", "idle");
  await page.reload();
  await expect(page.locator('.ao-node[data-agent-id="scout"]')).toHaveAttribute("data-status", "error");
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  const slider = page.getByRole("slider", { name: "Позиция воспроизведения" });
  await expect(slider).toBeVisible();
  await slider.fill("0");
  await expect(page.locator('.ao-node[data-status="idle"]')).toHaveCount(9);
  await page.getByRole("button", { name: "Закрыть панель", exact: true }).click();
  await expect(page.locator('.ao-node[data-agent-id="scout"]')).toHaveAttribute("data-status", "error");
});
