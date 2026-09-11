type GoogleAppsScriptResponse = {
  source: string;
  requestId: string;
  ok: boolean;
  message?: string;
};

type GoogleAppsScriptFormOptions = {
  endpoint: string;
  responseSource: string;
  requestPrefix: string;
  missingEndpointMessage: string;
  timeoutMs?: number;
};

export const DEFAULT_GOOGLE_APPLICATION_URL =
  "https://script.google.com/macros/s/AKfycbwwnFFz4HGe99gCfboyq-niMp5JwQU5a9fsnEmyHD_57YG7PmdC-Fvz5ClD8s_4bdHT/exec";

const createRequestId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const submitGoogleAppsScriptForm = <Payload extends object>(
  payload: Payload,
  {
    endpoint,
    responseSource,
    requestPrefix,
    missingEndpointMessage,
    timeoutMs = 20_000,
  }: GoogleAppsScriptFormOptions,
) => {
  if (!endpoint) return Promise.reject(new Error(missingEndpointMessage));

  return new Promise<void>((resolve, reject) => {
    const requestId = createRequestId(requestPrefix);
    const iframeName = `${requestPrefix}-${requestId}`;
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");
    let submitted = false;
    let loadFallbackHandle: number | undefined;

    iframe.name = iframeName;
    iframe.hidden = true;
    iframe.setAttribute("aria-hidden", "true");

    form.method = "POST";
    form.action = endpoint;
    form.target = iframeName;
    form.hidden = true;

    Object.entries({ ...payload, requestId }).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value ?? "");
      form.appendChild(input);
    });

    const cleanup = () => {
      window.clearTimeout(timeoutIdHandle);
      if (loadFallbackHandle !== undefined) window.clearTimeout(loadFallbackHandle);
      window.removeEventListener("message", handleMessage);
      iframe.removeEventListener("load", handleLoad);
      form.remove();
      iframe.remove();
    };

    const handleMessage = (event: MessageEvent<GoogleAppsScriptResponse>) => {
      if (event.data?.source !== responseSource || event.data.requestId !== requestId) return;

      cleanup();
      if (event.data.ok) resolve();
      else reject(new Error(event.data.message || "Не удалось отправить форму"));
    };

    // Google Apps Script wraps HtmlService output in its own sandbox iframe.
    // Older deployments post the confirmation to that wrapper instead of the
    // parent site, so no message reaches this window even though the request
    // has already been processed. Treat a completed iframe navigation as an
    // accepted submission after a short grace period; a direct response from
    // newer deployments still wins and preserves server-side errors.
    const handleLoad = () => {
      if (!submitted) return;
      if (loadFallbackHandle !== undefined) window.clearTimeout(loadFallbackHandle);
      loadFallbackHandle = window.setTimeout(() => {
        cleanup();
        resolve();
      }, 1_200);
    };

    window.addEventListener("message", handleMessage);
    iframe.addEventListener("load", handleLoad);
    document.body.append(iframe, form);

    const timeoutIdHandle = window.setTimeout(() => {
      cleanup();
      reject(new Error("Обработчик формы не ответил вовремя"));
    }, timeoutMs);

    submitted = true;
    form.submit();
  });
};
