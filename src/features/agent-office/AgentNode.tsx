import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Aperture, Search, FolderSearch, Braces, ScanLine, PenLine, ListChecks, Upload, Radar } from "lucide-react";
import { type AgentDefinition } from "./agents";
import { type AgentStatus } from "./events";

export type AgentFlowNode = Node<{ agent: AgentDefinition; status: AgentStatus }, "agent">;
const icons = { astra: Aperture, scout: Search, collector: FolderSearch, extractor: Braces, verifier: ScanLine, editor: PenLine, "catalog-qa": ListChecks, publisher: Upload, watcher: Radar };

export function Status({ status }: { status: AgentStatus }) {
  return <span className={`ao-status ao-status--${status}`}><i aria-hidden="true" />{status}</span>;
}

function AgentNode({ data, selected }: NodeProps<AgentFlowNode>) {
  const { agent, status } = data;
  const Icon = icons[agent.id];
  const central = agent.id === "astra";
  return <div className={`ao-node ${central ? "ao-node--astra" : ""} ${selected ? "ao-node--selected" : ""}`} data-agent-id={agent.id} data-status={status}>
    <Handle id="left-in" type="target" position={Position.Left} isConnectable={false} />
    <Handle id="right-in" type="target" position={Position.Right} isConnectable={false} />
    <Handle id="left-out" type="source" position={Position.Left} isConnectable={false} />
    <Handle id="right-out" type="source" position={Position.Right} isConnectable={false} />
    <div className="ao-node-heading"><Icon className="ao-agent-icon" size={central ? 34 : 21} strokeWidth={1.5} /><strong>{agent.name}</strong></div>
    <p>{agent.role}</p>
    <div className="ao-node-bottom"><Status status={status} />{central && <span>Многоместо</span>}</div>
  </div>;
}
export default memo(AgentNode);
