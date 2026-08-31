export const SUPPORT_CHAT_API = "https://sheinsheinshein1-web-chat-telegram-bridge-77c4.twc1.net";

const SUPPORT_SESSION_KEY = "support_chat_session";

export function getSupportSessionId(): string {
  let id = localStorage.getItem(SUPPORT_SESSION_KEY);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(SUPPORT_SESSION_KEY, id);
  }
  return id;
}

export async function sendSupportMessage(text: string): Promise<void> {
  const response = await fetch(`${SUPPORT_CHAT_API}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session: getSupportSessionId(), text }),
  });

  if (!response.ok) {
    throw new Error(`Support bridge returned ${response.status}`);
  }
}
