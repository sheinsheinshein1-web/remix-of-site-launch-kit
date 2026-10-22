import { useCallback, useEffect, useState } from "react";
import { detectRegion } from "@/lib/detectRegion";

const DISMISSED_KEY = "geo_suggestion_dismissed_v1";
let dismissedInMemory = false;
const wasDismissed = () => {
  try { return dismissedInMemory || sessionStorage.getItem(DISMISSED_KEY) === "1"; }
  catch { return dismissedInMemory; }
};

export function useRegionSuggestion(hasExplicitSelection: boolean) {
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (hasExplicitSelection || dismissed) return;
    // Static SEO HTML must never contain the build server's location suggestion.
    if (navigator.userAgent.includes("PrerenderBot/")) return;
    let active = true;
    void detectRegion().then((slug) => { if (active) setSuggestion(slug); });
    return () => { active = false; };
  }, [hasExplicitSelection, dismissed]);

  const dismiss = useCallback(() => {
    dismissedInMemory = true;
    setDismissed(true);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch { /* In-memory fallback. */ }
  }, []);

  return { suggestion: hasExplicitSelection || dismissed ? null : suggestion, dismiss };
}
