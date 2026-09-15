import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resultSchema, type ScoutResult } from "./runtime-contract";
import { collectorResultSchema, type CollectorResult } from "./collector-contract";
import { preparationResultSchema } from "./preparation-contract";
import type { z } from "zod";

export function RuntimeResult({ url }: { url: string }) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoutResult | CollectorResult | z.infer<typeof preparationResultSchema> | null>(null);
  const [error, setError] = useState<string | null>(null);
  return <div>
    <Button className="ao-button ao-result-link" variant="ghost" disabled={loading} onClick={async () => {
      if (opened) { setOpened(false); return; }
      if (result) { setOpened(true); return; }
      setLoading(true); setError(null);
      try {
        const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error("Не удалось открыть результат агента");
        setResult(resultSchema.or(collectorResultSchema).or(preparationResultSchema).parse(await response.json())); setOpened(true);
      } catch (error) { setError(error instanceof Error ? error.message : "Ошибка чтения JSON"); }
      finally { setLoading(false); }
    }}>{loading ? "Загрузка JSON…" : opened ? "Скрыть JSON" : "Открыть JSON"}</Button>
    {error && <p className="ao-runtime-error" role="alert">{error}</p>}
    {opened && result && <pre className="ao-result-json" aria-label={"kind" in result ? result.kind === "catalog.preparation" ? "Подготовленные карточки JSON" : "Результат Сборщика данных JSON" : "Результат Scout JSON"} tabIndex={0}>{JSON.stringify(result, null, 2)}</pre>}
  </div>;
}
