import { spawn } from "node:child_process";
import { open, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";

const lockPath = resolve(".mnogomesta-build.lock");
const mode = process.argv[2];

const processIsRunning = (pid) => {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const acquireLock = async () => {
  try {
    return await open(lockPath, "wx");
  } catch (error) {
    if (error.code !== "EEXIST") throw error;

    const previousPid = Number.parseInt(await readFile(lockPath, "utf8").catch(() => ""), 10);
    if (processIsRunning(previousPid)) {
      throw new Error(`[build] Another build is already running (pid ${previousPid}).`);
    }

    await unlink(lockPath).catch(() => undefined);
    return open(lockPath, "wx");
  }
};

const runNode = (...args) => new Promise((resolveRun, rejectRun) => {
  const child = spawn(process.execPath, args, { stdio: "inherit" });
  const forwardSignal = (signal) => child.kill(signal);
  process.once("SIGINT", forwardSignal);
  process.once("SIGTERM", forwardSignal);

  child.once("error", rejectRun);
  child.once("exit", (code, signal) => {
    process.removeListener("SIGINT", forwardSignal);
    process.removeListener("SIGTERM", forwardSignal);
    if (code === 0) {
      resolveRun();
      return;
    }
    rejectRun(new Error(`[build] ${args.join(" ")} failed${signal ? ` with ${signal}` : ` with code ${code}`}.`));
  });
});

const lock = await acquireLock();
await lock.writeFile(String(process.pid));

try {
  if (mode !== "--prerender-only") {
    await runNode("scripts/generate-card-thumbnails.mjs");
    await runNode("scripts/build-og-image.mjs");
    await runNode("node_modules/vite/bin/vite.js", "build");
  }

  if (mode !== "--no-prerender") {
    await runNode("scripts/prerender.mjs");
  }
} finally {
  await lock.close().catch(() => undefined);
  await unlink(lockPath).catch(() => undefined);
}
