import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralizeRu(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

export function formatSpecs(area: string, beds: number, baths: number) {
  return `${area}, ${beds} ${pluralizeRu(beds, "спальня", "спальни", "спален")}, ${baths} ${pluralizeRu(baths, "сан.узел", "сан.узла", "сан.узлов")}`;
}
