#!/usr/bin/env node
/**
 * Конвертер картинок в WebP.
 *
 * Что делает:
 *   1. Ищет все .png / .jpg / .jpeg в src/assets/ (включая подпапки).
 *   2. Пропускает SVG и логотипы (logo-*, share-icon).
 *   3. Конвертирует в .webp с качеством 75 (визуально идентично, в 2-3 раза легче).
 *   4. Удаляет оригиналы.
 *   5. Обновляет все импорты в src/**\/*.{ts,tsx,js,jsx,css,html,md}.
 *
 * Запуск:   node scripts/optimize-images.mjs
 *
 * Требует sharp:  bun add -d sharp   (или npm i -D sharp)
 */
import { readdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const ASSETS_DIR = join(ROOT, "src/assets");
const SRC_DIR = join(ROOT, "src");
const QUALITY = 75;
const SKIP_PATTERNS = [/^logo-/, /^share-icon/, /^logo\./];

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("[optimize-images] Не установлен sharp. Запусти: bun add -d sharp");
  process.exit(1);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

function shouldSkip(filename) {
  return SKIP_PATTERNS.some((re) => re.test(filename));
}

async function convertImages() {
  const converted = [];
  for await (const path of walk(ASSETS_DIR)) {
    const ext = extname(path).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
    const filename = path.split("/").pop();
    if (shouldSkip(filename)) continue;

    const webpPath = path.replace(/\.(png|jpe?g)$/i, ".webp");
    const before = (await stat(path)).size;
    await sharp(path).webp({ quality: QUALITY }).toFile(webpPath);
    const after = (await stat(webpPath)).size;
    await unlink(path);

    const rel = relative(ROOT, path);
    const saved = ((1 - after / before) * 100).toFixed(0);
    console.log(`[webp] ${rel}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (-${saved}%)`);
    converted.push({ from: path, to: webpPath });
  }
  return converted;
}

async function updateImports(converted) {
  if (converted.length === 0) return;
  const replacements = converted.map(({ from, to }) => {
    const fromName = from.split("/").pop();
    const toName = to.split("/").pop();
    return { fromName, toName };
  });

  let touched = 0;
  for await (const path of walk(SRC_DIR)) {
    const ext = extname(path).toLowerCase();
    if (![".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md"].includes(ext)) continue;
    let content = await readFile(path, "utf8");
    let changed = false;
    for (const { fromName, toName } of replacements) {
      if (content.includes(fromName)) {
        content = content.split(fromName).join(toName);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(path, content);
      console.log(`[import] обновлён ${relative(ROOT, path)}`);
      touched++;
    }
  }
  console.log(`\n[done] сжато: ${converted.length}, обновлено файлов: ${touched}`);
}

const converted = await convertImages();
await updateImports(converted);
if (converted.length === 0) {
  console.log("[done] нечего конвертировать — все картинки уже в WebP");
}
