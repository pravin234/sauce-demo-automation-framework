import type { PlaywrightTestConfig, Project } from "@playwright/test";

const baseProject: Omit<Project, "name"> = {
  timeout: 60_000,
  use: {
    baseURL: "https://www.saucedemo.com",
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
};

const config: PlaywrightTestConfig = {
  testDir: "./tests/specs",
  testMatch: "**/*.spec.ts",
  retries: 1,
  fullyParallel: true,
  workers: process.env.CI ? 1 : 3,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "playwright-report/results.json" }],
  ],
  projects: [
    {
      name: "Chrome",
      ...baseProject,
      use: {
        ...baseProject.use,
        browserName: "chromium",
      },
    },
    {
      name: "Firefox",
      ...baseProject,
      use: {
        ...baseProject.use,
        browserName: "firefox",
      },
    },
    {
      name: "WebKit",
      ...baseProject,
      use: {
        ...baseProject.use,
        browserName: "webkit",
      },
    },
  ],
};

export default config;
