export type PartnerApplicationPayload = {
  companyName: string;
  inn: string;
  activityType: "Модульные дома";
  interest: string;
  website: string;
  contactName: string;
  phone: string;
  sourceUrl: string;
  fax: string;
};

type PartnerApplicationResponse = {
  source: "mnogomesta-partner-application";
  requestId: string;
  ok: boolean;
  message?: string;
};

const RESPONSE_SOURCE = "mnogomesta-partner-application";
const RESPONSE_TIMEOUT_MS = 20_000;
const DEFAULT_PARTNER_APPLICATION_URL =
  "https://script.google.com/macros/s/AKfycbwwnFFz4HGe99gCfboyq-niMp5JwQU5a9fsnEmyHD_57YG7PmdC-Fvz5ClD8s_4bdHT/exec";

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `partner_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const submitPartnerApplication = (
  payload: PartnerApplicationPayload,
  endpoint = import.meta.env.VITE_PARTNER_APPLICATION_URL || DEFAULT_PARTNER_APPLICATION_URL,
) => {
  if (!endpoint) {
    return Promise.reject(new Error("Форма пока не подключена к обработчику заявок"));
  }

  return new Promise<void>((resolve, reject) => {
    const requestId = createRequestId();
    const iframeName = `partner-application-${requestId}`;
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");

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
      input.value = value;
      form.appendChild(input);
    });

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("message", handleMessage);
      form.remove();
      iframe.remove();
    };

    const handleMessage = (event: MessageEvent<PartnerApplicationResponse>) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.source !== RESPONSE_SOURCE || event.data.requestId !== requestId) return;

      cleanup();
      if (event.data.ok) {
        resolve();
      } else {
        reject(new Error(event.data.message || "Не удалось отправить заявку"));
      }
    };

    window.addEventListener("message", handleMessage);
    document.body.append(iframe, form);

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Обработчик заявок не ответил вовремя"));
    }, RESPONSE_TIMEOUT_MS);

    form.submit();
  });
};
