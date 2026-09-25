/**
 * Единые правила публичности каталога.
 *
 * Исходные записи сохраняются в данных: здесь определяется только то, что
 * разрешено показывать посетителям сайта и включать в поисковый индекс.
 */
export const HIDDEN_PUBLIC_TECHNOLOGIES = ["Каркасный"] as const;
// Снято с публикации по решению владельца: исходные данные сохраняем.
export const HIDDEN_PUBLIC_MANUFACTURER_IDS = ["lesprom96"] as const;

const hiddenTechnologySet = new Set<string>(HIDDEN_PUBLIC_TECHNOLOGIES);
const hiddenManufacturerSet = new Set<string>(HIDDEN_PUBLIC_MANUFACTURER_IDS);

export const isPublicProject = (project: { technology: string; manufacturerId?: string }) =>
  !hiddenTechnologySet.has(project.technology)
  && !hiddenManufacturerSet.has(project.manufacturerId ?? "");
