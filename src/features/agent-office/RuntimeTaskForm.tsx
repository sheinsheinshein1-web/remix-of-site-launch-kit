import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cityTaskInputSchema } from "./runtime-contract";
import { useOffice } from "./OfficeProvider";

export function RuntimeTaskForm() {
  const { createTask, health, connectionError } = useOffice();
  const [city, setCity] = useState("Екатеринбург");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef<{ city: string; id: string } | null>(null);
  return <form className="ao-runtime-form" onSubmit={async event => {
    event.preventDefault(); if (submitting) return;
    if (!request.current || request.current.city !== city) request.current = { city, id: crypto.randomUUID() };
    const input = cityTaskInputSchema.safeParse({ city, requestId: request.current.id });
    if (!input.success) { setError("Укажите название города без цифр и специальных символов"); return; }
    setSubmitting(true); setError(null);
    try { await createTask(input.data.city, input.data.requestId); request.current = null; }
    catch (error) { setError(error instanceof Error ? error.message : "Ошибка создания задачи"); }
    finally { setSubmitting(false); }
  }}>
    <label htmlFor="ao-city">Город для поиска производителей</label>
    <Input id="ao-city" value={city} onChange={event => setCity(event.target.value)} maxLength={80} disabled={submitting} />
    <Button type="submit" className="ao-button" variant="outline" disabled={submitting || !health?.searchAvailable || !!health?.activeRunId}>{submitting ? "Создание задания…" : health?.activeRunId ? "Scout выполняет поиск" : "Запустить Astra → Scout"}</Button>
    <p className="ao-note">{connectionError ?? (health?.searchAvailable ? "Реальный веб-поиск через Codex. Результат сохраняется для ручного рассмотрения." : health?.message ?? "Подключение к локальному runtime…")}</p>
    {error && <p role="alert" className="ao-runtime-error">{error}</p>}
  </form>;
}
