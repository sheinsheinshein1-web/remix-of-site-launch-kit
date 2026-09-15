// Some Codex CLI builds flatten open-page actions into {type:"other", query:URL}.
// Accept only completed web-tool items, never commentary or arbitrary URL mentions.
export function completedSourceUrl(entry: { type?: string; item?: { type?: string; query?: string; action?: { type?: string; url?: string } } }): string | null {
  if (entry.type !== "item.completed" || entry.item?.type !== "web_search") return null;
  const item = entry.item;
  const value = item.action?.type === "open_page" ? item.action.url : item.action?.type === "other" ? item.query : undefined;
  if (!value || !/^https?:\/\/\S+$/.test(value)) return null;
  try { return new URL(value).href; } catch { return null; }
}
