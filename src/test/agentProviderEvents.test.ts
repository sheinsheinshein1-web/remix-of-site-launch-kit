import { describe, expect, it } from "vitest";
import { completedSourceUrl } from "../../server/agent-runtime/provider-events";

describe("Codex CLI web-source trace", () => {
  it("recognizes explicit and flattened completed URL opens", () => {
    expect(completedSourceUrl({ type: "item.completed", item: { type: "web_search", action: { type: "open_page", url: "https://example.com/about" } } })).toBe("https://example.com/about");
    expect(completedSourceUrl({ type: "item.completed", item: { type: "web_search", query: "https://example.com/", action: { type: "other" } } })).toBe("https://example.com/");
  });
  it("does not mistake searches, pending actions, find expressions or messages for opens", () => {
    for (const entry of [
      { type: "item.started", item: { type: "web_search", action: { type: "open_page", url: "https://example.com/" } } },
      { type: "item.completed", item: { type: "web_search", query: "https://example.com/", action: { type: "search" } } },
      { type: "item.completed", item: { type: "agent_message", query: "https://example.com/", action: { type: "other" } } },
      { type: "item.completed", item: { type: "web_search", query: "'производство' in https://example.com/", action: { type: "other" } } },
    ]) expect(completedSourceUrl(entry)).toBeNull();
  });
});
