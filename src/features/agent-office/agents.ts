export const agentIds = ["astra", "scout", "collector", "extractor", "verifier", "editor", "catalog-qa", "publisher", "watcher"] as const;
export type AgentId = typeof agentIds[number];
export type AgentGroup = "Orchestration" | "Discovery" | "Data" | "Content" | "Quality" | "Operations";
export interface AgentDefinition {
  id: AgentId;
  name: string;
  group: AgentGroup;
  role: string;
  description: string;
  position: { x: number; y: number };
}

// Organizational layout is independent of the order in which a task is processed.
export const agents: AgentDefinition[] = [
  { id: "astra", name: "Astra", group: "Orchestration", role: "Центральный оркестратор", description: "Центральный оркестратор системы «Многоместо». Будет распределять задачи, контролировать проверки и передавать результаты между специалистами.", position: { x: 510, y: 300 } },
  { id: "scout", name: "Scout", group: "Discovery", role: "Поиск производителей", description: "Ищет производителей модульных домов и модульных бань по заданному городу.", position: { x: 80, y: 10 } },
  { id: "collector", name: "Collector", group: "Discovery", role: "Сбор официального каталога", description: "Собирает официальный каталог производителя, страницы проектов и исходную информацию.", position: { x: 80, y: 130 } },
  { id: "extractor", name: "Extractor", group: "Data", role: "Структурирование данных", description: "Преобразует найденные данные в существующую структуру данных «Многоместа».", position: { x: 80, y: 300 } },
  { id: "verifier", name: "Verifier", group: "Data", role: "Проверка фактов и источников", description: "Проверяет характеристики по официальным источникам и фиксирует доказательства.", position: { x: 80, y: 420 } },
  { id: "editor", name: "Editor", group: "Content", role: "Подготовка карточек", description: "Подготавливает данные и тексты карточек на основе подтверждённых фактов.", position: { x: 80, y: 590 } },
  { id: "catalog-qa", name: "Catalog QA", group: "Quality", role: "Качество и поиск дублей", description: "Проверяет дубли, связи, единообразие, заполненность и ошибки.", position: { x: 960, y: 130 } },
  { id: "publisher", name: "Publisher", group: "Operations", role: "Публикация после проверки", description: "В дальнейшем будет применять прошедшие проверку изменения к существующему каталогу.", position: { x: 960, y: 350 } },
  { id: "watcher", name: "Watcher", group: "Operations", role: "Мониторинг изменений", description: "В дальнейшем будет следить за изменениями цен, проектов и данных производителей.", position: { x: 960, y: 470 } },
];

export const agentById = Object.fromEntries(agents.map(agent => [agent.id, agent])) as Record<AgentId, AgentDefinition>;
export const organizationLinks = agents.filter(agent => agent.id !== "astra").map(agent => ({
  id: `astra-${agent.id}`, source: "astra" as AgentId, target: agent.id,
}));
export const taskPipeline: readonly AgentId[] = ["astra", "scout", "collector", "extractor", "verifier", "editor", "catalog-qa", "publisher"];
export const pipelineLinks = taskPipeline.slice(1).map((target, index) => ({ source: taskPipeline[index], target }));
