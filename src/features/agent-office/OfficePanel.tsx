import { RuntimeResult } from "./RuntimeResult";
import { useEffect, useRef } from "react";
import { Activity, Files, ListTodo, X, History, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { agentById, taskPipeline, type AgentId } from "./agents";
import { eventInvolvesAgent, type OfficeEvent, type OfficeState } from "./events";
import { Status } from "./AgentNode";
import { RuntimeTaskForm } from "./RuntimeTaskForm";
import { useOffice } from "./OfficeProvider";

export type PanelTab = "Overview" | "Activity" | "Tasks" | "Files";
export type OfficePanelSelection = { kind: "agent"; id: AgentId } | { kind: "Tasks" | "Activity" | "Replay" };
export function EventLog({ events }: { events: OfficeEvent[] }) {
  if (!events.length) return <Empty kind="Activity" />;
  return <ol className="ao-event-log">{events.map(event => <li key={event.id}>
    <time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleTimeString("ru-RU")}</time>
    <p>{event.message}</p><small>{event.runId} · {event.taskId}</small>
    {event.type === "task.handoff" && <p>{agentById[event.from].name} → {agentById[event.to].name}</p>}
  </li>)}</ol>;
}

function Empty({ kind }: { kind: "Activity" | "Tasks" | "Files" | "Replay" }) {
  const content = {
    Activity: ["Событий пока нет", "Здесь появятся реальные действия агентов после подключения исполнительной системы."],
    Tasks: ["Задач пока нет", "Здесь будут задачи, назначенные агентам, и их текущее состояние."],
    Files: ["Файлов пока нет", "Здесь будут результаты работы и документы, связанные с задачами."],
    Replay: ["Пока нечего воспроизводить", "История прохождения задачи появится после первого реального запуска."],
  };
  const Icon = { Activity, Tasks: ListTodo, Files, Replay: History }[kind];
  return <div className="ao-empty"><Icon size={26} strokeWidth={1.4} /><h3>{content[kind][0]}</h3><p>{content[kind][1]}</p></div>;
}

interface Props {
  selection: OfficePanelSelection;
  tab: PanelTab;
  setTab: (tab: PanelTab) => void;
  close: () => void;
  state: OfficeState;
  liveEvents: OfficeEvent[];
  cursor: number | null;
  setCursor: (cursor: number | null) => void;
}

export function OfficePanel({ selection, tab, setTab, close, state, liveEvents, cursor, setCursor }: Props) {
  const { health, connectionError } = useOffice();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [selection]);
  const agent = selection.kind === "agent" ? agentById[selection.id] : null;
  const section = agent ? tab : selection.kind;
  const events = agent ? state.events.filter(event => eventInvolvesAgent(event, agent.id)) : state.events;
  const tasks = agent ? state.tasks.filter(task => task.agentId === agent.id) : state.tasks;
  const files = agent ? state.files.filter(file => file.agentId === agent.id) : state.files;
  return <aside className="ao-panel" aria-label={agent ? `Агент ${agent.name}` : selection.kind} onKeyDown={event => { if (event.key === "Escape") close(); }}>
    <div className="ao-panel-heading"><div><h2 ref={heading} tabIndex={-1}>{agent?.name ?? selection.kind}</h2><p>{agent?.group ?? "Вся система"}</p></div><Button variant="ghost" size="icon" className="ao-button" aria-label="Закрыть панель" onClick={close}><X /></Button></div>
    {agent && <nav className="ao-panel-tabs" aria-label="Разделы агента">{(["Overview", "Activity", "Tasks", "Files"] as PanelTab[]).map(value => <Button key={value} variant="ghost" className="ao-button" aria-pressed={tab === value} onClick={() => setTab(value)}>{value}</Button>)}</nav>}
    <div className="ao-panel-content">
      {agent && section === "Overview" && <>
        <Status status={state.statuses[agent.id]} />
        <h3>{agent.role}</h3><p className="ao-description">{agent.description}</p>
        <dl className="ao-facts"><div><dt>Подключение</dt><dd>{["astra", "scout", "collector", "editor"].includes(agent.id) && health?.connected ? "Локальный runtime" : "Не подключён"}</dd></div><div><dt>Задачи</dt><dd>{tasks.length}</dd></div><div><dt>События</dt><dd>{events.length}</dd></div></dl>
        <p className="ao-note">{["astra", "scout", "collector", "editor"].includes(agent.id) ? connectionError ?? (agent.id === "editor" ? "Подготовка карточек преобразует сохранённый JSON в существующие поля каталога. Пропуски остаются null." : agent.id === "collector" ? "Сборщик данных читает официальный сайт и сохраняет сырой JSON." : health?.searchAvailable ? "Подключён поток Astra → Scout. Данные каталога доступны только для чтения." : health?.message ?? "Подключение к runtime…") : "Исполнение этого агента пока не подключено. Агент не выполняет действия."}</p>
        {agent.id === "astra" && cursor === null && <RuntimeTaskForm />}
        <h3>Место в процессе</h3><p className="ao-pipeline">{agent.id === "watcher" ? "Мониторинг после публикации" : taskPipeline.map(id => <span key={id} className={id === agent.id ? "ao-current" : ""}>{agentById[id].name}</span>)}</p>
      </>}
      {section === "Activity" && <EventLog events={events} />}
      {section === "Tasks" && <>
        {(!agent || agent.id === "astra") && cursor === null && <RuntimeTaskForm />}
        {tasks.length ? <ul className="ao-record-list">{tasks.map(task => <li key={task.id}><strong>{task.title}</strong><p>{agentById[task.agentId].name}</p><Status status={task.status} /><p><small>{task.id}</small></p>{state.files.filter(file => file.taskId === task.id && file.url).map(file => <RuntimeResult key={file.id} url={file.url!} />)}</li>)}</ul> : <Empty kind="Tasks" />}
      </>}
      {section === "Files" && (files.length ? <ul className="ao-record-list">{files.map(file => <li key={file.id}><strong>{file.name}</strong><p>{file.path}</p><small>{file.taskId}</small>{file.url && <RuntimeResult url={file.url} />}</li>)}</ul> : <Empty kind="Files" />)}
      {section === "Replay" && <>
        {liveEvents.length === 0 ? <Empty kind="Replay" /> : <>
          <p className="ao-description">Событие {cursor ?? liveEvents.length} из {liveEvents.length}</p>
          <input className="ao-replay-range" aria-label="Позиция воспроизведения" type="range" min={0} max={liveEvents.length} value={cursor ?? liveEvents.length} onChange={event => setCursor(Number(event.target.value))} />
          <div className="ao-replay-buttons"><Button className="ao-button" variant="ghost" disabled={cursor === 0} onClick={() => setCursor(Math.max(0, (cursor ?? liveEvents.length) - 1))}><ArrowLeft />Назад</Button><Button className="ao-button" variant="ghost" disabled={(cursor ?? liveEvents.length) >= liveEvents.length} onClick={() => setCursor((cursor ?? 0) + 1)}>Далее<ArrowRight /></Button></div>
          <EventLog events={events.slice(-1)} />
        </>}
        <h3>Маршрут задачи</h3><ol className="ao-replay-chain">{taskPipeline.map((id, index) => <li key={id}><span>{String(index + 1).padStart(2, "0")}</span>{agentById[id].name}</li>)}</ol>
        <p className="ao-note">Это схема процесса. Она не означает, что задача уже запускалась.</p>
      </>}
    </div>
  </aside>;
}
