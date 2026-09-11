import { DEFAULT_GOOGLE_APPLICATION_URL, submitGoogleAppsScriptForm } from "@/lib/googleAppsScriptForm";

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

const RESPONSE_SOURCE = "mnogomesta-partner-application";

export const submitPartnerApplication = (
  payload: PartnerApplicationPayload,
  endpoint = import.meta.env.VITE_PARTNER_APPLICATION_URL || DEFAULT_GOOGLE_APPLICATION_URL,
) => submitGoogleAppsScriptForm(payload, {
  endpoint,
  responseSource: RESPONSE_SOURCE,
  requestPrefix: "partner-application",
  missingEndpointMessage: "Форма пока не подключена к обработчику заявок",
});
