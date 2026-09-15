import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { agentRuntimePlugin } from "./server/agent-runtime/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: { deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/runtime/**", ...(process.env.AGENT_RUNTIME_DIR ? [`${process.env.AGENT_RUNTIME_DIR}/**`] : [])] },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), agentRuntimePlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
