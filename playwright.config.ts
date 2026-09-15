import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4179",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    env: { AGENT_RUNTIME_DIR: "/tmp/mnogomesta-agent-runtime-playwright", CODEX_EXECUTABLE: "/nonexistent/codex-test-provider" },
    command: `"${process.execPath}" ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4179 --strictPort`,
    url: "http://127.0.0.1:4179",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
