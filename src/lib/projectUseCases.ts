import type { ProjectUseCase } from "@/data/projects";

export const BUSINESS_USE_CASE_OPTIONS = [
  { value: "rental", label: "Дом под аренду" },
  { value: "glamping", label: "Глэмпинг" },
  { value: "recreation-center", label: "База отдыха" },
  { value: "hotel", label: "Гостиница" },
  { value: "office", label: "Офис" },
  { value: "cafe", label: "Кафе" },
  { value: "retail", label: "Торговый павильон" },
] as const satisfies ReadonlyArray<{ value: ProjectUseCase; label: string }>;

export const matchesProjectBusinessUseCases = (
  projectUseCases: readonly ProjectUseCase[] | undefined,
  selectedUseCases: ReadonlySet<ProjectUseCase>,
) => selectedUseCases.size === 0
  || projectUseCases?.some((useCase) => selectedUseCases.has(useCase)) === true;
