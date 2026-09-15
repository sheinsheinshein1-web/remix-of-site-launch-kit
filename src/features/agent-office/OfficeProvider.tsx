import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { createOfficeState, officeEventSchema, replayOfficeEvents, type OfficeEvent, type OfficeState } from "./events";
import { runtimeHealthSchema, runtimeTaskSchema, type RuntimeHealth } from "./runtime-contract";

const snapshotSchema = z.object({ health: runtimeHealthSchema, events: z.array(officeEventSchema), tasks: z.array(runtimeTaskSchema) });
const OfficeContext = createContext<{ state: OfficeState; health: RuntimeHealth | null; connectionError: string | null; createTask: (city: string, requestId: string) => Promise<void> } | null>(null);

export function OfficeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(createOfficeState);
  const [health, setHealth] = useState<RuntimeHealth | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const revision = useRef(0);
  const eventSignature = useRef("");
  const mounted = useRef(false);
  const refresh = useCallback(async () => {
    const requestRevision = ++revision.current;
    try {
      const response = await fetch("/__agent-runtime/snapshot", { cache: "no-store", signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error("Локальный runtime недоступен");
      const snapshot = snapshotSchema.parse(await response.json());
      if (!mounted.current || requestRevision !== revision.current) return;
      const signature = `${snapshot.events.length}:${snapshot.events.at(-1)?.id ?? ""}`;
      if (signature !== eventSignature.current) {
        setState(replayOfficeEvents(snapshot.events as OfficeEvent[], snapshot.events.length));
        eventSignature.current = signature;
      }
      setHealth(snapshot.health); setConnectionError(null);
    } catch (error) {
      if (!mounted.current || requestRevision !== revision.current) return;
      setConnectionError(error instanceof Error ? error.message : "Не удалось прочитать runtime");
      setHealth(null);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const poll = async () => { await refresh(); if (!cancelled) timer = setTimeout(poll, 1000); };
    void poll();
    return () => { cancelled = true; mounted.current = false; clearTimeout(timer); };
  }, [refresh]);
  const createTask = useCallback(async (city: string, requestId: string) => {
    const response = await fetch("/__agent-runtime/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city, requestId }), signal: AbortSignal.timeout(10000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Не удалось создать задание");
    await refresh();
  }, [refresh]);
  const value = useMemo(() => ({ state, health, connectionError, createTask }), [state, health, connectionError, createTask]);
  return <OfficeContext.Provider value={value}>{children}</OfficeContext.Provider>;
}

// The hook and provider intentionally share a private context in this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useOffice() {
  const context = useContext(OfficeContext);
  if (!context) throw new Error("OfficeProvider отсутствует");
  return context;
}
