// Integration test of both shipping Caddy configurations against the built
// site. CADDY_BIN may point to a downloaded official Caddy executable.
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm, writeFile, access } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

const binary = process.env.CADDY_BIN || "caddy";
const root = resolve("dist");
await access(join(root, "legacy-redirects.caddy"));
const temp = await mkdtemp(join(tmpdir(), "mnogomesta-seo-test-"));

const freePort = async () => {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((done) => server.close(done));
  return port;
};

try {
  for (const name of ["Caddyfile.container", "Caddyfile.timeweb.example"]) {
    const port = await freePort();
    let source = await readFile(resolve("deploy", name), "utf8");
    if (name === "Caddyfile.container") {
      source = source.replace(":8080 {", `http://127.0.0.1:${port} {`)
        .replace("root * /srv", `root * "${root}"`)
        .replace("import /srv/legacy-redirects.caddy", `import "${root}/legacy-redirects.caddy"`);
    } else {
      // Leave request handling intact; only remove the separate www redirect
      // vhost and substitute local bind/storage for the production host/root.
      source = source.replace(/www\.многоместа\.рф,[\s\S]*?\n}\n/, "")
        .replace("многоместа.рф, xn--80afg0abehb3ak.xn--p1ai {", `http://127.0.0.1:${port} {`)
        .replace("root * /var/www/mnogomesta/dist", `root * "${root}"`)
        .replace("import /var/www/mnogomesta/dist/legacy-redirects.caddy", `import "${root}/legacy-redirects.caddy"`);
    }
    const config = join(temp, name);
    await writeFile(config, `{\n admin off\n auto_https off\n persist_config off\n}\n${source}`);
    const validation = spawnSync(binary, ["validate", "--config", config, "--adapter", "caddyfile"], { encoding: "utf8" });
    if (validation.status !== 0) throw new Error(validation.error?.message || validation.stderr);
    const child = spawn(binary, ["run", "--config", config, "--adapter", "caddyfile"], { stdio: ["ignore", "ignore", "pipe"] });
    const closed = once(child, "close");
    let log = "";
    child.stderr.on("data", (chunk) => { log += chunk; });
    try {
      const base = `http://127.0.0.1:${port}`;
      let ready = false;
      for (let attempt = 0; attempt < 40; attempt += 1) {
        try {
          await fetch(`${base}/health`, { signal: AbortSignal.timeout(500) });
          ready = true;
        } catch { /* Wait for Caddy to bind. */ }
        if (ready) break;
        if (child.exitCode !== null) throw new Error(log);
        await new Promise((done) => setTimeout(done, 100));
      }
      if (!ready) throw new Error(`Caddy did not become ready: ${log}`);
      console.log(`\nTesting ${name}`);
      const check = spawnSync("sh", ["deploy/check-seo-headers.sh", base], { stdio: "inherit" });
      if (check.status !== 0) throw new Error(`${name}: SEO response checks failed`);
    } finally {
      child.kill("SIGTERM");
      await closed;
    }
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}
