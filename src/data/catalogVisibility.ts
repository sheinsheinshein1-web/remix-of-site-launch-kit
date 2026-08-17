/**
 * Единые правила публичности каталога.
 *
 * Исходные записи сохраняются в данных: здесь определяется только то, что
 * разрешено показывать посетителям сайта и включать в поисковый индекс.
 */
export const HIDDEN_PUBLIC_TECHNOLOGIES = ["Каркасный"] as const;

const hiddenTechnologySet = new Set<string>(HIDDEN_PUBLIC_TECHNOLOGIES);

export const isPublicProject = (project: { technology: string }) =>
  !hiddenTechnologySet.has(project.technology);
