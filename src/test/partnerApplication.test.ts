import { afterEach, describe, expect, it, vi } from "vitest";
import { submitPartnerApplication, type PartnerApplicationPayload } from "@/lib/partnerApplication";

const payload: PartnerApplicationPayload = {
  companyName: "Модульные решения",
  inn: "1234567890",
  activityType: "Модульные дома",
  interest: "Бесплатное размещение",
  website: "https://example.ru",
  contactName: "Иван Петров",
  phone: "+7 999 123-45-67",
  sourceUrl: "https://многоместа.рф/partner",
  fax: "",
};

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe("submitPartnerApplication", () => {
  it("не отправляет форму без настроенного обработчика", async () => {
    await expect(submitPartnerApplication(payload, "")).rejects.toThrow("не подключена");
  });

  it("отправляет поля в скрытый обработчик и ждёт подтверждение", async () => {
    vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(function () {
      const iframe = document.querySelector<HTMLIFrameElement>(`iframe[name="${this.target}"]`);
      const requestId = this.target.replace("partner-application-", "");

      window.setTimeout(() => {
        window.dispatchEvent(new MessageEvent("message", {
          source: iframe?.contentWindow,
          data: {
            source: "mnogomesta-partner-application",
            requestId,
            ok: true,
          },
        }));
      }, 0);
    });

    const submission = submitPartnerApplication(payload, "https://script.google.com/example");
    const submittedForm = document.querySelector<HTMLFormElement>("form");

    expect(submittedForm?.method).toBe("post");
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="companyName"]')?.value).toBe(payload.companyName);
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="sourceUrl"]')?.value).toBe(payload.sourceUrl);
    await expect(submission).resolves.toBeUndefined();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("передаёт ошибку обработчика в интерфейс", async () => {
    vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(function () {
      const iframe = document.querySelector<HTMLIFrameElement>(`iframe[name="${this.target}"]`);
      const requestId = this.target.replace("partner-application-", "");

      window.setTimeout(() => {
        window.dispatchEvent(new MessageEvent("message", {
          source: iframe?.contentWindow,
          data: {
            source: "mnogomesta-partner-application",
            requestId,
            ok: false,
            message: "Не удалось записать заявку",
          },
        }));
      }, 0);
    });

    await expect(submitPartnerApplication(payload, "https://script.google.com/example"))
      .rejects.toThrow("Не удалось записать заявку");
  });
});
