import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      // API simulée par page.route : tourne partout, y compris dans la CI.
      name: 'mock',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@fullstack/,
    },
    {
      // Vraie API Spring Boot (java-pour-les-noobs) sur le port 8080 : en local seulement.
      name: 'fullstack',
      use: { ...devices['Desktop Chrome'] },
      grep: /@fullstack/,
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
