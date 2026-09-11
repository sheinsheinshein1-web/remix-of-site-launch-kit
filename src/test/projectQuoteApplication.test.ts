import { afterEach, describe, expect, it, vi } from "vitest";
import {
  submitProjectQuoteApplication,
  type ProjectQuoteApplicationPayload,
} from "@/lib/projectQuoteApplication";

const payload: ProjectQuoteApplicationPayload = {
  applicationType: "projectQuote",
  leadId: "quote_test_1",
  projectName: "Twin House",
  projectId: "31",
  manufacturerName: "Платформа",
  area: "75 м²",
  price: "3 102 000 ₽",
  deliveryRegion: "Екатеринбург",
  plotStatus: "Участок уже есть",
  location: "Свердловская область, посёлок Растущий",
  payment: "Ипотека",
  bank: "Сбер",
  timing: "Через 3–6 месяцев",
  contactName: "Иван",
  phone: "+7 999 123-45-67",
  alternativeProjects: "Модуал 75 — Будущий Дом",
  sourceUrl: "https://многоместа.рф/modulnye-doma/proekty/twin-house/",
  fax: "",
};

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe("submitProjectQuoteApplication", () => {
  it("отправляет все данные покупателя в обработчик Google Таблицы", async () => {
    vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(function () {
      const iframe = document.querySelector<HTMLIFrameElement>(`iframe[name="${this.target}"]`);
      const requestId = this.querySelector<HTMLInputElement>('input[name="requestId"]')?.value;

      window.setTimeout(() => {
        window.dispatchEvent(new MessageEvent("message", {
          source: iframe?.contentWindow,
          data: {
            source: "mnogomesta-project-quote-application",
            requestId,
            ok: true,
          },
        }));
      }, 0);
    });

    const submission = submitProjectQuoteApplication(payload, "https://script.google.com/example");
    const submittedForm = document.querySelector<HTMLFormElement>("form");

    expect(submittedForm?.method).toBe("post");
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="applicationType"]')?.value).toBe("projectQuote");
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="leadId"]')?.value).toBe(payload.leadId);
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="projectName"]')?.value).toBe(payload.projectName);
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="alternativeProjects"]')?.value).toBe(payload.alternativeProjects);
    expect(submittedForm?.querySelector<HTMLInputElement>('input[name="phone"]')?.value).toBe(payload.phone);
    await expect(submission).resolves.toBeUndefined();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("передаёт ошибку записи в интерфейс", async () => {
    vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(function () {
      const iframe = document.querySelector<HTMLIFrameElement>(`iframe[name="${this.target}"]`);
      const requestId = this.querySelector<HTMLInputElement>('input[name="requestId"]')?.value;

      window.setTimeout(() => {
        window.dispatchEvent(new MessageEvent("message", {
          source: iframe?.contentWindow,
          data: {
            source: "mnogomesta-project-quote-application",
            requestId,
            ok: false,
            message: "Не удалось записать заявку",
          },
        }));
      }, 0);
    });

    await expect(submitProjectQuoteApplication(payload, "https://script.google.com/example"))
      .rejects.toThrow("Не удалось записать заявку");
  });

  it("не показывает ложную ошибку, если Apps Script обработал форму без доступного postMessage", async () => {
    vi.useFakeTimers();
    vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(function () {
      const iframe = document.querySelector<HTMLIFrameElement>(`iframe[name="${this.target}"]`);
      window.setTimeout(() => iframe?.dispatchEvent(new Event("load")), 0);
    });

    const submission = submitProjectQuoteApplication(payload, "https://script.google.com/example");
    await vi.advanceTimersByTimeAsync(1_300);
    await expect(submission).resolves.toBeUndefined();
    expect(document.querySelector("iframe")).toBeNull();
    vi.useRealTimers();
  });
});
