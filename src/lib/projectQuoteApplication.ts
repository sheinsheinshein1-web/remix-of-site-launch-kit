import { DEFAULT_GOOGLE_APPLICATION_URL, submitGoogleAppsScriptForm } from "@/lib/googleAppsScriptForm";

export type ProjectQuoteApplicationPayload = {
  applicationType: "projectQuote";
  leadId: string;
  projectName: string;
  projectId: string;
  manufacturerName: string;
  area: string;
  price: string;
  deliveryRegion: string;
  plotStatus: string;
  location: string;
  payment: string;
  bank: string;
  timing: string;
  contactName: string;
  phone: string;
  alternativeProjects: string;
  sourceUrl: string;
  fax: string;
};

const RESPONSE_SOURCE = "mnogomesta-project-quote-application";

export const createProjectQuoteLeadId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `quote_${crypto.randomUUID()}`;
  }

  return `quote_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const submitProjectQuoteApplication = (
  payload: ProjectQuoteApplicationPayload,
  endpoint = import.meta.env.VITE_PROJECT_QUOTE_APPLICATION_URL
    || import.meta.env.VITE_PARTNER_APPLICATION_URL
    || DEFAULT_GOOGLE_APPLICATION_URL,
) => submitGoogleAppsScriptForm(payload, {
  endpoint,
  responseSource: RESPONSE_SOURCE,
  requestPrefix: "project-quote-application",
  missingEndpointMessage: "Запись заявок покупателей пока не подключена",
});
