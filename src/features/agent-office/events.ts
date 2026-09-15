import { z } from "zod";
import { agentIds, type AgentId } from "./agents";
import { publicUrlSchema, runtimeTaskSchema, type RuntimeTask } from "./runtime-contract";

export const statuses = ["idle", "working", "waiting", "needs-review", "completed", "error"] as const;
export type AgentStatus = typeof statuses[number];
const agentId = z.enum(agentIds);
const status = z.enum(statuses);
const task = z.object({ id: z.string().min(1), title: z.string().min(1), agentId, status });
const file = z.object({ id: z.string().min(1), name: z.string().min(1), path: z.string().min(1), agentId, taskId: z.string().min(1), url: z.string().regex(/^\/__agent-runtime\/runs\/[\da-f-]{36}\/result$/).optional() });
const envelope = {
  version: z.literal(1), id: z.string().min(1), runId: z.string().min(1),
  sequence: z.number().int().nonnegative(), occurredAt: z.string().datetime({ offset: true }),
  taskId: z.string().min(1), message: z.string().min(1),
};

// Future transports must enter here; UI interactions never create execution events.
export const officeEventSchema = z.discriminatedUnion("type", [
  z.object({ ...envelope, type: z.literal("agent.status"), agentId, status }),
  z.object({ ...envelope, type: z.literal("task.handoff"), from: agentId, to: agentId }),
  z.object({ ...envelope, type: z.literal("task.updated"), task }),
  z.object({ ...envelope, type: z.literal("file.recorded"), file }),
  z.object({ ...envelope, type: z.literal("task.created"), agentId, task: runtimeTaskSchema }),
  z.object({ ...envelope, type: z.literal("agent.assigned"), agentId }),
  z.object({ ...envelope, type: z.literal("agent.started"), agentId }),
  z.object({ ...envelope, type: z.literal("source.found"), agentId, sourceUrl: publicUrlSchema }),
  z.object({ ...envelope, type: z.literal("candidate.found"), agentId, candidateName: z.string().min(1), sourceUrl: publicUrlSchema }),
  z.object({ ...envelope, type: z.literal("project.collected"), agentId: z.literal("collector"), projectName: z.string().min(1), sourceUrl: publicUrlSchema }),
  z.object({ ...envelope, type: z.literal("project.prepared"), agentId: z.literal("editor"), projectName: z.string().min(1), sourceUrl: publicUrlSchema }),
  z.object({ ...envelope, type: z.literal("agent.completed"), agentId }),
  z.object({ ...envelope, type: z.literal("task.completed"), agentId, task: runtimeTaskSchema }),
  z.object({ ...envelope, type: z.literal("task.failed"), agentId, task: runtimeTaskSchema, error: z.string().min(1) }),
]).superRefine((event, ctx) => {
  if (event.type === "task.handoff" && event.from === event.to) ctx.addIssue({ code: "custom", message: "Передача должна связывать разных агентов" });
  if (event.type === "task.updated" && event.task.id !== event.taskId) ctx.addIssue({ code: "custom", message: "Идентификатор задачи не совпадает" });
  if (event.type === "file.recorded" && event.file.taskId !== event.taskId) ctx.addIssue({ code: "custom", message: "Файл относится к другой задаче" });
  if ("task" in event && event.task.id !== event.taskId) ctx.addIssue({ code: "custom", message: "Задача события не совпадает" });
  if ("task" in event && "runId" in event.task && event.task.runId !== event.runId) ctx.addIssue({ code: "custom", message: "Запуск задачи не совпадает" });
  if ("task" in event && "agentId" in event && event.task.agentId !== event.agentId) ctx.addIssue({ code: "custom", message: "Агент задачи не совпадает" });
});
export interface OfficeTask { id: string; title: string; agentId: AgentId; status: AgentStatus }
export interface OfficeFile { id: string; name: string; path: string; agentId: AgentId; taskId: string; url?: string }
interface EventEnvelope { version: 1; id: string; runId: string; sequence: number; occurredAt: string; taskId: string; message: string }
export type OfficeEvent = EventEnvelope & (
  | { type: "agent.status"; agentId: AgentId; status: AgentStatus }
  | { type: "task.handoff"; from: AgentId; to: AgentId }
  | { type: "task.updated"; task: OfficeTask }
  | { type: "file.recorded"; file: OfficeFile }
  | { type: "task.created" | "task.completed"; agentId: AgentId; task: RuntimeTask }
  | { type: "task.failed"; agentId: AgentId; task: RuntimeTask; error: string }
  | { type: "agent.assigned" | "agent.started" | "agent.completed"; agentId: AgentId }
  | { type: "source.found"; agentId: AgentId; sourceUrl: string }
  | { type: "candidate.found"; agentId: AgentId; candidateName: string; sourceUrl: string }
  | { type: "project.collected"; agentId: "collector"; projectName: string; sourceUrl: string }
  | { type: "project.prepared"; agentId: "editor"; projectName: string; sourceUrl: string }
);
export interface OfficeState {
  events: OfficeEvent[];
  statuses: Record<AgentId, AgentStatus>;
  tasks: OfficeTask[];
  files: OfficeFile[];
  transfer: Extract<OfficeEvent, { type: "task.handoff" }> | null;
}
export const createOfficeState = (): OfficeState => ({
  events: [], statuses: Object.fromEntries(agentIds.map(id => [id, "idle"])) as Record<AgentId, AgentStatus>,
  tasks: [], files: [], transfer: null,
});

