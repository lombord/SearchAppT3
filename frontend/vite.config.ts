import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const serverEndpoint = `127.0.0.1:${process.env.BACKEND_PORT || 8000}`;

  const vitePort = process.env.VITE_PORT;

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      port: vitePort ? parseInt(vitePort, 10) : 3000,
      proxy: {
        "/api": {
          target: `http://${serverEndpoint}`,
        },
      },
    },
  });
};
