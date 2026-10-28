import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const port = Number(process.env.RETPROGRAM_QA_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  outputDir: process.env.RETPROGRAM_QA_RESULTS_DIR
    ? path.resolve(process.env.RETPROGRAM_QA_RESULTS_DIR)
    : "out/playwright-results",
  reporter: "list",
  workers: 1,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run studio:qa -- --port=${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