export function ingestOfficeEvent(state: OfficeState, input: unknown): OfficeState {
  const result = officeEventSchema.safeParse(input);
  if (!result.success) throw new Error(`Некорректное событие: ${result.error.message}`);
  const event = result.data as OfficeEvent;
  if (state.events.some(existing => existing.id === event.id)) return state;
  const previous = [...state.events].reverse().find(existing => existing.runId === event.runId);
  if (previous && event.sequence <= previous.sequence) throw new Error("Нарушен порядок событий запуска");
  const next = { ...state, events: [...state.events, event], transfer: null };
  switch (event.type) {
    case "agent.status": return { ...next, statuses: { ...state.statuses, [event.agentId]: event.status } };
    case "task.handoff": return { ...next, transfer: event };
    case "task.updated": return { ...next, tasks: [...state.tasks.filter(item => item.id !== event.task.id), event.task] };
    case "file.recorded": return { ...next, files: [...state.files.filter(item => item.id !== event.file.id), event.file] };
    case "task.created":
    case "task.completed":
    case "task.failed": {
      const task = event.task as OfficeTask;
      return { ...next, tasks: [...state.tasks.filter(item => item.id !== task.id), task], statuses: event.type === "task.failed" ? { ...state.statuses, [event.agentId]: "error" } : state.statuses };
    }
    case "agent.assigned": return { ...next, statuses: { ...state.statuses, [event.agentId]: "waiting" } };
    case "agent.started": return { ...next, transfer: state.transfer, statuses: { ...state.statuses, [event.agentId]: "working" }, tasks: state.tasks.map(task => task.id === event.taskId ? { ...task, status: "working" } : task) };
    case "agent.completed": return { ...next, statuses: { ...state.statuses, [event.agentId]: "completed" } };
    case "source.found":
    case "project.collected":
    case "project.prepared":
    case "candidate.found": return { ...next, transfer: state.transfer };
  }
}

// Replay projects an immutable prefix of accepted events; live state is never changed.
export function replayOfficeEvents(events: readonly OfficeEvent[], cursor: number): OfficeState {
  return events.slice(0, Math.max(0, Math.min(events.length, Math.floor(cursor)))).reduce(ingestOfficeEvent, createOfficeState());
}
export function eventInvolvesAgent(event: OfficeEvent, id: AgentId): boolean {
  switch (event.type) {
    case "agent.status": return event.agentId === id;
    case "task.handoff": return event.from === id || event.to === id;
    case "task.updated": return event.task.agentId === id;
    case "file.recorded": return event.file.agentId === id;
    default: return event.agentId === id;
  }
}
