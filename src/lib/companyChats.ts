const STORAGE_PREFIX = "company_chat_";
const INDEX_KEY = "company_chats_index";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface CompanyChatEntry {
  company: string;
  project: string;
  projectId: string;
  lastMessage: string;
  lastTime: string;
  savedAt: number;
}

export function getCompanyChats(): CompanyChatEntry[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const entries: CompanyChatEntry[] = JSON.parse(raw);
    const now = Date.now();
    return entries.filter(e => now - e.savedAt < WEEK_MS);
  } catch { return []; }
}

export function saveCompanyChatEntry(entry: Omit<CompanyChatEntry, "savedAt">) {
  const existing = getCompanyChats();
  const idx = existing.findIndex(e => e.company === entry.company);
  const updated: CompanyChatEntry = { ...entry, savedAt: Date.now() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(INDEX_KEY, JSON.stringify(existing));
}
