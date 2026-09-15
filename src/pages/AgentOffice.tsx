import { useMemo, useRef, useState } from "react";
import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant, MiniMap, Panel, MarkerType, useNodesState, useReactFlow, useViewport, type Edge, type Node } from "@xyflow/react";
import { Activity, ArrowUpRight, ChevronRight, History, ListTodo, Maximize, Minus, Network, Plus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import AgentNode, { Status } from "@/features/agent-office/AgentNode";
import { agents, agentById, organizationLinks, type AgentId } from "@/features/agent-office/agents";
import { OfficeProvider, useOffice } from "@/features/agent-office/OfficeProvider";
import { replayOfficeEvents } from "@/features/agent-office/events";
import { OfficePanel, type OfficePanelSelection, type PanelTab } from "@/features/agent-office/OfficePanel";
import "@xyflow/react/dist/style.css";
import "@/features/agent-office/agent-office.css";

const nodeTypes = { agent: AgentNode, label: ({ data }: { data: { label: string } }) => <div className="ao-group-label">{data.label}</div> };
const groupNodes: Node[] = [
  ["Discovery", 80, -28], ["Data", 80, 262], ["Content", 80, 552],
  ["Quality", 960, 92], ["Operations", 960, 312],
].map(([label, x, y]) => ({ id: `group-${label}`, type: "label", position: { x: Number(x), y: Number(y) }, data: { label }, draggable: false, selectable: false, focusable: false }));
const initialNodes: Node[] = [...groupNodes, ...agents.map(agent => ({ id: agent.id, type: "agent", position: agent.position, data: { agent, status: "idle" }, ariaLabel: `${agent.name}: ${agent.role}` }))];
const initialEdges: Edge[] = organizationLinks.map(link => {
  const left = agentById[link.target].position.x < agentById.astra.position.x;
  return { ...link, sourceHandle: left ? "left-out" : "right-out", targetHandle: left ? "right-in" : "left-in", type: "smoothstep", style: { stroke: "#36465d", strokeWidth: 1.3 }, selectable: false };
});

function OfficeCanvas() {
  const { state: live, health, connectionError } = useOffice();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [selection, setSelection] = useState<OfficePanelSelection | null>(null);
  const [tab, setTab] = useState<PanelTab>("Overview");
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const { zoom } = useViewport();
  const state = useMemo(() => cursor === null ? live : replayOfficeEvents(live.events, cursor), [live, cursor]);
  const selectedId = selection?.kind === "agent" ? selection.id : null;
  const displayedNodes = useMemo(() => nodes.map(node => node.type === "agent" ? { ...node, selected: node.id === selectedId, data: { ...node.data, status: state.statuses[node.id as AgentId] } } : node), [nodes, selectedId, state.statuses]);
  const edges = useMemo(() => {
    const base = initialEdges.map(edge => ({ ...edge, style: { ...edge.style, stroke: selectedId === edge.target || selectedId === "astra" ? "#7395c4" : "#36465d" } }));
    if (!state.transfer) return base;
    const { from, to, id } = state.transfer;
    const source = nodes.find(node => node.id === from);
    const target = nodes.find(node => node.id === to);
    const right = source.position.x <= target.position.x;
    return [...base, { id: `transfer-${id}`, source: from, target: to, sourceHandle: right ? "right-out" : "left-out", targetHandle: right ? "left-in" : "right-in", type: "smoothstep", animated: true, className: "ao-transfer", label: "Передача задачи", markerEnd: { type: MarkerType.ArrowClosed, color: "#7dacf8" }, style: { stroke: "#7dacf8", strokeWidth: 2.5 }, labelStyle: { fill: "#e9eef5" }, labelBgStyle: { fill: "#172438" } }];
  }, [nodes, selectedId, state.transfer]);

  const open = (next: OfficePanelSelection) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelection(next); setTab("Overview"); setDirectoryOpen(false);
    if (next.kind === "Replay") setCursor(live.events.length);
    else setCursor(null);
  };
  const close = () => { setSelection(null); setCursor(null); opener.current?.focus(); };
  const choose = (id: AgentId, focus = false) => {
    open({ kind: "agent", id });
    if (focus) {
      const node = nodes.find(item => item.id === id);
      void setCenter(node.position.x + (id === "astra" ? 135 : 110), node.position.y + 52, { zoom: Math.max(.75, zoom) });
    }
  };
  return <main className="agent-office">
    <Seo title="Многоместо — Agent Office" description="Внутренний офис агентской системы «Многоместо»." canonicalPath="/agent-office" noIndex />
    <header className="ao-header">
      <div className="ao-brand"><Network size={24} strokeWidth={1.5} /><h1>Многоместо <span>— Agent Office</span></h1></div>
      <div className="ao-system-status" title={connectionError ?? health?.message}><i />{health?.connected ? health.activeRunId ? "Выполняется задача" : "Runtime подключён" : "Runtime не подключён"}</div>
      <nav aria-label="Разделы Agent Office">{([ ["Tasks", ListTodo], ["Activity", Activity], ["Replay", History] ] as const).map(([kind, Icon]) => <Button key={kind} variant="ghost" className="ao-button" aria-pressed={selection?.kind === kind} onClick={() => open({ kind })}><Icon />{kind}{kind !== "Replay" && <span className="ao-count">{kind === "Tasks" ? live.tasks.length : live.events.length}</span>}</Button>)}</nav>
    </header>
    <div className="ao-workspace">
      <aside className={`ao-directory ${directoryOpen ? "ao-directory--open" : ""}`} aria-label="Список агентов">
        <div className="ao-directory-heading"><span>Агенты <small>{agents.length}</small></span><Button className="ao-button ao-mobile-only" variant="ghost" size="icon" aria-label="Закрыть список агентов" onClick={() => setDirectoryOpen(false)}><X /></Button></div>
        <button className="ao-directory-astra" onClick={() => choose("astra", true)} aria-pressed={selectedId === "astra"}><Network size={17} />Astra<Status status={state.statuses.astra} /></button>
        {(["Discovery", "Data", "Content", "Quality", "Operations"] as const).map(group => <section key={group}><h2>{group}</h2>{agents.filter(agent => agent.group === group).map(agent => <button key={agent.id} className="ao-directory-agent" aria-pressed={selectedId === agent.id} onClick={() => choose(agent.id, true)}><i className={`ao-status-dot ao-status-dot--${state.statuses[agent.id]}`} /><span>{agent.name}</span><ChevronRight size={13} /></button>)}</section>)}
        <p className="ao-directory-note">Один оркестратор.<br />Восемь специализаций.</p>
      </aside>
      <div className="ao-main">
        <div className="ao-map-heading"><div><h2>Сеть агентов</h2><p>От поиска производителя до проверенной карточки</p></div><Button variant="ghost" className="ao-button ao-mobile-only" aria-label="Открыть список агентов" onClick={() => setDirectoryOpen(!directoryOpen)}><Users /></Button><span className="ao-map-mode">{cursor === null ? "Организационная карта" : "Просмотр истории"}</span></div>
        <div className="ao-canvas" aria-label="Интерактивная карта агентов" onKeyDownCapture={event => {
          const id = (event.target as HTMLElement).closest<HTMLElement>(".react-flow__node")?.dataset.id as AgentId | undefined;
          if (id && agentById[id] && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault(); event.stopPropagation(); choose(id);
          }
        }}>
          <ReactFlow nodes={displayedNodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onNodeClick={(_, node) => { if (node.type === "agent") choose(node.id as AgentId); }} onPaneClick={close} nodesConnectable={false} deleteKeyCode={null} fitView fitViewOptions={{ padding: .16, maxZoom: 1 }} minZoom={.2} maxZoom={1.8} colorMode="dark" zoomOnDoubleClick={false} ariaLabelConfig={{ "node.a11yDescription.default": "Нажмите Enter для выбора агента. Стрелки перемещают выбранный узел.", "minimap.ariaLabel": "Навигация по карте" }}>
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#2b3545" />
            <Panel position="top-left"><div className="ao-canvas-note"><span className="ao-status-dot" />{cursor !== null ? "Replay · сохранённые события" : health?.activeRunId ? (health.activeAgent === "editor" ? "Подготовка карточек из сохранённых данных" : health.activeAgent === "collector" ? "Сборщик данных читает каталог" : "Scout ищет производителей") : health?.connected ? "Astra → Scout · запуск через Tasks" : "Ожидание локального runtime"}</div></Panel>
            <Panel position="bottom-left"><div className="ao-controls"><Button className="ao-button" variant="ghost" size="icon" aria-label="Уменьшить масштаб" onClick={() => void zoomOut()}><Minus /></Button><output aria-label="Масштаб">{Math.round(zoom * 100)}%</output><Button className="ao-button" variant="ghost" size="icon" aria-label="Увеличить масштаб" onClick={() => void zoomIn()}><Plus /></Button><Button className="ao-button" variant="ghost" size="icon" aria-label="Показать всю карту" onClick={() => void fitView({ padding: .16, maxZoom: 1 })}><Maximize /></Button></div></Panel>
            <MiniMap pannable zoomable position="bottom-right" nodeColor={node => node.id === "astra" ? "#7dacf8" : node.type === "label" ? "transparent" : "#455671"} maskColor="rgba(9,13,20,.65)" />
          </ReactFlow>
        </div>
        <footer className="ao-activity-strip"><Button variant="ghost" className="ao-button" onClick={() => open({ kind: "Activity" })}><Activity />Activity <span className="ao-count">{state.events.length}</span><ArrowUpRight /></Button><p>{state.events.at(-1)?.message ?? "Событий пока нет. Здесь появятся реальные действия агентов."}</p><span className="ao-pan-hint">Перетаскивайте карту · Масштабируйте колесом</span></footer>
      </div>
      {selection && <OfficePanel selection={selection} tab={tab} setTab={setTab} close={close} state={state} liveEvents={live.events} cursor={cursor} setCursor={setCursor} />}
    </div>
  </main>;
}

export default function AgentOffice() {
  return <OfficeProvider><ReactFlowProvider><OfficeCanvas /></ReactFlowProvider></OfficeProvider>;
}
