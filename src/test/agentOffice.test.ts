import { describe, expect, it } from "vitest";
import { agents, organizationLinks, taskPipeline } from "@/features/agent-office/agents";
import { createOfficeState, eventInvolvesAgent, ingestOfficeEvent, replayOfficeEvents, statuses, type OfficeEvent } from "@/features/agent-office/events";

// Test-only input. No fixtures, seed events or demo runs enter the application.
const event = (sequence: number, payload: object): OfficeEvent => ({ version: 1, id: `e-${sequence}`, runId: "test-run", sequence, occurredAt: "2026-09-12T12:00:00Z", taskId: "task-1", message: "Тестовое событие", ...payload } as OfficeEvent);

describe("Agent Office state", () => {
  it("starts with nine idle agents and no activity, tasks, files or transfer", () => {
    const state = createOfficeState();
    expect(Object.values(state.statuses)).toEqual(Array(9).fill("idle"));
    expect(state.events).toEqual([]); expect(state.tasks).toEqual([]); expect(state.files).toEqual([]); expect(state.transfer).toBeNull();
    expect(replayOfficeEvents([], 50)).toEqual(state);
  });
  it("keeps organization separate from the processing pipeline", () => {
    expect(new Set(agents.map(agent => agent.id)).size).toBe(9);
    expect(organizationLinks).toHaveLength(8);
    expect(organizationLinks.every(link => link.source === "astra" && agents.some(agent => agent.id === link.target))).toBe(true);
    expect(taskPipeline).toEqual(["astra", "scout", "collector", "extractor", "verifier", "editor", "catalog-qa", "publisher"]);
  });
  it.each(statuses)("accepts the real status %s", status => {
    expect(ingestOfficeEvent(createOfficeState(), event(1, { type: "agent.status", agentId: "scout", status })).statuses.scout).toBe(status);
  });
  it("ignores a redelivered event without duplicating activity", () => {
    const input = event(1, { type: "agent.status", agentId: "scout", status: "working" });
    const state = ingestOfficeEvent(createOfficeState(), input);
    expect(ingestOfficeEvent(state, input)).toBe(state);
  });
  it("rejects unknown agents, invalid statuses and self-transfers", () => {
    for (const payload of [
      { type: "agent.status", agentId: "invented", status: "working" },
      { type: "agent.status", agentId: "scout", status: "running" },
      { type: "task.handoff", from: "scout", to: "scout" },
    ]) expect(() => ingestOfficeEvent(createOfficeState(), event(1, payload))).toThrow();
  });
  it("rejects stale events per run while accepting the next run", () => {
    const state = ingestOfficeEvent(createOfficeState(), event(2, { type: "agent.status", agentId: "scout", status: "completed" }));
    const old = event(1, { type: "agent.status", agentId: "scout", status: "working" });
    expect(() => ingestOfficeEvent(state, old)).toThrow("порядок");
    expect(ingestOfficeEvent(state, { ...old, runId: "next-run" }).statuses.scout).toBe("working");
  });
  it("shows only explicit handoffs without inventing agent completion", () => {
    const handoff = event(1, { type: "task.handoff", from: "astra", to: "scout" });
    const state = ingestOfficeEvent(createOfficeState(), handoff);
    expect(state.transfer).toEqual(handoff);
    expect(state.statuses.astra).toBe("idle"); expect(state.statuses.scout).toBe("idle");
    expect(eventInvolvesAgent(handoff, "scout")).toBe(true);
    expect(eventInvolvesAgent(handoff, "astra")).toBe(true);
    expect(eventInvolvesAgent(handoff, "editor")).toBe(false);
    expect(ingestOfficeEvent(state, event(2, { type: "agent.status", agentId: "scout", status: "working" })).transfer).toBeNull();
  });
  it("replays history without changing the live state", () => {
    const inputs = [event(1, { type: "agent.status", agentId: "scout", status: "working" }), event(2, { type: "task.handoff", from: "scout", to: "collector" }), event(3, { type: "agent.status", agentId: "scout", status: "completed" })];
    const live = inputs.reduce(ingestOfficeEvent, createOfficeState());
    const before = JSON.stringify(live);
    expect(replayOfficeEvents(live.events, 1).statuses.scout).toBe("working");
    expect(replayOfficeEvents(live.events, 2).transfer?.to).toBe("collector");
    expect(replayOfficeEvents(live.events, 0)).toEqual(createOfficeState());
    expect(replayOfficeEvents(live.events, 100)).toEqual(live);
    expect(JSON.stringify(live)).toBe(before);
  });
  it("updates tasks and files from events and rejects mismatched task references", () => {
    const task = { id: "task-1", title: "Проверить каталог", agentId: "catalog-qa", status: "waiting" };
    const state = ingestOfficeEvent(createOfficeState(), event(1, { type: "task.updated", task }));
    const updated = ingestOfficeEvent(state, event(2, { type: "task.updated", task: { ...task, status: "completed" } }));
    expect(updated.tasks).toHaveLength(1); expect(updated.tasks[0].status).toBe("completed");
    const file = { id: "file-1", taskId: "task-1", agentId: "catalog-qa", name: "Проверка", path: "reports/check.json" };
    expect(ingestOfficeEvent(updated, event(3, { type: "file.recorded", file })).files).toEqual([file]);
    expect(() => ingestOfficeEvent(updated, event(4, { type: "file.recorded", file: { ...file, taskId: "wrong" } }))).toThrow();
  });
});
