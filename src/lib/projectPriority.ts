type ProjectTechnologyLike = {
  technology?: string;
};

export const getProjectTechnologyPriority = (project: ProjectTechnologyLike) => {
  const technology = (project.technology ?? "").toLowerCase();

  if (technology.includes("модул")) return 0;
  if (technology.includes("префаб") || technology.includes("домокомплект") || technology.includes("clt")) return 1;
  if (technology.includes("сип")) return 2;
  if (technology.includes("каркас")) return 9;

  return 5;
};

export const compareProjectTechnologyPriority = <T extends ProjectTechnologyLike>(a: T, b: T) => {
  return getProjectTechnologyPriority(a) - getProjectTechnologyPriority(b);
};

export const compareWithProjectPriority = <T extends ProjectTechnologyLike>(
  a: T,
  b: T,
  nextCompare: (a: T, b: T) => number = () => 0
) => {
  return compareProjectTechnologyPriority(a, b) || nextCompare(a, b);
};

export const groupByProjectTechnologyPriority = <T extends ProjectTechnologyLike>(items: T[]) => {
  const groups = new Map<number, T[]>();

  for (const item of items) {
    const priority = getProjectTechnologyPriority(item);
    const group = groups.get(priority) ?? [];
    group.push(item);
    groups.set(priority, group);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([, group]) => group);
};
