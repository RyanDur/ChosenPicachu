import {defineConfig} from '@playwright/test';

const smokeUrl = process.env.SMOKE_URL;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  use: {
    baseURL: smokeUrl || 'https://ryandur.github.io/ChosenPicachu/',
    trace: 'on-first-retry'
  },
  webServer: smokeUrl ? {
    command: 'npm run preview',
    url: smokeUrl,
    reuseExistingServer: true
  } : undefined,
  projects: [
    {name: 'chromium', use: {browserName: 'chromium'}},
    {name: 'firefox', use: {browserName: 'firefox'}},
    {name: 'webkit', use: {browserName: 'webkit'}}
  ]
});
