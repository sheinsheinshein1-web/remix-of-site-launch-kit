const normalizeTechnology = (technology: string) => technology
  .trim()
  .replace(/\s+/g, " ")
  .toLocaleLowerCase("ru");

export const PROJECT_TECHNOLOGY = {
  modular: {
    value: "Модульный дом",
    label: "Модульная",
  },
  frameModular: {
    value: "Каркасно-модульный",
    label: "Каркасно-модульная",
  },
  frame: {
    value: "Каркасный",
    label: "Каркасная",
  },
  prefab: {
    value: "СИП-Префаб",
    label: "СИП-префаб",
  },
  houseKit: {
    value: "Домокомплект",
    label: "Домокомплект",
  },
} as const;

export const getProjectTechnologyLabel = (technology: string) => {
  const normalized = normalizeTechnology(technology);
  if (normalized.includes("сип") || normalized.includes("префаб")) return PROJECT_TECHNOLOGY.prefab.label;
  if (normalized.includes("каркас") && normalized.includes("модул")) return PROJECT_TECHNOLOGY.frameModular.label;
  if (normalized.includes("каркас")) return PROJECT_TECHNOLOGY.frame.label;
  if (normalized.includes("домокомплект")) return PROJECT_TECHNOLOGY.houseKit.label;
  if (normalized.includes("модул")) return PROJECT_TECHNOLOGY.modular.label;
  return technology;
};

export const matchesProjectTechnology = (technology: string, filter: string) => (
  getProjectTechnologyLabel(technology) === getProjectTechnologyLabel(filter)
);
