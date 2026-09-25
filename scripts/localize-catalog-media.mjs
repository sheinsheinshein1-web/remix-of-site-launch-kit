import { createServer } from "vite";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, rename, mkdtemp, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { decodeIcon } from "./lib/decode-icon.mjs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);

const check = process.argv.includes("--check");
const recoveryPage = process.argv.includes("--recovery-page");
const preferRanges = process.argv.includes("--ranges");
const selectedHosts = process.argv.find(arg => arg.startsWith("--hosts="))?.slice(8).split(",");
const workerCount = selectedHosts ? 2 : 8;
const bundlePaths = process.argv.filter(arg => arg.startsWith("--bundle=")).map(arg => arg.slice(9));
const manifestPath = resolve("src/data/localMediaManifest.json");
const pathsPath = resolve("src/data/localMediaPaths.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const vite = await createServer({ configFile: false, appType: "custom", logLevel: "error", resolve: { alias: { "@": resolve("src") } }, server: { middlewareMode: true } });
let sources;
try {
  const { sourceProjects } = await vite.ssrLoadModule("/src/data/projects.ts");
  const { sourceManufacturers } = await vite.ssrLoadModule("/src/data/manufacturers.ts");
  const { isPublicProject } = await vite.ssrLoadModule("/src/data/catalogVisibility.ts");
  const published = sourceProjects.filter(isPublicProject);
  const makerIds = new Set(published.map(project => project.manufacturerId));
  const images = published.flatMap(project => project.gallery.map(item => item.image));
  for (const maker of sourceManufacturers.filter(maker => makerIds.has(maker.id))) {
    images.push(maker.logo, maker.profile?.schemaLogoUrl);
    images.push(...(maker.profile?.builtObjects ?? []).map(item => item.src));
    images.push(...(maker.profile?.social?.youtubeVideos ?? []).map(item => item.thumbnail));
  }
  sources = [...new Set(images.filter(src => typeof src === "string" && /^(?:https?:)?\/\//i.test(src)))].sort();
} finally {
  await vite.close();
}

await mkdir("public/media/catalog", { recursive: true });
if (recoveryPage) {
  await mkdir("outputs", { recursive: true });
  const missing = sources.filter(source => !manifest[source]);
  const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  for (let i = 0; i < missing.length; i += 40) {
    const path = `outputs/media-recovery-${i / 40 + 1}.html`;
    await writeFile(path, `<!doctype html><html><head><meta name="robots" content="noindex"><title>Media recovery</title></head><body style="display:grid;grid-template-columns:repeat(8,100px);gap:4px">${missing.slice(i, i + 40).map(source => `<img width="100" height="80" style="object-fit:contain" alt="${escape(source)}" src="${escape(source)}">`).join("\n")}</body></html>`);
    console.log(path);
  }
  process.exit(0);
}
const failures = [];
let done = 0;
let downloaded = 0;
const activeSources = selectedHosts
  ? sources.filter(source => selectedHosts.includes(new URL(source.startsWith("//") ? `https:${source}` : source).hostname))
  : sources;
async function verify(entry) {
  if (!entry || !/^\/media\/catalog\/[a-f0-9]{64}\.webp$/.test(entry.path)) throw new Error("not localized");
  const bytes = await readFile(resolve("public", `.${entry.path}`));
  if (sha256(bytes) !== entry.sha256) throw new Error("file checksum mismatch");
  const meta = await sharp(bytes).metadata();
  if (meta.width !== entry.width || meta.height !== entry.height || meta.format !== "webp") throw new Error("invalid image metadata");
}
async function download(source) {
  const requestUrl = source.startsWith("//") ? `https:${source}` : source;
  if (selectedHosts && !selectedHosts.includes(new URL(requestUrl).hostname)) throw new Error("not localized; outside selected retry hosts");
  if (preferRanges) return saveImage(source, await downloadRanges(requestUrl), requestUrl);
  // curl uses the host's TLS/network stack. Never disable certificate validation.
  let result;
  try { result = await execFileAsync("curl", [
    "--fail", "--silent", "--show-error", "--location", "--max-redirs", "5",
    "--proto", "=http,https", "--proto-redir", "=https", "--http1.1", "--max-time", "20",
    "--max-filesize", String(25 * 1024 * 1024),
    "--write-out", "%{stderr}%{url_effective}", requestUrl,
  ], { encoding: "buffer", maxBuffer: 26 * 1024 * 1024 }); }
  catch (error) {
    // Some origins stall after the first TLS record. A public image cache may
    // already have the same official asset; otherwise fetch verified byte ranges.
    if (error.code !== 28) throw error;
    const proxyUrl = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(requestUrl)}&f=1&nofb=1`;
    try {
      const proxyResult = await execFileAsync("curl", [
        "--fail", "--silent", "--show-error", "--location", "--max-redirs", "5",
        "--proto", "=https", "--proto-redir", "=https", "--max-time", "30",
        "--max-filesize", String(25 * 1024 * 1024), proxyUrl,
      ], { encoding: "buffer", maxBuffer: 26 * 1024 * 1024 });
      return saveImage(source, proxyResult.stdout, proxyUrl, true);
    } catch {
      return saveImage(source, await downloadRanges(requestUrl), requestUrl);
    }
  }
  return saveImage(source, result.stdout, result.stderr.toString().trim());
}
async function downloadRanges(source) {
  const directory = await mkdtemp(resolve(tmpdir(), "mnogomesta-media-"));
  const headersPath = resolve(directory, "headers");
  const chunks = [];
  let offset = 0, total, etag;
  try {
    do {
      let stdout;
      try {
        ({ stdout } = await execFileAsync("curl", ["--fail", "--silent", "--show-error", "--location", "--max-redirs", "5", "--proto", "=http,https", "--proto-redir", "=https", "--http1.1", "--max-time", "12", "--range", `${offset}-`, "--dump-header", headersPath, ...(etag ? ["--header", `If-Range: ${etag}`] : []), source], { encoding: "buffer", maxBuffer: 26 * 1024 * 1024 }));
      } catch (error) {
        if (error.code !== 28 || !error.stdout?.length) throw error;
        stdout = error.stdout;
      }
      const headers = await readFile(headersPath, "utf8");
      const ranges = [...headers.matchAll(/^content-range:\s*bytes (\d+)-(\d+)\/(\d+)/gim)];
      const range = ranges.at(-1);
      if (!range || Number(range[1]) !== offset || stdout.length === 0) throw new Error("Invalid partial image response");
      const length = Number(range[3]);
      if (stdout.length > length - offset) throw new Error("Partial image exceeds declared size");
      if (length > 25 * 1024 * 1024 || (total !== undefined && total !== length)) throw new Error("Image size changed during recovery");
      total = length;
      const currentEtag = [...headers.matchAll(/^etag:\s*(.+)$/gim)].at(-1)?.[1].trim();
      if (etag && currentEtag !== etag) throw new Error("Image changed during recovery");
      etag = currentEtag;
      chunks.push(stdout); offset += stdout.length;
    } while (offset < total);
    return Buffer.concat(chunks);
  } finally { await rm(directory, { recursive: true, force: true }); }
}
async function saveImage(source, original, fetchedUrl, recovery = false) {
  const decoded = decodeIcon(original);
  const { data, info } = await sharp(decoded.input, { limitInputPixels: 80000000, ...decoded.options }).rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer({ resolveWithObject: true });
  const hash = sha256(data);
  const path = `/media/catalog/${hash}.webp`;
  await writeFile(resolve("public", `.${path}`), data);
  manifest[source] = { path, width: info.width, height: info.height, sha256: hash, sourceSha256: sha256(original), fetchedUrl, importedAt: new Date().toISOString(), ...(recovery ? { recoveredFromBrowser: true } : {}) };
  downloaded++;
}
let cursor = 0;
for (const bundlePath of bundlePaths) {
  const bundle = JSON.parse(await readFile(bundlePath, "utf8"));
  for (const asset of bundle.assets ?? []) {
    if (activeSources.includes(asset.url) && !manifest[asset.url]) await saveImage(asset.url, await readFile(asset.path), asset.url, true);
  }
}
await Promise.all(Array.from({ length: workerCount }, async () => {
  while (cursor < activeSources.length) {
    const source = activeSources[cursor++];
    try {
      try { await verify(manifest[source]); }
      catch (error) { if (check || bundlePaths.length) throw error; await download(source); }
    } catch (error) {
      const detail = error.stderr?.toString().match(/curl:.*$/m)?.[0] ?? error.cause?.message ?? error.message;
      failures.push({ source, error: detail });
    }
    done++;
    if (done % 50 === 0) console.log(`[media] ${done}/${activeSources.length}, downloaded ${downloaded}, errors ${failures.length}`);
  }
}));
if (!check) {
  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(ordered, null, 2)}\n`);
  await rename(`${manifestPath}.tmp`, manifestPath);
  await writeFile(pathsPath, `${JSON.stringify(Object.fromEntries(Object.entries(ordered).map(([source, asset]) => [source, asset.path])), null, 2)}\n`);
  await mkdir("outputs", { recursive: true });
  await writeFile("outputs/local-media-report.json", JSON.stringify({ total: sources.length, downloaded, failures }, null, 2));
}
if (check) {
  const paths = JSON.parse(await readFile(pathsPath, "utf8"));
  for (const source of sources) if (paths[source] !== manifest[source]?.path) failures.push({ source, error: "public media mapping differs from verified manifest" });
}
console.log(`[media] ${activeSources.length - failures.length}/${activeSources.length} verified local images; ${downloaded} downloaded`);
if (failures.length) {
  for (const failure of failures.slice(0, 12)) console.error(`${failure.source}: ${failure.error}`);
  if (failures.length > 12) console.error(`[media] ${failures.length - 12} further failures${check ? "" : ": outputs/local-media-report.json"}`);
  process.exitCode = 1;
}
