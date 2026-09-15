export type EnforcementProceedingsSummary = {
  open: number;
  completed: number;
};

export type EnforcementProceedingsValue = Partial<EnforcementProceedingsSummary>;

export type LegalSource = {
  label: string;
  href: string;
};

const PUBLIC_LEGAL_SOURCE_HOSTS = new Set([
  "bo.nalog.ru",
  "egrul.nalog.ru",
  "kad.arbitr.ru",
  "fssp.gov.ru",
  "zakupki.gov.ru",
]);

/**
 * В публичном юридическом блоке показываем только государственные реестры.
 * Ссылки, которыми редактор подтверждает связь бренда с ИП/ООО, остаются
 * во внутреннем sourceAudit и не превращаются в пользовательский контент.
 */
export const getPublicLegalSources = (
  sources: Array<Partial<LegalSource>> | undefined,
): LegalSource[] => (sources ?? []).filter((source): source is LegalSource => {
  if (typeof source.label !== "string" || typeof source.href !== "string") return false;
  try {
    const hostname = new URL(source.href).hostname.replace(/^www\./, "");
    return PUBLIC_LEGAL_SOURCE_HOSTS.has(hostname);
  } catch {
    return false;
  }
});

/**
 * Единое правило для данных ФССП:
 * текущие и завершённые производства не смешиваются в один статус.
 */
export const formatEnforcementProceedings = (
  value: Partial<EnforcementProceedingsSummary> | undefined,
) => {
  const open = value?.open ?? 0;
  const completed = value?.completed ?? 0;
  if (open === 0 && completed === 0) return "Не обнаружено";

  const completedLabel = completed > 0 ? `${completed} завершено` : null;

  if (open === 0) return `Нет открытых${completedLabel ? ` · ${completedLabel}` : ""}`;

  const openLabel = `Открыто: ${open}`;
  return completed > 0 ? `${openLabel} · завершено: ${completed}` : openLabel;
};

/** Compatibility name used by presentation tests and future view-model code. */
export const formatManufacturerEnforcementProceedings = (
  value: EnforcementProceedingsValue,
) => formatEnforcementProceedings(value);
